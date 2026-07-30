import { db, doc, getDoc } from "./firebase.js";

// Check login session
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const studentId = params.get("id");

const viewer = document.getElementById("viewer");

async function loadPaper() {

    if (!studentId || !paper) {
        alert("Invalid request.");
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Student not found.");
        window.location.href = "index.html";
        return;
    }

    const data = snap.data();

    const field = "paper" + String(paper).padStart(2, "0") + "Pages";

    const totalPages = data[field];

    if (!totalPages) {
        alert("Paper not found.");
        window.location.href = "dashboard.html?id=" + studentId;
        return;
    }

    for (let i = 1; i <= totalPages; i++) {

        const no = String(i).padStart(2, "0");

        const page = document.createElement("div");
        page.className = "page";

        const img = document.createElement("img");
        img.src = `papers/paper${paper}/paper${paper}_Page_${no}.jpg`;

        const wm = document.createElement("div");
        wm.className = "watermark";
        wm.textContent = studentId;

        page.appendChild(img);
        page.appendChild(wm);

        viewer.appendChild(page);
    }

}

loadPaper();

// Disable Right Click
document.addEventListener("contextmenu", e => e.preventDefault());

// Disable Drag
document.addEventListener("dragstart", e => e.preventDefault());

// Disable Common Keyboard Shortcuts
document.addEventListener("keydown", e => {

    if (e.ctrlKey) {

        const k = e.key.toLowerCase();

        if (
            k === "s" ||
            k === "p" ||
            k === "c" ||
            k === "u" ||
            k === "a"
        ) {
            e.preventDefault();
            alert("This action is disabled.");
        }

    }

});
