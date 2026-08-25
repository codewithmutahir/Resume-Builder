/**
 * Free LinkedIn OpenID import helpers (no paid scrapers).
 */

const STATE_KEY = 'linkedin_oauth_state';
const RESULT_KEY = 'linkedin_import_result';
const CALLBACK_LOCK_PREFIX = 'linkedin_cb_lock_';

const SAFE = {
  network: "Couldn't reach LinkedIn import right now. Please try again.",
  config: 'LinkedIn import is temporarily unavailable. Please try again later.',
  state: 'LinkedIn sign-in expired. Please try again.',
  generic: 'Something went wrong. Please try again.',
  denied: 'LinkedIn sign-in was cancelled.',
};

function getApiBase() {
  const isLocal =
    typeof window !== 'undefined' &&
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
  if (isLocal) return '';
  return (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
}

function getRedirectUri() {
  const origin = window.location.origin.replace(
    'http://127.0.0.1:',
    'http://localhost:'
  );
  return `${origin}/linkedin/callback`;
}

export function isLinkedInImportConfigured() {
  return Boolean(process.env.REACT_APP_LINKEDIN_CLIENT_ID);
}

/** Start LinkedIn OAuth (full-page redirect). */
export function beginLinkedInImport() {
  const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
  if (!clientId) {
    throw new Error(SAFE.config);
  }

  // Always use localhost hostname consistently (not 127.0.0.1) for sessionStorage
  const origin = window.location.origin.replace(
    'http://127.0.0.1:',
    'http://localhost:'
  );
  if (origin !== window.location.origin) {
    // Bounce to localhost so OAuth state survives the round-trip
    const path = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`${origin}${path}`);
    return;
  }

  const state =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `li_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(STATE_KEY, state);

  const redirectUri = `${origin}/linkedin/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile email',
  });

  window.location.assign(
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  );
}

/**
 * Finish OAuth on /linkedin/callback — returns { personal }.
 * Safe under React Strict Mode (single-flight per authorization code).
 */
export async function completeLinkedInImport({ code, state, error }) {
  if (error === 'user_cancelled_login' || error === 'user_cancelled_authorize') {
    throw new Error(SAFE.denied);
  }
  if (error) {
    throw new Error(SAFE.generic);
  }

  if (!code || !state) {
    throw new Error(SAFE.state);
  }

  const lockKey = `${CALLBACK_LOCK_PREFIX}${code}`;
  const existingLock = sessionStorage.getItem(lockKey);

  // Already finished this code (Strict Mode remount)
  if (existingLock === 'done') {
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (raw) {
      return { personal: JSON.parse(raw) };
    }
  }

  // Exchange already in flight — wait for RESULT_KEY
  if (existingLock === 'pending') {
    for (let i = 0; i < 40; i += 1) {
      await new Promise((r) => setTimeout(r, 150));
      if (sessionStorage.getItem(lockKey) === 'done') {
        const raw = sessionStorage.getItem(RESULT_KEY);
        if (raw) return { personal: JSON.parse(raw) };
      }
      if (sessionStorage.getItem(lockKey) === 'error') {
        sessionStorage.removeItem(lockKey);
        throw new Error(SAFE.generic);
      }
    }
    throw new Error(SAFE.network);
  }

  const expected = sessionStorage.getItem(STATE_KEY);
  if (!expected || expected !== state) {
    throw new Error(SAFE.state);
  }

  sessionStorage.setItem(lockKey, 'pending');

  let response;
  try {
    response = await fetch(`${getApiBase()}/api/linkedin/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirectUri: getRedirectUri(),
      }),
    });
  } catch (err) {
    console.error('LinkedIn exchange network error:', err);
    sessionStorage.setItem(lockKey, 'error');
    sessionStorage.removeItem(lockKey);
    throw new Error(SAFE.network);
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // ignore
  }

  if (!response.ok) {
    sessionStorage.removeItem(lockKey);
    const allowed = [
      "You've reached today's import limit. Please try again tomorrow.",
      "You're importing too quickly. Please wait a bit and try again.",
      'LinkedIn import is temporarily unavailable. Please try again later.',
      "Couldn't connect to LinkedIn. Please try again.",
      "Couldn't load your LinkedIn profile. Please try again.",
      SAFE.generic,
    ];
    const msg =
      data.error && allowed.includes(data.error) ? data.error : SAFE.generic;
    throw new Error(msg);
  }

  if (!data.personal || typeof data.personal !== 'object') {
    sessionStorage.removeItem(lockKey);
    throw new Error(SAFE.generic);
  }

  // Clear CSRF state only after success; mark this code done for Strict Mode
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(data.personal));
  sessionStorage.setItem(lockKey, 'done');

  return data;
}

/** Stash import result for the builder to apply after redirect home. */
export function stashLinkedInImportResult(personal) {
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(personal));
}

export function consumeLinkedInImportResult() {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    sessionStorage.removeItem(RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
