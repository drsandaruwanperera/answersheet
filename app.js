// =====================================================
// STUDENT LOGIN SYSTEM
// =====================================================

import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const studentIdInput =
    document.getElementById("studentId");

const passwordInput =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const msg =
    document.getElementById("msg");


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(message, type = "error") {

    if (!msg) {
        return;
    }

    msg.textContent = message;

    msg.style.color =
        type === "success"
            ? "#16a34a"
            : "#dc2626";
}


// =====================================================
// NORMALIZE STUDENT ID
// =====================================================

function normalizeStudentId(studentId) {

    return String(studentId || "")
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();
}


// =====================================================
// A/L STUDENT CHECK
// =====================================================
//
// A27000 - A27999
// A28000 - A28999
// A29000 - A29999
//
// =====================================================

function isALStudentId(studentId) {

    const cleanId =
        normalizeStudentId(studentId);

    return /^A2[789]\d{3}$/.test(
        cleanId
    );
}


// =====================================================
// DETECT STUDENT TYPE
// =====================================================

function detectStudentType(
    studentId,
    data = {}
) {

    const cleanId =
        normalizeStudentId(studentId);


    // =================================================
    // FIREBASE STUDENT TYPE
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
    // FIREBASE GRADE
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


    // =================================================
    // A/L ADMISSION NUMBER
    // =================================================

    if (
        isALStudentId(cleanId)
    ) {

        return "al";

    }


    // =================================================
    // NUMERIC STUDENT IDs
    // =================================================

    if (
        /^\d{5}$/.test(cleanId)
    ) {

        const number =
            Number(cleanId);


        // =============================================
        // GRADE 11
        // 26000 - 26999
        // =============================================

        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "grade11";

        }


        // =============================================
        // GRADE 10
        // 27000 - 27999
        // =============================================

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    return "unknown";
}


// =====================================================
// GET GRADE NAME
// =====================================================

function getGradeName(type) {

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
// SAVE SESSION
// =====================================================

function saveStudentSession(
    studentId,
    studentType,
    gradeName,
    data
) {

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


    const studentName =
        data?.fullName ||
        data?.name ||
        data?.studentName ||
        data?.displayName ||
        "Student";


    sessionStorage.setItem(
        "studentName",
        studentName
    );


    if (
        data?.nicNumber
    ) {

        sessionStorage.setItem(
            "studentNIC",
            String(data.nicNumber)
        );

    }

}


// =====================================================
// CLEAR PASSWORD CHANGE SESSION
// =====================================================

function clearPasswordChangeSession() {

    sessionStorage.removeItem(
        "mustChangePassword"
    );

    sessionStorage.removeItem(
        "passwordChangeRequired"
    );

}


// =====================================================
// LOGIN
// =====================================================

async function loginStudent() {

    const studentId =
        normalizeStudentId(
            studentIdInput?.value
        );


    const password =
        String(
            passwordInput?.value || ""
        ).trim();


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
    // BUTTON LOADING
    // =================================================

    if (loginBtn) {

        loginBtn.disabled = true;

        loginBtn.innerHTML = `
            <span>Signing In...</span>
        `;

    }


    showMessage("");


    try {

        // =============================================
        // FIRESTORE STUDENT DOCUMENT
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
        // PASSWORD CHECK
        // =============================================

        const storedPassword =
            String(
                data?.password ?? ""
            );


        if (
            storedPassword !== password
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


        const gradeName =
            getGradeName(
                studentType
            );


        // =============================================
        // UNKNOWN CATEGORY
        // =============================================

        if (
            studentType === "unknown"
        ) {

            showMessage(
                "Unable to determine your student category. Please contact the System Administrator."
            );

            return;

        }


        // =============================================
        // SAVE SESSION
        // =============================================

        saveStudentSession(
            studentId,
            studentType,
            gradeName,
            data
        );


        // =============================================
        // UPDATE LAST ACTIVE
        // =============================================

        try {

            await updateDoc(
                studentRef,
                {
                    lastActiveAt:
                        Date.now()
                }
            );

        }
        catch (activeError) {

            console.warn(
                "Last active update failed:",
                activeError
            );

        }


        // =================================================
        // CONSOLE DEBUG
        // =================================================

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
            "Must Change Password:",
            data?.mustChangePassword
        );

        console.log(
            "Profile Completed:",
            data?.profileCompleted
        );

        console.log(
            "Registration Completed:",
            data?.registrationCompleted
        );

        console.log(
            "================================"
        );


        // =================================================
        // A/L STUDENT
        // =================================================

        if (
            studentType === "al"
        ) {

            /*
                A/L students use the A/L registration page
                when first registration is incomplete.
            */

            const needsALRegistration =
                data?.mustChangePassword === true ||
                data?.registrationCompleted !== true ||
                data?.profileCompleted !== true;


            if (
                needsALRegistration
            ) {

                clearPasswordChangeSession();


                showMessage(
                    "A/L registration required. Redirecting...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            "student-registration.html"
                        );

                    },
                    500
                );


                return;

            }


            // =========================================
            // A/L COMPLETED
            // =========================================

            clearPasswordChangeSession();


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.replace(
                        "dashboard.html"
                    );

                },
                500
            );


            return;

        }


        // =================================================
        // GRADE 10 / GRADE 11
        // MUST CHANGE PASSWORD
        // =================================================

        if (
            (
                studentType === "grade10" ||
                studentType === "grade11"
            ) &&
            data?.mustChangePassword === true
        ) {

            sessionStorage.setItem(
                "mustChangePassword",
                "true"
            );


            sessionStorage.setItem(
                "passwordChangeRequired",
                "true"
            );


            showMessage(
                `${gradeName} first login. Password change required.`,
                "success"
            );


            setTimeout(
                () => {

                    window.location.replace(
                        "change-password.html?id=" +
                        encodeURIComponent(
                            studentId
                        )
                    );

                },
                500
            );


            return;

        }


        // =================================================
        // GRADE 10 / GRADE 11 NORMAL LOGIN
        // =================================================

        if (
            studentType === "grade10" ||
            studentType === "grade11"
        ) {

            clearPasswordChangeSession();


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.replace(
                        "dashboard.html"
                    );

                },
                500
            );


            return;

        }


        // =================================================
        // FALLBACK
        // =================================================

        clearPasswordChangeSession();


        showMessage(
            "Login successful. Redirecting...",
            "success"
        );


        setTimeout(
            () => {

                window.location.replace(
                    "dashboard.html"
                );

            },
            500
        );

    }
    catch (error) {

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


            loginBtn.innerHTML = `
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
// SIGN IN BUTTON
// =====================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        loginStudent
    );

}


// =====================================================
// ENTER KEY LOGIN
// =====================================================

if (studentIdInput) {

    studentIdInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                loginStudent();

            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                loginStudent();

            }

        }
    );

}


// =====================================================
// CLEAR MESSAGE
// =====================================================

if (studentIdInput) {

    studentIdInput.addEventListener(
        "input",
        () => {

            if (msg) {
                msg.textContent = "";
            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            if (msg) {
                msg.textContent = "";
            }

        }
    );

}


// =====================================================
// STARTUP LOG
// =====================================================

console.log(
    "========================================"
);

console.log(
    "Student Assessment Portal Login"
);

console.log(
    "Grade 11: 26000 - 26999"
);

console.log(
    "Grade 10: 27000 - 27999"
);

console.log(
    "A/L: A27000 - A29999"
);

console.log(
    "A/L Registration: ENABLED"
);

console.log(
    "Grade 10/11 Password Change: ENABLED"
);

console.log(
    "========================================"
);