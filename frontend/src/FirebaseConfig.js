// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbaxelCSNm1w2QRZKqxefhjMEIgjywSeg",
  authDomain: "fileshare-60268.firebaseapp.com",
  projectId: "fileshare-60268",
  storageBucket: "fileshare-60268.appspot.com",
  messagingSenderId: "632668174093",
  appId: "1:632668174093:web:fe6048b5fa995539b0a244",
  measurementId: "G-6VHLW5VD5F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
