/**
 * Call the server-side AI / ATS proxy.
 * Client only sends allowlisted task + fields — never raw prompts or API keys.
 */

const SAFE_MESSAGES = {
  network: "Couldn't reach the service right now. Please try again.",
  unavailable: 'AI is temporarily unavailable. Please try again later.',
  empty: "Couldn't generate text right now. Please try again.",
  generic: 'Something went wrong. Please try again.',
  rate: "You're generating too quickly. Please wait a bit and try again.",
};

const ALLOWED_TASKS = new Set([
  'summary',
  'experience',
  'ats_score',
  'ats_rewrite',
]);

const ALLOWED_API_ERRORS = new Set([
  'Professional title is required.',
  'Company and position are required.',
  'Please enter real details (not placeholder or random text).',
  'Invalid input. Please use a normal job title.',
  'Invalid input. Please use normal company/role names.',
  'Paste a longer job description to analyze.',
  'Add resume content first, then improve it for the job.',
  'Add some resume details before running an ATS check.',
  "You've reached today's AI limit. Please try again tomorrow.",
  "You're generating too quickly. Please wait a bit and try again.",
  'AI is temporarily unavailable. Please try again later.',
  "Couldn't generate text right now. Please try again shortly.",
  'Something went wrong. Please try again.',
]);

const JD_STORAGE_KEY = 'resume_ats_jd';

/** Drop heavy fields (e.g. base64 photos) before ATS API calls. */
export function slimResumeForAts(resume) {
  if (!resume || typeof resume !== 'object') return {};
  const personal = resume.personal || {};
  return {
    personal: {
      fullName: personal.fullName || '',
      title: personal.title || '',
      email: personal.email || '',
      phone: personal.phone || '',
      location: personal.location || '',
      summary: String(personal.summary || '').slice(0, 2000),
    },
    skills: Array.isArray(resume.skills)
      ? resume.skills.slice(0, 40).map((s) => String(s).slice(0, 60))
      : [],
    experience: Array.isArray(resume.experience)
      ? resume.experience.slice(0, 12).map((e) => ({
          company: String(e.company || '').slice(0, 100),
          position: String(e.position || '').slice(0, 100),
          location: String(e.location || '').slice(0, 80),
          description: String(e.description || '').slice(0, 2000),
        }))
      : [],
    education: Array.isArray(resume.education)
      ? resume.education.slice(0, 8).map((e) => ({
          school: String(e.school || '').slice(0, 100),
          degree: String(e.degree || '').slice(0, 100),
          field: String(e.field || '').slice(0, 100),
          description: String(e.description || '').slice(0, 500),
        }))
      : [],
    projects: Array.isArray(resume.projects)
      ? resume.projects.slice(0, 8).map((p) => ({
          name: String(p.name || '').slice(0, 100),
          technologies: String(p.technologies || '').slice(0, 200),
          description: String(p.description || '').slice(0, 800),
        }))
      : [],
    certifications: Array.isArray(resume.certifications)
      ? resume.certifications.slice(0, 10).map((c) => ({
          name: String(c.name || '').slice(0, 100),
          issuer: String(c.issuer || '').slice(0, 100),
        }))
      : [],
  };
}

export function loadStoredJobDescription() {
  try {
    return sessionStorage.getItem(JD_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function storeJobDescription(jd) {
  try {
    if (!jd) sessionStorage.removeItem(JD_STORAGE_KEY);
    else sessionStorage.setItem(JD_STORAGE_KEY, String(jd).slice(0, 8000));
  } catch {
    // ignore
  }
}

function getGenerateUrl() {
  // Same-origin on localhost (setupProxy) and on Vercel/custom domain
  return '/api/generate';
}

function toUserMessage(status, apiError) {
  if (apiError && ALLOWED_API_ERRORS.has(apiError)) {
    return apiError;
  }
  if (status === 429) return SAFE_MESSAGES.rate;
  if (status === 503 || status >= 500) return SAFE_MESSAGES.unavailable;
  return SAFE_MESSAGES.generic;
}

async function postGenerate(task, fields) {
  if (!ALLOWED_TASKS.has(task)) {
    throw new Error(SAFE_MESSAGES.generic);
  }

  const url = getGenerateUrl();
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, fields }),
    });
  } catch (err) {
    console.error('AI generate network error:', err);
    throw new Error(SAFE_MESSAGES.network);
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // non-JSON
  }

  if (!response.ok) {
    console.error('AI generate failed:', response.status, data?.error);
    if (response.status === 413) {
      throw new Error('Something went wrong. Please try again.');
    }
    throw new Error(toUserMessage(response.status, data?.error));
  }

  return data;
}

/** Text generation (summary / experience / ats_rewrite) → string */
export async function generateWithAI({ task, fields }) {
  const data = await postGenerate(task, fields);
  if (!data.content || typeof data.content !== 'string') {
    throw new Error(SAFE_MESSAGES.empty);
  }
  return data.content.trim();
}

/** ATS score (deterministic) → { score, matched, missing, tips } */
export async function scoreResumeAts({ jobDescription, resume }) {
  const data = await postGenerate('ats_score', {
    jobDescription: String(jobDescription || '').slice(0, 8000),
    resume: slimResumeForAts(resume),
  });
  if (typeof data.score !== 'number') {
    throw new Error(SAFE_MESSAGES.generic);
  }
  return {
    score: data.score,
    matched: Array.isArray(data.matched) ? data.matched : [],
    missing: Array.isArray(data.missing) ? data.missing : [],
    tips: Array.isArray(data.tips) ? data.tips : [],
  };
}

export async function rewriteForAts(fields) {
  return generateWithAI({ task: 'ats_rewrite', fields });
}
