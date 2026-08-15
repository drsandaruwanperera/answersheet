import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =====================================================
// CHECK LOGIN
// =====================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace("index.html");

}


// =====================================================
// GET STUDENT ID
// =====================================================

const studentId =
    sessionStorage.getItem("studentId");


// =====================================================
// ELEMENTS
// =====================================================

const studentIdElement =
    document.getElementById("studentId");

const studentGradeElement =
    document.getElementById("studentGrade");

const greetingElement =
    document.getElementById("greeting");

const gradeLabelElement =
    document.getElementById("gradeLabel");

const onlineStatusElement =
    document.getElementById("onlineStatus");

const modelPapersCard =
    document.getElementById("modelPapersCard");

const grade11PastPapersCard =
    document.getElementById(
        "grade11PastPapersCard"
    );

const provincePapersCard =
    document.getElementById(
        "provincePapersCard"
    );

const modelPapersDescription =
    document.getElementById(
        "modelPapersDescription"
    );

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// DISPLAY STUDENT ID
// =====================================================

if (studentIdElement) {

    studentIdElement.textContent =
        studentId || "—";

}


// =====================================================
// FIREBASE STUDENT REFERENCE
// =====================================================

let studentRef = null;

if (studentId) {

    studentRef =
        doc(
            db,
            "students",
            studentId
        );

}


// =====================================================
// CURRENT STUDENT DATA
// =====================================================

let currentStudentData = null;

let currentStudentType = null;


// =====================================================
// DETECT STUDENT TYPE
// =====================================================
//
// Priority:
//
// 1. Student ID pattern
// 2. Firebase studentType
// 3. Firebase grade
// 4. sessionStorage
//
// IMPORTANT:
//
// 26000 - 26999 = Grade 11
// 27000 - 27999 = Grade 10
//
// 2005xxxxxxxx = A/L
// 2006xxxxxxxx = A/L
// 2007xxxxxxxx = A/L
//
// Old NIC 9 digits + V/X = A/L
// =====================================================

function getStudentType(data) {

    const cleanId =
        String(studentId || "")
            .trim()
            .replace(/\s+/g, "")
            .toUpperCase();


    // =================================================
    // STUDENT ID NUMBER
    // =================================================

    const studentNumber =
        Number(cleanId);


    // =================================================
    // GRADE 11
    // 26000 - 26999
    // =================================================

    if (
        /^\d{5}$/.test(cleanId) &&
        Number.isInteger(studentNumber) &&
        studentNumber >= 26000 &&
        studentNumber <= 26999
    ) {

        return "grade11";

    }


    // =================================================
    // GRADE 10
    // 27000 - 27999
    // =================================================

    if (
        /^\d{5}$/.test(cleanId) &&
        Number.isInteger(studentNumber) &&
        studentNumber >= 27000 &&
        studentNumber <= 27999
    ) {

        return "grade10";

    }


    // =================================================
    // A/L - NIC 2005
    // =================================================

    if (
        cleanId.startsWith("2005")
    ) {

        return "al";

    }


    // =================================================
    // A/L - NIC 2006
    // =================================================

    if (
        cleanId.startsWith("2006")
    ) {

        return "al";

    }


    // =================================================
    // A/L - NIC 2007
    // =================================================

    if (
        cleanId.startsWith("2007")
    ) {

        return "al";

    }


    // =================================================
    // OLD NIC
    // Example:
    // 123456789V
    // 123456789X
    // =================================================

    if (
        /^\d{9}[VX]$/.test(cleanId)
    ) {

        return "al";

    }


    // =================================================
    // FIREBASE STUDENT TYPE
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
    // FIREBASE GRADE
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


    // =================================================
    // SESSION STORAGE LAST
    // =================================================

    const sessionType =
        String(
            sessionStorage.getItem(
                "studentType"
            ) || ""
        )
        .toLowerCase()
        .trim();


    if (
        sessionType === "grade10" ||
        sessionType === "grade 10"
    ) {

        return "grade10";

    }


    if (
        sessionType === "grade11" ||
        sessionType === "grade 11"
    ) {

        return "grade11";

    }


    if (
        sessionType === "al" ||
        sessionType === "a/l" ||
        sessionType === "a level" ||
        sessionType === "advanced" ||
        sessionType === "advanced level"
    ) {

        return "al";

    }


    return null;

}


// =====================================================
// GRADE DISPLAY NAME
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
// STUDENT NAME
// =====================================================

function getStudentName(data) {

    return (
        data?.name ||
        data?.studentName ||
        data?.fullName ||
        data?.displayName ||
        "Student"
    );

}


// =====================================================
// TIME BASED GREETING
// =====================================================

function updateGreeting(name) {

    if (!greetingElement) {

        return;

    }


    const hour =
        new Date().getHours();


    let greeting;


    if (
        hour >= 5 &&
        hour < 12
    ) {

        greeting = "Good morning";

    }

    else if (
        hour >= 12 &&
        hour < 17
    ) {

        greeting = "Good afternoon";

    }

    else {

        greeting = "Good evening";

    }


    greetingElement.textContent =
        `${greeting}, ${name} 👋`;

}


// =====================================================
// HIDE ALL MATERIAL CARDS
// =====================================================

function hideAllMaterialCards() {

    if (modelPapersCard) {

        modelPapersCard.style.display =
            "none";

    }


    if (grade11PastPapersCard) {

        grade11PastPapersCard.style.display =
            "none";

    }


    if (provincePapersCard) {

        provincePapersCard.style.display =
            "none";

    }

}


// =====================================================
// GET PAPER LINK
// =====================================================

function getStudentLinks(type) {

    const encodedId =
        encodeURIComponent(
            studentId || ""
        );


    // =================================================
    // GRADE 11
    // =================================================

    if (type === "grade11") {

        return {

            model:
                "grade11-model-papers.html?id=" +
                encodedId,

            past:
                "grade11-past-papers.html?id=" +
                encodedId

        };

    }


    // =================================================
    // GRADE 10
    // =================================================

    if (type === "grade10") {

        return {

            model:
                "grade10-model-paper.html?id=" +
                encodedId

        };

    }


    // =================================================
    // A/L
    // =================================================

    if (type === "al") {

        return {

            model:
                "model-papers.html?id=" +
                encodedId,

            province:
                "province-paper.html?id=" +
                encodedId

        };

    }


    return {};

}


// =====================================================
// SET CARD NAVIGATION
// =====================================================

function setupCardNavigation(
    card,
    url
) {

    if (
        !card ||
        !url
    ) {

        return;

    }


    // Mouse click

    card.onclick = () => {

        window.location.href =
            url;

    };


    // Keyboard

    card.onkeydown = event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            window.location.href =
                url;

        }

    };

}


// =====================================================
// CONFIGURE MATERIALS
// =====================================================

function configureMaterials(type) {

    // First hide everything

    hideAllMaterialCards();


    const links =
        getStudentLinks(type);


    // =================================================
    // GRADE 11
    // =================================================

    if (type === "grade11") {

        if (modelPapersCard) {

            modelPapersCard.style.display =
                "block";

        }


        if (grade11PastPapersCard) {

            grade11PastPapersCard.style.display =
                "block";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Grade 11 Model Papers";

        }


        setupCardNavigation(
            modelPapersCard,
            links.model
        );


        setupCardNavigation(
            grade11PastPapersCard,
            links.past
        );


        return;

    }


    // =================================================
    // GRADE 10
    // =================================================

    if (type === "grade10") {

        if (modelPapersCard) {

            modelPapersCard.style.display =
                "block";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Grade 10 Model Papers";

        }


        setupCardNavigation(
            modelPapersCard,
            links.model
        );


        return;

    }


    // =================================================
    // A/L
    // =================================================

    if (type === "al") {

        if (modelPapersCard) {

            modelPapersCard.style.display =
                "block";

        }


        if (provincePapersCard) {

            provincePapersCard.style.display =
                "block";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Advanced Level Model Papers";

        }


        setupCardNavigation(
            modelPapersCard,
            links.model
        );


        setupCardNavigation(
            provincePapersCard,
            links.province
        );


        return;

    }


    // =================================================
    // UNKNOWN
    // =================================================

    console.warn(
        "Student type could not be detected:",
        studentId
    );

}


// =====================================================
// UPDATE ACTIVE STATUS
// =====================================================

async function updateActiveStatus() {

    if (!studentRef) {

        return;

    }


    try {

        await updateDoc(
            studentRef,
            {

                lastActiveAt:
                    Date.now()

            }
        );


        if (
            onlineStatusElement
        ) {

            onlineStatusElement.innerHTML = `
                <span class="online-dot"></span>
                Online
            `;

        }

    }

    catch (error) {

        console.error(
            "Active status update failed:",
            error
        );

    }

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    if (!studentId) {

        console.error(
            "Student ID not found."
        );

        window.location.replace(
            "index.html"
        );

        return;

    }


    if (!studentRef) {

        return;

    }


    try {

        // =============================================
        // GET STUDENT
        // =============================================

        const snapshot =
            await getDoc(
                studentRef
            );


        if (!snapshot.exists()) {

            console.error(
                "Student not found in Firebase:",
                studentId
            );

            alert(
                "Student account not found."
            );

            sessionStorage.clear();

            window.location.replace(
                "index.html"
            );

            return;

        }


        const data =
            snapshot.data();


        currentStudentData =
            data;


        // =============================================
        // DETECT TYPE
        // =============================================

        const studentType =
            getStudentType(
                data
            );


        currentStudentType =
            studentType;


        // =============================================
        // GRADE NAME
        // =============================================

        const gradeName =
            getGradeName(
                studentType
            );


        // =============================================
        // DISPLAY GRADE
        // =============================================

        if (
            studentGradeElement
        ) {

            studentGradeElement.textContent =
                gradeName;

        }


        if (
            gradeLabelElement
        ) {

            gradeLabelElement.textContent =
                gradeName;

        }


        // =============================================
        // STUDENT NAME
        // =============================================

        const studentName =
            getStudentName(
                data
            );


        updateGreeting(
            studentName
        );


        // =============================================
        // MATERIAL CARDS
        // =============================================

        configureMaterials(
            studentType
        );


        // =============================================
        // SAVE CORRECT TYPE
        // =============================================

        if (studentType) {

            sessionStorage.setItem(
                "studentType",
                studentType
            );


            if (
                studentType === "grade10"
            ) {

                sessionStorage.setItem(
                    "studentGrade",
                    "10"
                );

            }

            else if (
                studentType === "grade11"
            ) {

                sessionStorage.setItem(
                    "studentGrade",
                    "11"
                );

            }

            else if (
                studentType === "al"
            ) {

                sessionStorage.setItem(
                    "studentGrade",
                    "al"
                );

            }

        }


        // =============================================
        // DEBUG
        // =============================================

        console.log(
            "===================================="
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Detected Student Type:",
            studentType
        );

        console.log(
            "Display Grade:",
            gradeName
        );

        console.log(
            "Firebase studentType:",
            data.studentType
        );

        console.log(
            "Firebase grade:",
            data.grade
        );

        console.log(
            "===================================="
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// =====================================================
// HEARTBEAT
// =====================================================

loadDashboard();

updateActiveStatus();


const heartbeat =
    setInterval(
        updateActiveStatus,
        30000
    );


// =====================================================
// USER ACTIVITY
// =====================================================

let lastActivity =
    Date.now();


function markActivity() {

    lastActivity =
        Date.now();

}


[
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart"
].forEach(
    eventName => {

        document.addEventListener(
            eventName,
            markActivity,
            {
                passive: true
            }
        );

    }
);


// =====================================================
// AUTO LOGOUT
// =====================================================
//
// 5 minutes inactive
//

const IDLE_LIMIT =
    5 * 60 * 1000;


const idleChecker =
    setInterval(
        async () => {

            const idleTime =
                Date.now() -
                lastActivity;


            if (
                idleTime >=
                IDLE_LIMIT
            ) {

                clearInterval(
                    heartbeat
                );

                clearInterval(
                    idleChecker
                );


                // =====================================
                // MARK OFFLINE
                // =====================================

                if (studentRef) {

                    try {

                        await updateDoc(
                            studentRef,
                            {
                                lastActiveAt:
                                    0
                            }
                        );

                    }

                    catch (error) {

                        console.error(
                            "Failed to mark offline:",
                            error
                        );

                    }

                }


                // =====================================
                // CLEAR SESSION
                // =====================================

                sessionStorage.removeItem(
                    "loggedIn"
                );

                sessionStorage.removeItem(
                    "studentId"
                );

                sessionStorage.removeItem(
                    "studentType"
                );

                sessionStorage.removeItem(
                    "studentGrade"
                );


                alert(
                    "You have been logged out because you were inactive for 5 minutes."
                );


                window.location.replace(
                    "index.html"
                );

            }

        },
        10000
    );


// =====================================================
// TAB VISIBILITY
// =====================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            lastActivity =
                Date.now();

            updateActiveStatus();


            if (
                currentStudentData
            ) {

                updateGreeting(
                    getStudentName(
                        currentStudentData
                    )
                );

            }

        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {

                return;

            }


            // =========================================
            // STOP TIMERS
            // =========================================

            clearInterval(
                heartbeat
            );

            clearInterval(
                idleChecker
            );


            // =========================================
            // MARK OFFLINE
            // =========================================

            if (studentRef) {

                try {

                    await updateDoc(
                        studentRef,
                        {
                            lastActiveAt:
                                0
                        }
                    );

                }

                catch (error) {

                    console.error(
                        "Logout status update failed:",
                        error
                    );

                }

            }


            // =========================================
            // CLEAR SESSION
            // =========================================

            sessionStorage.removeItem(
                "loggedIn"
            );

            sessionStorage.removeItem(
                "studentId"
            );

            sessionStorage.removeItem(
                "studentType"
            );

            sessionStorage.removeItem(
                "studentGrade"
            );


            // =========================================
            // GO LOGIN
            // =========================================

            window.location.replace(
                "index.html"
            );

        }
    );

}


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Student Dashboard Loaded"
);

console.log(
    "Student ID:",
    studentId
);
