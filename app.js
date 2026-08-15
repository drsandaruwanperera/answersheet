import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// ==========================
// Login Button
// ==========================

const loginBtn =
    document.getElementById("loginBtn");


// ==========================
// Login
// ==========================

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
        // Clear Message
        // ==========================

        msg.textContent = "";


        // ==========================
        // Validation
        // ==========================

        if (!studentId || !password) {

            msg.textContent =
                "Please enter Student ID and Password.";

            return;

        }


        try {

            // ==========================
            // Get Student
            // ==========================

            const ref =
                doc(
                    db,
                    "students",
                    studentId
                );


            const snap =
                await getDoc(ref);


            // ==========================
            // Student Not Found
            // ==========================

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


            // ==========================
            // Detect Student Grade
            // ==========================

            const studentNumber =
                Number(studentId);

            let studentGrade = null;


            // ==========================
            // Grade 11
            // 26000 - 26999
            // ==========================

            if (
                Number.isInteger(studentNumber) &&
                studentNumber >= 26000 &&
                studentNumber <= 26999
            ) {

                studentGrade = 11;

            }


            // ==========================
            // Grade 10
            // 27000 - 27999
            // ==========================

            else if (
                Number.isInteger(studentNumber) &&
                studentNumber >= 27000 &&
                studentNumber <= 27999
            ) {

                studentGrade = 10;

            }


            // ==========================
            // Firebase Grade Fallback
            // ==========================

            else if (
                String(data.grade) ===
                "10"
            ) {

                studentGrade = 10;

            }

            else if (
                String(data.grade) ===
                "11"
            ) {

                studentGrade = 11;

            }


            // ==========================
            // Student Type Fallback
            // ==========================

            else if (
                data.studentType ===
                "grade10"
            ) {

                studentGrade = 10;

            }

            else if (
                data.studentType ===
                "grade11"
            ) {

                studentGrade = 11;

            }


            // ==========================
            // Save Grade
            // ==========================

            if (
                studentGrade !== null
            ) {

                sessionStorage.setItem(
                    "studentGrade",
                    String(studentGrade)
                );

            }

            else {

                sessionStorage.removeItem(
                    "studentGrade"
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
                studentGrade === 10
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
                studentGrade === 11
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


        // ==========================
        // Error
        // ==========================

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


// ==========================
// Loaded
// ==========================

console.log(
    "✅ Student Login Loaded"
);
