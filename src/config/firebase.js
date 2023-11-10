import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from '@firebase/storage';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from '@firebase/functions';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
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
