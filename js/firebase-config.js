// ========== FIREBASE CONFIGURATION ==========
const firebaseConfig = {
  apiKey: "AIzaSyA-4dJG2UYIyj9wLNbyhyZDPHe3tuNwpXs",
  authDomain: "sushivibe-a29c2.firebaseapp.com",
  projectId: "sushivibe-a29c2",
  storageBucket: "sushivibe-a29c2.firebasestorage.app",
  messagingSenderId: "714267291452",
  appId: "1:714267291452:web:83e861b62cb2904e43b839",
  measurementId: "G-5YJZ959BW6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

console.log('🔥 Firebase connected');
