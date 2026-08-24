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

function getStudentId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlId =
        params.get("id") ||
        params.get("studentId");


    if (urlId) {

        sessionStorage.setItem(
            "studentId",
            urlId
        );

        return urlId;
    }


    return sessionStorage.getItem(
        "studentId"
    );
}


const studentId =
    getStudentId();


// ============================================================
// GET PAPER ELEMENT
// ============================================================

function findPaperElement(
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


    const selectors = [

        `#${paperId}`,

        `[data-paper="${paperId}"]`,

        `[data-paper="${number}"]`,

        `[data-paper-id="${paperId}"]`

    ];


    for (
        const selector
        of selectors
    ) {

        try {

            const element =
                document.querySelector(
                    selector
                );


            if (element) {
                return element;
            }

        } catch (error) {

            console.warn(
                "Invalid selector:",
                selector
            );

        }
    }


    return null;
}


// ============================================================
// GET STUDENT DATA
// ============================================================

async function getStudentData() {

    if (!studentId) {

        console.error(
            "Student ID not found."
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
                "Student document not found:",
                studentId
            );

            return null;
        }


        return snapshot.data();

    } catch (error) {

        console.error(
            "Failed to read student document:",
            error
        );

        return null;
    }
}


// ============================================================
// CHECK VIEWED STATUS
// ============================================================

function hasViewedPaper(
    studentData,
    paperId
) {

    if (!studentData) {
        return false;
    }


    const viewed =
        studentData
            ?.paperViews
            ?.al
            ?.model
            ?.[paperId];


    return viewed === true;
}


// ============================================================
// CHECK PAPER ACCESS
// ============================================================

function hasPaperAccess(
    studentData,
    paperId
) {

    if (!studentData) {
        return false;
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
// UPDATE PAPER CARD STATUS
// ============================================================

function updatePaperUI(
    paperNumber,
    status
) {

    const element =
        findPaperElement(
            paperNumber
        );


    if (!element) {

        console.warn(
            `Paper element not found: paper${String(paperNumber).padStart(2, "0")}`
        );

        return;
    }


    // --------------------------------------------------------
    // REMOVE OLD CLASSES
    // --------------------------------------------------------

    element.classList.remove(
        "paper-viewed",
        "paper-available",
        "disabled"
    );


    // --------------------------------------------------------
    // VIEWED
    // --------------------------------------------------------

    if (
        status === "viewed"
    ) {

        element.classList.add(
            "paper-viewed"
        );


        element.setAttribute(
            "aria-disabled",
            "true"
        );


        element.onclick =
            async function(event) {

                event.preventDefault();
                event.stopPropagation();


                /*
                 * Check Firestore AGAIN.
                 *
                 * This is the important protection.
                 */

                await openPaper(
                    paperNumber
                );

            };


        updateStatusText(
            element,
            "🔵 Viewed"
        );


        return;
    }


    // --------------------------------------------------------
    // AVAILABLE
    // --------------------------------------------------------

    if (
        status === "available"
    ) {

        element.classList.add(
            "paper-available"
        );


        element.removeAttribute(
            "aria-disabled"
        );


        element.onclick =
            async function(event) {

                event.preventDefault();
                event.stopPropagation();


                await openPaper(
                    paperNumber
                );

            };


        updateStatusText(
            element,
            "🟢 Available"
        );


        return;
    }


    // --------------------------------------------------------
    // LOCKED
    // --------------------------------------------------------

    if (
        status === "locked"
    ) {

        element.classList.add(
            "disabled"
        );


        element.setAttribute(
            "aria-disabled",
            "true"
        );


        element.onclick =
            function(event) {

                event.preventDefault();
                event.stopPropagation();


                alert(
                    "This paper is not available yet."
                );

            };


        updateStatusText(
            element,
            "🔒 Locked"
        );
    }
}


// ============================================================
// UPDATE STATUS TEXT
// ============================================================

function updateStatusText(
    element,
    text
) {

    /*
     * If the HTML has a dedicated:
     *
     * <span class="paper-status">
     *
     * use it.
     */

    const statusElement =
        element.querySelector(
            ".paper-status"
        );


    if (statusElement) {

        statusElement.textContent =
            text;

        return;
    }


    /*
     * Otherwise update existing spans.
     */

    const spans =
        element.querySelectorAll(
            "span"
        );


    spans.forEach(
        span => {

            const oldText =
                span.textContent
                    .toLowerCase();


            if (
                oldText.includes(
                    "available"
                ) ||
                oldText.includes(
                    "viewed"
                ) ||
                oldText.includes(
                    "locked"
                )
            ) {

                span.textContent =
                    text;

            }

        }
    );
}


// ============================================================
// SETUP PAPERS
// ============================================================

async function setupPapers() {

    console.log(
        "Loading A/L Model Paper access..."
    );


    const studentData =
        await getStudentData();


    if (!studentData) {

        console.error(
            "Student data could not be loaded."
        );

        return;
    }


    // --------------------------------------------------------
    // PAPER 01 - 10
    // --------------------------------------------------------

    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const paperId =
            `paper${String(i).padStart(2, "0")}`;


        // ----------------------------------------------------
        // ACCESS
        // ----------------------------------------------------

        const accessible =
            hasPaperAccess(
                studentData,
                paperId
            );


        if (!accessible) {

            updatePaperUI(
                i,
                "locked"
            );

            continue;
        }


        // ----------------------------------------------------
        // VIEWED
        // ----------------------------------------------------

        const viewed =
            hasViewedPaper(
                studentData,
                paperId
            );


        if (viewed) {

            updatePaperUI(
                i,
                "viewed"
            );

        } else {

            updatePaperUI(
                i,
                "available"
            );

        }

    }


    console.log(
        "A/L Model Paper status loaded."
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
        "Checking paper before opening:",
        paperId
    );


    // --------------------------------------------------------
    // ALWAYS READ FIRESTORE AGAIN
    // --------------------------------------------------------

    const studentData =
        await getStudentData();


    if (!studentData) {

        alert(
            "Unable to verify your paper access. Please try again."
        );

        return;
    }


    // --------------------------------------------------------
    // CHECK ACCESS
    // --------------------------------------------------------

    const accessible =
        hasPaperAccess(
            studentData,
            paperId
        );


    if (!accessible) {

        alert(
            `Model Paper ${number} is not available for you.`
        );

        return;
    }


    // --------------------------------------------------------
    // CHECK VIEWED
    // --------------------------------------------------------

    const alreadyViewed =
        hasViewedPaper(
            studentData,
            paperId
        );


    if (alreadyViewed) {

        console.log(
            `Blocked: ${paperId} has already been viewed.`
        );


        alert(
            `Model Paper ${number} has already been viewed and cannot be opened again.`
        );


        return;
    }


    // --------------------------------------------------------
    // SAVE STUDENT ID
    // --------------------------------------------------------

    if (studentId) {

        sessionStorage.setItem(
            "studentId",
            studentId
        );

    }


    // --------------------------------------------------------
    // VIEWER URL
    // --------------------------------------------------------

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
        "Opening:",
        viewerUrl
    );


    // --------------------------------------------------------
    // OPEN
    // --------------------------------------------------------

    window.location.href =
        viewerUrl;
}


// ============================================================
// GLOBAL FUNCTION
// ============================================================

window.openPaper =
    openPaper;


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPapers();

    }
);


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "🟢 A/L Model Papers Page Active"
);

console.log(
    "Student ID:",
    studentId
);
