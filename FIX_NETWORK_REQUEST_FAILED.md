# Fix auth/network-request-failed Error (400 Status)

## Error Details

- **Error Code**: `auth/network-request-failed`
- **HTTP Status**: 400 (Bad Request)
- **Location**: Signup with Email/Password

A 400 status means the request reached Firebase but was rejected. This is different from a network connectivity issue.

## Most Common Causes

### 1. Email/Password Provider Not Enabled ⚠️ **MOST LIKELY**

Firebase Authentication requires the Email/Password provider to be explicitly enabled.

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **Authentication** → **Sign-in method**
4. Find **Email/Password** in the list
5. Click on it
6. Toggle **Enable** to **ON**
7. Click **Save**

### 2. Identity Toolkit API Not Enabled

Email/Password authentication requires the Identity Toolkit API.

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **APIs & Services** → **Library**
4. Search for **Identity Toolkit API**
5. Click on it
6. Click **ENABLE**
7. Wait for it to enable (may take 1-2 minutes)

### 3. API Key Restrictions Too Strict

If your API key has restrictions that block the Identity Toolkit API.

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **APIs & Services** → **Credentials**
4. Click your API key (starts with `AIzaSy...`)
5. Under **API restrictions**:
   - Make sure **Identity Toolkit API** is included
   - OR temporarily set to **Don't restrict key** (for testing)
6. Click **Save**

### 4. Domain Not Authorized

Your domain might not be in the authorized domains list.

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `resume-builder-f0a68`
3. Go to **Authentication** → **Settings**
4. Scroll to **Authorized domains**
5. Make sure `localhost` is listed (for local development)
6. Add your production domain if deploying

### 5. Invalid API Key or Configuration

The API key might be incorrect or the Firebase config might be wrong.

**Fix:**
1. Go to Firebase Console → **Project Settings**
2. Scroll to **Your apps** → **Web app**
3. Copy the **exact** config values
4. Update `frontend/.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyBycWeyvYHBWTDQ1010127WuGwBkoLfza
   REACT_APP_FIREBASE_AUTH_DOMAIN=resume-builder-f0a68.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=resume-builder-f0a68
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=664193409741
   REACT_APP_FIREBASE_APP_ID=1:664193409741:web:208f3dbef3b291df57bf84
   ```
5. **Restart dev server** after updating `.env`

## Step-by-Step Troubleshooting

### Step 1: Verify Email/Password is Enabled

1. Firebase Console → Authentication → Sign-in method
2. Check if **Email/Password** shows **Enabled** ✅
3. If not, enable it

### Step 2: Verify Identity Toolkit API is Enabled

1. Google Cloud Console → APIs & Services → Library
2. Search "Identity Toolkit API"
3. Check if it shows **Enabled** ✅
4. If not, enable it

### Step 3: Check API Key Restrictions

1. Google Cloud Console → APIs & Services → Credentials
2. Click your API key
3. Under **API restrictions**, verify:
   - **Identity Toolkit API** is included
   - OR set to **Don't restrict key** (for testing)

### Step 4: Verify Firebase Config

1. Check browser console for Firebase initialization logs
2. Should see:
   - `Firebase initialized successfully`
   - `Auth domain: resume-builder-f0a68.firebaseapp.com`
   - `Project ID: resume-builder-f0a68`
   - `API Key (preview): AIzaSy...XXXXX`
   - `API Key length: 39`

### Step 5: Check Network Tab

1. Open browser DevTools → **Network** tab
2. Try to sign up
3. Look for request to `identitytoolkit.googleapis.com`
4. Check the response:
   - **200**: Success (should work)
   - **400**: Bad request (check provider/API enabled)
   - **403**: Forbidden (check API key restrictions)
   - **404**: Not found (check API enabled)

## Quick Checklist

- [ ] Email/Password provider enabled in Firebase Console
- [ ] Identity Toolkit API enabled in Google Cloud Console
- [ ] API key allows Identity Toolkit API (or unrestricted)
- [ ] `localhost` in authorized domains
- [ ] Firebase config values correct in `.env`
- [ ] Dev server restarted after `.env` changes
- [ ] Browser console shows Firebase initialized successfully

## Testing After Fixes

1. **Restart dev server** (important!)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Open browser console** (F12)
4. **Try to sign up** with a valid email
5. **Check console logs** for:
   - `Firebase initialized successfully`
   - `Attempting to create user with email: ...`
   - Any error messages

## Still Not Working?

### Check Browser Console

Look for these specific errors:

1. **"Firebase is not configured"**
   - Fix: Check `.env` file, restart dev server

2. **"API key not valid"**
   - Fix: Get correct API key from Firebase Console

3. **"Identity Toolkit API not enabled"**
   - Fix: Enable Identity Toolkit API in Google Cloud Console

4. **"Email/Password provider not enabled"**
   - Fix: Enable Email/Password in Firebase Console

### Network Tab Analysis

In DevTools → Network tab, look for:
- Request URL: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=...`
- Status Code: Should be 200 (success) or 400 (bad request)
- Response: Check error message in response body

### Common Response Errors

**400 Bad Request with:**
- `"EMAIL_EXISTS"` → Email already registered
- `"OPERATION_NOT_ALLOWED"` → Email/Password not enabled
- `"INVALID_API_KEY"` → API key is wrong
- `"API_KEY_NOT_VALID"` → API key restrictions blocking

## Prevention

After fixing, ensure:
1. ✅ Email/Password provider stays enabled
2. ✅ Identity Toolkit API stays enabled
3. ✅ API key restrictions include Identity Toolkit API
4. ✅ Authorized domains include your domains

## Need More Help?

Check these resources:
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Identity Toolkit API Docs](https://cloud.google.com/identity-platform/docs)
- Firebase Console → Authentication → Settings → Help

