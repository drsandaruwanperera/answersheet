// ==========================
// Admin Role Protection
// ==========================

function applyAdminPermissions() {

    const isAdmin =
        sessionStorage.getItem("adminLoggedIn") === "true";

    if (!isAdmin) {
        return;
    }

    const role =
        sessionStorage.getItem("adminRole") || "limited";

    const fullAdminItems =
        document.querySelectorAll(".full-admin-only");

    if (role !== "full") {

        fullAdminItems.forEach(item => {
            item.style.display = "none";
        });

    }

}


// ==========================
// Page Protection
// ==========================

function protectAdminPage() {

    const isAdmin =
        sessionStorage.getItem("adminLoggedIn") === "true";

    if (!isAdmin) {

        window.location.replace(
            "admin-login.html"
        );

        return false;
    }

    return true;
}


// ==========================
// Full Admin Only Pages
// ==========================

function protectFullAdminPage() {

    if (!protectAdminPage()) {
        return;
    }

    const role =
        sessionStorage.getItem("adminRole");

    if (role !== "full") {

        alert(
            "You do not have permission to access this page."
        );

        window.location.replace(
            "admin.html"
        );

    }

}


// ==========================
// Apply Permissions
// ==========================

applyAdminPermissions();


// ==========================
// Session Timeout
// ==========================

const TIMEOUT =
    15 * 60 * 1000;

let logoutTimer;

function logout() {

    alert(
        "Your session has expired due to inactivity."
    );

    sessionStorage.clear();

    window.location.replace(
        "admin-login.html"
    );

}

function resetTimer() {

    clearTimeout(logoutTimer);

    logoutTimer =
        setTimeout(
            logout,
            TIMEOUT
        );

}

[
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
    "touchstart"
].forEach(event => {

    document.addEventListener(
        event,
        resetTimer
    );

});

resetTimer();
