/**
 * firebase.js
 * Optional Firebase integration for LALens.
 * The app works fully without these env vars — all exports are null-safe.
 * Set VITE_FIREBASE_* variables in .env to enable Google sign-in and cloud save.
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey        = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain    = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId     = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId         = import.meta.env.VITE_FIREBASE_APP_ID;

/**
 * Returns true when all required Firebase config values are present.
 * Use this guard before any Firebase call.
 */
export const isFirebaseConfigured = Boolean(apiKey && authDomain && projectId && appId);

let _app  = null;
let _auth = null;
let _db   = null;

if (isFirebaseConfigured) {
  try {
    _app  = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId });
    _auth = getAuth(_app);
    _db   = getFirestore(_app);
    // Analytics is intentionally skipped — it requires additional browser setup
    // and can fail silently in dev. Enable it explicitly in production if needed.
  } catch (err) {
    console.warn("[LALens] Firebase initialization failed:", err?.message || err);
    _app = null;
    _auth = null;
    _db = null;
  }
}

export const firebaseApp = _app;
export const auth        = _auth;
export const db          = _db;
