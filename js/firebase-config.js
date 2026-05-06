// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAcpb7w7SK_QQPayxiZav638PQQaeDfaU",
  authDomain: "sushiviecatering.firebaseapp.com",
  projectId: "sushiviecatering",
  storageBucket: "sushiviecatering.firebasestorage.app",
  messagingSenderId: "53464789510",
  appId: "1:53464789510:web:181e18a8e2db525c6bc987",
  measurementId: "G-8F3WHE183Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

console.log('🔥 Firebase connected successfully!');
