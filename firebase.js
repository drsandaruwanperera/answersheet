// =====================================================
// FIREBASE APP
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


// =====================================================
// FIREBASE AUTHENTICATION
// =====================================================

import {
    getAuth,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


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
    limit,
    writeBatch
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
// AUTHENTICATION
// =====================================================

const auth =
    getAuth(
        app
    );


// =====================================================
// EXPORT
// =====================================================

export {

    // Firestore

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

    limit,

    writeBatch,


    // Authentication

    auth,

    reauthenticateWithCredential,

    EmailAuthProvider

};
