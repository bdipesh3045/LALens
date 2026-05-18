/**
 * useFirebaseAuth
 * Tracks Firebase auth state. All functions are safe no-ops when Firebase
 * is not configured — the rest of the app is unaffected.
 */

import { useCallback, useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

export function useFirebaseAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(isFirebaseConfigured); // start true only if firebase exists

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) return null;
    try {
      const provider = new GoogleAuthProvider();
      const result   = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        console.warn("[LALens] Google sign-in error:", err?.message || err);
      }
      return null;
    }
  }, []);

  const signOutUser = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("[LALens] Sign-out error:", err?.message || err);
    }
  }, []);

  return { currentUser, loading, signInWithGoogle, signOutUser };
}
