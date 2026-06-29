import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "verdexai.firebaseapp.com",
  projectId: "verdexai",
  storageBucket: "verdexai.firebasestorage.app",
  messagingSenderId: "716765144063",
  appId: "1:716765144063:web:1056fba58766771f9e7dca",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
