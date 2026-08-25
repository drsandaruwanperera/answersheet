import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey:
        "...",

    authDomain:
        "answersheet2026.firebaseapp.com",

    projectId:
        "answersheet2026",

    storageBucket:
        "answersheet2026.firebasestorage.app",

    messagingSenderId:
        "953495846284",

    appId:
        "1:953495846284:web:0f1f9def812a5cbef16aa9"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app =
    initializeApp(
        firebaseConfig
    );


// =====================================================
// FIRESTORE
// =====================================================

const db =
    getFirestore(
        app
    );


// =====================================================
// EXPORT
// =====================================================

export {

    db,

    // Firestore document functions
    doc,
    getDoc,
    getDocs,

    // Firestore write functions
    setDoc,
    updateDoc,
    deleteDoc,

    // Firestore collection
    collection,

    // ⭐ REAL-TIME LISTENER
    onSnapshot

};


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Firebase initialized"
);

console.log(
    "🔥 Firestore real-time listener available"
);
