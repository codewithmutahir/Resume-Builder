const fs = require('fs');
const path = require('path');

// Minimal PDF page-count + first content Y probe via raw stream text operators is unreliable.
// Instead: check file exists, size, and that PDF has multiple pages via /Type /Page count.
const pdfPath = path.join(__dirname, '..', 'tmp', 'classic-real-template.pdf');
const buf = fs.readFileSync(pdfPath);
const text = buf.toString('latin1');
const pageMatches = text.match(/\/Type\s*\/Page[^s]/g) || [];
const pageCount = pageMatches.length;
console.log(JSON.stringify({
  path: pdfPath,
  bytes: buf.length,
  pageCount,
  hasPagePadPattern: text.includes('Zoya Mansoor'),
  multiPage: pageCount >= 2,
}));
if (pageCount < 2) {
  console.error('Expected multi-page PDF to verify continuation margins');
  process.exit(1);
}
