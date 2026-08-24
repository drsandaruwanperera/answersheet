// ============================================================
// A/L MODEL PAPERS
// model-papers.js
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


// ============================================================
// STUDENT ID
// ============================================================

const studentId =
    sessionStorage.getItem("studentId");


// ============================================================
// GET STUDENT DATA
// ============================================================

async function getStudentData() {

    if (!studentId) {

        console.error(
            "❌ Student ID not found in sessionStorage."
        );

        return null;
    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        const snapshot =
            await getDoc(
                studentRef
            );


        if (!snapshot.exists()) {

            console.error(
                "❌ Student document not found:",
                studentId
            );

            return null;
        }


        return snapshot.data();

    } catch (error) {

        console.error(
            "❌ Firestore error:",
            error
        );

        return null;
    }
}


// ============================================================
// CHECK VIEWED
// ============================================================

function hasViewedPaper(
    studentData,
    paperId
) {

    if (!studentData) {
        return false;
    }


    const viewed =
        studentData?.paperViews?.al?.model?.[paperId];


    return viewed === true;
}


// ============================================================
// CHECK ACCESS
// ============================================================

function hasPaperAccess(
    studentData,
    paperId
) {

    if (!studentData) {
        return true;
    }


    /*
     * IMPORTANT:
     *
     * If paper01 / paper02 / etc.
     * does not exist in Firestore,
     * consider it AVAILABLE.
     */

    if (
        !Object.prototype.hasOwnProperty.call(
            studentData,
            paperId
        )
    ) {

        return true;
    }


    const value =
        studentData[paperId];


    return (
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1"
    );
}


// ============================================================
// GET PAPER BUTTON
// ============================================================

function getPaperButton(
    paperNumber
) {

    const number =
        String(
            paperNumber
        ).padStart(
            2,
            "0"
        );


    return document.getElementById(
        `paper${number}`
    );
}


// ============================================================
// UPDATE STATUS
// ============================================================

function updatePaperStatus(
    paperNumber,
    status
) {

    const button =
        getPaperButton(
            paperNumber
        );


    if (!button) {
        return;
    }


    // Remove old classes

    button.classList.remove(
        "available",
        "viewed",
        "disabled"
    );


    // ========================================================
    // AVAILABLE
    // ========================================================

    if (
        status === "available"
    ) {

        button.classList.add(
            "available"
        );


        const statusElement =
            button.querySelector(
                ".paper-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "🟢 Available";

        }


        return;
    }


    // ========================================================
    // VIEWED
    // ========================================================

    if (
        status === "viewed"
    ) {

        button.classList.add(
            "viewed"
        );


        const statusElement =
            button.querySelector(
                ".paper-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "🔵 Viewed";

        }


        return;
    }


    // ========================================================
    // LOCKED
    // ========================================================

    if (
        status === "locked"
    ) {

        button.classList.add(
            "disabled"
        );


        const statusElement =
            button.querySelector(
                ".paper-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "🔒 Locked";

        }
    }
}


// ============================================================
// LOAD PAPER STATUSES
// ============================================================

async function loadPaperStatuses() {

    console.log(
        "======================================"
    );

    console.log(
        "A/L MODEL PAPERS"
    );

    console.log(
        "Student ID:",
        studentId
    );

    console.log(
        "======================================"
    );


    const studentData =
        await getStudentData();


    /*
     * If Firestore cannot be read,
     * keep papers available instead of
     * locking all papers.
     */

    if (!studentData) {

        console.warn(
            "Student data unavailable. Papers remain available."
        );


        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            updatePaperStatus(
                i,
                "available"
            );
        }


        return;
    }


    // ========================================================
    // PAPERS 01 - 10
    // ========================================================

    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const paperId =
            `paper${String(
                i
            ).padStart(
                2,
                "0"
            )}`;


        const accessible =
            hasPaperAccess(
                studentData,
                paperId
            );


        // ----------------------------------------------------
        // NOT AVAILABLE
        // ----------------------------------------------------

        if (!accessible) {

            updatePaperStatus(
                i,
                "locked"
            );

            continue;
        }


        // ----------------------------------------------------
        // ALREADY VIEWED
        // ----------------------------------------------------

        const viewed =
            hasViewedPaper(
                studentData,
                paperId
            );


        if (viewed) {

            updatePaperStatus(
                i,
                "viewed"
            );

        } else {

            updatePaperStatus(
                i,
                "available"
            );

        }
    }


    console.log(
        "✅ Paper statuses loaded."
    );
}


// ============================================================
// OPEN PAPER
// ============================================================

async function openPaper(
    paperNumber
) {

    const number =
        String(
            paperNumber
        ).padStart(
            2,
            "0"
        );


    const paperId =
        `paper${number}`;


    console.log(
        "======================================"
    );

    console.log(
        "PAPER CLICKED:",
        paperId
    );


    // ========================================================
    // GET CURRENT FIRESTORE DATA
    // ========================================================

    const studentData =
        await getStudentData();


    /*
     * If student data cannot be loaded,
     * don't silently fail.
     */

    if (!studentData) {

        console.warn(
            "Student data could not be verified."
        );


        alert(
            "Unable to verify your account. Please refresh the page and try again."
        );


        return;
    }


    // ========================================================
    // CHECK ACCESS
    // ========================================================

    const accessible =
        hasPaperAccess(
            studentData,
            paperId
        );


    if (!accessible) {

        alert(
            `Model Paper ${number} is not available.`
        );


        return;
    }


    // ========================================================
    // CHECK VIEWED
    // ========================================================

    const alreadyViewed =
        hasViewedPaper(
            studentData,
            paperId
        );


    if (alreadyViewed) {

        console.log(
            "❌ BLOCKED - ALREADY VIEWED:",
            paperId
        );


        alert(
            `Model Paper ${number} has already been viewed and cannot be opened again.`
        );


        return;
    }


    // ========================================================
    // BUILD VIEWER URL
    // ========================================================

    const viewerUrl =
        `viewer.html?` +
        `paper=${encodeURIComponent(
            paperId
        )}` +
        `&id=${encodeURIComponent(
            studentId
        )}` +
        `&type=al-model`;


    console.log(
        "✅ OPENING:",
        viewerUrl
    );


    console.log(
        "======================================"
    );


    // ========================================================
    // NAVIGATE
    // ========================================================

    window.location.assign(
        viewerUrl
    );
}


// ============================================================
// ATTACH CLICK EVENTS
// ============================================================

function attachPaperEvents() {

    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const button =
            getPaperButton(
                i
            );


        if (!button) {

            console.warn(
                `Paper button not found: paper${String(i).padStart(2, "0")}`
            );

            continue;
        }


        /*
         * Remove inline onclick behavior.
         *
         * The HTML can still contain:
         *
         * onclick="openPaper(1)"
         *
         * but we don't rely on it.
         */

        button.removeAttribute(
            "onclick"
        );


        // ----------------------------------------------------
        // CLICK
        // ----------------------------------------------------

        button.addEventListener(
            "click",
            async function(event) {

                event.preventDefault();

                event.stopPropagation();


                await openPaper(
                    i
                );

            }
        );


        // ----------------------------------------------------
        // KEYBOARD
        // ----------------------------------------------------

        button.addEventListener(
            "keydown",
            async function(event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    await openPaper(
                        i
                    );

                }

            }
        );
    }
}


// ============================================================
// GLOBAL FUNCTION
// ============================================================
//
// This is kept because your HTML currently contains:
// onclick="openPaper(1)"
//
// So even if the HTML hasn't been changed,
// it will still work.
//

window.openPaper =
    openPaper;


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "🟢 Model Papers page loaded."
        );


        // Attach click handlers FIRST

        attachPaperEvents();


        // Then load statuses

        await loadPaperStatuses();

    }
);


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "🟢 A/L Model Papers JS loaded."
);

console.log(
    "Student ID:",
    studentId
);
