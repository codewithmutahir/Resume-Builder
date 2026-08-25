const React = require('react');
const ReactPDF = require('@react-pdf/renderer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const entry = path.join(root, 'src/components/ResumeTemplates/CreativeTemplatePDF.jsx');
const bundle = path.join(root, 'tmp/CreativeTemplatePDF.cjs');

execSync(
  `npx --yes esbuild "${entry}" --bundle --platform=node --outfile="${bundle}" --external:@react-pdf/renderer --loader:.jsx=jsx --format=cjs --alias:@=./src`,
  { cwd: root, stdio: 'inherit' }
);

const { CreativeTemplatePDF } = require(bundle);
const {
  softPageBackground,
  headerSubtitleColor,
  skillBadgeColors,
} = require(path.join(root, 'src/utils/colorUtils.js'));

const colors = {
  primary: '#000000',
  secondary: '#5e576b',
  accent: '#bcc0c8',
  text: '#111827',
  textSecondary: '#374151',
};

const expected = {
  pageBg: softPageBackground(colors.accent, colors.primary),
  title: headerSubtitleColor(colors.primary, colors.accent),
  badges: skillBadgeColors(colors.primary, colors.accent),
};

console.log('Expected theme mapping:', expected);

const data = {
  personal: {
    fullName: 'Trevor Stevenson',
    title: 'Professional Title',
    email: 't@example.com',
    phone: '555',
    location: 'City',
    summary: 'Summary',
  },
  experience: [],
  education: [],
  skills: ['Photoshop', 'Cybersecurity'],
  projects: [],
  certifications: [],
  references: [],
};

(async () => {
  const out = path.join(root, 'tmp/creative-color-check.pdf');
  await ReactPDF.renderToFile(
    React.createElement(CreativeTemplatePDF, { data, colors }),
    out
  );
  const buf = fs.readFileSync(out);
  const latin = buf.toString('latin1');
  // Hardcoded pinks must be gone from the stylesheet path — spot-check expected hex fragments.
  const banned = ['#faf5ff', '#f3e8ff', '#e9d5ff'];
  const foundBanned = banned.filter((c) => latin.toLowerCase().includes(c.toLowerCase().slice(1)));
  console.log(JSON.stringify({
    bytes: buf.length,
    expected,
    foundBannedHardcodedPinks: foundBanned,
    ok:
      expected.pageBg.toLowerCase() !== '#faf5ff' &&
      expected.title.toLowerCase() !== '#e9d5ff' &&
      expected.badges.background.toLowerCase() === '#bcc0c8' &&
      foundBanned.length === 0,
  }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
