import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Check if email exists and get provider info
  const checkEmailExists = async (email) => {
    try {
      if (!auth) {
        console.warn('Auth not initialized, cannot check email existence');
        return null;
      }
      
      if (!email || !email.trim()) {
        return null;
      }
      
      // Normalize email (lowercase, trim) - Firebase Auth is case-insensitive
      const normalizedEmail = email.toLowerCase().trim();
      
      console.log(`Checking email existence for: ${normalizedEmail}`);
      
      // Check Firebase Auth sign-in methods - this is the primary check
      // This will return methods like ['google.com'] or ['password'] if email exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
      
      console.log(`Email ${normalizedEmail} sign-in methods:`, signInMethods);
      
      if (signInMethods && Array.isArray(signInMethods) && signInMethods.length > 0) {
        // Determine provider based on sign-in methods
        const isGoogle = signInMethods.includes('google.com');
        const isEmailPassword = signInMethods.includes('password');
        
        // Provider priority: Google > Email/Password
        const provider = isGoogle ? 'google' : (isEmailPassword ? 'email' : 'unknown');
        
        console.log(`Email ${normalizedEmail} exists with provider: ${provider}, methods: ${signInMethods.join(', ')}`);
        
        // Try to get additional info from Firestore (optional, don't fail if this fails)
        let displayName = null;
        if (db) {
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', normalizedEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              displayName = userData.displayName || null;
              console.log(`Found user in Firestore: ${displayName || 'No display name'}`);
            }
          } catch (firestoreError) {
            console.warn('Firestore query failed, but email exists in Auth:', firestoreError);
            // Continue even if Firestore query fails - Auth check is primary
          }
        }
        
        return {
          exists: true,
          provider: provider,
          displayName: displayName,
          signInMethods: signInMethods
        };
      }
      
      // No sign-in methods found, email doesn't exist
      console.log(`Email ${normalizedEmail} does not exist (no sign-in methods found)`);
      return null;
    } catch (error) {
      console.error('Error checking email existence:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/invalid-email') {
        console.log('Invalid email format');
        return null;
      }
      
      // If it's a network error or API error, log it but don't block signup
      // The actual signup will fail with auth/email-already-in-use if email exists
      if (error.code === 'auth/network-request-failed' || error.code === 'auth/internal-error') {
        console.warn('Network/API error checking email, will rely on signup validation');
        return null;
      }
      
      // For unknown errors, log but don't assume email is available
      console.warn('Could not verify email existence, signup will validate');
      return null;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      // Check if auth is initialized
      if (!auth) {
        const error = new Error('Firebase Authentication is not configured. Please check your Firebase setup.');
        error.code = 'auth/configuration-error';
        throw error;
      }

      // Validate inputs
      if (!email || !password) {
        const error = new Error('Email and password are required');
        error.code = 'auth/invalid-argument';
        throw error;
      }

      if (password.length < 6) {
        const error = new Error('Password must be at least 6 characters');
        error.code = 'auth/weak-password';
        throw error;
      }

      // Normalize email before checking
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if email already exists before attempting signup
      const emailCheck = await checkEmailExists(normalizedEmail);
      if (emailCheck && emailCheck.exists) {
        console.log(`Email ${normalizedEmail} already exists with provider: ${emailCheck.provider}`);
        const error = new Error(
          emailCheck.provider === 'google'
            ? 'This email is already registered with Google. Please sign in with Google instead.'
            : 'This email is already registered. Please sign in instead.'
        );
        error.code = 'auth/email-already-in-use';
        error.provider = emailCheck.provider;
        throw error;
      }
      
      console.log(`Email ${normalizedEmail} is available, proceeding with signup`);

      // Log signup attempt for debugging
      console.log('Attempting to create user with email:', email);
      console.log('Auth instance:', auth ? 'Initialized' : 'Not initialized');
      console.log('Auth domain:', auth?.config?.authDomain);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (profileError) {
          console.warn('Failed to update profile name:', profileError);
          // Continue even if profile update fails
        }
      }

      // Create user document in Firestore
      if (db) {
        try {
          const userDoc = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: displayName || userCredential.user.displayName || '',
            createdAt: serverTimestamp(),
            resumeCount: 0,
            lastLogin: serverTimestamp()
          };

          await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        } catch (firestoreError) {
          console.error('Failed to create user document in Firestore:', firestoreError);
          // Continue even if Firestore write fails - user is still created in Auth
          toast.warning('Account created but profile setup incomplete. Please try logging in.');
        }
      }
      
      toast.success('Account created successfully!');
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      // Enhanced debugging for network errors
      if (error.code === 'auth/network-request-failed') {
        console.error('Network request failed - Possible causes:');
        console.error('1. Email/Password provider not enabled in Firebase Console');
        console.error('2. Identity Toolkit API not enabled in Google Cloud Console');
        console.error('3. API key restrictions blocking the request');
        console.error('4. Network connectivity issues');
        console.error('5. CORS or domain authorization issues');
        console.error('Auth config:', auth?.config);
        
        const errorMessage = 'Network error. Please check:\n' +
          '1. Email/Password is enabled in Firebase Console\n' +
          '2. Identity Toolkit API is enabled in Google Cloud Console\n' +
          '3. Your internet connection is working';
        toast.error(errorMessage);
        throw error;
      }
      
      // Handle email already in use with provider-specific message
      if (error.code === 'auth/email-already-in-use') {
        // Try to get provider info if not already set
        if (!error.provider) {
          try {
            const emailCheck = await checkEmailExists(email);
            if (emailCheck && emailCheck.exists) {
              error.provider = emailCheck.provider;
            }
          } catch (checkError) {
            // Fallback to generic message
          }
        }
        
        const errorMessage = error.provider === 'google'
          ? 'This email is already registered with Google. Please sign in with Google instead.'
          : 'This email is already registered. Please sign in with your password instead.';
        toast.error(errorMessage);
        throw error;
      }
      
      // Don't log full error details in production
      const errorMessage = getErrorMessage(error.code) || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      // Check if auth is initialized
      if (!auth) {
        const error = new Error('Firebase Authentication is not configured. Please check your Firebase setup.');
        error.code = 'auth/configuration-error';
        throw error;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      if (db) {
        try {
          await setDoc(
            doc(db, 'users', userCredential.user.uid),
            { lastLogin: serverTimestamp() },
            { merge: true }
          );
        } catch (firestoreError) {
          console.warn('Failed to update last login:', firestoreError);
          // Continue even if Firestore update fails
        }
      }
      
      toast.success('Welcome back!');
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      
      // If user not found or wrong password, check if email exists with Google
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        try {
          const emailCheck = await checkEmailExists(email);
          if (emailCheck && emailCheck.exists && emailCheck.provider === 'google') {
            const errorMessage = 'This email is registered with Google. Please sign in with Google instead.';
            toast.error(errorMessage);
            error.provider = 'google';
            throw error;
          }
        } catch (checkError) {
          // Continue with original error
        }
      }
      
      const errorMessage = getErrorMessage(error.code) || 'Failed to sign in. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Check if auth is initialized
      if (!auth) {
        throw new Error('Firebase Authentication is not configured. Please check your Firebase setup.');
      }

      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // New user - create document
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL || '',
          createdAt: serverTimestamp(),
          resumeCount: 0,
          lastLogin: serverTimestamp()
        });
      } else {
        // Existing user - update last login
        await setDoc(
          userDocRef,
          { lastLogin: serverTimestamp() },
          { merge: true }
        );
      }
      
      toast.success('Signed in with Google!');
      return userCredential;
    } catch (error) {
      console.error('Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
        return;
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection and Firebase configuration.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google sign-in is not enabled. Please enable it in Firebase Console.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized. Please add it in Firebase Console.');
      } else {
        toast.error(getErrorMessage(error.code) || 'Failed to sign in with Google. Please try again.');
      }
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error signing out');
      throw error;
    }
  };

  // Get user-friendly error messages
  const getErrorMessage = (errorCode, provider = null) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        if (provider === 'google') {
          return 'This email is already registered with Google. Please sign in with Google instead.';
        } else if (provider === 'email') {
          return 'This email is already registered. Please sign in with your password instead.';
        }
        return 'This email is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-up is not enabled. Please enable it in Firebase Console';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or use "Forgot Password" if needed.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and Firebase configuration';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized. Please add it in Firebase Console';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled';
      case 'auth/configuration-error':
        return 'Firebase is not configured. Please check your setup';
      case 'auth/invalid-argument':
        return 'Please provide valid email and password';
      case 'auth/invalid-api-key':
        return 'Invalid API key. Please check your Firebase configuration';
      case 'auth/api-key-not-valid':
        return 'API key is not valid. Please update your Firebase configuration';
      default:
        return 'An error occurred. Please try again';
    }
  };

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Increment resume count
  const incrementResumeCount = async () => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const currentCount = userDocSnap.data().resumeCount || 0;
        await setDoc(
          userDocRef,
          { resumeCount: currentCount + 1 },
          { merge: true }
        );
        setUserData(prev => ({ ...prev, resumeCount: currentCount + 1 }));
      }
    } catch (error) {
      console.error('Error incrementing resume count:', error);
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    signInWithGoogle,
    logout,
    incrementResumeCount,
    checkEmailExists,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

