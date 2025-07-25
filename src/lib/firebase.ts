// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
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

// Dynamically set authDomain on client-side
if (typeof window !== 'undefined') {
    const dynamicAuthDomain = `${firebaseConfig.projectId}.firebaseapp.com`;
    if (window.location.hostname.includes('localhost') || !window.location.hostname.includes('firebaseapp.com')) {
        firebaseConfig.authDomain = dynamicAuthDomain;
    } else {
        firebaseConfig.authDomain = window.location.hostname;
    }
}


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };