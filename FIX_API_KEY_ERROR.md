# Fix Invalid API Key Error

## Error: "API key not valid. Please pass a valid API key."

This error means your Firebase API key is incorrect or has restrictions. Follow these steps to fix it:

## Step 1: Get the Correct API Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **resume-builder-f0a68**
3. Click the **⚙️ Settings (gear icon)** → **Project settings**
4. Scroll down to **Your apps** section
5. Find your **Web app** (or create one if you don't have it)
6. In the **SDK setup and configuration** section, you'll see:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "resume-builder-f0a68.firebaseapp.com",
     projectId: "resume-builder-f0a68",
     messagingSenderId: "664193409741",
     appId: "1:664193409741:web:208f3dbef3b291df57bf84"
   };
   ```
7. **Copy the exact `apiKey` value** from here

## Step 2: Update Your .env File

1. Open `frontend/.env` file
2. Update the API key:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   (Replace with the actual key from Step 1)

3. Make sure there are **NO spaces** around the `=` sign
4. Make sure the key is **NOT wrapped in quotes**
5. Save the file

## Step 3: Check API Key Restrictions (Important!)

The API key might have restrictions that block authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **resume-builder-f0a68**
3. Go to **APIs & Services** → **Credentials**
4. Find your API key (starts with `AIzaSy...`)
5. Click on it to edit
6. Check **API restrictions**:
   - If restricted, make sure these APIs are enabled:
     - **Identity Toolkit API**
     - **Firebase Installations API**
   - OR set to **Don't restrict key** (for testing)
7. Check **Application restrictions**:
   - For local development: Set to **None** or add `localhost`
   - For production: Add your domain
8. Click **Save**

## Step 4: Enable Required APIs

Make sure these APIs are enabled in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **resume-builder-f0a68**
3. Go to **APIs & Services** → **Library**
4. Search and enable:
   - **Identity Toolkit API** ✅
   - **Firebase Installations API** ✅
   - **Firebase Authentication API** ✅

## Step 5: Restart Your Dev Server

After updating `.env`:

1. **Stop** your dev server (Ctrl+C)
2. **Start** it again:
   ```bash
   cd frontend
   yarn start
   # or
   npm start
   ```

## Step 6: Verify the API Key is Loaded

1. Open browser console (F12)
2. Look for these logs:
   - `Firebase initialized successfully`
   - `API Key (preview): AIzaSy...XXXXX`
   - `API Key length: 39` (should be 39 characters)

If you see a different length or the preview doesn't match, the key isn't loading correctly.

## Common Issues

### Issue 1: API Key Not Loading
**Symptoms**: API key preview shows `undefined` or wrong value
**Solution**: 
- Check `.env` file is in `frontend/` directory
- Make sure variable name is `REACT_APP_FIREBASE_API_KEY` (with `REACT_APP_` prefix)
- Restart dev server after changing `.env`

### Issue 2: API Key Has Restrictions
**Symptoms**: Works locally but fails in production
**Solution**: 
- Add your production domain to API key restrictions
- Or temporarily remove restrictions for testing

### Issue 3: Wrong API Key
**Symptoms**: Error persists even after updating
**Solution**:
- Get a fresh API key from Firebase Console
- Make sure you're copying from the correct project
- Verify the key matches your project ID

## Quick Checklist

- [ ] API key copied from Firebase Console → Project Settings → Your apps
- [ ] `.env` file updated with correct API key (no quotes, no spaces)
- [ ] Dev server restarted after updating `.env`
- [ ] Identity Toolkit API enabled in Google Cloud Console
- [ ] API key restrictions allow Authentication API
- [ ] Browser console shows correct API key preview

## Still Not Working?

1. **Create a new Web app** in Firebase Console:
   - Project Settings → Your apps → Add app → Web
   - Copy the new API key
   - Update `.env` with new key

2. **Check browser console** for the exact error message

3. **Verify project ID matches**: The error URL should show `projects/resume-builder-f0a68`

4. **Try in incognito mode** to rule out cache issues

