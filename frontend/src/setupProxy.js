/**
 * Local-only API routes for CRA/craco dev server.
 */
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const apiRoot = path.join(__dirname, '..', '..', 'api');
const generatePath = path.join(apiRoot, 'generate.js');
const linkedinExchangePath = path.join(apiRoot, 'linkedin', 'exchange.js');

function mountHandler(app, routePath, handlerFile, extraCacheFiles = []) {
  app.all(routePath, (req, res) => {
    delete require.cache[require.resolve(handlerFile)];
    for (const file of extraCacheFiles) {
      try {
        delete require.cache[require.resolve(file)];
      } catch {
        // ignore
      }
    }
    const handler = require(handlerFile);
    Promise.resolve(handler(req, res)).catch((err) => {
      console.error(`Local ${routePath} error:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
      }
    });
  });
}

module.exports = function setupProxy(app) {
  app.use(express.json({ limit: '1mb' }));

  mountHandler(app, '/api/generate', generatePath, [
    path.join(apiRoot, 'atsScore.js'),
  ]);
  mountHandler(app, '/api/linkedin/exchange', linkedinExchangePath);
};
