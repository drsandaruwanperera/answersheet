// ==========================================
// ADMIN LOGIN
// ==========================================

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// ==========================================
// Elements
// ==========================================

const loginBtn =
    document.getElementById("loginBtn");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const msg =
    document.getElementById("msg");


// ==========================================
// Check Elements
// ==========================================

if (!loginBtn) {

    console.error(
        "❌ loginBtn not found in admin-login.html"
    );

}

if (!usernameInput) {

    console.error(
        "❌ username input not found"
    );

}

if (!passwordInput) {

    console.error(
        "❌ password input not found"
    );

}


// ==========================================
// Show Message
// ==========================================

function showMessage(message, type = "error") {

    if (!msg) {

        // If #msg doesn't exist,
        // use alert as fallback.

        alert(message);

        return;

    }

    msg.textContent = message;

    msg.className =
        "login-message " + type;

}


// ==========================================
// Clear Message
// ==========================================

function clearMessage() {

    if (!msg) {
        return;
    }

    msg.textContent = "";

    msg.className =
        "login-message";

}


// ==========================================
// Login Function
// ==========================================

async function loginAdmin() {

    clearMessage();


    // ======================================
    // Get Values
    // ======================================

    const username =
        usernameInput?.value.trim() || "";

    const password =
        passwordInput?.value.trim() || "";


    // ======================================
    // Validation
    // ======================================

    if (!username) {

        showMessage(
            "Please enter your username."
        );

        usernameInput?.focus();

        return;

    }


    if (!password) {

        showMessage(
            "Please enter your password."
        );

        passwordInput?.focus();

        return;

    }


    // ======================================
    // Loading State
    // ======================================

    const originalText =
        loginBtn.textContent;

    loginBtn.disabled = true;

    loginBtn.textContent =
        "Signing in...";


    try {

        console.log(
            "🔐 Checking admin login..."
        );


        // ==================================
        // Get Admin Accounts
        // ==================================

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "admins"
                )
            );


        console.log(
            "Admin accounts found:",
            snapshot.size
        );


        let account = null;


        // ==================================
        // Find Username
        // ==================================

        snapshot.forEach(
            adminDoc => {

                const data =
                    adminDoc.data();


                console.log(
                    "Checking admin:",
                    data.username
                );


                if (
                    String(data.username || "")
                        .trim()
                        .toLowerCase()
                    ===
                    username.toLowerCase()
                ) {

                    account = {
                        id: adminDoc.id,
                        ...data
                    };

                }

            }
        );


        // ==================================
        // Username Not Found
        // ==================================

        if (!account) {

            showMessage(
                "Invalid username or password."
            );

            console.warn(
                "❌ Admin username not found:",
                username
            );

            return;

        }


        // ==================================
        // Password Check
        // ==================================

        const savedPassword =
            String(
                account.password || ""
            ).trim();


        if (
            password !==
            savedPassword
        ) {

            showMessage(
                "Invalid username or password."
            );

            console.warn(
                "❌ Wrong admin password"
            );

            return;

        }


        // ==================================
        // Get Role
        // ==================================

        const role =
            account.role ||
            "limited";


        // ==================================
        // Save Session
        // ==================================

        sessionStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        sessionStorage.setItem(
            "adminRole",
            role
        );

        sessionStorage.setItem(
            "adminUsername",
            username
        );


        console.log(
            "✅ Admin login successful",
            {
                username,
                role
            }
        );


        // ==================================
        // Redirect
        // ==================================

        window.location.replace(
            "admin.html"
        );

    }

    catch (error) {

        console.error(
            "❌ Admin login error:",
            error
        );


        showMessage(
            "Login failed. Please check your Firebase connection."
        );

    }

    finally {

        loginBtn.disabled = false;

        loginBtn.textContent =
            originalText;

    }

}


// ==========================================
// Button Click
// ==========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        loginAdmin
    );

}


// ==========================================
// Enter Key Login
// ==========================================

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                loginAdmin();

            }

        }
    );

}


if (usernameInput) {

    usernameInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                loginAdmin();

            }

        }
    );

}


// ==========================================
// Already Logged In
// ==========================================

if (
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true"
) {

    console.log(
        "Admin already logged in."
    );

    // Uncomment this if you want
    // already logged-in admins to
    // automatically skip the login page.

    // window.location.replace("admin.html");

}


// ==========================================
// Console
// ==========================================

console.log(
    "✅ Admin Login JS Loaded"
);
