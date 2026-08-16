import {
    db,
    doc,
    getDoc
} from "./firebase.js";


console.log(
    "ADMIN LOGIN JS STARTED"
);


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


        if (
            !loginBtn ||
            !usernameInput ||
            !passwordInput ||
            !msg
        ) {

            console.error(
                "Admin login elements not found."
            );

            return;

        }


        // =================================================
        // LOGIN
        // =================================================

        async function login() {

            const username =
                usernameInput.value.trim();


            const password =
                passwordInput.value.trim();


            msg.textContent =
                "";


            if (
                !username ||
                !password
            ) {

                msg.textContent =
                    "Please enter username and password.";

                return;

            }


            loginBtn.disabled =
                true;


            loginBtn.textContent =
                "Signing in...";


            try {

                console.log(
                    "Checking admin:",
                    username
                );


                // =========================================
                // ADMIN DOCUMENT
                // =========================================

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
                    !adminSnap.exists()
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                const adminData =
                    adminSnap.data();


                // =========================================
                // USERNAME CHECK
                // =========================================

                const databaseUsername =
                    String(
                        adminData.username ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    databaseUsername !==
                    username.toLowerCase()
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =========================================
                // PASSWORD CHECK
                // =========================================

                const databasePassword =
                    String(
                        adminData.password ||
                        ""
                    ).trim();


                if (
                    databasePassword !==
                    password
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =========================================
                // ROLE
                // =========================================

                const originalRole =
                    String(
                        adminData.role ||
                        "admin"
                    )
                    .trim();


                const normalizedRole =
                    originalRole
                        .toLowerCase()
                        .replace(
                            /[\s_-]+/g,
                            ""
                        );


                // =========================================
                // SAVE SESSION
                // =========================================

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


                console.log(
                    "================================="
                );

                console.log(
                    "ADMIN LOGIN SUCCESS"
                );

                console.log(
                    "Username:",
                    username
                );

                console.log(
                    "Original Role:",
                    originalRole
                );

                console.log(
                    "Normalized Role:",
                    normalizedRole
                );

                console.log(
                    "Super Admin:",
                    normalizedRole ===
                    "superadmin"
                );

                console.log(
                    "================================="
                );


                // =========================================
                // REDIRECT
                // =========================================

                window.location.replace(
                    "admin.html"
                );

            }
            catch (
                error
            ) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                msg.textContent =
                    "Login failed: " +
                    error.message;

            }
            finally {

                loginBtn.disabled =
                    false;


                loginBtn.textContent =
                    "Sign In →";

            }

        }


        // =================================================
        // BUTTON
        // =================================================

        loginBtn.addEventListener(
            "click",
            login
        );


        // =================================================
        // ENTER KEY
        // =================================================

        passwordInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    login();

                }

            }
        );

    }
);
