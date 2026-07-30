// Auto Logout After 15 Minutes of Inactivity

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

let logoutTimer;

function logout() {

    alert("Your session has expired due to inactivity.");

    // Clear login session
    sessionStorage.clear();

    // Go to login page
    window.location.replace("index.html");
}

function resetTimer() {

    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(logout, TIMEOUT);
}

// Reset timer on user activity
[
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
    "touchstart"
].forEach(event => {
    document.addEventListener(event, resetTimer);
});

// Start timer
resetTimer();
