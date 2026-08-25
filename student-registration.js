// =====================================================
// STUDENT REGISTRATION SYSTEM
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


const confirmCheckbox =
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


const toggleNewPassword =
    document.getElementById(
        "toggleNewPassword"
    );


const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


const requirementLength =
    document.getElementById(
        "requirementLength"
    );


const requirementMatch =
    document.getElementById(
        "requirementMatch"
    );


// =====================================================
// SESSION
// =====================================================

const loggedIn =
    sessionStorage.getItem(
        "loggedIn"
    ) === "true";


const studentId =
    String(
        sessionStorage.getItem(
            "studentId"
        ) || ""
    )
    .trim()
    .toUpperCase();


// =====================================================
// PAGE PROTECTION
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
// SHOW MESSAGE
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
        "registration-message " +
        type;

}


// =====================================================
// STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    const type =
        String(
            data?.studentType || ""
        )
        .trim()
        .toLowerCase();


    if (
        type === "grade10" ||
        type === "grade 10"
    ) {

        return "grade10";

    }


    if (
        type === "grade11" ||
        type === "grade 11"
    ) {

        return "grade11";

    }


    return "al";

}


// =====================================================
// LOAD STUDENT
// =====================================================

async function loadStudent() {

    try {

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
                "Student account could not be found."
            );


            if (
                completeRegistrationBtn
            ) {

                completeRegistrationBtn.disabled =
                    true;

            }


            return;

        }


        const data =
            studentSnap.data();


        // =============================================
        // STUDENT TYPE
        // =============================================

        const studentType =
            getStudentType(
                data
            );


        // =============================================
        // ONLY FIRST-LOGIN ACCOUNTS
        // =============================================

        if (
            data?.mustChangePassword !==
            true
        ) {

            // Registration already completed.
            if (
                data?.registrationCompleted ===
                true ||
                data?.profileCompleted ===
                true
            ) {

                window.location.replace(
                    "dashboard.html"
                );


                return;

            }

        }


        // =============================================
        // DISPLAY ADMISSION NUMBER
        // =============================================

        if (
            studentIdInput
        ) {

            studentIdInput.value =
                studentId;

        }


        // =============================================
        // PRE-FILL EXISTING NAME
        // =============================================

        const existingName =
            data?.fullName ||
            data?.name ||
            data?.studentName ||
            "";


        if (
            fullNameInput &&
            existingName
        ) {

            fullNameInput.value =
                existingName;

        }


        // =============================================
        // PRE-FILL NIC
        // =============================================

        if (
            nicNumberInput &&
            data?.nicNumber
        ) {

            nicNumberInput.value =
                String(
                    data.nicNumber
                );

        }


        // =============================================
        // SESSION
        // =============================================

        sessionStorage.setItem(
            "studentType",
            studentType
        );


        console.log(
            "======================================"
        );

        console.log(
            "STUDENT REGISTRATION LOADED"
        );

        console.log(
            "Admission Number:",
            studentId
        );

        console.log(
            "Student Type:",
            studentType
        );

        console.log(
            "Must Change Password:",
            data?.mustChangePassword
        );

        console.log(
            "======================================"
        );

    }

    catch (
        error
    ) {

        console.error(
            "Load student error:",
            error
        );


        showMessage(
            "Unable to load your student account."
        );

    }

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

            const show =
                input.type ===
                "password";


            input.type =
                show
                    ? "text"
                    : "password";


            button.textContent =
                show
                    ? "🙈"
                    : "🙊";


            button.setAttribute(
                "aria-label",
                show
                    ? "Hide password"
                    : "Show password"
            );

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


    const lengthValid =
        password.length >= 6;


    const matchValid =
        password.length > 0 &&
        password ===
        confirmPassword;


    if (
        requirementLength
    ) {

        requirementLength.classList.toggle(
            "valid",
            lengthValid
        );

        requirementLength.classList.toggle(
            "invalid",
            !lengthValid
        );


        const icon =
            requirementLength.querySelector(
                "span"
            );


        if (
            icon
        ) {

            icon.textContent =
                lengthValid
                    ? "✓"
                    : "○";

        }

    }


    if (
        requirementMatch
    ) {

        requirementMatch.classList.toggle(
            "valid",
            matchValid
        );

        requirementMatch.classList.toggle(
            "invalid",
            !matchValid
        );


        const icon =
            requirementMatch.querySelector(
                "span"
            );


        if (
            icon
        ) {

            icon.textContent =
                matchValid
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
        updatePasswordRequirements
    );

}


if (
    confirmPasswordInput
) {

    confirmPasswordInput.addEventListener(
        "input",
        updatePasswordRequirements
    );

}


// =====================================================
// CLEAN TEXT
// =====================================================

function cleanText(
    value
) {

    return String(
        value || ""
    )
    .trim()
    .replace(
        /\s+/g,
        " "
    );

}


// =====================================================
// VALIDATE FULL NAME
// =====================================================

function validateFullName(
    value
) {

    const name =
        cleanText(
            value
        );


    if (
        !name
    ) {

        return {
            valid: false,
            message:
                "Please enter your full name."
        };

    }


    if (
        name.length <
        3
    ) {

        return {
            valid: false,
            message:
                "Please enter your complete full name."
        };

    }


    if (
        name.length >
        100
    ) {

        return {
            valid: false,
            message:
                "Full name is too long."
        };

    }


    return {
        valid: true,
        value: name
    };

}


// =====================================================
// VALIDATE NIC
// =====================================================

function validateNIC(
    value
) {

    const nic =
        cleanText(
            value
        )
        .toUpperCase()
        .replace(
            /\s+/g,
            ""
        );


    if (
        !nic
    ) {

        return {
            valid: false,
            message:
                "Please enter your NIC number."
        };

    }


    /*
       Sri Lankan NIC formats supported:

       Old:
       123456789V
       123456789X

       New:
       200012345678
    */

    const oldNIC =
        /^[0-9]{9}[VX]$/i;


    const newNIC =
        /^[0-9]{12}$/;


    if (
        !oldNIC.test(nic) &&
        !newNIC.test(nic)
    ) {

        return {
            valid: false,
            message:
                "Please enter a valid NIC number."
        };

    }


    return {
        valid: true,
        value: nic
    };

}


// =====================================================
// VALIDATE PASSWORD
// =====================================================

function validatePassword(
    password,
    confirmPassword
) {

    if (
        !password
    ) {

        return {
            valid: false,
            message:
                "Please create a new password."
        };

    }


    if (
        password.length <
        6
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
        valid: true
    };

}


// =====================================================
// COMPLETE REGISTRATION
// =====================================================

async function completeRegistration() {

    // ================================================
    // GET VALUES
    // ================================================

    const fullName =
        cleanText(
            fullNameInput?.value
        );


    const nicNumber =
        cleanText(
            nicNumberInput?.value
        )
        .toUpperCase()
        .replace(
            /\s+/g,
            ""
        );


    const newPassword =
        newPasswordInput?.value ||
        "";


    const confirmPassword =
        confirmPasswordInput?.value ||
        "";


    // ================================================
    // VALIDATE NAME
    // ================================================

    const nameValidation =
        validateFullName(
            fullName
        );


    if (
        !nameValidation.valid
    ) {

        showMessage(
            nameValidation.message
        );


        fullNameInput?.focus();


        return;

    }


    // ================================================
    // VALIDATE NIC
    // ================================================

    const nicValidation =
        validateNIC(
            nicNumber
        );


    if (
        !nicValidation.valid
    ) {

        showMessage(
            nicValidation.message
        );


        nicNumberInput?.focus();


        return;

    }


    // ================================================
    // VALIDATE PASSWORD
    // ================================================

    const passwordValidation =
        validatePassword(
            newPassword,
            confirmPassword
        );


    if (
        !passwordValidation.valid
    ) {

        showMessage(
            passwordValidation.message
        );


        if (
            newPassword.length <
            6
        ) {

            newPasswordInput?.focus();

        }
        else {

            confirmPasswordInput?.focus();

        }


        return;

    }


    // ================================================
    // CONFIRM CHECKBOX
    // ================================================

    if (
        !confirmCheckbox?.checked
    ) {

        showMessage(
            "Please confirm that the information provided is accurate."
        );


        return;

    }


    // ================================================
    // STUDENT ID
    // ================================================

    if (
        !studentId
    ) {

        showMessage(
            "Student session could not be identified. Please login again."
        );


        return;

    }


    // ================================================
    // BUTTON
    // ================================================

    if (
        completeRegistrationBtn
    ) {

        completeRegistrationBtn.disabled =
            true;


        completeRegistrationBtn.innerHTML =
            `
                <span>
                    Saving Registration...
                </span>
            `;

    }


    showMessage(
        "Saving your registration...",
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


        const studentSnap =
            await getDoc(
                studentRef
            );


        if (
            !studentSnap.exists()
        ) {

            throw new Error(
                "Student account was not found."
            );

        }


        const currentData =
            studentSnap.data();


        // =============================================
        // UPDATE FIRESTORE
        // =============================================

        await updateDoc(
            studentRef,
            {

                // -------------------------------
                // Personal information
                // -------------------------------

                fullName:
                    nameValidation.value,


                name:
                    nameValidation.value,


                studentName:
                    nameValidation.value,


                nicNumber:
                    nicValidation.value,


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
                    Date.now(),

                // -------------------------------
                // Activity
                // -------------------------------

                lastActiveAt:
                    Date.now()

            }
        );


        // =============================================
        // UPDATE SESSION
        // =============================================

        sessionStorage.setItem(
            "studentName",
            nameValidation.value
        );


        sessionStorage.setItem(
            "studentNIC",
            nicValidation.value
        );


        sessionStorage.setItem(
            "loggedIn",
            "true"
        );


        // =============================================
        // SUCCESS
        // =============================================

        showMessage(
            "Registration completed successfully. Redirecting...",
            "success"
        );


        // =============================================
        // REDIRECT
        // =============================================

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
// SUBMIT BUTTON
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

        if (
            !input
        ) {

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
// CLEAR MESSAGE
// =====================================================

[
    fullNameInput,
    nicNumberInput,
    newPasswordInput,
    confirmPasswordInput
]
.forEach(
    input => {

        if (
            !input
        ) {

            return;

        }


        input.addEventListener(
            "input",
            () => {

                if (
                    registrationMessage
                ) {

                    registrationMessage.textContent =
                        "";

                    registrationMessage.className =
                        "registration-message";

                }

            }
        );

    }
);


// =====================================================
// LOAD
// =====================================================

loadStudent();


// =====================================================
// INITIAL PASSWORD STATUS
// =====================================================

updatePasswordRequirements();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "======================================"
);

console.log(
    "✅ STUDENT REGISTRATION SYSTEM LOADED"
);

console.log(
    "Admission Number:",
    studentId
);

console.log(
    "Full Name: ENABLED"
);

console.log(
    "NIC Number: ENABLED"
);

console.log(
    "Password Change: ENABLED"
);

console.log(
    "Firebase Save: ENABLED"
);

console.log(
    "======================================"
);
