import {
    db,
    doc,
    getDoc
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


        if (!username || !password) {

            msg.textContent =
                "Please enter username and password.";

            return;
        }


        try {

            // ==========================
            // Get Admin Account
            // ==========================

            const ref =
                doc(
                    db,
                    "admins",
                    "admin"
                );

            const snap =
                await getDoc(ref);


            if (!snap.exists()) {

                msg.textContent =
                    "Admin account not found.";

                return;
            }


            const data =
                snap.data();


            // ==========================
            // Check Login
            // ==========================

            if (
                username !== data.username ||
                password !== data.password
            ) {

                msg.textContent =
                    "Invalid username or password.";

                return;
            }


            // ==========================
            // Get Role
            // ==========================

            const role =
                data.role || "limited";


            // ==========================
            // Save Session
            // ==========================

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            sessionStorage.setItem(
                "adminRole",
                role
            );


            console.log(
                "Admin login:",
                username,
                "Role:",
                role
            );


            // ==========================
            // Open Dashboard
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
