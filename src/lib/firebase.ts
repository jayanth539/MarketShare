// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2ZXe9wVbCOQBRpz9ssGaRY8qf84cjwUc",
  authDomain: "marketshare-w0g8e.firebaseapp.com",
  projectId: "marketshare-w0g8e",
  storageBucket: "marketshare-w0g8e.appspot.com",
  messagingSenderId: "820623457084",
  appId: "1:820623457084:web:3fc6b7a146f2a01985bc39",
};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
