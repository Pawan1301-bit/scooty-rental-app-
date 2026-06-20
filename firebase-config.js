import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMujOwen0ZICNqotgfZa59v7b9bVF5LRg",
  authDomain: "sanatan-wheels.firebaseapp.com",
  projectId: "sanatan-wheels",
  storageBucket: "sanatan-wheels.firebasestorage.app",
  messagingSenderId: "642688548709",
  appId: "1:642688548709:web:8aa796434a677c738d2b8c",
  measurementId: "G-8P07RV727N"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
export { app };