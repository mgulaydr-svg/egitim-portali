import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDs2tv4gCZ0gjDBDcP1-L4iz-lheWJpJdc",
    authDomain: "egitim-portali-432a0.firebaseapp.com",
    projectId: "egitim-portali-432a0",
    storageBucket: "egitim-portali-432a0.firebasestorage.app",
    messagingSenderId: "805497480819",
    appId: "1:805497480819:web:834b581f831b33519c6c06",
    measurementId: "G-BJPW46YC95"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);