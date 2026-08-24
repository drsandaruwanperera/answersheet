// ============================================================
// A/L MODEL PAPERS
// model-papers.js
// ============================================================

import {
    db,
    doc,
    getDoc,
    updateDoc
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
// ELEMENTS
// ============================================================

const paperContainer =
    document.getElementById("paperContainer");


// ============================================================
// GET PAPER ELEMENT
// ============================================================

function findPaperElement(paperNumber) {

    const number =
        String(paperNumber).padStart(2, "0");

    const paperId =
        `paper${number}`;

    const selectors = [
        `#${paperId}`,
        `[data-paper="${paperId}"]`,
        `[data-paper="${number}"]`,
        `[data-paper-id="${paperId}"]`
    ];

    for (const selector of selectors) {

        const element =
            document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


// ============================================================
// GET STUDENT DOCUMENT
// ============================================================

async function getStudentData() {

    if (!studentId) {
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
            return null;
        }

        return snapshot.data();

    } catch (error) {

        console.error(
            "Failed to load student:",
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
     * Main structure:
     *
     * paperViews.al.model.paper01
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

    /*
     * Existing access fields:
     *
     * paper01
     * paper02
     * ...
     */

    if (!studentData) {

        // If student data is unavailable,
        // do not accidentally block all papers.
        return true;
    }


    const value =
        studentData[paperId];


    /*
     * Accept common Firestore values.
     */

    return (
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1"
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
        String(paperNumber).padStart(2, "0");


    // Remove previous states

    element.classList.remove(
        "disabled",
        "paper-viewed",
        "paper-available"
    );


    // Remove old disabled attributes

    element.removeAttribute(
        "disabled"
    );

    element.removeAttribute(
        "aria-disabled"
    );


    // ========================================================
    // VIEWED
    // ========================================================

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
         * Prevent opening.
         */

        element.onclick =
            function(event) {

                event.preventDefault();
                event.stopPropagation();


                alert(
                    `Model Paper ${number} has already been viewed.`
                );

            };


        /*
         * Update visible status if the card
         * contains a status element.
         */

        const statusElement =
            element.querySelector(
                ".paper-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "🔵 Viewed";

        }


        /*
         * If no dedicated status exists,
         * try to replace "Available".
         */

        element
            .querySelectorAll(
                "span"
            )
            .forEach(
                span => {

                    const text =
                        span.textContent
                            .toLowerCase();

                    if (
                        text.includes(
                            "available"
                        )
                    ) {

                        span.textContent =
                            "🔵 Viewed";

                    }

                }
            );


        return;
    }


    // ========================================================
    // AVAILABLE
    // ========================================================

    if (
        status === "available"
    ) {

        element.classList.add(
            "paper-available"
        );


        element.onclick =
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                openPaper(
                    paperNumber
                );

            };


        const statusElement =
            element.querySelector(
                ".paper-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "🟢 Available";

        }


        element
            .querySelectorAll(
                "span"
            )
            .forEach(
                span => {

                    const text =
                        span.textContent
                            .toLowerCase();

                    if (
                        text.includes(
                            "viewed"
                        ) ||
                        text.includes(
                            "available"
                        )
                    ) {

                        span.textContent =
                            "🟢 Available";

                    }

                }
            );


        return;
    }


    // ========================================================
    // NOT AVAILABLE
    // ========================================================

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


        const statusElement =
            element.querySelector(
                ".paper-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "🔒 Locked";

        }
    }
}


// ============================================================
// SETUP ALL PAPERS
// ============================================================

async function setupPapers() {

    console.log(
        "Loading A/L model paper status..."
    );


    const studentData =
        await getStudentData();


    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const paperId =
            `paper${String(i).padStart(2, "0")}`;


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
        "A/L model paper statuses loaded."
    );
}


// ============================================================
// OPEN PAPER
// ============================================================

function openPaper(
    paperNumber
) {

    const number =
        String(paperNumber).padStart(2, "0");

    const paperId =
        `paper${number}`;


    const studentDataPromise =
        getStudentData();


    studentDataPromise.then(
        studentData => {

            // ----------------------------------------------
            // Check again before opening
            // ----------------------------------------------

            if (
                hasViewedPaper(
                    studentData,
                    paperId
                )
            ) {

                alert(
                    `Model Paper ${number} has already been viewed.`
                );

                return;
            }


            if (
                studentData &&
                !hasPaperAccess(
                    studentData,
                    paperId
                )
            ) {

                alert(
                    "This paper is not available."
                );

                return;
            }


            // ----------------------------------------------
            // Store student ID
            // ----------------------------------------------

            if (studentId) {

                sessionStorage.setItem(
                    "studentId",
                    studentId
                );

            }


            // ----------------------------------------------
            // Open viewer
            // ----------------------------------------------

            const url =
                `viewer.html?` +
                `paper=${encodeURIComponent(
                    paperId
                )}` +
                `&id=${encodeURIComponent(
                    studentId || ""
                )}` +
                `&type=al-model`;


            console.log(
                "Opening model paper:",
                url
            );


            window.location.href =
                url;

        }
    );
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
