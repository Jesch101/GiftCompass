import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from '@firebase/storage';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from '@firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyDrl_yOepIH6lCGyK9BlrcrCKO_g4tCLXU',
  authDomain: 'giftregistry-ee951.firebaseapp.com',
  projectId: 'giftregistry-ee951',
  storageBucket: 'giftregistry-ee951.appspot.com',
  messagingSenderId: '511279037110',
  appId: '1:511279037110:web:e7032975b3b74a0e708417',
  measurementId: 'G-HFCFHEHZHZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Functions
export const functions = getFunctions(app);
// connectFunctionsEmulator(functions, '127.0.0.1', 5001);
export const helloWorld = httpsCallable(functions, 'helloWorld2');
export const generateInviteLink = httpsCallable(functions, 'generateInviteLink');
export const validateInvite = httpsCallable(functions, 'validateInvite');
