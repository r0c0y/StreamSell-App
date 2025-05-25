// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- IMPORT FIRESTORE
// Later, you might import other services like getFirestore, getStorage

// Your web app's Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL CONFIGURATION FROM THE FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyA2_ABmDao4_mlwGHwmoJiufI1 rBW4MTRw" ,
    authDomain:"streamsellapp.firebaseapp.com",
    projectId:"streamsellapp",
    storageBucket: "streamsellapp.firebasestorage.app",
    messagingSenderId: "715796446717" ,
    appId:"1:715796446717 :web :94a6bebcd3b163a9282d94",
    measurementId: "G- 5GBNGDTXRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // <-- This initializes Firestore and exports the 'db' instance

// You can export 'app' if you need it elsewhere, or specific services like 'auth'
export default app;