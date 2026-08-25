// =====================================================
// STUDENT FIRST LOGIN REGISTRATION
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


const fullNameInput =
    document.getElementById(
        "fullName"
    );


const nicInput =
    document.getElementById(
        "nicNumber"
    );


const newPasswordInput =
    document.getElementById(
        "newPassword"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );


const completeBtn =
    document.getElementById(
        "completeBtn"
    );


const message =
    document.getElementById(
        "message"
    );


// =====================================================
// SESSION
// =====================================================

const loggedIn =
    sessionStorage.getItem(
        "loggedIn"
    ) === "true";


const studentId =
    (
        sessionStorage.getItem(
            "studentId"
        ) || ""
    )
    .trim()
    .toUpperCase();


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    text,
    type = "error"
) {

    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.className =
        "message show " +
        type;

}


// =====================================================
// CHECK SESSION
// =====================================================

if (
    !loggedIn ||
    !studentId
) {

    window.location.replace(
        "index.html"
    );

}


// =====================================================
// SHOW ADMISSION NUMBER
// =====================================================

if (studentIdInput) {

    studentIdInput.value =
        studentId;

}


// =====================================================
// VALIDATE NIC
// =====================================================

function validateNIC(
    nic
) {

    const cleanNIC =
        String(
            nic || ""
        )
        .trim()
        .toUpperCase();


    // -----------------------------------------------
    // OLD SRI LANKAN NIC
    // Example:
    // 123456789V
    // 123456789X
    // -----------------------------------------------

    const oldNIC =
        /^[0-9]{9}[VX]$/;


    // -----------------------------------------------
    // NEW SRI LANKAN NIC
    // Example:
    // 200012345678
    // -----------------------------------------------

    const newNIC =
        /^[0-9]{12}$/;


    return (
        oldNIC.test(
            cleanNIC
        ) ||
        newNIC.test(
            cleanNIC
        )
    );

}


// =====================================================
// LOAD STUDENT
// =====================================================

async function loadStudent() {

    if (!studentId) {
        return;
    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        const snapshot =
            await getDoc(
                studentRef
            );


        // =============================================
        // NOT FOUND
        // =============================================

        if (
            !snapshot.exists()
        ) {

            showMessage(
                "Student account could not be found."
            );


            if (completeBtn) {

                completeBtn.disabled =
                    true;

            }


            return;

        }


        const data =
            snapshot.data();


        // =============================================
        // IMPORTANT
        // =============================================
        //
        // Only students with
        // mustChangePassword = true
        // should complete this page.
        //
        // =============================================

        if (
            data?.mustChangePassword !== true
        ) {

            window.location.replace(
                "dashboard.html"
            );


            return;

        }


        // =============================================
        // EXISTING FULL NAME
        // =============================================

        const existingName =
            data?.fullName ||
            data?.name ||
            data?.studentName ||
            "";


        if (
            existingName &&
            fullNameInput
        ) {

            fullNameInput.value =
                existingName;

        }

    }
    catch (error) {

        console.error(
            "Student registration load error:",
            error
        );


        showMessage(
            "Unable to load your registration details. Please try again."
        );

    }

}


// =====================================================
// COMPLETE REGISTRATION
// =====================================================

async function completeRegistration() {

    const fullName =
        fullNameInput?.value
            ?.trim() || "";


    const nicNumber =
        nicInput?.value
            ?.trim()
            .toUpperCase() || "";


    const newPassword =
        newPasswordInput?.value
            ?.trim() || "";


    const confirmPassword =
        confirmPasswordInput?.value
            ?.trim() || "";


    // =================================================
    // FULL NAME
    // =================================================

    if (!fullName) {

        showMessage(
            "Please enter your full name."
        );


        fullNameInput?.focus();


        return;

    }


    if (
        fullName.length < 3
    ) {

        showMessage(
            "Please enter a valid full name."
        );


        fullNameInput?.focus();


        return;

    }


    // =================================================
    // NIC
    // =================================================

    if (!nicNumber) {

        showMessage(
            "Please enter your NIC number."
        );


        nicInput?.focus();


        return;

    }


    if (
        !validateNIC(
            nicNumber
        )
    ) {

        showMessage(
            "Please enter a valid NIC number."
        );


        nicInput?.focus();


        return;

    }


    // =================================================
    // PASSWORD
    // =================================================

    if (!newPassword) {

        showMessage(
            "Please create a new password."
        );


        newPasswordInput?.focus();


        return;

    }


    if (
        newPassword.length < 6
    ) {

        showMessage(
            "New password must contain at least 6 characters."
        );


        newPasswordInput?.focus();


        return;

    }


    // =================================================
    // PASSWORD MUST NOT EQUAL ADMISSION NUMBER
    // =================================================

    if (
        newPassword.toUpperCase() ===
        studentId.toUpperCase()
    ) {

        showMessage(
            "Your new password cannot be the same as your Admission Number."
        );


        newPasswordInput?.focus();


        return;

    }


    // =================================================
    // CONFIRM PASSWORD
    // =================================================

    if (
        newPassword !==
        confirmPassword
    ) {

        showMessage(
            "Passwords do not match."
        );


        confirmPasswordInput?.focus();


        return;

    }


    // =================================================
    // DISABLE BUTTON
    // =================================================

    if (completeBtn) {

        completeBtn.disabled =
            true;


        completeBtn.textContent =
            "Saving...";

    }


    showMessage(
        "",
        "success"
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


        const snapshot =
            await getDoc(
                studentRef
            );


        // =============================================
        // STUDENT NOT FOUND
        // =============================================

        if (
            !snapshot.exists()
        ) {

            throw new Error(
                "Student account was not found."
            );

        }


        const existingData =
            snapshot.data();


        // =============================================
        // SECURITY CHECK
        // =============================================

        if (
            existingData?.mustChangePassword !== true
        ) {

            window.location.replace(
                "dashboard.html"
            );


            return;

        }


        // =============================================
        // UPDATE FIRESTORE
        // =============================================

        await updateDoc(
            studentRef,
            {

                // -------------------------------
                // Student name
                // -------------------------------

                fullName:
                    fullName,

                name:
                    fullName,

                studentName:
                    fullName,


                // -------------------------------
                // NIC
                // -------------------------------

                nicNumber:
                    nicNumber,


                // -------------------------------
                // New password
                // -------------------------------

                password:
                    newPassword,


                // -------------------------------
                // Registration status
                // -------------------------------

                mustChangePassword:
                    false,

                profileCompleted:
                    true,

                registrationCompleted:
                    true,


                // -------------------------------
                // Registration timestamp
                // -------------------------------

                registrationCompletedAt:
                    Date.now()

            }
        );


        // =================================================
        // UPDATE SESSION
        // =================================================

        sessionStorage.setItem(
            "studentName",
            fullName
        );


        sessionStorage.setItem(
            "studentNIC",
            nicNumber
        );


        sessionStorage.setItem(
            "registrationCompleted",
            "true"
        );


        // =================================================
        // SUCCESS
        // =================================================

        showMessage(
            "Registration completed successfully. Redirecting...",
            "success"
        );


        // =================================================
        // REDIRECT
        // =================================================

        setTimeout(
            () => {

                window.location.replace(
                    "dashboard.html"
                );

            },
            800
        );

    }
    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        showMessage(
            "Unable to complete registration. Please try again."
        );

    }
    finally {

        if (completeBtn) {

            completeBtn.disabled =
                false;


            completeBtn.textContent =
                "Complete Registration";

        }

    }

}


// =====================================================
// BUTTON
// =====================================================

if (completeBtn) {

    completeBtn.addEventListener(
        "click",
        completeRegistration
    );

}


// =====================================================
// ENTER KEY
// =====================================================

[
    fullNameInput,
    nicInput,
    newPasswordInput,
    confirmPasswordInput
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


                    completeRegistration();

                }

            }
        );

    }
);


// =====================================================
// START
// =====================================================

loadStudent();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "======================================"
);

console.log(
    "🎓 FIRST LOGIN REGISTRATION"
);

console.log(
    "Student ID:",
    studentId
);

console.log(
    "Registration System: ACTIVE"
);

console.log(
    "======================================"
);
