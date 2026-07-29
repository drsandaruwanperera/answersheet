import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAKbrx_tt4SXi1obmDIvqUVi2VmcXCs0_8",

  authDomain: "answersheet2026.firebaseapp.com",

  projectId: "answersheet2026",

  storageBucket: "answersheet2026.firebasestorage.app",

  messagingSenderId: "953495846284",

  appId: "1:953495846284:web:0f1f9def812a5cbef16aa9"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, doc, getDoc, updateDoc };
