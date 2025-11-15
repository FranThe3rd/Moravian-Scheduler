// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAi2ZUF-5wwnJYSHipZOGSEYVF5YB3TSr4",
  authDomain: "moravian-scheduler.firebaseapp.com",
  projectId: "moravian-scheduler",
  storageBucket: "moravian-scheduler.firebasestorage.app",
  messagingSenderId: "482518196028",
  appId: "1:482518196028:web:896d96ea0ac3c5ae1e8839",
  measurementId: "G-B5KMY817RC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

provider.addScope("email");
provider.addScope("profile");

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
