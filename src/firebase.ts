import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = JSON.parse(
  import.meta.env.VITE_firebaseConfig 
);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
