import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =========================================
// CHECK LOGIN
// =========================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


// =========================================
// GET STUDENT ID
// =========================================

const studentId =
    sessionStorage.getItem("studentId");


// =========================================
// ELEMENTS
// =========================================

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

const totalPapersElement =
    document.getElementById("totalPapers");

const viewedPapersElement =
    document.getElementById("viewedPapers");

const progressValueElement =
    document.getElementById("progressValue");

const modelPapersCard =
    document.getElementById("modelPapersCard");

const pastPapersCard =
    document.getElementById("pastPapersCard");

const modelPapersTitle =
    document.getElementById("modelPapersTitle");

const modelPapersDescription =
    document.getElementById("modelPapersDescription");

const pastPapersTitle =
    document.getElementById("pastPapersTitle");

const pastPapersDescription =
    document.getElementById("pastPapersDescription");

const logoutBtn =
    document.getElementById("logoutBtn");


// =========================================
// DISPLAY STUDENT ID
// =========================================

if (studentIdElement) {
    studentIdElement.textContent =
        studentId || "—";
}


// =========================================
// FIREBASE STUDENT REFERENCE
// =========================================

let studentRef = null;

if (studentId) {

    studentRef = doc(
        db,
        "students",
        studentId
    );

}


// =========================================
// CURRENT DATA
// =========================================

let currentStudentData = null;
let currentStudentType = null;


// =========================================
// DETECT STUDENT TYPE
// =========================================
//
// RULES:
//
// 26000 - 26999  = Grade 11
// 27000 - 27999  = Grade 10
//
// First 4 digits:
//
// 2005xxxxxxxx   = A/L
// 2006xxxxxxxx   = A/L
// 2007xxxxxxxx   = A/L
//
// Also supports Firebase studentType / grade.
// =========================================

function getStudentType(data) {

    const cleanId =
        String(studentId || "")
            .trim()
            .replace(/\s+/g, "");


    // =====================================
    // IMPORTANT:
    // ID NUMBER HAS PRIORITY
    // =====================================

    // -------------------------------------
    // GRADE 11
    // -------------------------------------

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

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // =====================================
    // A/L - FIRST FOUR DIGITS
    // =====================================

    const firstFour =
        cleanId.substring(0, 4);


    if (
        firstFour === "2005" ||
        firstFour === "2006" ||
        firstFour === "2007"
    ) {

        return "al";

    }


    // =====================================
    // OLD NIC
    // =====================================

    if (
        /^\d{9}[VvXx]$/.test(cleanId)
    ) {

        return "al";

    }


    // =====================================
    // SESSION STORAGE FALLBACK
    // =====================================

    const sessionType =
        String(
            sessionStorage.getItem(
                "studentType"
            ) || ""
        )
        .toLowerCase()
        .trim();


    if (
        sessionType === "grade11" ||
        sessionType === "grade 11"
    ) {

        return "grade11";

    }


    if (
        sessionType === "grade10" ||
        sessionType === "grade 10"
    ) {

        return "grade10";

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


    // =====================================
    // FIREBASE STUDENT TYPE FALLBACK
    // =====================================

    const firebaseType =
        String(
            data?.studentType || ""
        )
        .toLowerCase()
        .trim();


    if (
        firebaseType === "grade11" ||
        firebaseType === "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseType === "grade10" ||
        firebaseType === "grade 10"
    ) {

        return "grade10";

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


    // =====================================
    // FIREBASE GRADE FALLBACK
    // =====================================

    const firebaseGrade =
        String(
            data?.grade || ""
        )
        .toLowerCase()
        .trim();


    if (
        firebaseGrade === "11" ||
        firebaseGrade === "grade11" ||
        firebaseGrade === "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseGrade === "10" ||
        firebaseGrade === "grade10" ||
        firebaseGrade === "grade 10"
    ) {

        return "grade10";

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


    // =====================================
    // UNKNOWN
    // =====================================

    return null;

}


// =========================================
// GRADE DISPLAY NAME
// =========================================

function getGradeName(type) {

    if (type === "grade11") {
        return "Grade 11";
    }

    if (type === "grade10") {
        return "Grade 10";
    }

    if (type === "al") {
        return "Advanced Level";
    }

    return "Student";

}


// =========================================
// STUDENT NAME
// =========================================

function getStudentName(data) {

    return (
        data?.name ||
        data?.studentName ||
        data?.fullName ||
        data?.displayName ||
        "Student"
    );

}


// =========================================
// TIME GREETING
// =========================================

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


// =========================================
// MATERIAL CONFIGURATION
// =========================================
//
// Grade 11:
// Model Papers
// Past Papers (2016 - 2025)
//
// Grade 10:
// Model Papers only
//
// A/L:
// Model Papers
// Province Papers
// =========================================

function getMaterialConfig(type) {

    // =====================================
    // GRADE 11
    // =====================================

    if (type === "grade11") {

        return {

            model: {
                title: "Model Papers",
                description:
                    "Grade 11 Model Papers",

                url:
                    "grade11-model-papers.html"
            },

            second: {
                title: "Past Papers",
                description:
                    "Grade 11 Past Papers 2016 - 2025",

                url:
                    "grade11-past-papers.html"
            }

        };

    }


    // =====================================
    // GRADE 10
    // =====================================

    if (type === "grade10") {

        return {

            model: {
                title: "Model Papers",
                description:
                    "Grade 10 Model Papers",

                url:
                    "grade10-model-papers.html"
            },

            second: null

        };

    }


    // =====================================
    // A/L
    // =====================================

    if (type === "al") {

        return {

            model: {
                title: "Model Papers",
                description:
                    "Advanced Level Model Papers",

                url:
                    "model-papers.html"
            },

            second: {
                title: "Province Papers",
                description:
                    "Provincial Examination Papers",

                url:
                    "past-papers.html"
            }

        };

    }


    // =====================================
    // UNKNOWN
    // =====================================

    return {

        model: null,
        second: null

    };

}


// =========================================
// UPDATE CARD TEXT
// =========================================

function updateMaterialCards(type) {

    const config =
        getMaterialConfig(type);


    // =====================================
    // MODEL CARD
    // =====================================

    if (modelPapersCard) {

        if (!config.model) {

            modelPapersCard.style.display =
                "none";

        }

        else {

            modelPapersCard.style.display =
                "";

        }

    }


    if (modelPapersTitle && config.model) {

        modelPapersTitle.textContent =
            config.model.title;

    }


    if (
        modelPapersDescription &&
        config.model
    ) {

        modelPapersDescription.textContent =
            config.model.description;

    }


    // =====================================
    // SECOND CARD
    // =====================================

    if (!config.second) {

        if (pastPapersCard) {

            pastPapersCard.style.display =
                "none";

        }

    }

    else {

        if (pastPapersCard) {

            pastPapersCard.style.display =
                "";

        }


        if (pastPapersTitle) {

            pastPapersTitle.textContent =
                config.second.title;

        }


        if (pastPapersDescription) {

            pastPapersDescription.textContent =
                config.second.description;

        }

    }

}


// =========================================
// SET CARD LINKS
// =========================================

function setupMaterialCards(type) {

    const config =
        getMaterialConfig(type);


    // =====================================
    // MODEL PAPERS
    // =====================================

    if (
        modelPapersCard &&
        config.model
    ) {

        const modelUrl =
            config.model.url;


        modelPapersCard.onclick =
            () => {

                window.location.href =
                    modelUrl +
                    "?id=" +
                    encodeURIComponent(
                        studentId
                    );

            };


        modelPapersCard.onkeydown =
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    window.location.href =
                        modelUrl +
                        "?id=" +
                        encodeURIComponent(
                            studentId
                        );

                }

            };

    }


    // =====================================
    // SECOND PAPERS
    // =====================================

    if (
        pastPapersCard &&
        config.second
    ) {

        const secondUrl =
            config.second.url;


        pastPapersCard.onclick =
            () => {

                window.location.href =
                    secondUrl +
                    "?id=" +
                    encodeURIComponent(
                        studentId
                    );

            };


        pastPapersCard.onkeydown =
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    window.location.href =
                        secondUrl +
                        "?id=" +
                        encodeURIComponent(
                            studentId
                        );

                }

            };

    }

}


// =========================================
// LOAD PAPER PROGRESS
// =========================================

function calculatePaperProgress(data) {

    let totalPapers = 0;
    let viewedPapers = 0;


    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const field =
            "paper" +
            String(i).padStart(
                2,
                "0"
            ) +
            "Viewed";


        if (
            Object.prototype.hasOwnProperty.call(
                data,
                field
            )
        ) {

            totalPapers++;


            if (
                data[field] === true
            ) {

                viewedPapers++;

            }

        }

    }


    return {
        totalPapers,
        viewedPapers
    };

}


// =========================================
// DISPLAY PROGRESS
// =========================================

function updateProgress(data) {

    const result =
        calculatePaperProgress(data);


    const total =
        result.totalPapers;

    const viewed =
        result.viewedPapers;


    if (totalPapersElement) {

        totalPapersElement.textContent =
            total;

    }


    if (viewedPapersElement) {

        viewedPapersElement.textContent =
            viewed;

    }


    const progress =
        total > 0
            ? Math.round(
                (
                    viewed /
                    total
                ) * 100
            )
            : 0;


    if (progressValueElement) {

        progressValueElement.textContent =
            progress + "%";

    }

}


// =========================================
// LOAD DASHBOARD
// =========================================

async function loadDashboard() {

    if (!studentRef) {

        console.error(
            "Student ID not found."
        );

        return;

    }


    try {

        const snapshot =
            await getDoc(
                studentRef
            );


        if (!snapshot.exists()) {

            console.error(
                "Student not found:",
                studentId
            );

            return;

        }


        const data =
            snapshot.data();


        currentStudentData =
            data;


        // =================================
        // DETECT TYPE
        // =================================

        const studentType =
            getStudentType(data);


        currentStudentType =
            studentType;


        // =================================
        // DISPLAY GRADE
        // =================================

        const gradeName =
            getGradeName(
                studentType
            );


        if (studentGradeElement) {

            studentGradeElement.textContent =
                gradeName;

        }


        if (gradeLabelElement) {

            gradeLabelElement.textContent =
                gradeName;

        }


        // =================================
        // NAME + GREETING
        // =================================

        const studentName =
            getStudentName(data);


        updateGreeting(
            studentName
        );


        // =================================
        // MATERIALS
        // =================================

        updateMaterialCards(
            studentType
        );


        setupMaterialCards(
            studentType
        );


        // =================================
        // PROGRESS
        // =================================

        updateProgress(
            data
        );


        // =================================
        // DEBUG
        // =================================

        console.log(
            "=============================="
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Detected Type:",
            studentType
        );

        console.log(
            "Grade:",
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
            "Material Config:",
            getMaterialConfig(
                studentType
            )
        );

        console.log(
            "=============================="
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// =========================================
// UPDATE ACTIVE STATUS
// =========================================

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


        if (onlineStatusElement) {

            onlineStatusElement.innerHTML =
                `
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


// =========================================
// START
// =========================================

loadDashboard();

updateActiveStatus();


// =========================================
// HEARTBEAT
// =========================================

const heartbeat =
    setInterval(
        updateActiveStatus,
        30000
    );


// =========================================
// USER ACTIVITY
// =========================================

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


// =========================================
// AUTO LOGOUT
// =========================================

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


                // =========================
                // MARK OFFLINE
                // =========================

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


                // =========================
                // CLEAR SESSION
                // =========================

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


// =========================================
// TAB VISIBILITY
// =========================================

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


            if (currentStudentData) {

                updateGreeting(
                    getStudentName(
                        currentStudentData
                    )
                );

            }

        }

    }
);


// =========================================
// LOGOUT
// =========================================

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


            clearInterval(
                heartbeat
            );

            clearInterval(
                idleChecker
            );


            // =============================
            // MARK OFFLINE
            // =============================

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


            // =============================
            // CLEAR SESSION
            // =============================

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


            // =============================
            // REDIRECT
            // =============================

            window.location.replace(
                "index.html"
            );

        }
    );

}


// =========================================
// CONSOLE
// =========================================

console.log(
    "✅ Student Dashboard Loaded"
);

console.log(
    "Student ID:",
    studentId
);
