// =====================================================
// IMPORT FIREBASE
// =====================================================

import {
    db,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    limit
} from "./firebase.js";


// =====================================================
// START
// =====================================================

console.log(
    "======================================"
);

console.log(
    "🔐 ADMIN LOGIN SYSTEM STARTED"
);

console.log(
    "======================================"
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
// ROLE NORMALIZER
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


    if (
        value === "superadmin" ||
        value === "superadministrator" ||
        value === "full"
    ) {

        return "superadmin";

    }


    return "limited";

}


// =====================================================
// FIND ADMIN
// =====================================================

async function findAdmin(
    username
) {

    // =================================================
    // METHOD 1
    // DOCUMENT ID
    // =================================================

    try {

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


        if (
            adminSnap.exists()
        ) {

            console.log(
                "✅ Admin found by document ID"
            );


            return {

                id:
                    adminSnap.id,

                data:
                    adminSnap.data()

            };

        }

    }
    catch (error) {

        console.warn(
            "Document ID lookup failed:",
            error
        );

    }


    // =================================================
    // METHOD 2
    // USERNAME FIELD
    // =================================================

    try {

        const adminsRef =
            collection(
                db,
                "admins"
            );


        const adminQuery =
            query(
                adminsRef,
                where(
                    "username",
                    "==",
                    username
                ),
                limit(1)
            );


        const snapshot =
            await getDocs(
                adminQuery
            );


        if (
            !snapshot.empty
        ) {

            const adminDoc =
                snapshot.docs[0];


            console.log(
                "✅ Admin found by username field"
            );


            return {

                id:
                    adminDoc.id,

                data:
                    adminDoc.data()

            };

        }

    }
    catch (error) {

        console.error(
            "Username field lookup failed:",
            error
        );

    }


    // =================================================
    // NOT FOUND
    // =================================================

    return null;

}


// =====================================================
// LOGIN
// =====================================================

async function loginAdmin() {

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


        usernameInput?.focus();

        return;

    }


    if (!password) {

        showMessage(
            "Please enter password."
        );


        passwordInput?.focus();

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
            "--------------------------------------"
        );


        console.log(
            "Attempting admin login"
        );


        console.log(
            "Username:",
            username
        );


        // =================================================
        // FIND ADMIN
        // =================================================

        const admin =
            await findAdmin(
                username
            );


        if (!admin) {

            console.error(
                "❌ ADMIN NOT FOUND"
            );


            showMessage(
                "Invalid username or password."
            );


            return;

        }


        const adminData =
            admin.data;


        console.log(
            "Admin document:",
            admin.id
        );


        console.log(
            "Admin username:",
            adminData.username
        );


        console.log(
            "Admin role:",
            adminData.role
        );


        // =================================================
        // USERNAME CHECK
        // =================================================

        const storedUsername =
            String(
                adminData.username ||
                admin.id ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            storedUsername !==
            username.toLowerCase()
        ) {

            console.error(
                "❌ Username mismatch"
            );


            showMessage(
                "Invalid username or password."
            );


            return;

        }


        // =================================================
        // PASSWORD
        // =================================================

        const storedPassword =
            String(
                adminData.password ??
                ""
            )
                .trim();


        if (
            storedPassword !==
            password
        ) {

            console.error(
                "❌ Password mismatch"
            );


            showMessage(
                "Invalid username or password."
            );


            return;

        }


        // =================================================
        // ROLE
        // =================================================

        const role =
            normalizeRole(
                adminData.role
            );


        // =================================================
        // SESSION
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
            role
        );


        // =================================================
        // SUCCESS
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
            "Role:",
            role
        );


        console.log(
            "Super Admin:",
            role === "superadmin"
        );


        console.log(
            "======================================"
        );


        showMessage(
            "Login successful. Redirecting...",
            "success"
        );


        // =================================================
        // REDIRECT
        // =================================================

        setTimeout(
            () => {

                window.location.href =
                    "admin.html";

            },
            500
        );

    }

    catch (error) {

        console.error(
            "======================================"
        );


        console.error(
            "❌ ADMIN LOGIN ERROR"
        );


        console.error(
            error
        );


        console.error(
            "Message:",
            error.message
        );


        console.error(
            "======================================"
        );


        showMessage(
            "Login failed: " +
            error.message
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
// BUTTON
// =====================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        loginAdmin
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

                    loginAdmin();

                }

            }
        );

    }
);


// =====================================================
// CLEAR MESSAGE
// =====================================================

if (usernameInput) {

    usernameInput.addEventListener(
        "input",
        () => {

            if (msg) {
                msg.textContent = "";
            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            if (msg) {
                msg.textContent = "";
            }

        }
    );

}
