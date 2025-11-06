# Firestore Security Rules for Resume Builder

## Current Issue: "Missing or insufficient permissions"

This error occurs because Firestore security rules are blocking read/write operations. You need to configure rules in Firebase Console.

## Step 1: Open Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `resume-builder-f0a68`
3. Go to **Firestore Database** → **Rules** tab

## Step 2: Update Security Rules

Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Resumes collection - users can only read/write their own resumes
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 3: Publish Rules

1. Click **Publish** button
2. Wait for confirmation that rules are published

## What These Rules Do

### Users Collection (`/users/{userId}`)
- ✅ Users can read/write their own user document
- ❌ Users cannot access other users' documents
- ❌ Unauthenticated users cannot access any user documents

### Resumes Collection (`/resumes/{resumeId}`)
- ✅ Users can read resumes they created (where `userId` matches)
- ✅ Users can create resumes with their own `userId`
- ✅ Users can update/delete their own resumes
- ❌ Users cannot access other users' resumes
- ❌ Unauthenticated users cannot access resumes

## Testing the Rules

After publishing:

1. **Test authenticated access**:
   - Sign in to your app
   - Try to create/read user data
   - Should work ✅

2. **Test unauthorized access**:
   - Try accessing data without signing in
   - Should be blocked ❌

## Common Rule Patterns Explained

```javascript
// Allow if user is authenticated
allow read, write: if request.auth != null;

// Allow if user owns the document
allow read, write: if request.auth.uid == userId;

// Allow reading own data, writing own data
allow read: if request.auth.uid == resource.data.userId;
allow write: if request.auth.uid == request.resource.data.userId;

// Allow creating with own userId
allow create: if request.auth.uid == request.resource.data.userId;
```

## Troubleshooting

### Still getting permission errors?

1. **Check rule syntax**: Make sure there are no typos
2. **Verify user is authenticated**: Check `request.auth != null`
3. **Check userId matches**: Verify `request.auth.uid == userId`
4. **Wait a few seconds**: Rules can take 10-30 seconds to propagate

### Testing Rules in Firebase Console

1. Go to Firestore → Rules tab
2. Click **Rules Playground**
3. Test scenarios:
   - Authenticated user reading own document
   - Authenticated user reading other user's document (should fail)
   - Unauthenticated user (should fail)

## For Development (Less Secure - Use Temporarily)

If you want to test quickly, you can use these rules (⚠️ NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows any authenticated user to read/write anything. **Only use for testing!**

## Production Rules (Recommended)

Use the rules from Step 2 above - they provide proper security while allowing your app to function.

