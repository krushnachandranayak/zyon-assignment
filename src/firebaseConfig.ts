// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// This is the object you copied from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCf5tqIUfpBXkAvRfAYA3QWLmQd1-F8B8c",
  authDomain: "zyon-admin-auth.firebaseapp.com",
  projectId: "zyon-admin-auth",
  storageBucket: "zyon-admin-auth.firebasestorage.app",
  messagingSenderId: "614384791895",
  appId: "1:614384791895:web:1d93f6ac47813326658e12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();