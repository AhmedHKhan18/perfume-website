// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5XNvL3oHChl_D1Ww_SFR8cPDEiQWkIPY",
  authDomain: "perfume-website-b048a.firebaseapp.com",
  projectId: "perfume-website-b048a",
  storageBucket: "perfume-website-b048a.firebasestorage.app",
  messagingSenderId: "719930154459",
  appId: "1:719930154459:web:68f3bea31ccea807751bfe",
  measurementId: "G-HRL683ZPW7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
     analytics = getAnalytics(app);
    }
  });
}
export const auth = getAuth();



export { analytics };
