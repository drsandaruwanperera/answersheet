// ==========================
// Session Timeout
// ==========================

const TIMEOUT =
    15 * 60 * 1000; // 15 minutes

let logoutTimer;


// ==========================
// Check Current Session
// ==========================

const isAdmin =
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";

const isStudent =
    sessionStorage.getItem(
        "loggedIn"
    ) === "true";


// ==========================
// Logout
// ==========================

function logout() {

    alert(
        "Your session has expired due to inactivity."
    );


    // Clear session

    sessionStorage.clear();


    // Admin → Admin Login

    if (isAdmin) {

        window.location.replace(
            "admin-login.html"
        );

        return;

    }


    // Student → Student Login

    if (isStudent) {

        window.location.replace(
            "index.html"
        );

        return;

    }


    // Default

    window.location.replace(
        "index.html"
    );

}


// ==========================
// Reset Timer
// ==========================

function resetTimer() {

    clearTimeout(
        logoutTimer
    );


    logoutTimer =
        setTimeout(
            logout,
            TIMEOUT
        );

}


// ==========================
// User Activity
// ==========================

[
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
    "touchstart"
].forEach(
    event => {

        document.addEventListener(
            event,
            resetTimer
        );

    }
);


// ==========================
// Start Timer
// ==========================

resetTimer();
