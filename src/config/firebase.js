// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

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
