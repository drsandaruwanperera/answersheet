import {
    db,
    doc,
    getDoc
} from "./firebase.js";

console.log("✅ ADMIN LOGIN JS STARTED");


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

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


        // =================================================
        // CHECK ELEMENTS
        // =================================================

        if (
            !loginBtn ||
            !usernameInput ||
            !passwordInput ||
            !msg
        ) {

            console.error(
                "❌ Admin login elements not found."
            );

            return;

        }


        // =================================================
        // NORMALIZE ROLE
        // =================================================

        function normalizeRole(
            role
        ) {

            return String(
                role || ""
            )
            .trim()
            .toLowerCase()
            .replace(
                /[\s_-]+/g,
                ""
            );

        }


        // =================================================
        // LOGIN FUNCTION
        // =================================================

        async function login() {

            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value.trim();


            // ---------------------------------------------
            // CLEAR MESSAGE
            // ---------------------------------------------

            msg.textContent = "";


            // ---------------------------------------------
            // VALIDATION
            // ---------------------------------------------

            if (
                !username ||
                !password
            ) {

                msg.textContent =
                    "Please enter username and password.";

                return;

            }


            // ---------------------------------------------
            // BUTTON LOADING
            // ---------------------------------------------

            loginBtn.disabled =
                true;

            loginBtn.textContent =
                "Signing in...";


            try {

                console.log(
                    "🔐 Checking admin:",
                    username
                );


                // =================================================
                // GET ADMIN DOCUMENT
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


                console.log(
                    "Admin exists:",
                    adminSnap.exists()
                );


                // =================================================
                // ADMIN NOT FOUND
                // =================================================

                if (
                    !adminSnap.exists()
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =================================================
                // ADMIN DATA
                // =================================================

                const adminData =
                    adminSnap.data();


                console.log(
                    "Admin data:",
                    adminData
                );


                // =================================================
                // USERNAME CHECK
                // =================================================

                const storedUsername =
                    String(
                        adminData.username || ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    storedUsername !==
                    username.toLowerCase()
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =================================================
                // PASSWORD CHECK
                // =================================================

                const storedPassword =
                    String(
                        adminData.password || ""
                    ).trim();


                if (
                    storedPassword !==
                    password
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =================================================
                // GET ROLE
                // =================================================

                /*
                 * IMPORTANT
                 *
                 * Firestore:
                 *
                 * role: "superadmin"
                 *
                 * or
                 *
                 * role: "admin"
                 */

                const rawRole =
                    adminData.role ||
                    "admin";


                const role =
                    normalizeRole(
                        rawRole
                    );


                // =================================================
                // VALID ROLE
                // =================================================

                const finalRole =
                    role === "superadmin"
                        ? "superadmin"
                        : "admin";


                console.log(
                    "================================="
                );

                console.log(
                    "LOGIN SUCCESS"
                );

                console.log(
                    "Username:",
                    username
                );

                console.log(
                    "Firestore Role:",
                    rawRole
                );

                console.log(
                    "Normalized Role:",
                    role
                );

                console.log(
                    "Final Role:",
                    finalRole
                );

                console.log(
                    "Is Superadmin:",
                    finalRole === "superadmin"
                );

                console.log(
                    "================================="
                );


                // =================================================
                // CLEAR OLD SESSION
                // =================================================

                sessionStorage.removeItem(
                    "adminLoggedIn"
                );

                sessionStorage.removeItem(
                    "adminRole"
                );

                sessionStorage.removeItem(
                    "adminUsername"
                );


                // =================================================
                // SAVE NEW SESSION
                // =================================================

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                sessionStorage.setItem(
                    "adminRole",
                    finalRole
                );


                sessionStorage.setItem(
                    "adminUsername",
                    username
                );


                // =================================================
                // REDIRECT
                // =================================================

                window.location.replace(
                    "admin.html"
                );

            }

            catch (
                error
            ) {

                console.error(
                    "❌ ADMIN LOGIN ERROR:",
                    error
                );


                msg.textContent =
                    "Login failed: " +
                    (
                        error.message ||
                        "Unknown error."
                    );

            }

            finally {

                loginBtn.disabled =
                    false;

                loginBtn.textContent =
                    "Sign In →";

            }

        }


        // =================================================
        // BUTTON CLICK
        // =================================================

        loginBtn.addEventListener(
            "click",
            login
        );


        // =================================================
        // ENTER KEY - USERNAME
        // =================================================

        usernameInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    passwordInput.focus();

                }

            }
        );


        // =================================================
        // ENTER KEY - PASSWORD
        // =================================================

        passwordInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    login();

                }

            }
        );

    }
);
