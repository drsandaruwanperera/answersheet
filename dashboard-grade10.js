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
// STUDENT FIREBASE REFERENCE
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
        return;
    }


    element.style.display =
        "none";

}


// =====================================================
// LOAD GRADE 10 PAPER SETTINGS
// =====================================================

async function loadPaperSettings() {

    try {

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


        // =================================================
        // IF DOCUMENT DOES NOT EXIST
        // =================================================

        if (
            !settingsSnapshot.exists()
        ) {

            console.warn(
                "Grade 10 paperSettings document not found."
            );


            // Default behaviour:
            // Show both buttons.

            showElement(
                "modelPapersCard"
            );

            showElement(
                "pastPapersCard"
            );


            return;

        }


        const settings =
            settingsSnapshot.data();


        // =================================================
        // MODEL PAPERS
        // =================================================

        const modelPapersEnabled =
            settings.modelPapersEnabled !== false;


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

        const pastPapersEnabled =
            settings.pastPapersEnabled !== false;


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
        // CONSOLE
        // =================================================

        console.log(
            "Grade 10 Paper Visibility:",
            {
                modelPapers:
                    modelPapersEnabled,

                pastPapers:
                    pastPapersEnabled
            }
        );

    }
    catch (error) {

        console.error(
            "Paper settings load error:",
            error
        );


        // Firebase error:
        // keep both buttons visible.

        showElement(
            "modelPapersCard"
        );

        showElement(
            "pastPapersCard"
        );

    }

}


// =====================================================
// INITIAL ACTIVE STATUS
// =====================================================

updateLastActive();


// =====================================================
// LOAD PAPER SETTINGS
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


            // Reload Firebase settings
            // when student comes back.

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
// CONSOLE
// =====================================================

console.log(
    "===================================="
);

console.log(
    "✅ GRADE 10 STUDENT DASHBOARD"
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
