import {
    db,
    collection,
    getDocs
} from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");

async function loginAdmin() {

    msg.textContent = "";

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();

    if (!username || !password) {

        msg.textContent =
            "Please enter username and password.";

        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Checking...";

    try {

        console.log("========== ADMIN LOGIN ==========");
        console.log("Username entered:", username);

        const snapshot =
            await getDocs(
                collection(db, "admins")
            );

        console.log(
            "Admins collection documents:",
            snapshot.size
        );

        let account = null;

        snapshot.forEach(adminDoc => {

            const data = adminDoc.data();

            console.log(
                "Admin document:",
                adminDoc.id,
                data
            );

            if (
                String(data.username || "")
                    .trim()
                    .toLowerCase()
                ===
                username.toLowerCase()
            ) {

                account = data;

            }

        });


        if (!account) {

            console.error(
                "❌ Username not found in admins collection."
            );

            msg.textContent =
                "Username not found.";

            return;
        }


        console.log(
            "✅ Username found."
        );


        if (
            String(account.password || "").trim()
            !==
            password
        ) {

            console.error(
                "❌ Password does not match."
            );

            msg.textContent =
                "Wrong password.";

            return;
        }


        console.log(
            "✅ Password correct."
        );


        const role =
            account.role || "admin";


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
            "✅ SESSION CREATED"
        );

        console.log(
            "adminLoggedIn:",
            sessionStorage.getItem(
                "adminLoggedIn"
            )
        );


        window.location.replace(
            "admin.html"
        );

    }

    catch (error) {

        console.error(
            "❌ FIREBASE ADMIN LOGIN ERROR"
        );

        console.error(error);

        msg.textContent =
            "Firebase error: " +
            error.message;

    }

    finally {

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Sign In";

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


console.log(
    "✅ admin-login.js loaded"
);
