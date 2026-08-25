import {
    db,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    limit
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const loginBtn =
    document.getElementById("loginBtn");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const msg =
    document.getElementById("msg");


// =====================================================
// MESSAGE
// =====================================================

function showMessage(message, type = "error") {

    if (!msg) return;

    msg.textContent = message;

    msg.style.color =
        type === "success"
            ? "#16a34a"
            : "#dc2626";
}


// =====================================================
// NORMALIZE ROLE
// =====================================================

function normalizeRole(role) {

    const value =
        String(role || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, "");

    // Your Firebase uses role = "full"
    if (
        value === "full" ||
        value === "superadmin" ||
        value === "superadministrator"
    ) {

        return "superadmin";
    }

    // Your Firebase limited admin
    return "limited";
}


// =====================================================
// FIND ADMIN
// =====================================================

async function findAdmin(username) {

    // -------------------------------------------------
    // FIRST: try document ID
    // -------------------------------------------------

    try {

        const adminRef =
            doc(
                db,
                "admins",
                username
            );

        const adminSnap =
            await getDoc(adminRef);

        if (adminSnap.exists()) {

            return {
                id: adminSnap.id,
                data: adminSnap.data()
            };
        }

    }
    catch (error) {

        console.warn(
            "Document ID lookup error:",
            error
        );
    }


    // -------------------------------------------------
    // SECOND: search username field
    // -------------------------------------------------

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
            await getDocs(adminQuery);

        if (!snapshot.empty) {

            const adminDoc =
                snapshot.docs[0];

            return {
                id: adminDoc.id,
                data: adminDoc.data()
            };
        }

    }
    catch (error) {

        console.error(
            "Username query error:",
            error
        );

        throw error;
    }


    return null;
}


// =====================================================
// LOGIN
// =====================================================

async function login() {

    const username =
        usernameInput
            ? usernameInput.value.trim()
            : "";

    const password =
        passwordInput
            ? passwordInput.value.trim()
            : "";


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

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


    // -------------------------------------------------
    // BUTTON
    // -------------------------------------------------

    if (loginBtn) {

        loginBtn.disabled = true;

        loginBtn.innerHTML =
            `
            <span>Signing In...</span>
            `;
    }


    showMessage("");


    try {

        console.log(
            "================================"
        );

        console.log(
            "ADMIN LOGIN"
        );

        console.log(
            "Username:",
            username
        );


        // -------------------------------------------------
        // FIND ADMIN
        // -------------------------------------------------

        const admin =
            await findAdmin(
                username
            );


        if (!admin) {

            console.error(
                "Admin document not found."
            );

            showMessage(
                "Invalid username or password."
            );

            return;
        }


        const data =
            admin.data;


        console.log(
            "Admin document:",
            admin.id
        );

        console.log(
            "Database username:",
            data.username
        );

        console.log(
            "Database role:",
            data.role
        );


        // -------------------------------------------------
        // USERNAME
        // -------------------------------------------------

        const databaseUsername =
            String(
                data.username ||
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


        // -------------------------------------------------
        // PASSWORD
        // -------------------------------------------------

        const databasePassword =
            String(
                data.password ||
                ""
            )
            .trim();


        if (
            databasePassword !==
            password
        ) {

            console.error(
                "Password mismatch."
            );

            showMessage(
                "Invalid username or password."
            );

            return;
        }


        // -------------------------------------------------
        // ROLE
        // -------------------------------------------------

        const normalizedRole =
            normalizeRole(
                data.role
            );


        console.log(
            "Normalized role:",
            normalizedRole
        );


        // -------------------------------------------------
        // SAVE SESSION
        // -------------------------------------------------

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


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        console.log(
            "LOGIN SUCCESS"
        );

        console.log(
            "Username:",
            username
        );

        console.log(
            "Role:",
            normalizedRole
        );

        console.log(
            "Super Admin:",
            normalizedRole === "superadmin"
        );

        console.log(
            "================================"
        );


        showMessage(
            "Login successful. Redirecting...",
            "success"
        );


        // -------------------------------------------------
        // REDIRECT
        // -------------------------------------------------

        setTimeout(
            () => {

                window.location.replace(
                    "admin.html"
                );

            },
            300
        );

    }
    catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );


        showMessage(
            "Login failed: " +
            error.message
        );

    }
    finally {

        if (loginBtn) {

            loginBtn.disabled = false;

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

        if (!input) return;

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    login();
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


// =====================================================
// START
// =====================================================

console.log(
    "✅ Admin Login JS Loaded"
);
