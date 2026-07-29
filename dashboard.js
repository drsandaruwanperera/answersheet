import { db, doc, getDoc, updateDoc } from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

// Display Student ID
document.getElementById("studentId").textContent = studentId;

// Sign Out
document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Are you sure you want to sign out?")) {
        window.location.href = "index.html";
    }

});

// Load Dashboard Information
async function loadDashboard() {

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

    let viewed = 0;

    for (let i = 1; i <= 10; i++) {

        const field = "paper" + String(i).padStart(2, "0");
        const btn = document.getElementById(field);

        if (data[field] === true) {

            viewed++;

            btn.classList.add("viewed");

            btn.innerHTML = `
                📘 Model Paper ${String(i).padStart(2, "0")}
                <small>🔒 Viewed</small>
            `;

        } else {

            btn.classList.add("available");

            btn.innerHTML = `
                📘 Model Paper ${String(i).padStart(2, "0")}
                <small>🟢 Available</small>
            `;

        }

    }

    document.getElementById("progressText").textContent =
        viewed + " / 10 Papers Viewed";

    document.getElementById("progressFill").style.width =
        (viewed / 10 * 100) + "%";

}

// Open Paper
async function openPaper(no) {

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

loadDashboard();
