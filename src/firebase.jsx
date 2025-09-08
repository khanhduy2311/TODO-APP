// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your project's credentials
const firebaseConfig = {
  apiKey: "AIzaSyDogSmk0XH31D7qbzAj07D2P52ClcG_dFk",
  authDomain: "naver-todo-app.firebaseapp.com",
  projectId: "naver-todo-app",
  storageBucket: "naver-todo-app.firebasestorage.app",
  messagingSenderId: "42431800481",
  appId: "1:42431800481:web:47e7486c447b1dc5377ce0",
  measurementId: "G-CZ2HHY1DN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in other components
export const auth = getAuth(app);
export const db = getFirestore(app);