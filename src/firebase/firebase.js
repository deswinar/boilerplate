// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import {
	GoogleAuthProvider,
	getAuth
} from "firebase/auth";
import {
	getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: "",
	authDomain: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
	auth, 
	db, 
  googleProvider, 
 };