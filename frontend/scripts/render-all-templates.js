const React = require('react');
const ReactPDF = require('@react-pdf/renderer');
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const templates = [
  'ClassicTemplatePDF',
  'ModernTemplatePDF',
  'MinimalTemplatePDF',
  'ElegantTemplatePDF',
  'CreativeTemplatePDF',
];

const long =
  'Designed and developed an interactive Yearly Sales Dashboard using Power BI that visualizes KPIs across regions and product lines with scheduled refreshes for leadership reporting.';

const data = {
  personal: {
    fullName: 'Zoya Mansoor',
    title: 'Customer Support Specialist',
    email: 'zoya@example.com',
    phone: '+92 300 0000000',
    location: 'Karachi',
    linkedin: 'linkedin.com/in/zoya',
    website: 'zoya.dev',
    summary: long,
  },
  experience: Array.from({ length: 4 }, (_, i) => ({
    position: `Role ${i + 1}`,
    company: `Company ${i + 1}`,
    startDate: '2018-01',
    endDate: '2020-01',
    current: i === 0,
    location: 'Karachi',
    description: long,
  })),
  education: [
    { degree: 'BS Analytics', school: 'University', startDate: '2014-01', endDate: '2018-01', field: 'Business' },
    { degree: 'Intermediate', school: 'College', startDate: '2012-01', endDate: '2014-01' },
  ],
  skills: ['Support', 'Communication', 'Excel', 'Power BI'],
  projects: [
    { name: 'Sales Dashboard', technologies: 'Power BI', description: long },
    { name: 'Feedback Tracker', technologies: 'Sheets', description: long },
  ],
  certifications: [
    { name: 'Digital Marketing', issuer: 'Provider', date: '2024-01', credentialId: 'ID-1' },
  ],
  references: [
    { name: 'Ali Khan', title: 'Lead', company: 'Co', email: 'a@x.com', phone: '111' },
  ],
};

(async () => {
  const outDir = path.join(__dirname, '..', 'tmp');
  fs.mkdirSync(outDir, { recursive: true });
  const results = [];

  for (const name of templates) {
    const entry = path.join(__dirname, '..', 'src', 'components', 'ResumeTemplates', `${name}.jsx`);
    const bundle = path.join(outDir, `${name}.cjs`);
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',
      outfile: bundle,
      external: ['@react-pdf/renderer'],
      loader: { '.jsx': 'jsx' },
      format: 'cjs',
      logLevel: 'silent',
    });
    delete require.cache[require.resolve(bundle)];
    const mod = require(bundle);
    const Comp = mod[name];
    const pdfPath = path.join(outDir, `${name}.pdf`);
    await ReactPDF.renderToFile(React.createElement(Comp, { data, colors: null }), pdfPath);
    const buf = fs.readFileSync(pdfPath);
    const pageCount = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    results.push({ name, bytes: buf.length, pageCount, ok: buf.length > 1000 });
  }

  console.log(JSON.stringify(results, null, 2));
  if (results.some((r) => !r.ok)) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
