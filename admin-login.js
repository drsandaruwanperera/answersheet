import {
    db,
    collection,
    getDocs
} from "./firebase.js";

const loginBtn =
    document.getElementById("loginBtn");


loginBtn.addEventListener(
    "click",
    async () => {

        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value
                .trim();

        const msg =
            document.getElementById("msg");


        msg.textContent = "";


        // ==========================
        // Validation
        // ==========================

        if (!username || !password) {

            msg.textContent =
                "Please enter username and password.";

            return;

        }


        try {

            // ==========================
            // Get Admin Accounts
            // ==========================

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "admins"
                    )
                );


            let account = null;


            snapshot.forEach(
                adminDoc => {

                    const data =
                        adminDoc.data();


                    if (
                        data.username ===
                        username
                    ) {

                        account = data;

                    }

                }
            );


            // ==========================
            // Account Not Found
            // ==========================

            if (!account) {

                msg.textContent =
                    "Invalid username or password.";

                return;

            }


            // ==========================
            // Check Password
            // ==========================

            if (
                password !==
                account.password
            ) {

                msg.textContent =
                    "Invalid username or password.";

                return;

            }


            // ==========================
            // Get Role
            // ==========================

            const role =
                account.role ||
                "limited";


            // ==========================
            // Save Admin Session
            // ==========================

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
                "Admin login:",
                username,
                "Role:",
                role
            );


            // ==========================
            // Dashboard
            // ==========================

            window.location.href =
                "admin.html";

        }
        catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            msg.textContent =
                "Login failed. Please try again.";

        }

    }
);
