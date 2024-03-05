import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCt95g_u6Xdy9-gzkZS_YiUwRL3Qpzpzrk",
    authDomain: "fact-spectrum.firebaseapp.com",
    projectId: "fact-spectrum",
    storageBucket: "fact-spectrum.appspot.com",
    messagingSenderId: "448432925284",
    appId: "1:448432925284:web:425a96d3181ab170facd71",
    measurementId: "G-Z095W27C6P"
  };

const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);