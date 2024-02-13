import { createContext, useContext, useEffect, useState } from 'react';
import {
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, Timestamp, query, where, getDocs, collection, addDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/firebase';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState();

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
          registeredAt: Timestamp.fromDate(new Date()),
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const createUser = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        registeredAt: Timestamp.fromDate(new Date()),
      });
      return user;
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const signIn = async (email, password) =>  {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;  
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn, signInWithGoogle, sendPasswordReset }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};