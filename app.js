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

        const studentId =
            document
                .getElementById("studentId")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value
                .trim();

        const msg =
            document.getElementById("msg");


        // ==========================
        // Validation
        // ==========================

        if (!studentId || !password) {

            msg.textContent =
                "Please enter Student ID and Password.";

            return;

        }


        try {

            const ref =
                doc(
                    db,
                    "students",
                    studentId
                );

            const snap =
                await getDoc(ref);


            if (!snap.exists()) {

                msg.textContent =
                    "Student ID not found.";

                return;

            }


            const data =
                snap.data();


            // ==========================
            // Check Password
            // ==========================

            if (
                data.password !==
                password
            ) {

                msg.textContent =
                    "Wrong Password.";

                return;

            }


            // ==========================
            // Save Login Session
            // ==========================

            sessionStorage.setItem(
                "loggedIn",
                "true"
            );

            sessionStorage.setItem(
                "studentId",
                studentId
            );


            // Save Grade

            if (data.grade) {

                sessionStorage.setItem(
                    "studentGrade",
                    String(data.grade)
                );

            }


            // ==========================
            // Force Password Change
            // ==========================

            if (
                data.mustChangePassword ===
                true
            ) {

                window.location.href =
                    "change-password.html?id=" +
                    encodeURIComponent(
                        studentId
                    );

                return;

            }


            // ==========================
            // Grade 10
            // ==========================

            if (
                String(data.grade) ===
                "10"
            ) {

                window.location.href =
                    "dashboard-grade10.html?id=" +
                    encodeURIComponent(
                        studentId
                    );

                return;

            }


            // ==========================
            // Grade 11
            // ==========================

            if (
                String(data.grade) ===
                "11"
            ) {

                window.location.href =
                    "dashboard-grade11.html?id=" +
                    encodeURIComponent(
                        studentId
                    );

                return;

            }


            // ==========================
            // A/L
            // ==========================

            window.location.href =
                "dashboard.html?id=" +
                encodeURIComponent(
                    studentId
                );

        }
        catch (error) {

            console.error(
                "Login error:",
                error
            );

            msg.textContent =
                "Login failed. Please try again.";

        }

    }
);


console.log(
    "app.js loaded"
);
