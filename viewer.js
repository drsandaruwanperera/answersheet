import { db, doc, getDoc } from "./firebase.js";

const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const studentId = params.get("id");

const viewer = document.getElementById("viewer");

async function loadPaper() {

    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Student not found");
        return;
    }

    const data = snap.data();

    const field = "paper" + String(paper).padStart(2, "0") + "Pages";

    const totalPages = data[field];

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

document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("dragstart", e => e.preventDefault());

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
