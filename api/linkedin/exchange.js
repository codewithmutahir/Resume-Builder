/**
 * Exchange LinkedIn OAuth authorization code for profile fields.
 * Free official OpenID Connect — no paid scrapers.
 *
 * Env (server): LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET
 * Env (client): REACT_APP_LINKEDIN_CLIENT_ID (same client id)
 */

const RATE_LIMIT = { perHour: 10, perDay: 20 };
const rateBuckets = globalThis.__linkedinOauthBuckets || new Map();
globalThis.__linkedinOauthBuckets = rateBuckets;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  let entry = rateBuckets.get(ip);

  if (!entry || now - entry.dayStarted > dayMs) {
    entry = { hourStarted: now, dayStarted: now, hourCount: 0, dayCount: 0 };
  } else if (now - entry.hourStarted > hourMs) {
    entry.hourStarted = now;
    entry.hourCount = 0;
  }

  if (entry.dayCount >= RATE_LIMIT.perDay) {
    rateBuckets.set(ip, entry);
    return {
      ok: false,
      error: "You've reached today's import limit. Please try again tomorrow.",
    };
  }
  if (entry.hourCount >= RATE_LIMIT.perHour) {
    rateBuckets.set(ip, entry);
    return {
      ok: false,
      error: "You're importing too quickly. Please wait a bit and try again.",
    };
  }

  entry.hourCount += 1;
  entry.dayCount += 1;
  rateBuckets.set(ip, entry);
  return { ok: true };
}

function getAllowedOrigins() {
  const fromEnv = process.env.ALLOWED_ORIGINS || '';
  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://resume-builder-three-ebon.vercel.app',
  ];
  return [
    ...new Set([
      ...defaults,
      ...fromEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ]),
  ];
}

function setCors(req, res) {
  const origin = req.headers.origin;
  const allowed = getAllowedOrigins();
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', allowed[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function isAllowedRedirectUri(uri) {
  if (!uri || typeof uri !== 'string') return false;
  try {
    const u = new URL(uri);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (u.pathname !== '/linkedin/callback') return false;
    const origin = u.origin;
    return getAllowedOrigins().includes(origin) || /localhost|127\.0\.0\.1/.test(u.hostname);
  } catch {
    return false;
  }
}

async function fetchPictureDataUrl(pictureUrl) {
  if (!pictureUrl || !/^https:\/\//i.test(pictureUrl)) return '';
  try {
    const res = await fetch(pictureUrl, {
      headers: { Accept: 'image/*' },
    });
    if (!res.ok) return pictureUrl;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return pictureUrl;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 600000) return pictureUrl;
    return `data:${contentType};base64,${buf.toString('base64')}`;
  } catch {
    return pictureUrl;
  }
}

function mapUserInfo(info, picture) {
  const given = (info.given_name || '').trim();
  const family = (info.family_name || '').trim();
  const fullName =
    (info.name || '').trim() || [given, family].filter(Boolean).join(' ').trim();

  return {
    fullName: fullName.slice(0, 120),
    email: String(info.email || '')
      .trim()
      .toLowerCase()
      .slice(0, 120),
    picture: picture || '',
    // OpenID rarely returns headline; leave title empty for user to fill
    title: '',
    linkedin: '',
  };
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Something went wrong. Please try again.' });
  }

  const origin = req.headers.origin;
  const allowed = getAllowedOrigins();
  if (origin && !allowed.includes(origin)) {
    return res.status(403).json({ error: 'Something went wrong. Please try again.' });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return res.status(429).json({ error: rate.error });
  }

  const clientId =
    process.env.LINKEDIN_CLIENT_ID || process.env.REACT_APP_LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('LinkedIn OAuth not configured: LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET');
    return res.status(503).json({
      error: 'LinkedIn import is temporarily unavailable. Please try again later.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Something went wrong. Please try again.' });
    }
  }

  const code = body?.code;
  const redirectUri = body?.redirectUri;

  if (!code || typeof code !== 'string' || code.length > 512) {
    return res.status(400).json({ error: 'Something went wrong. Please try again.' });
  }
  if (!isAllowedRedirectUri(redirectUri)) {
    return res.status(400).json({ error: 'Something went wrong. Please try again.' });
  }

  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok || !tokenData.access_token) {
      console.warn('LinkedIn token error:', tokenRes.status, tokenData.error);
      return res.status(400).json({
        error: "Couldn't connect to LinkedIn. Please try again.",
      });
    }

    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const info = await profileRes.json().catch(() => ({}));
    if (!profileRes.ok) {
      console.warn('LinkedIn userinfo error:', profileRes.status);
      return res.status(502).json({
        error: "Couldn't load your LinkedIn profile. Please try again.",
      });
    }

    const picture = await fetchPictureDataUrl(info.picture);
    const personal = mapUserInfo(info, picture);

    if (!personal.fullName && !personal.email) {
      return res.status(502).json({
        error: "Couldn't load your LinkedIn profile. Please try again.",
      });
    }

    return res.status(200).json({ personal });
  } catch (err) {
    console.error('LinkedIn exchange error:', err);
    return res.status(503).json({
      error: "Couldn't connect to LinkedIn. Please try again.",
    });
  }
};
