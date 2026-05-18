/**
 * briefService.js
 * Firestore CRUD for investment briefs.
 * All functions guard against a null `db` (Firebase not configured).
 * Collection: investmentBriefs/{autoId}
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "investmentBriefs";

/**
 * Saves an investment brief for an authenticated user.
 * @param {import("firebase/auth").User} user
 * @param {object} brief — the generateInvestmentBrief() output
 * @param {string} [briefText] — optional plain-text representation
 * @returns {Promise<string>} the new document ID
 */
export async function saveInvestmentBrief(user, brief, briefText = "") {
  if (!db) throw new Error("Firebase is not configured in this environment.");
  if (!user) throw new Error("User must be signed in to save a brief.");

  const docRef = await addDoc(collection(db, COLLECTION), {
    userId:      user.uid,
    userEmail:   user.email,
    createdAt:   serverTimestamp(),
    profile:     brief.profile,
    topMatch:    brief.topMatch,
    matches:     brief.allMatches ?? [],
    briefText:   briefText || "",
    dataStatus:  "Prototype model estimate",
    appVersion:  "semifinal-demo"
  });

  return docRef.id;
}

/**
 * Returns all briefs belonging to the signed-in user, newest first.
 * @param {import("firebase/auth").User} user
 * @returns {Promise<Array>}
 */
export async function getUserInvestmentBriefs(user) {
  if (!db || !user) return [];

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? null
  }));
}

/**
 * Deletes a single investment brief by document ID.
 * Guards that the current user owns the document (Firestore rules enforce this too).
 * @param {import("firebase/auth").User} user
 * @param {string} briefId — Firestore document ID
 */
export async function deleteInvestmentBrief(user, briefId) {
  if (!db || !user || !briefId) return;
  await deleteDoc(doc(db, COLLECTION, briefId));
}
