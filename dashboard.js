import { db, doc, getDoc } from "./firebase.js";

// Check Login
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

// Load Dashboard
async function loadDashboard() {

    if (!studentId) {
        alert("Student ID not found.");
        return;
    }

    try {

        const ref = doc(db, "students", studentId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            alert("Student not found.");
            return;
        }

        const data = snap.data();

        console.log("Student:", studentId);
        console.log(data);

        let viewed = 0;

        for (let i = 1; i <= 10; i++) {

            const viewedField = "paper" + String(i).padStart(2, "0") + "Viewed";

            console.log(viewedField, data[viewedField]);

            if (data[viewedField] === true) {
                viewed++;
            }

        }

        document.getElementById("progressText").textContent =
            viewed + " / 10 Papers Viewed";

        document.getElementById("progressFill").style.width =
            (viewed * 10) + "%";

    } catch (error) {

        console.error(error);
        alert("Failed to load dashboard.");

    }

}

// Load Dashboard
loadDashboard();
