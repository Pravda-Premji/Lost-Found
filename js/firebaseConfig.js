// js/firebaseConfig.js
// 1) Copy your Firebase web app config from Firebase Console (Project settings -> Your apps -> SDK config)
// 2) Replace the "YOUR_..." values below with the real ones, then save this file.

const firebaseConfig = {
  apiKey: "AIzaSyDIkXYR3autWyzOtCQB0ixzJA-fDFnAKDc",
  authDomain: "lostfound1-f2cd5.firebaseapp.com",
  projectId: "lostfound1-f2cd5",
  storageBucket: "lostfound1-f2cd5.firebasestorage.app",
  messagingSenderId: "944657149232",
  appId: "1:944657149232:web:45fe23b24a41ddf29e6cf5"
};
// Initialize Firebase (safe check in case it was already initialized)
if (!window.firebase) {
  console.error('Firebase SDK not loaded. Check your HTML includes.');
}
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
