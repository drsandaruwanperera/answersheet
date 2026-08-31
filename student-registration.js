// =====================================================
// STUDENT REGISTRATION / FIRST LOGIN ONBOARDING
// A/L STUDENTS ONLY
// =====================================================


// =====================================================
// FIREBASE
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

const registrationStudentId =
    document.getElementById(
        "registrationStudentId"
    );


const fullNameInput =
    document.getElementById(
        "fullName"
    );


const nicNumberInput =
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


const registrationConfirm =
    document.getElementById(
        "registrationConfirm"
    );


const completeRegistrationBtn =
    document.getElementById(
        "completeRegistrationBtn"
    );


const registrationMessage =
    document.getElementById(
        "registrationMessage"
    );


const requirementLength =
    document.getElementById(
        "requirementLength"
    );


const requirementMatch =
    document.getElementById(
        "requirementMatch"
    );


const toggleNewPassword =
    document.getElementById(
        "toggleNewPassword"
    );


const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
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
        ) ||
        ""
    )
        .trim()
        .toUpperCase();


// =====================================================
// A/L STUDENT ID VALIDATION
// =====================================================

function isALStudentId(
    id
) {

    const cleanId =
        String(
            id || ""
        )
            .trim()
            .toUpperCase();


    /*
        A/L admission series:

        A27000 - A27999
        A28000 - A28999
        A29000 - A29999

        Pattern:

        A2
        followed by 7 / 8 / 9
        followed by exactly 3 digits
    */

    return /^A2[789]\d{3}$/.test(
        cleanId
    );

}


// =====================================================
// CHECK LOGIN
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
// CHECK A/L ONLY
// =====================================================

if (
    loggedIn &&
    studentId &&
    !isALStudentId(
        studentId
    )
) {

    console.warn(
        "Non A/L student attempted onboarding:",
        studentId
    );


    alert(
        "A/L Student Registration Only.\n\n" +
        "This registration page is only available for A/L students."
    );


    sessionStorage.removeItem(
        "loggedIn"
    );


    sessionStorage.removeItem(
        "studentId"
    );


    sessionStorage.removeItem(
        "studentName"
    );


    sessionStorage.removeItem(
        "studentNIC"
    );


    window.location.replace(
        "index.html"
    );

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type = "error"
) {

    if (
        !registrationMessage
    ) {

        return;

    }


    registrationMessage.textContent =
        message;


    registrationMessage.className =
        "registration-message";


    if (
        type === "success"
    ) {

        registrationMessage.classList.add(
            "success"
        );

    }
    else {

        registrationMessage.classList.add(
            "error"
        );

    }

}


// =====================================================
// SHOW STUDENT ID
// =====================================================

if (
    registrationStudentId
) {

    registrationStudentId.value =
        studentId;

}


// =====================================================
// PASSWORD TOGGLE
// =====================================================

function setupPasswordToggle(
    button,
    input
) {

    if (
        !button ||
        !input
    ) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const isPassword =
                input.type ===
                "password";


            if (
                isPassword
            ) {

                input.type =
                    "text";


                button.textContent =
                    "🙈";


                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }
            else {

                input.type =
                    "password";


                button.textContent =
                    "🙊";


                button.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


setupPasswordToggle(
    toggleNewPassword,
    newPasswordInput
);


setupPasswordToggle(
    toggleConfirmPassword,
    confirmPasswordInput
);


// =====================================================
// PASSWORD REQUIREMENTS
// =====================================================

function updatePasswordRequirements() {

    const password =
        newPasswordInput?.value ||
        "";


    const confirmPassword =
        confirmPasswordInput?.value ||
        "";


    const validLength =
        password.length >= 6;


    const passwordsMatch =
        password.length > 0 &&
        password ===
        confirmPassword;


    if (
        requirementLength
    ) {

        requirementLength.classList.toggle(
            "valid",
            validLength
        );


        const icon =
            requirementLength.querySelector(
                "span"
            );


        if (icon) {

            icon.textContent =
                validLength
                    ? "✓"
                    : "○";

        }

    }


    if (
        requirementMatch
    ) {

        requirementMatch.classList.toggle(
            "valid",
            passwordsMatch
        );


        const icon =
            requirementMatch.querySelector(
                "span"
            );


        if (icon) {

            icon.textContent =
                passwordsMatch
                    ? "✓"
                    : "○";

        }

    }

}


if (
    newPasswordInput
) {

    newPasswordInput.addEventListener(
        "input",
        () => {

            updatePasswordRequirements();

            clearMessage();

        }
    );

}


if (
    confirmPasswordInput
) {

    confirmPasswordInput.addEventListener(
        "input",
        () => {

            updatePasswordRequirements();

            clearMessage();

        }
    );

}


// =====================================================
// CLEAR MESSAGE
// =====================================================

function clearMessage() {

    if (
        registrationMessage
    ) {

        registrationMessage.textContent =
            "";


        registrationMessage.className =
            "registration-message";

    }

}


if (
    fullNameInput
) {

    fullNameInput.addEventListener(
        "input",
        clearMessage
    );

}


if (
    nicNumberInput
) {

    nicNumberInput.addEventListener(
        "input",
        clearMessage
    );

}


if (
    registrationConfirm
) {

    registrationConfirm.addEventListener(
        "change",
        clearMessage
    );

}


// =====================================================
// LOAD STUDENT
// =====================================================

async function loadStudent() {

    try {

        if (
            !studentId
        ) {

            return;

        }


        // ---------------------------------------------
        // A/L ONLY CHECK
        // ---------------------------------------------

        if (
            !isALStudentId(
                studentId
            )
        ) {

            showMessage(
                "This registration page is only for A/L students."
            );


            return;

        }


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


        if (
            !studentSnap.exists()
        ) {

            showMessage(
                "A/L student account could not be found."
            );


            return;

        }


        const data =
            studentSnap.data();


        // =============================================
        // If already registered
        // =============================================

        const alreadyRegistered =
            data?.profileCompleted === true &&
            data?.registrationCompleted === true &&
            data?.mustChangePassword !== true;


        if (
            alreadyRegistered
        ) {

            window.location.replace(
                "dashboard.html"
            );


            return;

        }


        // =============================================
        // Existing name
        // =============================================

        if (
            fullNameInput
        ) {

            const existingName =
                data?.fullName ||
                data?.name ||
                data?.studentName ||
                "";


            if (
                existingName
            ) {

                fullNameInput.value =
                    existingName;

            }

        }


        // =============================================
        // Existing NIC
        // =============================================

        if (
            nicNumberInput
        ) {

            if (
                data?.nicNumber
            ) {

                nicNumberInput.value =
                    String(
                        data.nicNumber
                    );

            }

        }

    }
    catch (
        error
    ) {

        console.error(
            "Load registration error:",
            error
        );


        showMessage(
            "Unable to load your registration details. Please try again."
        );

    }

}


// =====================================================
// VALIDATE NAME
// =====================================================

function validateName(
    name
) {

    const clean =
        String(
            name || ""
        )
            .trim()
            .replace(
                /\s+/g,
                " "
            );


    if (
        !clean
    ) {

        return {

            valid: false,

            message:
                "Please enter your full name."

        };

    }


    if (
        clean.length < 3
    ) {

        return {

            valid: false,

            message:
                "Please enter your full name."

        };

    }


    return {

        valid: true,

        value:
            clean

    };

}


// =====================================================
// VALIDATE NIC
// =====================================================

function validateNIC(
    nic
) {

    const clean =
        String(
            nic || ""
        )
            .trim()
            .toUpperCase()
            .replace(
                /\s+/g,
                ""
            );


    if (
        !clean
    ) {

        return {

            valid: false,

            message:
                "Please enter your NIC number."

        };

    }


    /*
        Supports common Sri Lankan NIC formats:

        Old:
        123456789V
        123456789X

        New:
        123456789012
    */


    const oldNIC =
        /^\d{9}[VX]$/i.test(
            clean
        );


    const newNIC =
        /^\d{12}$/.test(
            clean
        );


    if (
        !oldNIC &&
        !newNIC
    ) {

        return {

            valid: false,

            message:
                "Please enter a valid NIC number."

        };

    }


    return {

        valid: true,

        value:
            clean

    };

}


// =====================================================
// VALIDATE PASSWORD
// =====================================================

function validatePassword() {

    const password =
        newPasswordInput?.value ||
        "";


    const confirmPassword =
        confirmPasswordInput?.value ||
        "";


    if (
        password.length < 6
    ) {

        return {

            valid: false,

            message:
                "Password must contain at least 6 characters."

        };

    }


    if (
        password !==
        confirmPassword
    ) {

        return {

            valid: false,

            message:
                "Passwords do not match."

        };

    }


    return {

        valid: true,

        value:
            password

    };

}


// =====================================================
// COMPLETE REGISTRATION
// =====================================================

async function completeRegistration() {

    // ================================================
    // Check session
    // ================================================

    if (
        !loggedIn ||
        !studentId
    ) {

        window.location.replace(
            "index.html"
        );


        return;

    }


    // ================================================
    // A/L ONLY - SECOND SECURITY CHECK
    // ================================================

    if (
        !isALStudentId(
            studentId
        )
    ) {

        showMessage(
            "Only A/L students can complete registration."
        );


        alert(
            "Only A/L students are allowed to register."
        );


        return;

    }


    // ================================================
    // Get values
    // ================================================

    const nameResult =
        validateName(
            fullNameInput?.value
        );


    if (
        !nameResult.valid
    ) {

        showMessage(
            nameResult.message
        );


        fullNameInput?.focus();


        return;

    }


    const nicResult =
        validateNIC(
            nicNumberInput?.value
        );


    if (
        !nicResult.valid
    ) {

        showMessage(
            nicResult.message
        );


        nicNumberInput?.focus();


        return;

    }


    const passwordResult =
        validatePassword();


    if (
        !passwordResult.valid
    ) {

        showMessage(
            passwordResult.message
        );


        newPasswordInput?.focus();


        return;

    }


    // ================================================
    // Confirmation
    // ================================================

    if (
        !registrationConfirm?.checked
    ) {

        showMessage(
            "Please confirm that the information provided is accurate."
        );


        return;

    }


    // ================================================
    // Disable button
    // ================================================

    if (
        completeRegistrationBtn
    ) {

        completeRegistrationBtn.disabled =
            true;


        completeRegistrationBtn.innerHTML =
            `
                <span>
                    Completing Registration...
                </span>
            `;

    }


    showMessage(
        "Saving your registration...",
        "success"
    );


    try {

        // ============================================
        // Student reference
        // ============================================

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        // ============================================
        // Check student
        // ============================================

        const studentSnap =
            await getDoc(
                studentRef
            );


        if (
            !studentSnap.exists()
        ) {

            throw new Error(
                "A/L student account not found."
            );

        }


        const currentData =
            studentSnap.data();


        // ============================================
        // FINAL A/L CHECK
        // ============================================

        /*
            Even if somebody manually changes
            sessionStorage, registration will still
            only continue for A/L IDs.
        */

        if (
            !isALStudentId(
                studentId
            )
        ) {

            throw new Error(
                "Only A/L students are allowed to complete registration."
            );

        }


        // ============================================
        // Update registration
        // ============================================

        await updateDoc(
            studentRef,
            {

                fullName:
                    nameResult.value,

                name:
                    nameResult.value,

                studentName:
                    nameResult.value,

                nicNumber:
                    nicResult.value,

                password:
                    passwordResult.value,

                mustChangePassword:
                    false,

                profileCompleted:
                    true,

                registrationCompleted:
                    true,

                lastActiveAt:
                    Date.now(),

                registrationCompletedAt:
                    Date.now(),

                category:
                    "A/L",

                studentCategory:
                    "A/L"

            }
        );


        // ============================================
        // Update session
        // ============================================

        sessionStorage.setItem(
            "studentName",
            nameResult.value
        );


        sessionStorage.setItem(
            "studentNIC",
            nicResult.value
        );


        sessionStorage.setItem(
            "loggedIn",
            "true"
        );


        sessionStorage.setItem(
            "studentId",
            studentId
        );


        // ============================================
        // Success
        // ============================================

        showMessage(
            "A/L registration completed successfully. Redirecting...",
            "success"
        );


        // ============================================
        // Redirect
        // ============================================

        setTimeout(
            () => {

                window.location.replace(
                    "dashboard.html"
                );

            },
            800
        );

    }
    catch (
        error
    ) {

        console.error(
            "Registration error:",
            error
        );


        showMessage(
            error?.message ||
            "Unable to complete registration. Please try again."
        );

    }
    finally {

        if (
            completeRegistrationBtn
        ) {

            completeRegistrationBtn.disabled =
                false;


            completeRegistrationBtn.innerHTML =
                `
                    <span>
                        Complete Registration
                    </span>

                    <span>
                        →
                    </span>
                `;

        }

    }

}


// =====================================================
// BUTTON
// =====================================================

if (
    completeRegistrationBtn
) {

    completeRegistrationBtn.addEventListener(
        "click",
        completeRegistration
    );

}


// =====================================================
// ENTER KEY
// =====================================================

[
    fullNameInput,
    nicNumberInput,
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

console.log(
    "========================================"
);

console.log(
    "A/L STUDENT REGISTRATION SYSTEM"
);

console.log(
    "Student ID:",
    studentId
);

console.log(
    "A/L Student:",
    isALStudentId(
        studentId
    )
);

console.log(
    "Allowed Series:"
);

console.log(
    "A27000 - A27999"
);

console.log(
    "A28000 - A28999"
);

console.log(
    "A29000 - A29999"
);

console.log(
    "First Login Onboarding: ACTIVE"
);

console.log(
    "Password Change: REQUIRED"
);

console.log(
    "Profile Completion: REQUIRED"
);

console.log(
    "========================================"
);


// =====================================================
// LOAD
// =====================================================

if (
    isALStudentId(
        studentId
    )
) {

    loadStudent();

}
