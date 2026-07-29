import { db, doc, getDoc, updateDoc } from "./firebase.js";

async function openPaper(no) {

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id");

    if (!studentId) {
        alert("Student ID not found.");
        return;
    }

    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Student not found.");
        return;
    }

    const data = snap.data();

    const field = "paper" + String(no).padStart(2, "0");

    if (data[field] === true) {
        alert("This Model Paper has already been viewed.");
        return;
    }

    await updateDoc(ref, {
        [field]: true
    });

    window.location.href =
        "viewer.html?paper=" + no + "&id=" + studentId;

}

window.openPaper = openPaper;
// Student ID display
const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

document.getElementById("studentId").textContent = studentId;

// Sign Out
document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Are you sure you want to sign out?")) {
        window.location.href = "index.html";
    }

});
