import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// STUDENT LOGIN
// =====================================================

// Elements
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
        alert(message);
        return;
    }

    msg.textContent = message;

    msg.className = "message " + type;

}


// =====================================================
// GET STUDENT TYPE
// =====================================================

function detectStudentType(studentId, data = {}) {

    const cleanId =
        String(studentId || "")
            .trim()
            .replace(/\s+/g, "");


    // =================================================
    // A/L STUDENTS
    // 2005 - 2009
    // =================================================

    if (
        cleanId.startsWith("2005") ||
        cleanId.startsWith("2006") ||
        cleanId.startsWith("2007") ||
        cleanId.startsWith("2008") ||
        cleanId.startsWith("2009")
    ) {

        return "al";

    }


    // =================================================
    // OLD NIC
    // =================================================

    if (
        /^\d{9}[VvXx]$/.test(cleanId)
    ) {

        return "al";

    }


    // =================================================
    // GRADE 11
    // 26000 - 26999
    // =================================================

    if (
        /^\d{5}$/.test(cleanId)
    ) {

        const number =
            Number(cleanId);


        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "grade11";

        }


        // =================================================
        // GRADE 10
        // 27000 - 27999
        // =================================================

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // =================================================
    // FIREBASE studentType
    // =================================================

    const firebaseType =
        String(
            data?.studentType || ""
        )
        .toLowerCase()
        .trim();


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
    // FIREBASE grade
    // =================================================

    const firebaseGrade =
        String(
            data?.grade || ""
        )
        .toLowerCase()
        .trim();


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


    return null;

}


// =====================================================
// GET DISPLAY GRADE
// =====================================================

function getGradeName(type) {

    if (type === "grade10") {
        return "Grade 10";
    }

    if (type === "grade11") {
        return "Grade 11";
    }

    if (type === "al") {
        return "Advanced Level";
    }

    return "Student";

}


// =====================================================
// LOGIN
// =====================================================

async function loginStudent() {

    const studentId =
        studentIdInput
            ?.value
            ?.trim();


    const password =
        passwordInput
            ?.value
            ?.trim();


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

        loginBtn.dataset.originalText =
            loginBtn.innerHTML;

        loginBtn.innerHTML =
            "Signing In...";

    }


    try {

        console.log(
            "Student login attempt:",
            studentId
        );


        // =================================================
        // FIREBASE STUDENT DOCUMENT
        // =================================================

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


        // =================================================
        // STUDENT NOT FOUND
        // =================================================

        if (
            !studentSnap.exists()
        ) {

            console.error(
                "Student document not found:",
                studentId
            );

            showMessage(
                "Invalid Student ID or Password."
            );

            return;

        }


        // =================================================
        // STUDENT DATA
        // =================================================

        const data =
            studentSnap.data();


        console.log(
            "Student data loaded:",
            data
        );


        // =================================================
        // PASSWORD
        // =================================================

        const storedPassword =
            String(
                data.password ??
                ""
            ).trim();


        if (
            storedPassword === ""
        ) {

            showMessage(
                "This student account has no password."
            );

            return;

        }


        if (
            password !==
            storedPassword
        ) {

            console.warn(
                "Incorrect password:",
                studentId
            );

            showMessage(
                "Invalid Student ID or Password."
            );

            return;

        }


        // =================================================
        // DETECT STUDENT TYPE
        // =================================================

        const studentType =
            detectStudentType(
                studentId,
                data
            );


        if (!studentType) {

            showMessage(
                "Unable to identify this student account."
            );

            console.error(
                "Student type could not be detected:",
                {
                    studentId,
                    studentType: data.studentType,
                    grade: data.grade
                }
            );

            return;

        }


        const gradeName =
            getGradeName(
                studentType
            );


        // =================================================
        // SAVE LOGIN SESSION
        // =================================================

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


        // =================================================
        // SAVE STUDENT NAME
        // =================================================

        const studentName =
            data.name ||
            data.studentName ||
            data.fullName ||
            data.displayName ||
            "Student";


        sessionStorage.setItem(
            "studentName",
            studentName
        );


        // =================================================
        // UPDATE LAST ACTIVE
        // =================================================

        try {

            // Important:
            // Do not let this fail the login.

            const activeRef =
                doc(
                    db,
                    "students",
                    studentId
                );


            // We intentionally don't need updateDoc here
            // for login to work.

            console.log(
                "Login successful:",
                {
                    studentId,
                    studentType,
                    gradeName,
                    studentName
                }
            );

        }

        catch (activeError) {

            console.warn(
                "Active status update skipped:",
                activeError
            );

        }


        // =================================================
        // REDIRECT
        // =================================================

        window.location.replace(
            "dashboard.html"
        );

    }

    catch (error) {

        console.error(
            "Student login error:",
            error
        );


        showMessage(
            "Login failed. Please try again."
        );

    }

    finally {

        if (loginBtn) {

            loginBtn.disabled = false;

            if (
                loginBtn.dataset.originalText
            ) {

                loginBtn.innerHTML =
                    loginBtn.dataset.originalText;

            }

        }

    }

}


// =====================================================
// BUTTON CLICK
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

if (studentIdInput) {

    studentIdInput.addEventListener(
        "keydown",
        event => {

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
        event => {

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
// PAGE LOAD
// =====================================================

console.log(
    "✅ Student Login Loaded"
);

console.log(
    "Supported A/L ID years: 2005, 2006, 2007, 2008, 2009"
);
