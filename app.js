import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =========================================
// LOGIN BUTTON
// =========================================

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


// =========================================
// LOGIN
// =========================================

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


        // =====================================
        // CLEAR MESSAGE
        // =====================================

        msg.textContent = "";


        // =====================================
        // VALIDATION
        // =====================================

        if (
            !studentId ||
            !password
        ) {

            msg.textContent =
                "Please enter Student ID and Password.";

            return;

        }


        // =====================================
        // LOADING
        // =====================================

        loginBtn.disabled = true;

        loginBtn.textContent =
            "Signing in...";


        try {

            // =================================
            // GET STUDENT
            // =================================

            const ref =
                doc(
                    db,
                    "students",
                    studentId
                );


            const snap =
                await getDoc(ref);


            // =================================
            // STUDENT NOT FOUND
            // =================================

            if (!snap.exists()) {

                msg.textContent =
                    "Student ID not found.";

                return;

            }


            const data =
                snap.data();


            // =================================
            // PASSWORD CHECK
            // =================================

            if (
                data.password !==
                password
            ) {

                msg.textContent =
                    "Wrong Password.";

                return;

            }


            // =================================
            // SAVE LOGIN SESSION
            // =================================

            sessionStorage.setItem(
                "loggedIn",
                "true"
            );


            sessionStorage.setItem(
                "studentId",
                studentId
            );


            // =================================
            // DETECT STUDENT TYPE
            // =================================

            const studentNumber =
                Number(studentId);


            let studentType = null;


            // =================================
            // GRADE 11
            // 26000 - 26999
            // =================================

            if (
                Number.isInteger(
                    studentNumber
                ) &&
                studentNumber >= 26000 &&
                studentNumber <= 26999
            ) {

                studentType =
                    "grade11";

            }


            // =================================
            // GRADE 10
            // 27000 - 27999
            // =================================

            else if (
                Number.isInteger(
                    studentNumber
                ) &&
                studentNumber >= 27000 &&
                studentNumber <= 27999
            ) {

                studentType =
                    "grade10";

            }


            // =================================
            // FIREBASE STUDENT TYPE
            // =================================

            else if (
                typeof data.studentType ===
                "string"
            ) {

                const firebaseType =
                    data.studentType
                        .toLowerCase()
                        .trim();


                if (
                    firebaseType ===
                    "grade10" ||
                    firebaseType ===
                    "grade 10"
                ) {

                    studentType =
                        "grade10";

                }

                else if (
                    firebaseType ===
                    "grade11" ||
                    firebaseType ===
                    "grade 11"
                ) {

                    studentType =
                        "grade11";

                }

                else if (
                    firebaseType ===
                    "al" ||
                    firebaseType ===
                    "a/l" ||
                    firebaseType ===
                    "advanced" ||
                    firebaseType ===
                    "advanced level"
                ) {

                    studentType =
                        "al";

                }

            }


            // =================================
            // FIREBASE GRADE FALLBACK
            // =================================

            if (
                !studentType
            ) {

                const grade =
                    String(
                        data.grade ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                if (
                    grade === "10" ||
                    grade === "grade10" ||
                    grade === "grade 10"
                ) {

                    studentType =
                        "grade10";

                }

                else if (
                    grade === "11" ||
                    grade === "grade11" ||
                    grade === "grade 11"
                ) {

                    studentType =
                        "grade11";

                }

                else if (
                    grade === "al" ||
                    grade === "a/l" ||
                    grade === "advanced" ||
                    grade === "advanced level"
                ) {

                    studentType =
                        "al";

                }

            }


            // =================================
            // SAVE STUDENT TYPE
            // =================================

            if (
                studentType
            ) {

                sessionStorage.setItem(
                    "studentType",
                    studentType
                );


                // Keep old studentGrade
                // compatibility.

                if (
                    studentType ===
                    "grade10"
                ) {

                    sessionStorage.setItem(
                        "studentGrade",
                        "10"
                    );

                }

                else if (
                    studentType ===
                    "grade11"
                ) {

                    sessionStorage.setItem(
                        "studentGrade",
                        "11"
                    );

                }

                else {

                    sessionStorage.setItem(
                        "studentGrade",
                        "al"
                    );

                }

            }

            else {

                sessionStorage.removeItem(
                    "studentType"
                );

                sessionStorage.removeItem(
                    "studentGrade"
                );

            }


            // =================================
            // FORCE PASSWORD CHANGE
            // =================================

            if (
                data.mustChangePassword ===
                true
            ) {

                window.location.replace(
                    "change-password.html?id=" +
                    encodeURIComponent(
                        studentId
                    )
                );

                return;

            }


            // =================================
            // COMMON DASHBOARD
            // =================================

            window.location.replace(
                "dashboard.html"
            );

        }


        // =====================================
        // ERROR
        // =====================================

        catch (error) {

            console.error(
                "Login error:",
                error
            );


            msg.textContent =
                "Login failed. Please try again.";

        }


        // =====================================
        // RESET BUTTON
        // =====================================

        finally {

            loginBtn.disabled =
                false;

            loginBtn.textContent =
                "Sign In";

        }

    }
);


// =========================================
// ENTER KEY LOGIN
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            loginBtn.click();

        }

    }
);


// =========================================
// LOADED
// =========================================

console.log(
    "✅ Student Login Loaded"
);
