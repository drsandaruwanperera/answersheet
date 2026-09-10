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

const params =
    new URLSearchParams(window.location.search);

const paperNumber =
    String(params.get("paper") || "01")
        .padStart(2, "0");


async function getStudentData() {
    if (!studentId) {
        return null;
    }

    try {
        const snapshot = await getDoc(
            doc(db, "students", studentId)
        );

        return snapshot.exists()
            ? snapshot.data()
            : null;
    } catch (error) {
        console.error("Firestore error:", error);
        return null;
    }
}


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


function hasPaperAccess(studentData) {

    if (isALStudent(studentData)) {
        return true;
    }

    if (!studentData) {
        return false;
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


async function checkPdf(linkId, statusId, pdfUrl) {
    const link = document.getElementById(linkId);
    const status = document.getElementById(statusId);

    if (!link || !status) {
        return;
    }

    link.href = pdfUrl;

    try {
        const response = await fetch(pdfUrl, {
            method: "HEAD",
            cache: "no-store"
        });

        if (response.ok) {
            link.classList.remove("pending");
            link.textContent = "Open PDF →";
            status.textContent = "Available";
        } else {
            status.textContent = "PDF will appear here after upload.";
        }
    } catch (error) {
        status.textContent = "PDF will appear here after upload.";
    }
}


async function initialize() {
    const studentData = await getStudentData();

    if (!studentData || !hasPaperAccess(studentData)) {
        alert(`Paper ${paperNumber} is not available for your account yet.`);
        window.location.replace("model-papers.html");
        return;
    }

    const pageTitle =
        document.getElementById("pageTitle");

    const paperKicker =
        document.getElementById("paperKicker");

    const firstDescription =
        document.getElementById("firstDescription");

    const secondDescription =
        document.getElementById("secondDescription");

    if (pageTitle) {
        pageTitle.textContent =
            `Paper ${paperNumber}`;
    }

    if (paperKicker) {
        paperKicker.textContent =
            `PAPER ${paperNumber}`;
    }

    if (firstDescription) {
        firstDescription.textContent =
            `Open the September 2026 Top Ranking Model — Paper ${paperNumber} 1st Paper PDF.`;
    }

    if (secondDescription) {
        secondDescription.textContent =
            `Open the September 2026 Top Ranking Model — Paper ${paperNumber} 2nd Paper PDF.`;
    }

    const basePath =
        `papers/al-top-ranking/september/paper-${paperNumber}`;

    await Promise.all([
        checkPdf(
            "firstPaper",
            "firstStatus",
            `${basePath}-1st-paper.pdf`
        ),
        checkPdf(
            "secondPaper",
            "secondStatus",
            `${basePath}-2nd-paper.pdf`
        )
    ]);
}


document.addEventListener(
    "DOMContentLoaded",
    initialize
);
