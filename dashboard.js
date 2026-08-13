import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";

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

const params =
    new URLSearchParams(
        window.location.search
    );

const studentId =
    params.get("id");

// ==========================
// Display Student ID
// ==========================

document.getElementById(
    "studentId"
).textContent = studentId;

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

        console.log(
            "🟢 Student active:",
            studentId
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

// Immediately mark active
updateActiveStatus();

// Update every 20 seconds
setInterval(
    updateActiveStatus,
    20000
);

// Update when student returns to tab
document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            updateActiveStatus();

        }

    }
);

// Update when student interacts
window.addEventListener(
    "click",
    updateActiveStatus
);

// ==========================
// Sign Out
// ==========================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        async () => {

            if (
                !confirm(
                    "Are you sure you want to sign out?"
                )
            ) {

                return;

            }

            // Mark offline before logout
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
                    "Logout status update failed:",
                    error
                );

            }

            sessionStorage.clear();

            window.location.href =
                "index.html";

        }
    );

// ==========================
// Load Dashboard
// ==========================

async function loadDashboard() {

    if (!studentId) {

        alert(
            "Student ID not found."
        );

        return;

    }

    try {

        const ref =
            doc(
                db,
                "students",
                studentId
            );

        const snap =
            await getDoc(ref);

        if (!snap.exists()) {

            alert(
                "Student not found."
            );

            return;

        }

        const data =
            snap.data();

        console.log(
            "Student:",
            studentId
        );

        console.log(
            data
        );

        let viewed = 0;

        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const viewedField =
                "paper" +
                String(i).padStart(
                    2,
                    "0"
                ) +
                "Viewed";

            console.log(
                viewedField,
                data[viewedField]
            );

            if (
                data[viewedField] === true
            ) {

                viewed++;

            }

        }

        document.getElementById(
            "progressText"
        ).textContent =
            viewed +
            " / 10 Papers Viewed";

        document.getElementById(
            "progressFill"
        ).style.width =
            (viewed * 10) +
            "%";

    }
    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        alert(
            "Failed to load dashboard."
        );

    }

}

// ==========================
// Start Dashboard
// ==========================

loadDashboard();
