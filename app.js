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
    // FIREBASE studentType
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
        /^A\d{5}$/.test(
            cleanId
        )
    ) {

        return "al";

    }


    // =================================================
    // GRADE 11
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
        // GRADE 10
        // =============================================

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // =================================================
    // DEFAULT
    // =================================================

    return "al";

}


// =====================================================
// GET GRADE NAME
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
// SAVE STUDENT SESSION
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
            String(
                data.nicNumber
            )
        );

    }

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
    // DISABLE BUTTON
    // =================================================

    if (
        loginBtn
    ) {

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
        // NOT FOUND
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
                data?.password ??
                ""
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
        // STUDENT TYPE
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

        catch (
            activeError
        ) {

            console.warn(
                "Unable to update lastActiveAt:",
                activeError
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


        // =============================================
        // FIRST LOGIN / REGISTRATION
        // =============================================

        if (
            data?.mustChangePassword ===
            true
        ) {

            showMessage(
                "First login detected. Redirecting to registration...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.replace(
                        "student-registration.html"
                    );

                },
                300
            );


            return;

        }


        // =============================================
        // REGISTRATION INCOMPLETE
        // =============================================

        if (
            data?.registrationCompleted !==
            true &&
            data?.profileCompleted !==
            true
        ) {

            // Only send accounts that were specifically
            // marked for registration.
            if (
                data?.studentType ===
                "al" &&
                (
                    data?.fullName ||
                    data?.nicNumber
                )
            ) {

                showMessage(
                    "Please complete your registration.",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            "student-registration.html"
                        );

                    },
                    300
                );


                return;

            }

        }


        // =============================================
        // NORMAL LOGIN
        // =============================================

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

        if (
            loginBtn
        ) {

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

if (
    loginBtn
) {

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
// CLEAR MESSAGE
// =====================================================

if (
    studentIdInput
) {

    studentIdInput.addEventListener(
        "input",
        () => {

            if (
                msg
            ) {

                msg.textContent =
                    "";

            }

        }
    );

}


if (
    passwordInput
) {

    passwordInput.addEventListener(
        "input",
        () => {

            if (
                msg
            ) {

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
    "A/L IDs: A27000+"
);

console.log(
    "First Login Registration: ACTIVE"
);

console.log(
    "================================"
);
