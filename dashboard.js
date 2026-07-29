import { db, doc, getDoc, updateDoc } from "./firebase.js";

async function openPaper(no) {

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id");

    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Student not found");
        return;
    }

    const data = snap.data();

    // Password එක කලින් භාවිතා කරලා නම්
    if (data.used === true) {
        alert("Password already used.");
        return;
    }

    const field = "paper" + String(no).padStart(2, "0");

    if (data[field] === true) {
        alert("This Model Paper has already been viewed.");
        return;
    }

    // මේ paper එකත් used එකත් update කරන්න
    await updateDoc(ref, {
        [field]: true,
        used: true
    });

    window.location.href = "viewer.html?paper=" + no;
}

window.openPaper = openPaper;
