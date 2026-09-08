import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLIR72liJi5L4H5pB-gSYGP-M-Zucbkyc",
  authDomain: "ayudoot-c2656.firebaseapp.com",
  projectId: "ayudoot-c2656",
  storageBucket: "ayudoot-c2656.firebasestorage.app",
  messagingSenderId: "673429927885",
  appId: "1:673429927885:web:e5e0d36cba45e9001af684",
  measurementId: "G-ECD6B06N1M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;