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

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async () => {

            // =================================
            // GET INPUT VALUES
            // =================================

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
                document.getElementById(
                    "msg"
                );


            // =================================
            // CLEAR MESSAGE
            // =================================

            msg.textContent = "";


            // =================================
            // VALIDATION
            // =================================

            if (
                !studentId ||
                !password
            ) {

                msg.textContent =
                    "Please enter Student ID and Password.";

                return;

            }


            // =================================
            // LOADING
            // =================================

            loginBtn.disabled =
                true;

            loginBtn.textContent =
                "Signing in...";


            try {

                // =================================
                // CLEAN STUDENT ID
                // =================================

                const cleanStudentId =
                    String(
                        studentId
                    )
                    .trim()
                    .replace(
                        /\s+/g,
                        ""
                    );


                // =================================
                // GET STUDENT FROM FIREBASE
                // =================================

                const studentRef =
                    doc(
                        db,
                        "students",
                        cleanStudentId
                    );


                const studentSnapshot =
                    await getDoc(
                        studentRef
                    );


                // =================================
                // STUDENT NOT FOUND
                // =================================

                if (
                    !studentSnapshot.exists()
                ) {

                    msg.textContent =
                        "Student ID not found.";

                    return;

                }


                // =================================
                // STUDENT DATA
                // =================================

                const data =
                    studentSnapshot.data();


                // =================================
                // PASSWORD CHECK
                // =================================

                if (
                    String(
                        data.password || ""
                    ) !==
                    password
                ) {

                    msg.textContent =
                        "Wrong Password.";

                    return;

                }


                // =================================
                // STUDENT TYPE
                // =================================

                let studentType =
                    null;


                // =================================
                // NUMBER VERSION
                // =================================

                const studentNumber =
                    Number(
                        cleanStudentId
                    );


                // =================================
                // GRADE 11
                // =================================
                //
                // 26000 - 26999
                //

                if (
                    /^\d{5}$/.test(
                        cleanStudentId
                    ) &&
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
                // =================================
                //
                // 27000 - 27999
                //

                else if (
                    /^\d{5}$/.test(
                        cleanStudentId
                    ) &&
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
                // A/L STUDENT
                // =================================
                //
                // First 4 digits:
                //
                // 2005
                // 2006
                // 2007
                //
                // Example:
                // 200578900180
                //

                else if (
                    cleanStudentId.startsWith(
                        "2005"
                    ) ||
                    cleanStudentId.startsWith(
                        "2006"
                    ) ||
                    cleanStudentId.startsWith(
                        "2007"
                    )
                ) {

                    studentType =
                        "al";

                }


                // =================================
                // A/L - OLD NIC
                // =================================
                //
                // Example:
                //
                // 987654321V
                // 987654321X
                //

                else if (
                    /^\d{9}[VvXx]$/.test(
                        cleanStudentId
                    )
                ) {

                    studentType =
                        "al";

                }


                // =================================
                // FIREBASE STUDENT TYPE FALLBACK
                // =================================

                if (
                    !studentType
                ) {

                    const firebaseType =
                        String(
                            data.studentType ||
                            ""
                        )
                        .toLowerCase()
                        .trim()
                        .replace(
                            /\s+/g,
                            " "
                        );


                    // Grade 10

                    if (
                        firebaseType ===
                            "grade10" ||
                        firebaseType ===
                            "grade 10"
                    ) {

                        studentType =
                            "grade10";

                    }


                    // Grade 11

                    else if (
                        firebaseType ===
                            "grade11" ||
                        firebaseType ===
                            "grade 11"
                    ) {

                        studentType =
                            "grade11";

                    }


                    // A/L

                    else if (
                        firebaseType ===
                            "al" ||
                        firebaseType ===
                            "a/l" ||
                        firebaseType ===
                            "a level" ||
                        firebaseType ===
                            "a-level" ||
                        firebaseType ===
                            "advanced" ||
                        firebaseType ===
                            "advanced level" ||
                        firebaseType ===
                            "advancedlevel"
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

                    const firebaseGrade =
                        String(
                            data.grade ||
                            ""
                        )
                        .toLowerCase()
                        .trim()
                        .replace(
                            /\s+/g,
                            " "
                        );


                    // Grade 10

                    if (
                        firebaseGrade ===
                            "10" ||
                        firebaseGrade ===
                            "grade10" ||
                        firebaseGrade ===
                            "grade 10"
                    ) {

                        studentType =
                            "grade10";

                    }


                    // Grade 11

                    else if (
                        firebaseGrade ===
                            "11" ||
                        firebaseGrade ===
                            "grade11" ||
                        firebaseGrade ===
                            "grade 11"
                    ) {

                        studentType =
                            "grade11";

                    }


                    // A/L

                    else if (
                        firebaseGrade ===
                            "al" ||
                        firebaseGrade ===
                            "a/l" ||
                        firebaseGrade ===
                            "a level" ||
                        firebaseGrade ===
                            "a-level" ||
                        firebaseGrade ===
                            "advanced" ||
                        firebaseGrade ===
                            "advanced level"
                    ) {

                        studentType =
                            "al";

                    }

                }


                // =================================
                // FIREBASE STUDENT GRADE FALLBACK
                // =================================

                if (
                    !studentType
                ) {

                    const firebaseStudentGrade =
                        String(
                            data.studentGrade ||
                            ""
                        )
                        .toLowerCase()
                        .trim()
                        .replace(
                            /\s+/g,
                            " "
                        );


                    if (
                        firebaseStudentGrade ===
                            "10" ||
                        firebaseStudentGrade ===
                            "grade10" ||
                        firebaseStudentGrade ===
                            "grade 10"
                    ) {

                        studentType =
                            "grade10";

                    }

                    else if (
                        firebaseStudentGrade ===
                            "11" ||
                        firebaseStudentGrade ===
                            "grade11" ||
                        firebaseStudentGrade ===
                            "grade 11"
                    ) {

                        studentType =
                            "grade11";

                    }

                    else if (
                        firebaseStudentGrade ===
                            "al" ||
                        firebaseStudentGrade ===
                            "a/l" ||
                        firebaseStudentGrade ===
                            "a level" ||
                        firebaseStudentGrade ===
                            "a-level" ||
                        firebaseStudentGrade ===
                            "advanced" ||
                        firebaseStudentGrade ===
                            "advanced level"
                    ) {

                        studentType =
                            "al";

                    }

                }


                // =================================
                // STUDENT TYPE NOT FOUND
                // =================================

                if (
                    !studentType
                ) {

                    console.error(
                        "Student type could not be detected.",
                        {
                            studentId:
                                cleanStudentId,

                            data:
                                data
                        }
                    );


                    msg.textContent =
                        "Student category is not configured. Please contact the administrator.";

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
                    cleanStudentId
                );


                // =================================
                // SAVE STUDENT TYPE
                // =================================

                sessionStorage.setItem(
                    "studentType",
                    studentType
                );


                // =================================
                // SAVE COMPATIBILITY GRADE
                // =================================

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

                else if (
                    studentType ===
                    "al"
                ) {

                    sessionStorage.setItem(
                        "studentGrade",
                        "al"
                    );

                }


                // =================================
                // CONSOLE
                // =================================

                console.log(
                    "================================"
                );

                console.log(
                    "✅ LOGIN SUCCESS"
                );

                console.log(
                    "Student ID:",
                    cleanStudentId
                );

                console.log(
                    "Student Type:",
                    studentType
                );

                console.log(
                    "Firebase Student Type:",
                    data.studentType
                );

                console.log(
                    "Firebase Grade:",
                    data.grade
                );

                console.log(
                    "================================"
                );


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
                            cleanStudentId
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

}


// =========================================
// ENTER KEY LOGIN
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            if (
                loginBtn &&
                !loginBtn.disabled
            ) {

                loginBtn.click();

            }

        }

    }
);


// =========================================
// LOADED
// =========================================

console.log(
    "✅ Student Login Loaded"
);
