// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChyCa4Qf2GtV9sba7ROeDlQmA0zrUsfa0",
  authDomain: "uplyft-chatbot.firebaseapp.com",
  projectId: "uplyft-chatbot",
  storageBucket: "uplyft-chatbot.firebasestorage.app",
  messagingSenderId: "348363615299",
  appId: "1:348363615299:web:efb403c38ee7bf9b41f8f6",
  measurementId: "G-M1KRDF1GZL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
