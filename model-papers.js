```javascript
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
// GET STUDENT ID
// ============================================================

function getStudentId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlStudentId =
        params.get("id") ||
        params.get("studentId");


    if (urlStudentId) {

        sessionStorage.setItem(
            "studentId",
            urlStudentId
        );

        return urlStudentId;
    }


    return sessionStorage.getItem(
        "studentId"
    );
}


const studentId =
    getStudentId();


// ============================================================
// FIND PAPER CARD / BUTTON
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
// CHECK WHETHER PAPER WAS VIEWED
// ============================================================

function hasViewedPaper(
    studentData,
    paperId
) {

    if (!studentData) {

        return false;

    }


    /*
     * Firestore structure:
     *
     * paperViews
     *   └── al
     *       └── model
     *           ├── paper01: true
     *           ├── paper02: true
     *           └── ...
     */

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


    /*
     * IMPORTANT
     *
     * If the paper field does not exist,
     * the existing project behavior is:
     *
     *       AVAILABLE
     *
     * Therefore we MUST NOT treat a missing
     * field as locked.
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
// UPDATE STATUS TEXT
// ============================================================

function updateStatusText(
    element,
    status
) {

    if (!element) {

        return;

    }


    /*
     * If the HTML has:
     *
     * <span class="paper-status">
     *
     * use it.
     */

    const dedicatedStatus =
        element.querySelector(
            ".paper-status"
        );


    if (dedicatedStatus) {

        dedicatedStatus.textContent =
            status;

        return;

    }


    /*
     * Otherwise update an existing span
     * containing Available / Viewed.
     */

    const spans =
        element.querySelectorAll(
            "span"
        );


    spans.forEach(
        span => {

            const text =
                span.textContent
                    .toLowerCase()
                    .trim();


            if (
                text.includes("available") ||
                text.includes("viewed") ||
                text.includes("locked")
            ) {

                span.textContent =
                    status;

            }

        }
    );
}


// ============================================================
// UPDATE PAPER UI
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


    const number =
        String(
            paperNumber
        ).padStart(
            2,
            "0"
        );


    const paperId =
        `paper${number}`;


    // --------------------------------------------------------
    // REMOVE PREVIOUS STATES
    // --------------------------------------------------------

    element.classList.remove(
        "paper-viewed",
        "paper-available",
        "disabled"
    );


    element.removeAttribute(
        "aria-disabled"
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


        /*
         * IMPORTANT:
         *
         * Do not simply remove onclick.
         * We attach a function that performs
         * the Firestore check again.
         */

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
            "🔵 Viewed"
        );


        console.log(
            `${paperId}: VIEWED`
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


        console.log(
            `${paperId}: AVAILABLE`
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
                    `Model Paper ${number} is not available.`
                );

            };


        updateStatusText(
            element,
            "🔒 Locked"
        );


        console.log(
            `${paperId}: LOCKED`
        );

    }
}


// ============================================================
// SETUP ALL PAPERS
// ============================================================

async function setupPapers() {

    console.log(
        "===================================="
    );

    console.log(
        "Loading A/L Model Paper Status"
    );

    console.log(
        "Student ID:",
        studentId
    );

    console.log(
        "===================================="
    );


    const studentData =
        await getStudentData();


    if (!studentData) {

        console.error(
            "Unable to load student data."
        );

        return;
    }


    // --------------------------------------------------------
    // PAPERS 01 - 10
    // --------------------------------------------------------

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


        // ----------------------------------------------------
        // CHECK ACCESS
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
        // CHECK VIEWED
        // ----------------------------------------------------

        const viewed =
            hasViewedPaper(
                studentData,
                paperId
            );


        if (viewed) {

            /*
             * ONLY THIS PAPER becomes viewed/locked.
             */

            updatePaperUI(
                i,
                "viewed"
            );

        } else {

            /*
             * Missing paperViews field means
             * the paper is still available.
             */

            updatePaperUI(
                i,
                "available"
            );

        }

    }


    console.log(
        "===================================="
    );

    console.log(
        "A/L Model Paper Status Loaded"
    );

    console.log(
        "===================================="
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
        "------------------------------------"
    );

    console.log(
        "Checking paper before opening:"
    );

    console.log(
        "Paper:",
        paperId
    );


    // ========================================================
    // ALWAYS READ FIRESTORE AGAIN
    // ========================================================

    const studentData =
        await getStudentData();


    if (!studentData) {

        alert(
            "Unable to verify your paper access. Please try again."
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
            `Model Paper ${number} is not available for you.`
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
            `BLOCKED: ${paperId} has already been viewed.`
        );


        alert(
            `Model Paper ${number} has already been viewed and cannot be opened again.`
        );


        return;
    }


    // ========================================================
    // SAVE STUDENT ID
    // ========================================================

    if (studentId) {

        sessionStorage.setItem(
            "studentId",
            studentId
        );

    }


    // ========================================================
    // VIEWER URL
    // ========================================================

    const viewerUrl =
        `viewer.html?` +
        `paper=${encodeURIComponent(
            paperId
        )}` +
        `&id=${encodeURIComponent(
            studentId || ""
        )}` +
        `&type=al-model`;


    console.log(
        "Opening viewer:"
    );

    console.log(
        viewerUrl
    );


    // ========================================================
    // OPEN VIEWER
    // ========================================================

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
    function() {

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
```
