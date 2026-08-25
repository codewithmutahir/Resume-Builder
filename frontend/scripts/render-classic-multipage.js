const React = require('react');
const ReactPDF = require('@react-pdf/renderer');
const { ClassicTemplatePDF } = require('../tmp/classic-bundle.cjs');
const path = require('path');
const fs = require('fs');

const long =
  'Designed and developed an interactive Yearly Sales Dashboard using Power BI that visualizes KPIs across regions, product lines, and sales channels. Collaborated with stakeholders to define metrics, cleaned source data, built DAX measures, and published scheduled refreshes for leadership reporting across weekly and monthly cadences.';

const data = {
  personal: {
    fullName: 'Zoya Mansoor',
    title: 'Customer Support Specialist',
    email: 'zoya@example.com',
    phone: '+92 300 0000000',
    location: 'Karachi',
    linkedin: 'linkedin.com/in/zoya',
    summary:
      'Dedicated CSR with strong communication skills and a track record of resolving customer issues efficiently while maintaining high satisfaction scores. Experienced across phone, email, and chat channels with a focus on empathy, documentation quality, and continuous process improvement.',
  },
  experience: Array.from({ length: 5 }, (_, i) => ({
    position: i === 0 ? 'CSR' : `Support Role ${i + 1}`,
    company: i === 0 ? 'elite solutions' : `Company ${i + 1}`,
    startDate: '2017-02',
    endDate: i === 0 ? undefined : '2020-03',
    current: i === 0,
    location: 'karachi',
    description: long,
  })),
  education: [
    { degree: 'matric', school: 'ABC College', startDate: '2014-01', endDate: '2016-01', field: 'Commerce' },
    { degree: 'intermediate', school: 'XYZ College', startDate: '2016-02', endDate: '2018-02' },
    {
      degree: 'bs business analytics and programing',
      school: 'dhasuffa university',
      startDate: '2018-03',
      endDate: '2022-03',
      description: long,
    },
  ],
  skills: [
    'Customer Support',
    'team collabration',
    'Communication',
    'customer complaint and handling',
    'Power BI',
    'Excel',
  ],
  projects: [
    { name: 'yearly sales dashboard', technologies: 'Power BI', description: long },
    { name: 'customer feedback tracker', technologies: 'Excel, Sheets', description: long },
    { name: 'onboarding checklist', technologies: 'Notion', description: long },
  ],
  certifications: [
    { name: 'digital marketing', issuer: 'bano qabil', date: '2026-07', credentialId: 'BQ-DM-001' },
    { name: 'customer success fundamentals', issuer: 'Coursera', date: '2025-01', credentialId: 'CS-100' },
  ],
  references: [
    { name: 'Ali Khan', title: 'Team Lead', company: 'Elite Solutions', email: 'ali@example.com', phone: '111' },
    { name: 'Sara Ahmed', title: 'Manager', company: 'TechCare', email: 'sara@example.com', phone: '222' },
  ],
};

(async () => {
  const out = path.join(__dirname, '..', 'tmp', 'classic-real-template.pdf');
  const publicOut = path.join(__dirname, '..', 'public', 'classic-real-template.pdf');
  await ReactPDF.renderToFile(React.createElement(ClassicTemplatePDF, { data, colors: null }), out);
  fs.copyFileSync(out, publicOut);
  const buf = fs.readFileSync(out);
  const text = buf.toString('latin1');
  const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(JSON.stringify({ bytes: buf.length, pageCount, multiPage: pageCount >= 2 }));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
