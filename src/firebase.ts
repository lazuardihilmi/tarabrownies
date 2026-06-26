import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0666010344",
  appId: "1:786940653551:web:fa6ab870a9873fa523101a",
  apiKey: "AIzaSyAanSveelpFZlVF_c3YoJ8khyCasTWxGN0",
  authDomain: "gen-lang-client-0666010344.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-b83d7b58-7ef4-424a-8a09-50ac86a38d2c",
  storageBucket: "gen-lang-client-0666010344.firebasestorage.app",
  messagingSenderId: "786940653551",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
