// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Add a Web App and paste its config below.
// 3) Enable Authentication: Anonymous + Email/Password.
// 4) Create a Cloud Firestore database and publish firestore.rules.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqsMbCccK6hkloIQKvCfEGSAzBo6rXMxw",
  authDomain: "uchiha-restaurant.firebaseapp.com",
  projectId: "uchiha-restaurant",
  storageBucket: "uchiha-restaurant.firebasestorage.app",
  messagingSenderId: "967377785735",
  appId: "1:967377785735:web:df958ae0512594570af922",
};
const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
let app, auth, db;
if (configured) {
  app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app);
}
export { configured, auth, db, signInAnonymously, signInWithEmailAndPassword, signOut, collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp };
