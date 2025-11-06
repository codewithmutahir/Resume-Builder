# Google Cloud Console Setup Guide

## Step-by-Step Instructions for Google Cloud Console

Since you've already configured Firebase, you now need to set up Google Cloud Console to enable Google Sign-In.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Select your Firebase project**: `resume-builder-f0a68`
   - If you don't see it, click the project dropdown at the top
   - Search for "resume-builder-f0a68"
   - Select it

## Step 2: Enable Required APIs

Google Sign-In requires specific APIs to be enabled:

1. In Google Cloud Console, go to **APIs & Services** → **Library** (left sidebar)
2. Search for and enable these APIs one by one:

   ### a) Identity Toolkit API
   - Search: "Identity Toolkit API"
   - Click on it
   - Click **ENABLE** button
   - Wait for it to enable (shows a checkmark when done)

   ### b) Firebase Installations API
   - Search: "Firebase Installations API"
   - Click on it
   - Click **ENABLE** button
   - Wait for it to enable

   ### c) Firebase Authentication API (if available)
   - Search: "Firebase Authentication API"
   - If found, enable it

## Step 3: Configure OAuth Consent Screen

This is required for Google Sign-In to work:

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen** (left sidebar)

2. **Select User Type**:
   - Choose **External** (unless you have a Google Workspace account)
   - Click **CREATE**

3. **Fill in App Information**:
   - **App name**: `Resume Builder Pro`
   - **User support email**: Select your email from dropdown
   - **App logo**: (Optional - you can skip this)
   - **App domain**: (Optional - you can skip for now)
   - **Developer contact information**: Enter your email address
   - Click **SAVE AND CONTINUE**

4. **Scopes** (Step 2):
   - Click **ADD OR REMOVE SCOPES**
   - Make sure these are selected:
     - `email`
     - `profile`
     - `openid`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

5. **Test users** (Step 3 - if in Testing mode):
   - Click **ADD USERS**
   - Add your email address (and any other test emails)
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

6. **Summary** (Step 4):
   - Review the information
   - Click **BACK TO DASHBOARD**

## Step 4: Check API Key Restrictions

1. In Google Cloud Console, go to **APIs & Services** → **Credentials** (left sidebar)

2. Find your API key (it starts with `AIzaSy...`)

3. Click on the API key to edit it

4. **API restrictions** section:
   - Option A (Recommended for testing): Select **Don't restrict key**
   - Option B (More secure): Select **Restrict key** and choose:
     - **Identity Toolkit API**
     - **Firebase Installations API**
   
5. **Application restrictions** section:
   - For local development: Select **None** (or add `localhost`)
   - For production: Add your domain later

6. Click **SAVE**

## Step 5: Verify Setup

1. Go back to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **Authentication** → **Sign-in method**
4. Verify **Google** provider shows:
   - Status: **Enabled** ✅
   - Project support email: Your email

## Step 6: Test Google Sign-In

1. Restart your dev server:
   ```bash
   # Stop server (Ctrl+C)
   cd frontend
   yarn start
   ```

2. Open your app in browser
3. Click "Continue with Google"
4. A Google sign-in popup should appear
5. Sign in with your Google account

## Troubleshooting

### If you see "OAuth consent screen not configured":
- Go back to Step 3 and complete the OAuth consent screen setup
- Make sure you clicked "SAVE AND CONTINUE" on all steps

### If you see "API not enabled":
- Go back to Step 2 and enable Identity Toolkit API
- Wait a few minutes for the API to fully activate

### If popup doesn't appear:
- Check browser console for errors
- Make sure popups are allowed for localhost
- Try in incognito mode

### If you see "Unauthorized domain":
- In Firebase Console → Authentication → Settings
- Add `localhost` to Authorized domains (if not already there)

## Quick Checklist

- [ ] Selected correct project in Google Cloud Console
- [ ] Enabled Identity Toolkit API
- [ ] Enabled Firebase Installations API
- [ ] Configured OAuth consent screen (all 4 steps completed)
- [ ] Added test users (if in Testing mode)
- [ ] Checked API key restrictions
- [ ] Verified Google provider is enabled in Firebase Console
- [ ] Restarted dev server
- [ ] Tested Google sign-in

## Important Notes

1. **OAuth Consent Screen**: Must be completed before Google Sign-In works
2. **API Enablement**: Can take 1-2 minutes to fully activate
3. **Test Users**: If your app is in "Testing" mode, only added test users can sign in
4. **Production**: When deploying, you'll need to add your production domain to authorized domains

## Still Having Issues?

1. Check browser console (F12) for specific error messages
2. Verify all APIs are enabled: Go to APIs & Services → Enabled APIs
3. Check OAuth consent screen status: Should show "Published" or "Testing"
4. Verify Firebase Console shows Google provider as "Enabled"

