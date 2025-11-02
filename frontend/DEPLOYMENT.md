# Deployment Guide for Vercel

## 🚀 Quick Fix for 404 Error

The 404 error occurs because Vercel doesn't know how to handle React Router routes. We've added configuration files to fix this.

## ✅ Files Added

1. **`vercel.json`** - Main Vercel configuration
2. **`public/_redirects`** - Fallback redirect rule

## 📋 Deployment Steps

### Option 1: Redeploy (Recommended)

1. **Commit the new files:**
   ```bash
   git add vercel.json public/_redirects
   git commit -m "fix: Add Vercel configuration for React Router"
   git push
   ```

2. **Vercel will automatically redeploy** with the new configuration

### Option 2: Manual Deployment via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 3: Deploy via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click **"Deployments"**
3. Find the latest deployment
4. Click **"Redeploy"**
5. The new `vercel.json` will be picked up automatically

## ⚙️ Vercel Project Settings

Make sure your Vercel project has these settings:

### Build & Development Settings

- **Framework Preset:** `Create React App`
- **Build Command:** `yarn build` or `npm run build`
- **Output Directory:** `build`
- **Install Command:** `yarn install` or `npm install`

### Root Directory

- **Root Directory:** `frontend` (if your project is in a monorepo)
- **Root Directory:** `.` (if frontend is at root)

## 🔧 Environment Variables

If you have any environment variables, add them in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add your variables (e.g., `REACT_APP_API_URL`)
3. Click **Save**
4. Redeploy

## ✨ What the Configuration Does

### `vercel.json`
- Routes all requests to `index.html`
- Preserves static assets (CSS, JS, images)
- Allows React Router to handle client-side routing

### `public/_redirects`
- Backup fallback for SPA routing
- Ensures all routes return 200 status with `index.html`

## 🐛 Troubleshooting

### Still getting 404?

1. **Clear Vercel cache:**
   ```bash
   vercel --prod --force
   ```

2. **Check build logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on the latest deployment
   - Check the build logs for errors

3. **Verify files are in build:**
   - Ensure `build/` directory is created
   - Verify `build/index.html` exists
   - Check that static assets are in `build/static/`

### Build failing?

1. **Check Node version:**
   - Add to `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

2. **Install dependencies:**
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   yarn build
   ```

### Routes still not working?

1. **Verify vercel.json is at project root:**
   ```
   frontend/
   ├── vercel.json          ← Must be here
   ├── public/
   │   └── _redirects       ← Must be here
   ├── src/
   └── package.json
   ```

2. **Check Router configuration in App.js:**
   - Make sure you're using `BrowserRouter` (not `HashRouter`)
   - Verify routes are properly defined

## 📝 Additional Tips

- **Custom Domain:** Add in Vercel Dashboard → Settings → Domains
- **HTTPS:** Automatically enabled by Vercel
- **Automatic Deployments:** Set up in GitHub/GitLab integration
- **Preview Deployments:** Every PR gets a preview URL

## 🎉 Success!

Once deployed, your app should work at:
- Production: `https://your-project.vercel.app`
- All routes: `https://your-project.vercel.app/any-route`

No more 404 errors! 🚀

