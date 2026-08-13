// ==========================
// Admin Session Protection
// ==========================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    sessionStorage.getItem("adminRole") || "limited";


// ==========================
// Check Login
// ==========================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// ==========================
// Hide Full Admin Features
// ==========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (adminRole !== "full") {

            document
                .querySelectorAll(
                    ".full-admin-only"
                )
                .forEach(element => {

                    element.style.display =
                        "none";

                });

        }

    }
);
