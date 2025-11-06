# Fix Signup Error and API Key Security

## Issues Found

1. **Signup failing** with `auth/network-request-failed`
2. **API key appearing in console** (this is normal, but let's secure it properly)

## About API Key Exposure

### ⚠️ Important: Firebase API Keys Are Public by Design

Firebase API keys are **meant to be public** in client-side applications. They're not secret keys like database passwords. However, you should:

1. **Restrict the API key** in Google Cloud Console
2. **Use Firestore Security Rules** to protect data
3. **Never expose admin credentials** or service account keys

### Why API Keys Appear in Network Requests

- Firebase SDK needs to send the API key with every request
- This is visible in browser DevTools → Network tab
- This is **normal and expected** behavior
- Security comes from **API restrictions** and **Firestore rules**, not hiding the key

## Fix 1: Enable Email/Password Sign-Up

The signup error suggests Email/Password provider might not be enabled:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

## Fix 2: Verify API Key

The error shows API key ending with `-ts` which looks incorrect. Verify:

1. Go to Firebase Console → Project Settings
2. Copy the **exact** API key from the config
3. Update `frontend/.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyBycWeyvYHBWTDQ1010127WuGwBkoLfza
   ```
   (Make sure it's the FULL key, no `-ts` suffix)
4. Restart dev server

## Fix 3: Secure API Key with Restrictions

Even though API keys are public, restrict them:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **APIs & Services** → **Credentials**
4. Click your API key
5. Under **API restrictions**:
   - Select **Restrict key**
   - Choose:
     - ✅ Identity Toolkit API
     - ✅ Firebase Installations API
6. Under **Application restrictions**:
   - For development: Select **None** or add `localhost`
   - For production: Add your domain
7. Click **Save**

## Fix 4: Update Firestore Security Rules

Make sure rules allow authenticated users to create accounts:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## What Changed in Code

1. ✅ Added auth initialization check before signup
2. ✅ Added input validation
3. ✅ Better error handling (doesn't expose sensitive details)
4. ✅ Graceful Firestore error handling (user still created even if Firestore fails)
5. ✅ Improved error messages

## Testing

After fixes:

1. **Restart dev server**
2. **Try signing up** with email/password
3. **Check console** - should see cleaner error messages
4. **Verify account created** in Firebase Console → Authentication → Users

## Security Best Practices

### ✅ Do:
- Restrict API key to specific APIs
- Use Firestore Security Rules
- Validate inputs on client and server
- Use HTTPS in production

### ❌ Don't:
- Worry about API key being visible (it's normal)
- Put service account keys in client code
- Disable all security for "testing"
- Log sensitive user data

## Still Getting Errors?

1. **Check browser console** for specific error code
2. **Verify Email/Password is enabled** in Firebase Console
3. **Check API key** is correct (no typos, full length)
4. **Verify Firestore rules** are published
5. **Check network tab** for actual API response

