import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOut() {
    return auth.signOut(auth);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function googleSignIn() {
    return signInWithPopup(auth, googleProvider);
  }

  function getUser() {
    return auth.currentUser;
  }

  function updateUsername(name) {
    return currentUser.updateProfile({
      displayName: name,
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    getUser,
    login,
    signOut,
    signUp,
    googleSignIn,
    updateUsername,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
