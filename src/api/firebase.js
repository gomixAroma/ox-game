// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkjhiaXchK_GyFO0KWW3U7yYFQTp9_dCg",
    authDomain: "ox-game-723da.firebaseapp.com",
    projectId: "ox-game-723da",
    storageBucket: "ox-game-723da.appspot.com",
    messagingSenderId: "452868623343",
    appId: "1:452868623343:web:5c6780b08e8c0c218bc41a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
