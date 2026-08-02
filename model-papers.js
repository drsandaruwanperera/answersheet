import { db, doc, getDoc, updateDoc } from "./firebase.js";

// Check login session
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

// Load Model Papers
async function loadModelPapers() {

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

        for (let i = 1; i <= 10; i++) {

            const permission = "paper" + String(i).padStart(2, "0");
            const viewedField = permission + "Viewed";

            const btn = document.getElementById(permission);

            if (!btn) continue;

            // Hide papers without permission
            if (data[permission] !== true) {
                btn.style.display = "none";
                continue;
            }

            btn.style.display = "block";

            // Already viewed
            if (data[viewedField] === true) {

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

    } catch (error) {

        console.error(error);
        alert("Failed to load model papers.");

    }

}

// Open Paper
async function openPaper(no) {

    try {

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

        console.log("Updating:", viewedField);

        await updateDoc(ref, {
            [viewedField]: true
        });

        console.log("Firestore Update Success");

        window.location.href =
            `viewer.html?paper=${permission}&id=${studentId}`;

    } catch (error) {

        console.error("Firestore Update Error:", error);
        alert(error.message);

    }

}

window.openPaper = openPaper;

loadModelPapers();
