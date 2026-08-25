/**
 * Deterministic ATS-style keyword match (no LLM).
 * Used by /api/generate task `ats_score`.
 */

const STOP_WORDS = new Set(
  `
  a an the and or but if then else when at at by for with about against between into
  through during before after above below to from up down in out on off over under
  again further once here there all any both each few more most other some such no
  nor not only own same so than too very can will just should now of is are was were
  be been being have has had do does did having that this these those i you he she it
  we they them our your their what which who whom whose how why where who will would
  could may might must shall also as per via etc including include includes using use
  used based well able work works working team teams role roles job jobs company
  experience years year strong good great new please amp required requirements need
  needs looking seek seeking candidate candidates position positions skills skill
  description responsibilities responsibility qualification qualifications preferred
  must across within upon into onto `
    .trim()
    .split(/\s+/)
);

function stripHtml(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  const words = stripHtml(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/gi, ''))
    .filter(Boolean);

  const out = new Set();
  for (const w of words) {
    if (w.length < 3) continue;
    if (STOP_WORDS.has(w)) continue;
    if (/^\d+$/.test(w)) continue;
    out.add(w);
  }

  // Keep common multi-token tech phrases if present as joined forms
  const joined = stripHtml(text).toLowerCase();
  const phrases = [
    'machine learning',
    'deep learning',
    'data science',
    'project management',
    'customer service',
    'software engineer',
    'full stack',
    'front end',
    'back end',
    'react native',
    'node js',
    'ci cd',
  ];
  for (const p of phrases) {
    if (joined.includes(p)) out.add(p.replace(/\s+/g, ' '));
  }

  return out;
}

function buildResumeCorpus(resume) {
  if (!resume || typeof resume !== 'object') return '';
  const personal = resume.personal || {};
  const parts = [
    personal.fullName,
    personal.title,
    personal.summary,
    personal.location,
    ...(resume.skills || []),
    ...(resume.experience || []).flatMap((e) => [
      e.company,
      e.position,
      e.location,
      e.description,
    ]),
    ...(resume.education || []).flatMap((e) => [
      e.school,
      e.degree,
      e.field,
      e.description,
    ]),
    ...(resume.projects || []).flatMap((p) => [
      p.name,
      p.technologies,
      p.description,
    ]),
    ...(resume.certifications || []).flatMap((c) => [c.name, c.issuer]),
  ];
  return parts.filter(Boolean).join(' ');
}

function sectionPresence(resume) {
  const tips = [];
  let bonus = 0;
  const personal = resume?.personal || {};

  if (personal.summary && String(personal.summary).trim().length >= 40) {
    bonus += 8;
  } else {
    tips.push('Add a clear professional summary (2–3 sentences).');
  }

  if (Array.isArray(resume?.experience) && resume.experience.length > 0) {
    bonus += 8;
  } else {
    tips.push('Add at least one work experience entry with bullets.');
  }

  if (Array.isArray(resume?.skills) && resume.skills.length >= 5) {
    bonus += 6;
  } else {
    tips.push('List more relevant skills (aim for 6–12 keywords from the job).');
  }

  if (Array.isArray(resume?.education) && resume.education.length > 0) {
    bonus += 4;
  } else {
    tips.push('Include education details for ATS parsers.');
  }

  if (personal.email && personal.phone) {
    bonus += 4;
  } else {
    tips.push('Make sure email and phone are filled in.');
  }

  return { bonus, tips };
}

/**
 * @param {string} jobDescription
 * @param {object} resume structured resumeData
 */
function scoreAts(jobDescription, resume) {
  const jd = stripHtml(jobDescription).slice(0, 8000);
  if (jd.length < 40) {
    return {
      error: 'Paste a longer job description to analyze.',
      status: 400,
    };
  }

  const jdTokens = tokenize(jd);
  if (jdTokens.size < 8) {
    return {
      error: 'Paste a longer job description to analyze.',
      status: 400,
    };
  }

  const resumeText = buildResumeCorpus(resume);
  const resumeTokens = tokenize(resumeText);

  const matched = [];
  const missing = [];
  for (const token of jdTokens) {
    if (resumeTokens.has(token) || resumeText.toLowerCase().includes(token)) {
      matched.push(token);
    } else {
      missing.push(token);
    }
  }

  matched.sort((a, b) => b.length - a.length || a.localeCompare(b));
  missing.sort((a, b) => b.length - a.length || a.localeCompare(b));

  const coverage =
    jdTokens.size === 0 ? 0 : matched.length / jdTokens.size;
  const { bonus, tips: structureTips } = sectionPresence(resume);

  // 0–100: 70% keyword coverage + 30% structure bonus (max 30 from bonus~30)
  const keywordScore = Math.round(coverage * 70);
  const structureScore = Math.min(30, bonus);
  const score = Math.max(0, Math.min(100, keywordScore + structureScore));

  const tips = [...structureTips];
  if (missing.length > 0) {
    tips.unshift(
      `Add missing keywords where truthful: ${missing
        .slice(0, 8)
        .join(', ')}.`
    );
  }
  if (score >= 80) {
    tips.push('Strong match — tailor a few bullets to mirror the job’s top skills.');
  } else if (score >= 55) {
    tips.push('Decent match — rewrite summary and top role to echo the JD language.');
  } else {
    tips.push('Low match — prioritize the missing keywords that you actually have.');
  }

  return {
    score,
    matched: matched.slice(0, 24),
    missing: missing.slice(0, 24),
    tips: tips.slice(0, 6),
  };
}

module.exports = {
  scoreAts,
  stripHtml,
  buildResumeCorpus,
  tokenize,
};
