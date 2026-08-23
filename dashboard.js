import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =====================================================
// LOGIN PROTECTION
// =====================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


// =====================================================
// STUDENT ID
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


// =====================================================
// OPTIONAL ELEMENTS
// =====================================================

const dashboardTitle =
    document.getElementById("dashboardTitle");

const dashboardSubtitle =
    document.getElementById("dashboardSubtitle");


// =====================================================
// STUDENT REFERENCE
// =====================================================

let studentRef = null;

if (studentId) {
    studentRef = doc(
        db,
        "students",
        studentId
    );
}


// =====================================================
// CURRENT DATA
// =====================================================

let currentStudentData = null;
let currentStudentType = null;


// =====================================================
// DISPLAY STUDENT ID
// =====================================================

if (studentIdElement) {
    studentIdElement.textContent =
        studentId || "—";
}


// =====================================================
// DETECT STUDENT TYPE
// =====================================================

function getStudentType(data = {}) {

    // -------------------------------------------------
    // SESSION
    // -------------------------------------------------

    const sessionType =
        String(
            sessionStorage.getItem("studentType") || ""
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


    // -------------------------------------------------
    // FIREBASE STUDENT TYPE
    // -------------------------------------------------

    const firebaseType =
        String(
            data.studentType || ""
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


    // -------------------------------------------------
    // FIREBASE GRADE
    // -------------------------------------------------

    const grade =
        String(
            data.grade || ""
        )
        .toLowerCase()
        .trim();


    if (
        grade === "10" ||
        grade === "grade10" ||
        grade === "grade 10"
    ) {
        return "grade10";
    }


    if (
        grade === "11" ||
        grade === "grade11" ||
        grade === "grade 11"
    ) {
        return "grade11";
    }


    if (
        grade === "al" ||
        grade === "a/l" ||
        grade === "a level" ||
        grade === "advanced" ||
        grade === "advanced level"
    ) {
        return "al";
    }


    // -------------------------------------------------
    // STUDENT ID DETECTION
    // -------------------------------------------------

    const cleanId =
        String(studentId || "")
            .trim()
            .replace(/\s+/g, "")
            .toUpperCase();


    // A/L IDs
    if (
        cleanId.startsWith("2005") ||
        cleanId.startsWith("2006") ||
        cleanId.startsWith("2007") ||
        cleanId.startsWith("2008") ||
        cleanId.startsWith("2009")
    ) {
        return "al";
    }


    // Old NIC format
    if (
        /^\d{9}[VX]$/.test(cleanId)
    ) {
        return "al";
    }


    // Numeric IDs
    if (
        /^\d{5}$/.test(cleanId)
    ) {

        const number =
            Number(cleanId);


        // Grade 11
        if (
            number >= 26000 &&
            number <= 26999
        ) {
            return "grade11";
        }


        // Grade 10
        if (
            number >= 27000 &&
            number <= 27999
        ) {
            return "grade10";
        }

    }


    return null;
}


// =====================================================
// GRADE NAME
// =====================================================

function getGradeName(type) {

    if (type === "grade10") {
        return "Grade 10";
    }

    if (type === "grade11") {
        return "Grade 11";
    }

    if (type === "al") {
        return "A/L Student";
    }

    return "Student";
}


// =====================================================
// STUDENT NAME
// =====================================================

function getStudentName(data = {}) {

    return (
        data.name ||
        data.studentName ||
        data.fullName ||
        data.displayName ||
        sessionStorage.getItem("studentName") ||
        "Student"
    );
}


// =====================================================
// GREETING
// =====================================================

function updateGreeting(name) {

    if (!greetingElement) {
        return;
    }


    const hour =
        new Date().getHours();


    let greeting = "Welcome back";


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
    else if (
        hour >= 17 &&
        hour < 22
    ) {
        greeting = "Good evening";
    }


    greetingElement.textContent =
        `${greeting}, ${name} 👋`;
}


// =====================================================
// DASHBOARD CONTENT
// =====================================================
//
// Grade 10
//  - 1st Term Papers
//  - Model Papers
//
// Grade 11
//  - Term Test Papers
//  - Past Papers 2016 - 2025
//
// A/L
//  - Model Papers
//  - Province Papers
//
// =====================================================

function getDashboardConfig(type) {

    if (type === "grade10") {

        return {

            title:
                "Grade 10 Student",

            subtitle:
                "Grade 10",

            modelTitle:
                "1st Term – Model Papers",

            modelDescription:
                "Model Papers for your first term practice and preparation.",

            pastTitle:
                "1st Term Papers",

            pastDescription:
                "Grade 10 Term Assessment Papers",

            modelUrl:
                "grade10-model-papers.html",

            pastUrl:
                "grade10-term-papers.html"

        };

    }


    if (type === "grade11") {

        return {

            title:
                "Grade 11 Student",

            subtitle:
                "Grade 11",

            modelTitle:
                "Term Test Papers",

            modelDescription:
                "Practice Term Test Papers and preparation materials.",

            pastTitle:
                "Past Papers (2016 – 2025)",

            pastDescription:
                "Grade 11 past examination papers.",

            modelUrl:
                "grade11-model-papers.html",

            pastUrl:
                "grade11-past-papers.html"

        };

    }


    if (type === "al") {

        return {

            title:
                "A/L Student",

            subtitle:
                "Advanced Level",

            modelTitle:
                "A/L – Model Papers",

            modelDescription:
                "Practice and prepare with model papers.",

            pastTitle:
                "A/L – Province Papers",

            pastDescription:
                "Past papers from provincial examinations.",

            modelUrl:
                "model-papers.html",

            pastUrl:
                "province-papers.html"

        };

    }


    return null;
}


// =====================================================
// UPDATE DASHBOARD TEXT
// =====================================================

function updateDashboardContent(type) {

    const config =
        getDashboardConfig(type);


    if (!config) {
        return;
    }


    // -------------------------------------------------
    // Main title
    // -------------------------------------------------

    if (dashboardTitle) {

        dashboardTitle.textContent =
            config.title;

    }


    if (dashboardSubtitle) {

        dashboardSubtitle.textContent =
            config.subtitle;

    }


    if (studentGradeElement) {

        studentGradeElement.textContent =
            config.subtitle;

    }


    if (gradeLabelElement) {

        gradeLabelElement.textContent =
            config.subtitle;

    }


    // -------------------------------------------------
    // MODEL
    // -------------------------------------------------

    if (modelPapersTitle) {

        modelPapersTitle.textContent =
            config.modelTitle;

    }


    if (modelPapersDescription) {

        modelPapersDescription.textContent =
            config.modelDescription;

    }


    // -------------------------------------------------
    // SECOND CARD
    // -------------------------------------------------

    if (pastPapersTitle) {

        pastPapersTitle.textContent =
            config.pastTitle;

    }


    if (pastPapersDescription) {

        pastPapersDescription.textContent =
            config.pastDescription;

    }


    if (pastPapersCard) {

        pastPapersCard.style.display =
            "block";

    }
}


// =====================================================
// OPEN PAGE
// =====================================================

function openPage(url) {

    if (!url) {

        console.error(
            "Page URL is not configured."
        );

        return;
    }


    window.location.href =
        url;
}


// =====================================================
// SET CARD LINK
// =====================================================

function setupCard(card, url) {

    if (!card || !url) {
        return;
    }


    card.style.cursor =
        "pointer";


    card.setAttribute(
        "role",
        "button"
    );


    card.setAttribute(
        "tabindex",
        "0"
    );


    card.onclick =
        () => {
            openPage(url);
        };


    card.onkeydown =
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openPage(url);
            }

        };
}


// =====================================================
// SETUP DASHBOARD CARDS
// =====================================================

function setupDashboardCards(type) {

    const config =
        getDashboardConfig(type);


    if (!config) {
        return;
    }


    setupCard(
        modelPapersCard,
        config.modelUrl
    );


    setupCard(
        pastPapersCard,
        config.pastUrl
    );
}


// =====================================================
// PAPER PROGRESS
// =====================================================

function calculatePaperProgress(data) {

    let total =
        0;

    let viewed =
        0;


    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const paper =
            "paper" +
            String(i).padStart(
                2,
                "0"
            );


        const viewedField =
            paper + "Viewed";


        if (
            data[paper] === true
        ) {

            total++;


            if (
                data[viewedField] === true
            ) {

                viewed++;

            }

        }

    }


    return {
        total,
        viewed
    };
}


// =====================================================
// UPDATE PROGRESS UI
// =====================================================

function updateProgress(data) {

    const progress =
        calculatePaperProgress(data);


    if (totalPapersElement) {

        totalPapersElement.textContent =
            progress.total;

    }


    if (viewedPapersElement) {

        viewedPapersElement.textContent =
            progress.viewed;

    }


    const percentage =
        progress.total > 0
            ? Math.round(
                (
                    progress.viewed /
                    progress.total
                ) * 100
            )
            : 0;


    if (progressValueElement) {

        progressValueElement.textContent =
            `${percentage}%`;

    }


    // Optional progress bars
    const progressBars =
        document.querySelectorAll(
            ".progress-fill"
        );


    progressBars.forEach(
        bar => {

            bar.style.width =
                `${percentage}%`;

        }
    );
}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    if (!studentId || !studentRef) {

        sessionStorage.clear();

        window.location.replace(
            "index.html"
        );

        return;
    }


    try {

        const snapshot =
            await getDoc(
                studentRef
            );


        if (!snapshot.exists()) {

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


        // -------------------------------------------------
        // STUDENT TYPE
        // -------------------------------------------------

        const type =
            getStudentType(data);


        currentStudentType =
            type;


        if (!type) {

            console.error(
                "Unable to detect student type.",
                data
            );

            return;
        }


        // -------------------------------------------------
        // NAME
        // -------------------------------------------------

        const studentName =
            getStudentName(data);


        updateGreeting(
            studentName
        );


        // -------------------------------------------------
        // TYPE / GRADE
        // -------------------------------------------------

        updateDashboardContent(
            type
        );


        setupDashboardCards(
            type
        );


        // -------------------------------------------------
        // PROGRESS
        // -------------------------------------------------

        updateProgress(data);


        // -------------------------------------------------
        // CONSOLE
        // -------------------------------------------------

        console.log(
            "======================================"
        );

        console.log(
            "STUDENT DASHBOARD"
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Student Type:",
            type
        );

        console.log(
            "Dashboard:",
            getDashboardConfig(type)
        );

        console.log(
            "======================================"
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
// ACTIVE STATUS
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
            "Active status error:",
            error
        );

    }
}


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


            try {

                if (studentRef) {

                    await updateDoc(
                        studentRef,
                        {
                            lastActiveAt: 0
                        }
                    );

                }

            }
            catch (error) {

                console.error(
                    "Logout status error:",
                    error
                );

            }


            // Clear student session

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

            sessionStorage.removeItem(
                "studentName"
            );


            window.location.replace(
                "index.html"
            );

        }
    );

}


// =====================================================
// START
// =====================================================

loadDashboard();

updateActiveStatus();


// =====================================================
// HEARTBEAT
// =====================================================

const heartbeat =
    setInterval(
        updateActiveStatus,
        30000
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
// BEFORE LEAVE
// =====================================================

window.addEventListener(
    "beforeunload",
    () => {

        // Do not use await here.
        // Heartbeat will normally handle
        // the active state.

        clearInterval(
            heartbeat
        );

    }
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Student Dashboard JS Loaded"
);

console.log(
    "Student ID:",
    studentId
);
