/**
 * Generates a multi-page Classic PDF to verify page padding + spacing.
 * Run: node scripts/verify-classic-pdf.js
 */
const React = require('react');
const ReactPDF = require('@react-pdf/renderer');
const fs = require('fs');
const path = require('path');

// Babel isn't available for JSX here — import compiled? CRA isn't compiled.
// Use dynamic import of the source via a small inline document instead.

const { Document, Page, Text, View, StyleSheet, pdf } = ReactPDF;

const PAGE_PAD = 36;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingTop: PAGE_PAD,
    paddingBottom: PAGE_PAD,
    paddingHorizontal: PAGE_PAD,
    fontFamily: 'Times-Roman',
  },
  header: {
    textAlign: 'center',
    marginTop: -PAGE_PAD,
    marginHorizontal: -PAGE_PAD,
    paddingTop: PAGE_PAD,
    paddingBottom: 18,
    paddingHorizontal: PAGE_PAD,
    borderBottomWidth: 4,
    borderBottomColor: '#1f2937',
    marginBottom: 14,
  },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  title: { fontSize: 14, marginBottom: 10, fontStyle: 'italic' },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    marginBottom: 6,
  },
  subsection: { marginBottom: 8 },
  itemTitle: { fontSize: 11, fontWeight: 'bold' },
  text: { fontSize: 10, lineHeight: 1.45, marginTop: 3 },
});

const long =
  'Designed and developed an interactive Yearly Sales Dashboard using Power BI that visualizes KPIs across regions, product lines, and sales channels. Collaborated with stakeholders to define metrics, cleaned source data, and published scheduled refreshes for leadership reporting.';

const Doc = () =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page, wrap: true },
      React.createElement(
        View,
        { style: styles.header, wrap: false },
        React.createElement(Text, { style: styles.name }, 'Zoya Mansoor'),
        React.createElement(Text, { style: styles.title }, 'Customer Support Specialist')
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Professional Experience'),
        ...[1, 2, 3, 4].map((i) =>
          React.createElement(
            View,
            { key: i, style: styles.subsection, wrap: false },
            React.createElement(Text, { style: styles.itemTitle }, `Role ${i} — Company ${i}`),
            React.createElement(Text, { style: styles.text }, long)
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Education'),
        ...[1, 2, 3].map((i) =>
          React.createElement(
            View,
            { key: i, style: styles.subsection, wrap: false },
            React.createElement(Text, { style: styles.itemTitle }, `Degree ${i}`),
            React.createElement(Text, { style: styles.text }, 'Institution Name • City')
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.section, wrap: false },
        React.createElement(Text, { style: styles.sectionTitle }, 'Skills & Expertise'),
        React.createElement(Text, { style: styles.text }, 'Customer Support • Communication • Collaboration')
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Notable Projects'),
        ...[1, 2, 3].map((i) =>
          React.createElement(
            View,
            { key: i, style: styles.subsection, wrap: false },
            React.createElement(Text, { style: styles.itemTitle }, `Project ${i}`),
            React.createElement(Text, { style: styles.text }, long)
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Certifications'),
        React.createElement(
          View,
          { style: styles.subsection, wrap: false },
          React.createElement(Text, { style: styles.itemTitle }, 'Digital Marketing'),
          React.createElement(Text, { style: styles.text }, 'Bano Qabil • Jul 2026')
        )
      )
    )
  );

(async () => {
  const outDir = path.join(__dirname, '..', 'tmp');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'classic-spacing-verify.pdf');
  await ReactPDF.renderToFile(React.createElement(Doc), outPath);
  const stat = fs.statSync(outPath);
  console.log('Wrote', outPath, 'bytes=', stat.size);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
