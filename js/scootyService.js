// ─────────────────────────────────────────────
//  scootyService.js
//  All database operations in ONE place.
//  If you ever switch from Firebase, only edit this file.
// ─────────────────────────────────────────────

import { db } from "../firebase-config.js";
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, onSnapshot, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COL = "scooties";

// Get all scooties once (used in admin)
export async function getAllScooties() {
  const q = query(collection(db, COL), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Live listener (used in public scooties page — updates instantly)
export function listenScooties(callback) {
  const q = query(collection(db, COL), orderBy("name"));
  return onSnapshot(q, snap => {
    const scooties = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(scooties);
  });
}

// Add a new scooty
export async function addScooty(data) {
  return await addDoc(collection(db, COL), data);
}

// Update a scooty (edit price, availability etc)
export async function updateScooty(id, data) {
  return await updateDoc(doc(db, COL, id), data);
}

// Delete a scooty
export async function deleteScooty(id) {
  return await deleteDoc(doc(db, COL, id));
}

// Toggle availability only (quick action)
export async function toggleAvailability(id, current) {
  return await updateDoc(doc(db, COL, id), { available: !current });
}
