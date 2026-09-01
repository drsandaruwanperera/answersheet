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
// NORMALIZE STUDENT ID
// =====================================================

function normalizeStudentId(
    studentId
) {

    return String(
        studentId || ""
    )
        .trim()
        .replace(
            /\s+/g,
            ""
        )
        .toUpperCase();

}


// =====================================================
// CHECK A/L STUDENT ID
// =====================================================
//
// A27000 - A27999
// A28000 - A28999
// A29000 - A29999
//
// Valid:
// A27000
// A27555
// A28000
// A28999
// A29000
// A29999
//
// Invalid:
// A26000
// A30000
// 26000
// 27000
//
// =====================================================

function isALStudentId(
    studentId
) {

    const cleanId =
        normalizeStudentId(
            studentId
        );


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
        normalizeStudentId(
            studentId
        );


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
        isALStudentId(
            cleanId
        )
    ) {

        return "al";

    }


    // =================================================
    // NUMERIC ADMISSION NUMBERS
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


    // =================================================
    // UNKNOWN
    // =================================================

    return "unknown";

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
        passwordInput?.value
            ?.trim() || "";


    // =================================================
    // VALIDATION
    // =================================================

    if (
        !studentId
    ) {

        showMessage(
            "Please enter your Student ID."
        );


        studentIdInput?.focus();


        return;

    }


    if (
        !password
    ) {

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
        // UNKNOWN STUDENT TYPE
        // =============================================

        if (
            studentType ===
            "unknown"
        ) {

            showMessage(
                "Unable to determine your student category. Please contact the administrator."
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


        // =================================================
        // A/L FIRST LOGIN
        // =================================================
        //
        // A/L students ONLY go to:
        //
        // student-registration.html
        //
        // Grade 10 / Grade 11 NEVER go here.
        //
        // =================================================

        if (
            studentType ===
            "al"
        ) {

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
                    300
                );


                return;

            }

        }


        // =================================================
        // GRADE 10 / GRADE 11 FIRST LOGIN
        // =================================================
        //
        // IMPORTANT:
        //
        // These students MUST NOT go to
        // student-registration.html.
        //
        // They go to:
        //
        // change-password.html?id=STUDENT_ID
        //
        // =================================================

        if (
            (
                studentType === "grade10" ||
                studentType === "grade11"
            ) &&
            data?.mustChangePassword === true
        ) {

            sessionStorage.setItem(
                "