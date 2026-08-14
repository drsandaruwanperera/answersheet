import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// ==========================
// Check Student Login
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

const params =
    new URLSearchParams(
        window.location.search
    );

const studentId =
    params.get("id");


// ==========================
// Display Student ID
// ==========================

const studentIdElement =
    document.getElementById("studentId");

if (studentIdElement) {

    studentIdElement.textContent =
        studentId;

}


// ==========================
// Active Status
// ==========================

async function updateActiveStatus() {

    if (!studentId) {
        return;
    }

    try {

        await updateDoc(
            doc(
                db,
                "students",
                studentId
            ),
            {
                lastActiveAt:
                    Date.now()
            }
        );

    }
    catch (error) {

        console.error(
            "Active status update failed:",
            error
        );

    }

}


// ==========================
// Start Active Status
// ==========================

updateActiveStatus();

setInterval(
    updateActiveStatus,
    20000
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

            try {

                await updateDoc(
                    doc(
                        db,
                        "students",
                        studentId
                    ),
                    {
                        lastActiveAt: 0
                    }
                );

            }
            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

            sessionStorage.clear();

            window.location.href =
                "index.html";

        }
    );

}
