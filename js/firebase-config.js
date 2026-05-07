const firebaseConfig = {
  apiKey: "AIzaSyBxkCTH1tiqyrWWFaM8MaArdfRBS6wOIQo",
  authDomain: "sushivibe-7712.firebaseapp.com",
  projectId: "sushivibe-7712",
  storageBucket: "sushivibe-7712.firebasestorage.app",
  messagingSenderId: "502647939325",
  appId: "1:502647939325:web:8b4e6749a0504d266e1e94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

console.log('🔥 Firebase connected to sushivibe-7712');
