// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mern-ari-blog.firebaseapp.com",
  projectId: "mern-ari-blog",
  storageBucket: "mern-ari-blog.appspot.com",
  messagingSenderId: "296556655958",
  appId: "1:296556655958:web:dff03c328ea6e2f13fd2f7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
