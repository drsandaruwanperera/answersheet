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


function hasPaperAccess(studentData) {
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


async function checkPdf(linkId, statusId) {
    const link = document.getElementById(linkId);
    const status = document.getElementById(statusId);

    if (!link || !status) {
        return;
    }

    const pdfUrl = link.getAttribute("href");

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
        alert("Paper 01 is not available for your account yet.");
        window.location.replace("model-papers.html");
        return;
    }

    await Promise.all([
        checkPdf("firstPaper", "firstStatus"),
        checkPdf("secondPaper", "secondStatus")
    ]);
}


document.addEventListener(
    "DOMContentLoaded",
    initialize
);
