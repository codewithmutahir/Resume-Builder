# Vercel Deployment Setup for AI Summary Feature

## 🚀 Setup Instructions

### Step 1: Get Your FREE HuggingFace API Token

1. Go to [https://huggingface.co/](https://huggingface.co/)
2. Sign up for a free account (or log in if you already have one)
3. Click on your profile picture → **Settings**
4. Navigate to **Access Tokens** in the left sidebar
5. Click **New token**
6. Give it a name (e.g., "resume-builder")
7. Select **Read** permission (this is sufficient)
8. Click **Generate**
9. **Copy the token** - it starts with `hf_...`

### Step 2: Add Environment Variable to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to your Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your Resume Builder project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Set:
   - **Name**: `HF_TOKEN`
   - **Value**: Your HuggingFace token (the one starting with `hf_...`)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

#### Option B: Via Vercel CLI

```bash
vercel env add HF_TOKEN
# When prompted, paste your HuggingFace token
# Select all environments when asked
```

### Step 3: Redeploy Your Application

After adding the environment variable, you need to trigger a new deployment:

#### Option A: Push to Git

```bash
git add .
git commit -m "Add AI summary feature with Vercel serverless function"
git push
```

Vercel will automatically redeploy.

#### Option B: Manual Redeploy

1. Go to your project in Vercel Dashboard
2. Click on **Deployments**
3. Find the latest deployment
4. Click the three dots menu → **Redeploy**
5. Make sure "Use existing Build Cache" is **unchecked**
6. Click **Redeploy**

### Step 4: Test the Feature

1. Go to your deployed site on Vercel
2. Navigate to the Personal Details form
3. Fill in some basic information (name, title, etc.)
4. Click the **"Generate with AI"** button
5. Wait 10-20 seconds for the first request (model loading time)
6. Your AI-generated summary should appear!

## 📁 What Changed

### New Files Created:
- `api/summarize.js` - Vercel serverless function that calls HuggingFace API

### Files Modified:
- `vercel.json` - Updated to properly route API requests
- `frontend/src/components/ResumeBuilder/PersonalDetailsForm.jsx` - Removed incorrect imports

## 🔧 How It Works

1. **Frontend** (`PersonalDetailsForm.jsx`) makes a POST request to `/api/summarize`
2. **Vercel** routes the request to the serverless function at `api/summarize.js`
3. **Serverless Function** calls HuggingFace's BART AI model with your personal info
4. **HuggingFace** generates a professional summary
5. **Response** is sent back to your React frontend
6. **Summary** appears in the text field

## ⚠️ Important Notes

### First Request May Take Time
- The HuggingFace model needs to "warm up" on first use
- First request: 10-20 seconds
- Subsequent requests: 2-5 seconds

### Rate Limits (Free Tier)
- HuggingFace free tier: ~30,000 characters/month
- Plenty for personal use and testing

### Local Development

To test locally with Vercel CLI:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Create a .env file at the root (NOT in frontend folder)
echo "HF_TOKEN=your_token_here" > .env

# Run Vercel dev server
vercel dev

# Your app will run at http://localhost:3000
# API routes will work at http://localhost:3000/api/summarize
```

## 🐛 Troubleshooting

### "Error generating summary"
- Check that HF_TOKEN is set in Vercel environment variables
- Verify you've redeployed after adding the token
- Check Vercel Function logs: Dashboard → Your Project → Functions

### "Model is loading"
- This is normal for the first request
- Wait 10-20 seconds and try again
- The model will stay "warm" for a few minutes after use

### API not found (404)
- Make sure the `api` folder is at the **root** of your project, not in `frontend/`
- Check that `vercel.json` has the correct rewrite rules
- Redeploy the application

### CORS Errors
- The `api/summarize.js` function includes CORS headers
- If you still get errors, check your browser console for details

## 📊 Monitoring

View your API usage in Vercel:
1. Go to your project dashboard
2. Click on **Functions**
3. See execution time, invocations, and errors

## 🎉 Success!

Once deployed, your users can generate AI-powered professional summaries with a single click!

---

**Need Help?** Check the Vercel documentation: https://vercel.com/docs/functions/serverless-functions

