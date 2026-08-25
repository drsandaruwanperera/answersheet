// =====================================================
// STUDENT LOGIN SYSTEM
// =====================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const studentIdInput =
    document.getElementById(
        "studentId"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const loginBtn =
    document.getElementById(
        "loginBtn"
    );


const msg =
    document.getElementById(
        "msg"
    );


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(
    message,
    type = "error"
) {

    if (!msg) {
        return;
    }


    msg.textContent =
        message;


    msg.style.color =
        type === "success"
            ? "#16a34a"
            : "#dc2626";

}


// =====================================================
// DETECT STUDENT TYPE
// =====================================================
//
// Firebase studentType / grade is checked FIRST.
//
// Grade 11:
// 26000 - 26999
//
// Grade 10:
// 27000 - 27999
//
// Everything else:
// A/L
//
// =====================================================

function detectStudentType(
    studentId,
    data = {}
) {

    const cleanId =
        String(
            studentId || ""
        )
        .trim()
        .replace(
            /\s+/g,
            ""
        )
        .toUpperCase();


    // =================================================
    // 1. FIREBASE studentType
    // =================================================

    const firebaseType =
        String(
            data?.studentType || ""
        )
        .trim()
        .toLowerCase();


    if (
        firebaseType === "grade10" ||
        firebaseType === "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseType === "grade11" ||
        firebaseType === "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseType === "al" ||
        firebaseType === "a/l" ||
        firebaseType === "a level" ||
        firebaseType === "advanced" ||
        firebaseType === "advanced level"
    ) {

        return "al";

    }


    // =================================================
    // 2. FIREBASE grade
    // =================================================

    const firebaseGrade =
        String(
            data?.grade || ""
        )
        .trim()
        .toLowerCase();


    if (
        firebaseGrade === "10" ||
        firebaseGrade === "grade10" ||
        firebaseGrade === "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseGrade === "11" ||
        firebaseGrade === "grade11" ||
        firebaseGrade === "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseGrade === "al" ||
        firebaseGrade === "a/l" ||
        firebaseGrade === "a level" ||
        firebaseGrade === "advanced" ||
        firebaseGrade === "advanced level"
    ) {

        return "al";

    }


    // =================================================
    // 3. GRADE 11 ID
    // =================================================

    if (
        /^\d{5}$/.test(
            cleanId
        )
    ) {

        const number =
            Number(
                cleanId
            );


        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "grade11";

        }


        // =============================================
        // 4. GRADE 10 ID
        // =============================================

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // =================================================
    // 5. EVERYTHING ELSE = A/L
    // =================================================

    return "al";

}


// =====================================================
// GET DISPLAY GRADE
// =====================================================

function getGradeName(
    type
) {

    if (
        type === "grade10"
    ) {

        return "Grade 10";

    }


    if (
        type === "grade11"
    ) {

        return "Grade 11";

    }


    if (
        type === "al"
    ) {

        return "Advanced Level";

    }


    return "Student";

}


// =====================================================
// LOGIN
// =====================================================

async function loginStudent() {

    const studentId =
        studentIdInput?.value
            ?.trim()
            .toUpperCase() || "";


    const password =
        passwordInput?.value
            ?.trim() || "";


    // =================================================
    // VALIDATION
    // =================================================

    if (!studentId) {

        showMessage(
            "Please enter your Student ID."
        );


        studentIdInput?.focus();


        return;

    }


    if (!password) {

        showMessage(
            "Please enter your password."
        );


        passwordInput?.focus();


        return;

    }


    // =================================================
    // DISABLE LOGIN BUTTON
    // =================================================

    if (loginBtn) {

        loginBtn.disabled =
            true;


        loginBtn.innerHTML =
            `
                <span>
                    Signing In...
                </span>
            `;

    }


    showMessage(
        ""
    );


    try {

        // =============================================
        // STUDENT DOCUMENT
        // =============================================

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        const studentSnap =
            await getDoc(
                studentRef
            );


        // =============================================
        // STUDENT NOT FOUND
        // =============================================

        if (
            !studentSnap.exists()
        ) {

            showMessage(
                "Invalid Student ID or password."
            );


            return;

        }


        const data =
            studentSnap.data();


        // =============================================
        // PASSWORD
        // =============================================

        const storedPassword =
            String(
                data?.password ?? ""
            );


        if (
            storedPassword !==
            password
        ) {

            showMessage(
                "Invalid Student ID or password."
            );


            return;

        }


        // =============================================
        // DETECT CATEGORY
        // =============================================

        const studentType =
            detectStudentType(
                studentId,
                data
            );


        // =============================================
        // GRADE NAME
        // =============================================

        const gradeName =
            getGradeName(
                studentType
            );


        // =============================================
        // SAVE SESSION
        // =============================================

        sessionStorage.setItem(
            "loggedIn",
            "true"
        );


        sessionStorage.setItem(
            "studentId",
            studentId
        );


        sessionStorage.setItem(
            "studentType",
            studentType
        );


        sessionStorage.setItem(
            "studentGrade",
            gradeName
        );


        // =============================================
        // STUDENT NAME
        // =============================================

        const studentName =
            data?.name ||
            data?.studentName ||
            data?.fullName ||
            data?.displayName ||
            "Student";


        sessionStorage.setItem(
            "studentName",
            studentName
        );


        // =============================================
        // NIC IF AVAILABLE
        // =============================================

        if (
            data?.nicNumber
        ) {

            sessionStorage.setItem(
                "studentNIC",
                String(
                    data.nicNumber
                )
            );

        }


        // =============================================
        // DEBUG
        // =============================================

        console.log(
            "================================"
        );

        console.log(
            "LOGIN SUCCESS"
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Student Type:",
            studentType
        );

        console.log(
            "Grade:",
            gradeName
        );

        console.log(
            "Student Name:",
            studentName
        );

        console.log(
            "Must Change Password:",
            data?.mustChangePassword
        );

        console.log(
            "Profile Completed:",
            data?.profileCompleted
        );

        console.log(
            "================================"
        );


        // =============================================
        // SUCCESS MESSAGE
        // =============================================

        showMessage(
            "Login successful. Redirecting...",
            "success"
        );


        // =============================================
        // REDIRECT
        // =============================================

        setTimeout(
            () => {

                // -----------------------------------------
                // FIRST LOGIN
                // -----------------------------------------

                if (
                    data?.mustChangePassword === true
                ) {

                    window.location.replace(
                        "student-registration.html"
                    );

                    return;

                }


                // -----------------------------------------
                // NORMAL LOGIN
                // -----------------------------------------

                window.location.replace(
                    "dashboard.html"
                );

            },
            300
        );

    }

    catch (
        error
    ) {

        console.error(
            "Student login error:",
            error
        );


        showMessage(
            "Unable to sign in. Please try again."
        );

    }

    finally {

        if (loginBtn) {

            loginBtn.disabled =
                false;


            loginBtn.innerHTML =
                `
                    <span>
                        Sign In
                    </span>

                    <span class="login-arrow">
                        →
                    </span>
                `;

        }

    }

}


// =====================================================
// LOGIN BUTTON
// =====================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        loginStudent
    );

}


// =====================================================
// ENTER KEY
// =====================================================

[
    studentIdInput,
    passwordInput
]
.forEach(
    input => {

        if (!input) {
            return;
        }


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();


                    loginStudent();

                }

            }
        );

    }
);


// =====================================================
// CLEAR MESSAGE WHEN TYPING
// =====================================================

if (studentIdInput) {

    studentIdInput.addEventListener(
        "input",
        () => {

            if (msg) {

                msg.textContent =
                    "";

            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            if (msg) {

                msg.textContent =
                    "";

            }

        }
    );

}


// =====================================================
// START
// =====================================================

console.log(
    "================================"
);

console.log(
    "✅ Student Login System Loaded"
);

console.log(
    "Grade 11 IDs: 26000 - 26999"
);

console.log(
    "Grade 10 IDs: 27000 - 27999"
);

console.log(
    "All other IDs: A/L"
);

console.log(
    "First Login Registration: ACTIVE"
);

console.log(
    "================================"
);
