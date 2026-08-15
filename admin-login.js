import {
    db,
    doc,
    getDoc
} from "./firebase.js";

console.log("ADMIN LOGIN JS STARTED");

document.addEventListener("DOMContentLoaded", () => {

    const loginBtn =
        document.getElementById("loginBtn");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const msg =
        document.getElementById("msg");


    if (!loginBtn) {

        console.error(
            "loginBtn not found"
        );

        return;
    }


    loginBtn.addEventListener(
        "click",
        async () => {

            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value.trim();


            msg.textContent = "";


            if (!username || !password) {

                msg.textContent =
                    "Please enter username and password.";

                return;
            }


            loginBtn.disabled = true;

            loginBtn.textContent =
                "Signing in...";


            try {

                console.log(
                    "Checking admin login..."
                );


                // =================================
                // GET ADMIN DOCUMENT
                // =================================

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


                // =================================
                // NOT FOUND
                // =================================

                if (!adminSnap.exists()) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;
                }


                const adminData =
                    adminSnap.data();


                console.log(
                    "Admin data loaded."
                );


                // =================================
                // CHECK USERNAME
                // =================================

                if (
                    String(
                        adminData.username || ""
                    ).trim().toLowerCase()
                    !==
                    username.toLowerCase()
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;
                }


                // =================================
                // CHECK PASSWORD
                // =================================

                if (
                    String(
                        adminData.password || ""
                    ).trim()
                    !==
                    password
                ) {

                    msg.textContent =
                        "Invalid username or password.";

                    return;
                }


                // =================================
                // LOGIN SUCCESS
                // =================================

                const role =
                    adminData.role ||
                    "limited";


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
                    "ADMIN LOGIN SUCCESS"
                );


                // =================================
                // OPEN ADMIN PANEL
                // =================================

                window.location.href =
                    "admin.html";

            }

            catch (error) {

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
    );


    // =================================
    // ENTER KEY
    // =================================

    passwordInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                loginBtn.click();

            }

        }
    );

});
