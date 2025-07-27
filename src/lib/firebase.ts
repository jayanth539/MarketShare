
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2ZXe9wVbCOQBRpz9ssGaRY8qf84cjwUc",
  authDomain: "marketshare-w0g8e.firebaseapp.com",
  projectId: "marketshare-w0g8e",
  storageBucket: "marketshare-w0g8e.appspot.com",
  messagingSenderId: "820623457084",
  appId: "1:820623457084:web:3fc6b7a146f2a01985bc39",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };

    