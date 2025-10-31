// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
     apiKey: "AIzaSyAaF5OYId1cj0UtSdfKRrvSJLiBEpgL6-Q",
     authDomain: "copy-er.firebaseapp.com",
     databaseURL: "https://copy-er-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "copy-er",
     storageBucket: "copy-er.firebasestorage.app",
     messagingSenderId: "728665812415",
     appId: "1:728665812415:web:91ffb1bb51bdd12047050a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export { db, ref, set, get, onValue, push, update, remove };