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
// Logout
// ==========================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

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
