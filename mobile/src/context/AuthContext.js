import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from '../services/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        const result = await getUserProfile(firebaseUser.uid);
        if (result.success) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...result.data,
          });
        } else {
          // Profile doesn't exist yet (shouldn't happen normally)
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            profileComplete: false,
          });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const signUp = async (email, password, name) => {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name in Firebase Auth
      await firebaseUpdateProfile(firebaseUser, {
        displayName: name,
      });

      // Create user profile in Firestore
      const profileData = {
        email: email.toLowerCase(),
        name,
        profileComplete: false,
      };

      const result = await createUserProfile(firebaseUser.uid, profileData);

      if (result.success) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...profileData,
        });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMessage = 'Failed to create account';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user profile from Firestore
      const result = await getUserProfile(firebaseUser.uid);
      
      if (result.success) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...result.data,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      let errorMessage = 'Failed to sign in';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Account not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const result = await updateUserProfile(user.id, profileData);
      
      if (result.success) {
        setUser({
          ...user,
          ...profileData,
        });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Failed to send reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Account not found';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
