// ============================================================
// A/L TOP RANKING MODEL PAPERS
// ============================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// ============================================================
// LOGIN CHECK
// ============================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


const studentId =
    sessionStorage.getItem("studentId");

const paperButton =
    document.getElementById("paper01Open");

const paperCard =
    document.getElementById("paper01Card");


// ============================================================
// GET STUDENT DATA
// ============================================================

async function getStudentData() {

    if (!studentId) {
        return null;
    }

    try {
        const studentRef =
            doc(db, "students", studentId);

        const snapshot =
            await getDoc(studentRef);

        return snapshot.exists()
            ? snapshot.data()
            : null;

    } catch (error) {
        console.error("Firestore error:", error);
        return null;
    }
}


// ============================================================
// ACCESS CHECK
// ============================================================

function hasPaperAccess(studentData) {

    if (!studentData) {
        return true;
    }

    if (!Object.prototype.hasOwnProperty.call(studentData, "paper01")) {
        return true;
    }

    const value = studentData.paper01;

    return (
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1"
    );
}


function hasViewedPaper(studentData) {

    return (
        studentData?.paperViews?.al?.model?.paper01 === true
    );
}


// ============================================================
// OPEN PAPER 01
// ============================================================

async function openPaper01() {

    if (!paperButton) {
        return;
    }

    const studentData =
        await getStudentData();

    if (!studentData) {
        alert(
            "Unable to verify your account. Please refresh the page and try again."
        );
        return;
    }

    if (!hasPaperAccess(studentData)) {
        paperCard?.classList.add("locked");
        alert("Paper 01 is not available for your account yet.");
        return;
    }

    if (hasViewedPaper(studentData)) {
        paperCard?.classList.add("viewed");
        alert(
            "Paper 01 has already been viewed and cannot be opened again."
        );
        return;
    }

    window.location.href =
        "al-top-ranking-paper.html?paper=01&month=september";
}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        if (!paperButton) {
            return;
        }

        paperButton.addEventListener(
            "click",
            openPaper01
        );

        const studentData =
            await getStudentData();

        if (!studentData) {
            return;
        }

        if (!hasPaperAccess(studentData)) {
            paperCard?.classList.add("locked");
            paperButton.textContent = "🔒 Locked";
            return;
        }

        if (hasViewedPaper(studentData)) {
            paperCard?.classList.add("viewed");
            paperButton.textContent = "🔵 Already Viewed";
        }
    }
);
