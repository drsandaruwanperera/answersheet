import { db, doc, getDoc } from "./firebase.js";

// Check login session
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");      // paper01
const studentId = params.get("id");

const viewer = document.getElementById("viewer");

async function loadPaper() {

    if (!paper || !studentId) {
        alert("Invalid request.");
        window.location.href = "dashboard.html?id=" + studentId;
        return;
    }

    // Get Paper Information
    const paperRef = doc(db, "papers", paper);
    const paperSnap = await getDoc(paperRef);

    if (!paperSnap.exists()) {
        alert("Paper not found.");
        window.location.href = "dashboard.html?id=" + studentId;
        return;
    }

    const paperData = paperSnap.data();

    const totalPages = paperData.pages;

    for (let i = 1; i <= totalPages; i++) {

        const no = String(i).padStart(2, "0");

        const page = document.createElement("div");
        page.className = "page";

        const img = document.createElement("img");
        img.src = `papers/${paper}/${paper}_Page_${no}.jpg`;

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
