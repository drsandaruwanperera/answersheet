import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


// ==========================
// Settings
// ==========================

const HEARTBEAT =
    30000; // 30 seconds

const IDLE_LIMIT =
    5 * 60 * 1000; // 5 minutes


// ==========================
// Session
// ==========================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );

const loggedIn =
    sessionStorage.getItem(
        "loggedIn"
    ) === "true";


// ==========================
// Stop If Not Logged In
// ==========================

if (
    !loggedIn ||
    !studentId
) {

    console.log(
        "Student presence not started."
    );

}
else {

    const studentRef =
        doc(
            db,
            "students",
            studentId
        );


    // ==========================
    // Update Last Active
    // ==========================

    async function updateLastActive() {

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
                "Last active update failed:",
                error
            );

        }

    }


    // ==========================
    // Initial
    // ==========================

    updateLastActive();


    // ==========================
    // Heartbeat
    // ==========================

    const heartbeat =
        setInterval(
            updateLastActive,
            HEARTBEAT
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


                    window.location.href =
                        "index.html";

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


    console.log(
        "✅ Student live tracking started"
    );

}
