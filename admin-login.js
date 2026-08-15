import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =========================================
// ELEMENTS
// =========================================

const loginBtn =
    document.getElementById("loginBtn");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const msg =
    document.getElementById("msg");

const togglePassword =
    document.getElementById("togglePassword");


// =========================================
// SHOW MESSAGE
// =========================================

function showMessage(text) {

    if (!msg) {

        alert(text);

        return;

    }

    msg.textContent = text;

}


// =========================================
// CLEAR MESSAGE
// =========================================

function clearMessage() {

    if (msg) {

        msg.textContent = "";

    }

}


// =========================================
// TOGGLE PASSWORD
// =========================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

            }

            else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁️";

            }

        }
    );

}


// =========================================
// LOGIN
// =========================================

async function loginAdmin() {

    clearMessage();


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();


    // =====================================
    // VALIDATION
    // =====================================

    if (!username) {

        showMessage(
            "Please enter your username."
        );

        usernameInput.focus();

        return;

    }


    if (!password) {

        showMessage(
            "Please enter your password."
        );

        passwordInput.focus();

        return;

    }


    // =====================================
    // LOADING
    // =====================================

    loginBtn.disabled = true;

    loginBtn.innerHTML =
        "Signing in...";


    try {

        console.log(
            "🔐 Checking admin account..."
        );


        // =================================
        // GET ADMINS
        // =================================

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "admins"
                )
            );


        console.log(
            "Admin documents:",
            snapshot.size
        );


        let account = null;


        // =================================
        // FIND USERNAME
        // =================================

        snapshot.forEach(
            adminDoc => {

                const data =
                    adminDoc.data();


                const savedUsername =
                    String(
                        data.username || ""
                    )
                        .trim()
                        .toLowerCase();


                if (
                    savedUsername ===
                    username.toLowerCase()
                ) {

                    account = data;

                }

            }
        );


        // =================================
        // NOT FOUND
        // =================================

        if (!account) {

            showMessage(
                "Invalid username or password."
            );

            return;

        }


        // =================================
        // PASSWORD
        // =================================

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

            return;

        }


        // =================================
        // ROLE
        // =================================

        const role =
            account.role ||
            "admin";


        // =================================
        // SAVE SESSION
        // =================================

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
            "✅ Admin login successful"
        );


        // =================================
        // REDIRECT
        // =================================

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

        loginBtn.innerHTML =
            `
            <span>Sign In</span>
            <span>→</span>
            `;

    }

}


// =========================================
// BUTTON
// =========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        loginAdmin
    );

}


// =========================================
// ENTER KEY
// =========================================

document.addEventListener(
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


// =========================================
// READY
// =========================================

console.log(
    "✅ Admin Login Loaded"
);
