// ============================================================
// A/L TOP RANKING MODEL PAPERS
// ============================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


const studentId =
    sessionStorage.getItem("studentId");

const paperCards = [
    {
        number: "01",
        card: document.getElementById("paper01Card"),
        button: document.getElementById("paper01Open")
    },
    {
        number: "02",
        card: document.getElementById("paper02Card"),
        button: document.getElementById("paper02Open")
    }
];


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
// A/L STUDENT CHECK
// ============================================================

function isALStudent(studentData) {

    const studentType =
        String(
            studentData?.studentType || ""
        )
            .trim()
            .toLowerCase();

    const grade =
        String(
            studentData?.grade || ""
        )
            .trim()
            .toLowerCase();

    return (
        studentType === "al" ||
        studentType === "a/l" ||
        studentType === "a level" ||
        studentType === "advanced" ||
        studentType === "advanced level" ||
        grade === "al" ||
        grade === "a/l" ||
        grade === "a level" ||
        grade === "advanced" ||
        grade === "advanced level"
    );
}


// ============================================================
// ACCESS CHECK
// ============================================================

function hasPaperAccess(studentData) {

    if (isALStudent(studentData)) {
        return true;
    }

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


function hasViewedPaper(studentData, paperNumber) {

    const key =
        `paper${paperNumber}`;

    return (
        studentData?.paperViews?.al?.model?.[key] === true
    );
}


// ============================================================
// OPEN PAPER
// ============================================================

async function openPaper(paperNumber, paperButton, paperCard) {

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
        alert(`Paper ${paperNumber} is not available for your account yet.`);
        return;
    }

    if (hasViewedPaper(studentData, paperNumber)) {
        paperCard?.classList.add("viewed");
        alert(
            `Paper ${paperNumber} has already been viewed and cannot be opened again.`
        );
        return;
    }

    window.location.href =
        `al-top-ranking-paper.html?paper=${paperNumber}&month=september`;
}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        const studentData =
            await getStudentData();

        paperCards.forEach(
            function(item) {

                if (!item.button) {
                    return;
                }

                item.button.addEventListener(
                    "click",
                    function() {
                        openPaper(
                            item.number,
                            item.button,
                            item.card
                        );
                    }
                );

                if (!studentData) {
                    return;
                }

                if (!hasPaperAccess(studentData)) {
                    item.card?.classList.add("locked");
                    item.button.textContent = "🔒 Locked";
                    return;
                }

                if (hasViewedPaper(studentData, item.number)) {
                    item.card?.classList.add("viewed");
                    item.button.textContent = "🔵 Already Viewed";
                }
            }
        );
    }
);
