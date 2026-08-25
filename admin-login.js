import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ADMIN LOGIN
// =====================================================

console.log(
    "🔐 ADMIN LOGIN JS STARTED"
);


// =====================================================
// ELEMENTS
// =====================================================

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


const usernameInput =
    document.getElementById(
        "username"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const msg =
    document.getElementById(
        "msg"
    );


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type = "error"
) {

    if (!msg) {
        return;
    }


    msg.textContent =
        message;


    msg.style.color =
        type === "success"
            ? "#16a34a"
            : "#dc2626";

}


// =====================================================
// NORMALIZE ROLE
// =====================================================

function normalizeRole(
    role
) {

    const value =
        String(
            role || ""
        )
            .trim()
            .toLowerCase()
            .replace(
                /[\s_-]+/g,
                ""
            );


    // ---------------------------------------------
    // SUPER ADMIN
    // ---------------------------------------------

    if (
        value === "superadmin" ||
        value === "superadministrator" ||
        value === "full"
    ) {

        return "superadmin";

    }


    // ---------------------------------------------
    // LIMITED ADMIN
    // ---------------------------------------------

    if (
        value === "limited" ||
        value === "admin" ||
        value === "administrator" ||
        value === "normaladmin"
    ) {

        return "limited";

    }


    // ---------------------------------------------
    // DEFAULT
    // ---------------------------------------------

    return "limited";

}


// =====================================================
// LOGIN
// =====================================================

async function login() {

    const username =
        usernameInput
            ? usernameInput.value
                .trim()
            : "";


    const password =
        passwordInput
            ? passwordInput.value
                .trim()
            : "";


    showMessage(
        ""
    );


    // =================================================
    // VALIDATION
    // =================================================

    if (!username) {

        showMessage(
            "Please enter username."
        );


        if (usernameInput) {
            usernameInput.focus();
        }


        return;

    }


    if (!password) {

        showMessage(
            "Please enter password."
        );


        if (passwordInput) {
            passwordInput.focus();
        }


        return;

    }


    // =================================================
    // BUTTON
    // =================================================

    if (loginBtn) {

        loginBtn.disabled =
            true;


        loginBtn.innerHTML =
            `
            <span>Signing In...</span>
            `;

    }


    try {

        console.log(
            "Checking admin:",
            username
        );


        // =================================================
        // ADMIN DOCUMENT
        // =================================================

        const adminRef =
            doc(
                db,
                "admins",
                username
            );


        const adminSnap =
            await getDoc(
                adminRef
            );


        // =================================================
        // NOT FOUND
        // =================================================

        if (
            !adminSnap.exists()
        ) {

            console.error(
                "Admin document not found:",
                username
            );


            showMessage(
                "Invalid username or password."
            );


            return;

        }


        // =================================================
        // DATA
        // =================================================

        const adminData =
            adminSnap.data();


        console.log(
            "Admin data loaded:",
            {
                username:
                    adminData.username,

                role:
                    adminData.role
            }
        );


        // =================================================
        // USERNAME
        // =================================================

        const databaseUsername =
            String(
                adminData.username ||
                adminSnap.id ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            databaseUsername !==
            username.toLowerCase()
        ) {

            showMessage(
                "Invalid username or password."
            );


            return;

        }


        // =================================================
        // PASSWORD
        // =================================================

        const databasePassword =
            String(
                adminData.password ||
                ""
            )
                .trim();


        if (
            databasePassword !==
            password
        ) {

            showMessage(
                "Invalid username or password."
            );


            return;

        }


        // =================================================
        // ROLE
        // =================================================

        const originalRole =
            String(
                adminData.role ||
                "limited"
            )
                .trim();


        const normalizedRole =
            normalizeRole(
                originalRole
            );


        // =================================================
        // SAVE SESSION
        // =================================================

        sessionStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        sessionStorage.setItem(
            "adminUsername",
            username
        );


        sessionStorage.setItem(
            "adminRole",
            normalizedRole
        );


        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "======================================"
        );


        console.log(
            "✅ ADMIN LOGIN SUCCESS"
        );


        console.log(
            "Username:",
            username
        );


        console.log(
            "Database Role:",
            originalRole
        );


        console.log(
            "Session Role:",
            normalizedRole
        );


        console.log(
            "Super Admin:",
            normalizedRole ===
            "superadmin"
        );


        console.log(
            "======================================"
        );


        // =================================================
        // SUCCESS
        // =================================================

        showMessage(
            "Login successful. Redirecting...",
            "success"
        );


        // =================================================
        // REDIRECT
        // =================================================

        setTimeout(
            () => {

                window.location.replace(
                    "admin.html"
                );

            },
            300
        );

    }

    catch (
        error
    ) {

        console.error(
            "❌ ADMIN LOGIN ERROR:",
            error
        );


        showMessage(
            "Login failed. Please try again."
        );

    }

    finally {

        if (loginBtn) {

            loginBtn.disabled =
                false;


            loginBtn.innerHTML =
                `
                <span>Sign In</span>
                <span>→</span>
                `;

        }

    }

}


// =====================================================
// LOGIN BUTTON
// =====================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        login
    );

}


// =====================================================
// ENTER KEY
// =====================================================

[
    usernameInput,
    passwordInput
].forEach(
    input => {

        if (!input) {
            return;
        }


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    login();

                }

            }
        );

    }
);


// =====================================================
// START
// =====================================================

console.log(
    "✅ Admin Login System Ready"
);
