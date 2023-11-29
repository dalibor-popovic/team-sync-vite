import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const UserStateContext = createContext({});

export const AuthContext = React.createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

const userFromStorage = Object.keys(localStorage)
  .filter((key) => key.startsWith('firebase:authUse'))
  .map((key) => localStorage[key]);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    userFromStorage.length ? JSON.parse(userFromStorage[0]) : null
  );

  const navigate = useNavigate();

  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await auth.signOut();
    setUser(null);
    navigate('/auth/login');
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsub();
  }, []);

  const values = {
    user,
    signIn,
    auth,
    logout,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => {
  return useContext(UserStateContext);
};
