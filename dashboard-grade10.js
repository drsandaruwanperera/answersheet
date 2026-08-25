// ==========================
// Check Login
// ==========================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// ==========================
// Get Student ID
// ==========================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


// ==========================
// Get Student Grade
// ==========================

const studentGrade =
    sessionStorage.getItem(
        "studentGrade"
    );


// ==========================
// Show Student ID
// ==========================

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
    getDoc,
    onSnapshot
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
// PAPER SETTINGS REFERENCE
// =====================================================

const paperSettingsRef =
    doc(
        db,
        "paperSettings",
        "grade10"
    );


// =====================================================
// GRADE 10 DASHBOARD RESOURCE CONTROL
// =====================================================
//
// Firebase:
//
// paperSettings
//     └── grade10
//
//          dashboard_model: true / false
//          dashboard_past: true / false
//
// If false → card hidden
// If true → card shown
//
// If field does not exist → card shown
// =====================================================


// ==========================
// Model Papers Card
// ==========================

const modelPapersCard =
    document.querySelector(
        '[data-resource="grade10-model"]'
    );


// ==========================
// Past Papers Card
// ==========================

const pastPapersCard =
    document.querySelector(
        '[data-resource="grade10-past"]'
    );


// =====================================================
// APPLY DASHBOARD SETTINGS
// =====================================================

function applyDashboardSettings(
    settings = {}
) {


    // =================================================
    // MODEL PAPERS
    // =================================================

    if (modelPapersCard) {

        const modelEnabled =
            settings.dashboard_model !== false;


        modelPapersCard.style.display =
            modelEnabled
                ? ""
                : "none";

    }


    // =================================================
    // PAST PAPERS
    // =================================================

    if (pastPapersCard) {

        const pastEnabled =
            settings.dashboard_past !== false;


        pastPapersCard.style.display =
            pastEnabled
                ? ""
                : "none";

    }


    console.log(
        "Grade 10 dashboard settings applied:",
        {
            modelPapers:
                settings.dashboard_model !== false,

            pastPapers:
                settings.dashboard_past !== false
        }
    );

}


// =====================================================
// LOAD DASHBOARD SETTINGS
// =====================================================

async function loadDashboardSettings() {

    try {

        const snapshot =
            await getDoc(
                paperSettingsRef
            );


        if (
            !snapshot.exists()
        ) {

            console.log(
                "No Grade 10 paper settings found. Using default settings."
            );


            applyDashboardSettings(
                {}
            );


            return;

        }


        const settings =
            snapshot.data();


        applyDashboardSettings(
            settings
        );

    }
    catch (error) {

        console.error(
            "Failed to load Grade 10 dashboard settings:",
            error
        );


        // If Firebase settings cannot be loaded,
        // keep cards visible.

        applyDashboardSettings(
            {}
        );

    }

}


// =====================================================
// REAL-TIME DASHBOARD SETTINGS
// =====================================================
//
// This means:
//
// Admin changes
//     ↓
// Firebase
//     ↓
// Student Dashboard
//     ↓
// Card updates automatically
//
// No manual page refresh required.
// =====================================================

function startDashboardSettingsListener() {

    try {

        onSnapshot(
            paperSettingsRef,

            snapshot => {

                if (
                    snapshot.exists()
                ) {

                    const settings =
                        snapshot.data();


                    applyDashboardSettings(
                        settings
                    );

                }
                else {

                    applyDashboardSettings(
                        {}
                    );

                }

            },

            error => {

                console.error(
                    "Grade 10 dashboard realtime settings error:",
                    error
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Failed to start dashboard settings listener:",
            error
        );

    }

}


// =====================================================
// START DASHBOARD SETTINGS
// =====================================================

loadDashboardSettings();

startDashboardSettingsListener();


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
// INITIAL ACTIVE STATUS
// =====================================================

updateLastActive();


// =====================================================
// HEARTBEAT
// =====================================================
//
// Update every 30 seconds.
//

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
//
// 5 minutes without activity.
//

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


            // =========================================
            // Mark inactive
            // =========================================

            if (studentRef) {

                try {

                    await updateDoc(
                        studentRef,
                        {
                            lastActiveAt: 0
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


            // =========================================
            // Clear session
            // =========================================

            sessionStorage.removeItem(
                "loggedIn"
            );

            sessionStorage.removeItem(
                "studentId"
            );

            sessionStorage.removeItem(
                "studentGrade"
            );


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
    "================================="
);

console.log(
    "✅ Grade 10 Student Dashboard Loaded"
);

console.log(
    "Student ID:",
    studentId
);

console.log(
    "Grade:",
    studentGrade
);

console.log(
    "Dashboard Resource Control: ACTIVE"
);

console.log(
    "================================="
);
