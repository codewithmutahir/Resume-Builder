# Firebase Google Sign-In Setup Guide

## Error: `auth/network-request-failed`

This error occurs when Google Sign-In is not properly configured in Firebase. Follow these steps to fix it:

## Step 1: Enable Google Sign-In Provider

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`resume-builder-f0a68`)
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** to ON
6. Enter your **Support email** (your email address)
7. Click **Save**

## Step 2: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Scroll down to **Authorized domains**
3. Add your domains:
   - `localhost` (should already be there for local development)
   - Your production domain (e.g., `your-app.vercel.app`)
   - Any other domains you're using

## Step 3: Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (`resume-builder-f0a68`)
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Fill in the required information:
   - **User Type**: External (unless you have a Google Workspace)
   - **App name**: Resume Builder Pro
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. Add scopes (if needed):
   - `email`
   - `profile`
   - `openid`
7. Add test users (if in Testing mode):
   - Add your email address
8. Click **Save and Continue**

## Step 4: Verify Firebase Configuration

Make sure your `.env` file has the correct values:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyBycWeyvYHBWTDQ1010127WuGwBkoLfza
REACT_APP_FIREBASE_AUTH_DOMAIN=resume-builder-f0a68.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=resume-builder-f0a68
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=664193409741
REACT_APP_FIREBASE_APP_ID=1:664193409741:web:208f3dbef3b291df57bf84
```

## Step 5: Restart Your Dev Server

After making changes:
1. Stop your dev server (Ctrl+C)
2. Start it again: `yarn start` or `npm start`

## Common Issues and Solutions

### Issue 1: "Unauthorized domain"
**Solution**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Issue 2: "Operation not allowed"
**Solution**: Enable Google provider in Firebase Console → Authentication → Sign-in method

### Issue 3: "Network request failed"
**Possible causes**:
- Google Sign-In provider not enabled
- OAuth consent screen not configured
- Network/firewall blocking requests
- Incorrect Firebase configuration

**Solutions**:
1. Verify Google provider is enabled (Step 1)
2. Configure OAuth consent screen (Step 3)
3. Check browser console for detailed error
4. Verify `.env` file has correct values
5. Clear browser cache and try again

### Issue 4: Popup blocked
**Solution**: Allow popups for your domain in browser settings

## Testing

1. Open your app in the browser
2. Click "Continue with Google"
3. A popup should open with Google sign-in
4. After signing in, you should be redirected to the app

## Still Having Issues?

1. Check browser console for detailed error messages
2. Verify Firebase project ID matches your `.env` file
3. Ensure you're using the correct Firebase project
4. Check Firebase Console → Authentication → Users to see if sign-ins are being attempted
5. Verify your internet connection is stable

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to Firebase Authorized domains
2. Update environment variables in your hosting platform
3. Ensure OAuth consent screen includes your production domain
4. Test Google sign-in on production domain

