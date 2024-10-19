import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBhyKJBA6XubFqbupIsFTCaX24R9h6bgh4',
  authDomain: 'not-so-random-number-gen-2.firebaseapp.com',
  projectId: 'not-so-random-number-gen-2',
  storageBucket: 'not-so-random-number-gen-2.appspot.com',
  messagingSenderId: '214301765878',
  appId: '1:214301765878:web:56ad225c547a369602bcd7',
  measurementId: 'G-ESZ0EV21TJ'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };