// ─────────────────────────────────────────────
//  userService.js
//  All user database operations in one place.
// ─────────────────────────────────────────────

import { db, app } from "../firebase-config.js";
import { auth } from "../firebase-config.js";
import {
  doc, setDoc, getDoc, updateDoc,
  collection, getDocs, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const storage = getStorage(app);

// ── Create user account + save profile to Firestore ──
export async function signupUser(name, email, password, phone, dlFile) {

  // 1. Create Firebase Auth account
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid  = cred.user.uid;

  // 2. Upload DL photo to Firebase Storage
  const dlRef  = ref(storage, `dl-photos/${uid}`);
  await uploadBytes(dlRef, dlFile);
  const dlURL  = await getDownloadURL(dlRef);

  // 3. Send email verification
  await sendEmailVerification(cred.user);

  // 4. Save user profile in Firestore
  await setDoc(doc(db, "users", uid), {
    name,
    email,
    phone,
    dlURL,
    status:    "pending",   // pending | approved | rejected
    createdAt: new Date().toISOString()
  });

  return cred.user;
}

// ── Get single user profile ──
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── Get all pending users (for admin) ──
export async function getPendingUsers() {
  const q    = query(collection(db, "users"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Get all users (for admin) ──
export async function getAllUsers() {
  const q    = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Approve user ──
export async function approveUser(uid) {
  return await updateDoc(doc(db, "users", uid), { status: "approved" });
}

// ── Reject user ──
export async function rejectUser(uid) {
  return await updateDoc(doc(db, "users", uid), { status: "rejected" });
}

// ── Check current auth state ──
export function getCurrentUser() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, resolve);
  });
}
