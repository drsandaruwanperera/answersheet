import {
    db,
    doc,
    getDoc
} from "./firebase.js";


console.log(
    "ADMIN LOGIN JS STARTED"
);


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // =================================================
        // ELEMENTS
        // =================================================

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
                "Admin login elements not found."
            );

            return;

        }


        // =================================================
        // LOGIN FUNCTION
        // =================================================

        async function login() {


            const username =
                usernameInput.value
                    .trim();


            const password =
                passwordInput.value
                    .trim();


            // =============================================
            // CLEAR MESSAGE
            // =============================================

            msg.textContent =
                "";


            // =============================================
            // VALIDATION
            // =============================================

            if (
                !username ||
                !password
            ) {

                msg.textContent =
                    "Please enter username and password.";

                return;

            }


            // =============================================
            // LOADING
            // =============================================

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


                console.log(
                    "Admin document exists:",
                    adminSnap.exists()
                );


                // =========================================
                // ADMIN NOT FOUND
                // =========================================

                if (
                    !adminSnap.exists()
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =========================================
                // ADMIN DATA
                // =========================================

                const adminData =
                    adminSnap.data();


                console.log(
                    "Admin data:",
                    adminData
                );


                // =========================================
                // USERNAME CHECK
                // =========================================

                const storedUsername =
                    String(
                        adminData.username ||
                        ""
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


                // =========================================
                // PASSWORD CHECK
                // =========================================

                const storedPassword =
                    String(
                        adminData.password ||
                        ""
                    )
                    .trim();


                if (
                    storedPassword !==
                    password
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;

                }


                // =========================================
                // GET ROLE
                // =========================================

                let role =
                    String(
                        adminData.role ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                console.log(
                    "Original Firestore role:",
                    adminData.role
                );


                // =========================================
                // NORMALIZE ROLE
                // =========================================

                if (
                    role === "super admin" ||
                    role === "super_admin" ||
                    role === "superadministrator" ||
                    role === "super administrator" ||
                    role === "super-admin" ||
                    role === "superadmin"
                ) {

                    role =
                        "superadmin";

                }

                else if (
                    role === "administrator" ||
                    role === "admin"
                ) {

                    role =
                        "admin";

                }

                else {

                    role =
                        "limited";

                }


                // =========================================
                // LOGIN SUCCESS
                // =========================================

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


                // =========================================
                // EXTRA ROLE STORAGE
                // =========================================
                //
                // This makes the role easier to use
                // from other pages as well.
                //

                sessionStorage.setItem(
                    "role",
                    role
                );


                sessionStorage.setItem(
                    "userRole",
                    role
                );


                sessionStorage.setItem(
                    "username",
                    username
                );


                // =========================================
                // DEBUG
                // =========================================

                console.log(
                    "================================"
                );

                console.log(
                    "ADMIN LOGIN SUCCESS"
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
                    "Superadmin:",
                    role === "superadmin"
                );

                console.log(
                    "================================"
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
                    "Login failed. Please try again.";

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
        // ENTER KEY
        // =================================================

        passwordInput.addEventListener(
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


        usernameInput.addEventListener(
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
