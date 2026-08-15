// ==========================
// Check Login
// ==========================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.href =
        "index.html";

}


// ==========================
// Get Student ID
// ==========================

const studentId =
    sessionStorage.getItem(
        "studentId"
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

            if (
                !confirm(
                    "Are you sure you want to sign out?"
                )
            ) {

                return;

            }

            sessionStorage.removeItem(
                "loggedIn"
            );

            sessionStorage.removeItem(
                "studentId"
            );

            window.location.href =
                "index.html";

        }
    );

}

console.log(
    "✅ Grade 11 Dashboard Loaded"
);
