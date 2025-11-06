import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Create user document in Firestore
      const userDoc = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName || '',
        createdAt: serverTimestamp(),
        resumeCount: 0,
        lastLogin: serverTimestamp()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
      
      toast.success('Account created successfully!');
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(getErrorMessage(error.code));
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
      
      toast.success('Welcome back!');
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(getErrorMessage(error.code));
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
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed. Please enable Google sign-in in Firebase Console';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized. Please add it in Firebase Console';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled';
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

