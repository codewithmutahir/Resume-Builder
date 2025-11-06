# Email Duplicate Prevention & Better Error Handling

## Problem Fixed

Previously, users could:
1. Sign up with Google using email `user@example.com`
2. Then sign up again with Email/Password using the same `user@example.com`
3. This created **duplicate accounts** with the same email

## Solution Implemented

### 1. Email Existence Check Before Signup

**New Function: `checkEmailExists()`**
- Uses Firebase's `fetchSignInMethodsForEmail()` to check if email exists
- Determines which provider (Google or Email/Password) the email is registered with
- Checks Firestore for additional user data

**How it works:**
```javascript
// Before signup, check if email exists
const emailCheck = await checkEmailExists(email);
if (emailCheck && emailCheck.exists) {
  // Show provider-specific error message
  if (emailCheck.provider === 'google') {
    // "This email is already registered with Google. Please sign in with Google instead."
  } else {
    // "This email is already registered. Please sign in instead."
  }
}
```

### 2. Improved Error Messages

**Signup Errors:**
- ✅ **Email exists with Google**: "This email is already registered with Google. Please sign in with Google instead."
- ✅ **Email exists with Email/Password**: "This email is already registered. Please sign in with your password instead."
- ✅ **Generic**: "This email is already registered. Please sign in instead."

**Login Errors:**
- ✅ **User not found but email exists with Google**: "This email is registered with Google. Please sign in with Google instead."
- ✅ **Wrong password but email exists with Google**: "This email is registered with Google. Please sign in with Google instead."
- ✅ **User not found**: "No account found with this email. Please sign up first."
- ✅ **Wrong password**: "Incorrect password. Please try again or use 'Forgot Password' if needed."

### 3. Enhanced User Experience

**Signup Page:**
- Automatically redirects to login page after 2 seconds if email exists with Google
- Shows clear error messages guiding users to the correct sign-in method

**Login Page:**
- Detects when email is registered with Google and suggests using Google sign-in
- Provides helpful error messages for all scenarios

## Code Changes

### `AuthContext.js`

1. **Added `fetchSignInMethodsForEmail` import**
   ```javascript
   import { fetchSignInMethodsForEmail } from 'firebase/auth';
   ```

2. **Added Firestore query imports**
   ```javascript
   import { collection, query, where, getDocs } from 'firebase/firestore';
   ```

3. **New `checkEmailExists()` function**
   - Checks Firebase Auth sign-in methods
   - Queries Firestore for user data
   - Returns provider info (google/email)

4. **Updated `signup()` function**
   - Checks email existence BEFORE attempting signup
   - Shows provider-specific error messages
   - Prevents duplicate account creation

5. **Updated `login()` function**
   - Checks if email exists with Google when login fails
   - Suggests using Google sign-in when appropriate

6. **Enhanced `getErrorMessage()` function**
   - Accepts `provider` parameter
   - Returns provider-specific messages

### `Signup.jsx`

- Added redirect to login page when email exists with Google
- Better error handling

## How It Works

### Scenario 1: User tries to sign up with email already registered with Google

1. User enters email `user@example.com` (already registered with Google)
2. `checkEmailExists()` detects email exists with Google provider
3. Shows error: "This email is already registered with Google. Please sign in with Google instead."
4. Redirects to login page after 2 seconds
5. **No duplicate account created** ✅

### Scenario 2: User tries to sign up with email already registered with Email/Password

1. User enters email `user@example.com` (already registered with Email/Password)
2. `checkEmailExists()` detects email exists with Email/Password provider
3. Shows error: "This email is already registered. Please sign in with your password instead."
4. User can click "Sign in" link
5. **No duplicate account created** ✅

### Scenario 3: User tries to login with Email/Password but account is Google-only

1. User enters email `user@example.com` (registered with Google)
2. Login fails with `auth/user-not-found` or `auth/wrong-password`
3. System checks if email exists with Google
4. Shows error: "This email is registered with Google. Please sign in with Google instead."
5. User can use Google sign-in button
6. **Better user guidance** ✅

## Testing

### Test Case 1: Prevent Google Email Duplicate
1. Sign up with Google using `test@example.com`
2. Try to sign up with Email/Password using `test@example.com`
3. **Expected**: Error message suggesting Google sign-in
4. **Result**: ✅ No duplicate account created

### Test Case 2: Prevent Email/Password Duplicate
1. Sign up with Email/Password using `test@example.com`
2. Try to sign up again with Email/Password using `test@example.com`
3. **Expected**: Error message suggesting login
4. **Result**: ✅ No duplicate account created

### Test Case 3: Login with Wrong Provider
1. Sign up with Google using `test@example.com`
2. Try to login with Email/Password using `test@example.com`
3. **Expected**: Error message suggesting Google sign-in
4. **Result**: ✅ Clear guidance provided

## Security Notes

- `fetchSignInMethodsForEmail()` is a public API - it only reveals which sign-in methods are available, not sensitive data
- Firestore queries are protected by security rules
- Email existence check happens before account creation, preventing duplicates
- All error messages are user-friendly and don't expose sensitive information

## Benefits

1. ✅ **No duplicate accounts** - Same email can't be registered twice
2. ✅ **Better UX** - Clear error messages guide users
3. ✅ **Provider detection** - System knows which provider to suggest
4. ✅ **Prevents confusion** - Users know exactly what to do
5. ✅ **Data integrity** - One email = one account

## Future Enhancements (Optional)

1. **Account Linking**: Allow users to link Google and Email/Password accounts
2. **Email Verification**: Send verification emails for Email/Password accounts
3. **Password Reset**: Add "Forgot Password" functionality
4. **Social Login Detection**: Show which social providers are available for an email

