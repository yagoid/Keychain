// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDot06ggHuCDqnivxw_bEn5IDUgX0y-af0",
  authDomain: "keychain-3e92c.firebaseapp.com",
  projectId: "keychain-3e92c",
  storageBucket: "keychain-3e92c.appspot.com",
  messagingSenderId: "410583207966",
  appId: "1:410583207966:web:cf928fe0f877578bec1e0f",
  measurementId: "G-9GVCZMY1F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };