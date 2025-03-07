import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhKo1bCsWyFharqY4cm7doZLo_VHaO5xM",
  authDomain: "freelancersaas.firebaseapp.com",
  projectId: "freelancersaas",
  storageBucket: "freelancersaas.firebasestorage.app",
  messagingSenderId: "832941103862",
  appId: "1:832941103862:web:c95f730da34549736a2ad7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 