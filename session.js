// Auto Logout After 15 Minutes of Inactivity

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

let logoutTimer;

function resetTimer() {

    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(() => {

        alert("Your session has expired due to inactivity.");

        window.location.href = "index.html";

    }, TIMEOUT);

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
