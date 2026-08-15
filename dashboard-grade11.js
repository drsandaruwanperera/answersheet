// ==========================
// Firebase
// ==========================

import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


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
// Display Student ID
// ==========================

const studentIdElement =
    document.getElementById(
        "studentId"
    );

if (studentIdElement) {

    studentIdElement.textContent =
        studentId || "";

}


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
                    Date.now(),

                grade:
                    String(
                        studentGrade || "11"
                    ),

                studentType:
                    "grade11"
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
// Update every 30 seconds
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
// 5 minutes inactive
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

            if (
                !confirm(
                    "Are you sure you want to sign out?"
                )
            ) {

                return;

            }


            clearInterval(
                heartbeat
            );

            clearInterval(
                idleChecker
            );


            // ==========================
            // Mark Student Offline
            // ==========================

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
                        "Failed to update logout status:",
                        error
                    );

                }

            }


            // ==========================
            // Clear Session
            // ==========================

            sessionStorage.removeItem(
                "loggedIn"
            );

            sessionStorage.removeItem(
                "studentId"
            );

            sessionStorage.removeItem(
                "studentGrade"
            );


            // ==========================
            // Redirect
            // ==========================

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
    "✅ Grade 11 Dashboard Loaded"
);

console.log(
    "🟢 Grade 11 Live Tracking Active:",
    studentId
);
