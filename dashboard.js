import { db, doc, getDoc, updateDoc } from "./firebase.js";

// Check login session
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

// Display Student ID
document.getElementById("studentId").textContent = studentId;

// Sign Out
document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Are you sure you want to sign out?")) {

        sessionStorage.clear();
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

        const permission = "paper" + String(i).padStart(2, "0");
        const viewedField = permission + "Viewed";

        const btn = document.getElementById(permission);

        // No permission
        if (data[permission] !== true) {
            btn.style.display = "none";
            continue;
        }

        btn.style.display = "block";

        if (data[viewedField] === true) {

            viewed++;

            btn.className = "viewed";

            btn.innerHTML = `
                📘 Model Paper ${String(i).padStart(2, "0")}
                <small>🔒 Viewed</small>
            `;

        } else {

            btn.className = "available";

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

    const permission = "paper" + String(no).padStart(2, "0");
    const viewedField = permission + "Viewed";

    if (data[permission] !== true) {
        alert("You do not have permission to view this paper.");
        return;
    }

    if (data[viewedField] === true) {
        alert("This Model Paper has already been viewed.");
        return;
    }

   await updateDoc(ref, {
    [viewedField]: true
});

alert("Firestore Updated Successfully");

    window.location.href =
        "viewer.html?paper=" + permission + "&id=" + studentId;

}

window.openPaper = openPaper;

loadDashboard();
