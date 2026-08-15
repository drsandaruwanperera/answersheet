import {
    db,
    collection,
    getDocs
} from "./firebase.js";


console.log("================================");
console.log("✅ ADMIN LOGIN JS LOADED");
console.log("================================");


const loginBtn =
    document.getElementById("loginBtn");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const msg =
    document.getElementById("msg");


async function loginAdmin() {

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
            "Checking admin:",
            username
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "admins"
                )
            );


        console.log(
            "Admins found:",
            snapshot.size
        );


        let account = null;


        snapshot.forEach(
            adminDoc => {

                const data =
                    adminDoc.data();


                console.log(
                    "Admin document:",
                    adminDoc.id
                );


                if (
                    String(
                        data.username || ""
                    )
                    .trim()
                    .toLowerCase()
                    ===
                    username.toLowerCase()
                ) {

                    account = data;

                }

            }
        );


        if (!account) {

            msg.textContent =
                "Invalid username or password.";

            console.error(
                "❌ Admin username not found."
            );

            return;

        }


        if (
            String(
                account.password || ""
            ).trim()
            !==
            password
        ) {

            msg.textContent =
                "Invalid username or password.";

            console.error(
                "❌ Wrong admin password."
            );

            return;

        }


        // ==========================
        // LOGIN SUCCESS
        // ==========================

        console.log(
            "✅ ADMIN LOGIN SUCCESS"
        );


        sessionStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        sessionStorage.setItem(
            "adminRole",
            account.role || "limited"
        );

        sessionStorage.setItem(
            "adminUsername",
            username
        );


        console.log(
            "Session:",
            sessionStorage.getItem(
                "adminLoggedIn"
            )
        );


        // ==========================
        // REDIRECT
        // ==========================

        window.location.assign(
            "admin.html"
        );

    }

    catch (error) {

        console.error(
            "❌ ADMIN LOGIN ERROR:",
            error
        );

        msg.textContent =
            "Login failed: " +
            error.message;

    }

    finally {

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Sign In →";

    }

}


loginBtn.addEventListener(
    "click",
    loginAdmin
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            loginAdmin();

        }

    }
);
