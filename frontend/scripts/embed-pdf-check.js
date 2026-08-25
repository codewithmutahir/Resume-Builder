const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'tmp', 'classic-real-template.pdf');
const htmlPath = path.join(__dirname, '..', 'public', 'pdf-check.html');
const b64 = fs.readFileSync(pdfPath).toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Classic PDF Page Check</title>
  <style>
    body { margin: 0; background: #1a1a1a; color: #fff; font-family: system-ui; }
    #meta { padding: 12px 16px; white-space: pre-wrap; }
    canvas { display: block; margin: 0 auto 24px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
  <div id="meta">Loading…</div>
  <div id="pages"></div>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    function firstInkY(canvas) {
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      const data = ctx.getImageData(0, 0, width, height).data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (r < 250 || g < 250 || b < 250) return y;
        }
      }
      return -1;
    }

    (async () => {
      const raw = atob('${b64}');
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const meta = document.getElementById('meta');
      const pagesEl = document.getElementById('pages');
      const results = [];

      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.dataset.page = String(n);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        pagesEl.appendChild(canvas);
        const y = firstInkY(canvas);
        // Page padding is 36pt. At scale 1.5 => ~54px. Header on page 1 is full-bleed
        // so page 1 firstInkY can be ~0. Page 2+ must have top margin.
        const isContinuation = n > 1;
        const expectedMinY = isContinuation ? 40 : 0;
        results.push({
          page: n,
          firstInkY: y,
          expectedMinY,
          ok: isContinuation ? y >= expectedMinY : true,
        });
      }

      window.__PDF_CHECK__ = {
        numPages: pdf.numPages,
        results,
        continuationOk: results.filter((r) => r.page > 1).every((r) => r.ok),
        allOk: results.filter((r) => r.page > 1).every((r) => r.ok) && pdf.numPages >= 2,
      };
      meta.textContent = JSON.stringify(window.__PDF_CHECK__, null, 2);
      document.title = window.__PDF_CHECK__.allOk ? 'PDF CHECK PASS' : 'PDF CHECK FAIL';
    })().catch((e) => {
      document.getElementById('meta').textContent = String(e && e.stack ? e.stack : e);
      document.title = 'PDF CHECK ERROR';
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(htmlPath, html);
console.log('Wrote', htmlPath, 'b64chars=', b64.length);
