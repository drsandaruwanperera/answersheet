// =====================================================
// FIREBASE APP
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


// =====================================================
// FIRESTORE
// =====================================================

import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey:
        "YOUR_REAL_FIREBASE_API_KEY",

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
// INITIALIZE
// =====================================================

const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(
        app
    );


// =====================================================
// EXPORT
// =====================================================

export {

    db,

    collection,

    doc,

    getDoc,

    getDocs,

    setDoc,

    updateDoc,

    deleteDoc,

    onSnapshot,

    query,

    where,

    limit

};
