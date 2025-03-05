// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Importing auth and GoogleAuthProvider

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABY5Tb4moSd8DiIsgdye5ZWAAZfaY4tkw",
  authDomain: "edu-ai-50f9e.firebaseapp.com",
  projectId: "edu-ai-50f9e",
  storageBucket: "edu-ai-50f9e.firebasestorage.app",
  messagingSenderId: "287294567787",
  appId: "1:287294567787:web:4f5b4d6569a3fd2d62c82e",
  measurementId: "G-2W9MVJWBEB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
