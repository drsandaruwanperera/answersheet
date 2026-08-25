// =====================================================
// GRADE 10 STUDENT DASHBOARD
// =====================================================


// =====================================================
// CHECK LOGIN
// =====================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =====================================================
// STUDENT INFORMATION
// =====================================================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


const studentGrade =
    sessionStorage.getItem(
        "studentGrade"
    );


// =====================================================
// SHOW STUDENT ID
// =====================================================

const studentIdElement =
    document.getElementById(
        "studentId"
    );


if (studentIdElement) {

    studentIdElement.textContent =
        studentId || "Unknown";

}


// =====================================================
// FIREBASE
// =====================================================

import {
    db,
    doc,
    updateDoc,
    getDoc
} from "./firebase.js";


// =====================================================
// STUDENT REFERENCE
// =====================================================

let studentRef = null;


if (studentId) {

    studentRef =
        doc(
            db,
            "students",
            studentId
        );

}


// =====================================================
// UPDATE LAST ACTIVE
// =====================================================

async function updateLastActive() {

    if (!studentRef) {

        return;

    }


    try {

        await updateDoc(
            studentRef,
            {
                lastActiveAt:
                    Date.now()
            }
        );

    }
    catch (error) {

        console.error(
            "Failed to update active status:",
            error
        );

    }

}


// =====================================================
// SHOW ELEMENT
// =====================================================

function showElement(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        console.warn(
            "Element not found:",
            elementId
        );

        return;

    }


    element.style.display =
        "";

}


// =====================================================
// HIDE ELEMENT
// =====================================================

function hideElement(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        console.warn(
            "Element not found:",
            elementId
        );

        return;

    }


    element.style.display =
        "none";

}


// =====================================================
// LOAD PAPER SETTINGS
// =====================================================

async function loadPaperSettings() {

    console.log(
        "===================================="
    );

    console.log(
        "📚 Loading Grade 10 Paper Settings..."
    );


    try {

        // -------------------------------------------------
        // FIREBASE DOCUMENT
        // -------------------------------------------------

        const settingsRef =
            doc(
                db,
                "paperSettings",
                "grade10"
            );


        const settingsSnapshot =
            await getDoc(
                settingsRef
            );


        // -------------------------------------------------
        // DOCUMENT DOES NOT EXIST
        // -------------------------------------------------

        if (
            !settingsSnapshot.exists()
        ) {

            console.warn(
                "⚠️ paperSettings/grade10 does not exist."
            );


            /*
             * If there is no Firebase document,
             * show both buttons.
             */

            showElement(
                "modelPapersCard"
            );


            showElement(
                "pastPapersCard"
            );


            return;

        }


        // -------------------------------------------------
        // GET DATA
        // -------------------------------------------------

        const settings =
            settingsSnapshot.data();


        console.log(
            "🔥 Firebase Grade 10 Settings:",
            settings
        );


        // =================================================
        // MODEL PAPERS
        // =================================================
        //
        // ONLY Boolean true = SHOW
        //
        // false = HIDE
        // undefined = HIDE
        // "true" = HIDE
        // "false" = HIDE
        //
        // This prevents accidental display.
        // =================================================

        const modelPapersEnabled =
            settings.modelPapersEnabled === true;


        console.log(
            "Model Papers:",
            modelPapersEnabled
                ? "🟢 VISIBLE"
                : "🔴 HIDDEN"
        );


        if (
            modelPapersEnabled
        ) {

            showElement(
                "modelPapersCard"
            );

        }
        else {

            hideElement(
                "modelPapersCard"
            );

        }


        // =================================================
        // PAST PAPERS
        // =================================================
        //
        // ONLY Boolean true = SHOW
        //
        // false = HIDE
        // undefined = HIDE
        // "true" = HIDE
        // "false" = HIDE
        // =================================================

        const pastPapersEnabled =
            settings.pastPapersEnabled === true;


        console.log(
            "Past Papers:",
            pastPapersEnabled
                ? "🟢 VISIBLE"
                : "🔴 HIDDEN"
        );


        if (
            pastPapersEnabled
        ) {

            showElement(
                "pastPapersCard"
            );

        }
        else {

            hideElement(
                "pastPapersCard"
            );

        }


        // =================================================
        // FINAL STATUS
        // =================================================

        console.log(
            "------------------------------------"
        );

        console.log(
            "Model Papers Card:",
            document.getElementById(
                "modelPapersCard"
            )
                ? "FOUND"
                : "NOT FOUND"
        );

        console.log(
            "Past Papers Card:",
            document.getElementById(
                "pastPapersCard"
            )
                ? "FOUND"
                : "NOT FOUND"
        );

        console.log(
            "===================================="
        );

    }
    catch (error) {

        console.error(
            "❌ Failed to load paper settings:",
            error
        );


        /*
         * IMPORTANT:
         *
         * If Firebase fails, we do NOT automatically
         * enable hidden buttons.
         *
         * This prevents an admin-disabled paper
         * from accidentally becoming visible.
         */


        hideElement(
            "modelPapersCard"
        );


        hideElement(
            "pastPapersCard"
        );

    }

}


// =====================================================
// INITIAL ACTIVE STATUS
// =====================================================

updateLastActive();


// =====================================================
// INITIAL PAPER SETTINGS
// =====================================================

loadPaperSettings();


// =====================================================
// HEARTBEAT
// =====================================================

const heartbeat =
    setInterval(
        updateLastActive,
        30000
    );


// =====================================================
// ACTIVITY TRACKING
// =====================================================

let lastActivity =
    Date.now();


function markActivity() {

    lastActivity =
        Date.now();


    updateLastActive();

}


[
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart"
].forEach(
    eventName => {

        document.addEventListener(
            eventName,
            markActivity,
            {
                passive: true
            }
        );

    }
);


// =====================================================
// AUTOMATIC LOGOUT
// =====================================================

const IDLE_LIMIT =
    5 * 60 * 1000;


const idleChecker =
    setInterval(
        () => {

            const idleTime =
                Date.now() -
                lastActivity;


            if (
                idleTime >=
                IDLE_LIMIT
            ) {

                clearInterval(
                    heartbeat
                );


                clearInterval(
                    idleChecker
                );


                sessionStorage.removeItem(
                    "loggedIn"
                );


                sessionStorage.removeItem(
                    "studentId"
                );


                sessionStorage.removeItem(
                    "studentGrade"
                );


                alert(
                    "You have been logged out because you were inactive for 5 minutes."
                );


                window.location.replace(
                    "index.html"
                );

            }

        },
        10000
    );


// =====================================================
// TAB VISIBILITY
// =====================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            lastActivity =
                Date.now();


            updateLastActive();


            // Reload admin settings
            // whenever student returns
            // to the dashboard.

            loadPaperSettings();

        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            clearInterval(
                heartbeat
            );


            clearInterval(
                idleChecker
            );


            // ---------------------------------------------
            // MARK STUDENT OFFLINE
            // ---------------------------------------------

            if (studentRef) {

                try {

                    await updateDoc(
                        studentRef,
                        {
                            lastActiveAt:
                                0
                        }
                    );

                }
                catch (error) {

                    console.error(
                        "Logout status update failed:",
                        error
                    );

                }

            }


            // ---------------------------------------------
            // CLEAR SESSION
            // ---------------------------------------------

            sessionStorage.removeItem(
                "loggedIn"
            );


            sessionStorage.removeItem(
                "studentId"
            );


            sessionStorage.removeItem(
                "studentGrade"
            );


            // ---------------------------------------------
            // REDIRECT
            // ---------------------------------------------

            window.location.replace(
                "index.html"
            );

        }
    );

}


// =====================================================
// CONSOLE INFORMATION
// =====================================================

console.log(
    "===================================="
);

console.log(
    "✅ GRADE 10 STUDENT DASHBOARD LOADED"
);

console.log(
    "Student ID:",
    studentId
);

console.log(
    "Student Grade:",
    studentGrade
);

console.log(
    "Firebase Paper Visibility: ACTIVE"
);

console.log(
    "===================================="
);
