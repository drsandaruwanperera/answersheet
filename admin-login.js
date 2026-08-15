import {
    db,
    collection,
    getDocs
} from "./firebase.js";

const loginBtn =
    document.getElementById("loginBtn");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const msg =
    document.getElementById("msg");


async function adminLogin() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();


    // ==========================
    // VALIDATION
    // ==========================

    if (!username || !password) {

        msg.textContent =
            "Please enter username and password.";

        return;

    }


    // ==========================
    // LOADING
    // ==========================

    loginBtn.disabled = true;

    loginBtn.textContent =
        "Signing in...";

    msg.textContent = "";


    try {

        console.log(
            "Admin login started..."
        );

        console.log(
            "Username:",
            username
        );


        // ==========================
        // GET ADMINS
        // ==========================

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


        snapshot.forEach(
            adminDoc => {

                const data =
                    adminDoc.data();


                console.log(
                    "Admin:",
                    adminDoc.id,
                    data
                );


                const dbUsername =
                    String(
                        data.username || ""
                    )
                    .trim();


                if (
                    dbUsername.toLowerCase()
                    ===
                    username.toLowerCase()
                ) {

                    account = data;

                }

            }
        );


        // ==========================
        // USERNAME CHECK
        // ==========================

        if (!account) {

            msg.textContent =
                "Invalid username or password.";

            console.error(
                "Username not found."
            );

            return;

        }


        // ==========================
        // PASSWORD CHECK
        // ==========================

        const dbPassword =
            String(
                account.password || ""
            )
            .trim();


        if (
            dbPassword !== password
        ) {

            msg.textContent =
                "Invalid username or password.";

            console.error(
                "Password incorrect."
            );

            return;

        }


        // ==========================
        // LOGIN SUCCESS
        // ==========================

        const role =
            account.role || "limited";


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
            "✅ ADMIN LOGIN SUCCESS"
        );

        console.log(
            "Role:",
            role
        );


        // ==========================
        // GO ADMIN PANEL
        // ==========================

        window.location.replace(
            "admin.html"
        );

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

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Login";

    }

}


// ==========================
// BUTTON
// ==========================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        adminLogin
    );

}


// ==========================
// ENTER KEY
// ==========================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            adminLogin();

        }

    }
);


console.log(
    "✅ Admin Login JS Loaded"
);s
