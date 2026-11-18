// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Add a Web App and paste its config below.
// 3) Enable Authentication: Anonymous + Email/Password.
// 4) Create a Cloud Firestore database and publish firestore.rules.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};
const configured = !firebaseConfig.apiKey.startsWith("PASTE_") && !firebaseConfig.projectId.startsWith("PASTE_");
let app, auth, db;
if (configured) {
  app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app);
}
export { configured, auth, db, signInAnonymously, signInWithEmailAndPassword, signOut, collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp };
