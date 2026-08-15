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


// ==========================
// Firebase Live Tracking
// ==========================

import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


// ==========================
// Student Reference
// ==========================

let studentRef = null;

if (studentId) {

    studentRef =
        doc(
            db,
            "students",
            studentId
        );

}


// ==========================
// Update Last Active
// ==========================

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


// ==========================
// Initial Active Status
// ==========================

updateLastActive();


// ==========================
// Heartbeat
// ==========================
//
// Update every 30 seconds.
//

const heartbeat =
    setInterval(
        updateLastActive,
        30000
    );


// ==========================
// Activity Tracking
// ==========================

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


// ==========================
// Automatic Logout
// ==========================
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


// ==========================
// Tab Visibility
// ==========================

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


// ==========================
// Logout
// ==========================

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


            // Mark inactive
            //
            // Use 0 so Admin immediately
            // considers the student offline.

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


// ==========================
// Console
// ==========================

console.log(
    "✅ Student dashboard live tracking active:",
    {
        studentId,
        grade: studentGrade
    }
);
