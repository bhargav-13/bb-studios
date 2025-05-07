// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAywcXrGz880VgOZtxbuYVdYsqIV0ZO95Q",
  authDomain: "bb-studios-6e51c.firebaseapp.com",
  projectId: "bb-studios-6e51c",
  storageBucket: "bb-studios-6e51c.firebasestorage.app",
  messagingSenderId: "439476970672",
  appId: "1:439476970672:web:1e7385baea2edc7586c775",
  measurementId: "G-03FF7CTXRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };