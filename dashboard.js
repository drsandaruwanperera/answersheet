// =========================================
// STUDENT DASHBOARD
// Dynamic Grade 10 / Grade 11 / A/L
// =========================================

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

    window.location.replace(
        "index.html"
    );

}


// =========================================
// GET STUDENT ID
// =========================================

// Prefer sessionStorage.
// URL ?id= is kept as fallback for compatibility.

const sessionStudentId =
    sessionStorage.getItem(
        "studentId"
    );

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const urlStudentId =
    urlParams.get("id");

const studentId =
    sessionStudentId ||
    urlStudentId;


// =========================================
// ELEMENTS
// =========================================

const studentIdElement =
    document.getElementById(
        "studentId"
    );

const studentGradeElement =
    document.getElementById(
        "studentGrade"
    );

const studentNameElement =
    document.getElementById(
        "studentName"
    );

const greetingElement =
    document.getElementById(
        "greeting"
    );

const gradeLabelElement =
    document.getElementById(
        "gradeLabel"
    );

const onlineStatusElement =
    document.getElementById(
        "onlineStatus"
    );

const totalPapersElement =
    document.getElementById(
        "totalPapers"
    );

const viewedPapersElement =
    document.getElementById(
        "viewedPapers"
    );

const progressValueElement =
    document.getElementById(
        "progressValue"
    );

const modelPapersCard =
    document.getElementById(
        "modelPapersCard"
    );

const pastPapersCard =
    document.getElementById(
        "pastPapersCard"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =========================================
// DISPLAY STUDENT ID
// =========================================

if (studentIdElement) {

    studentIdElement.textContent =
        studentId || "Unknown";

}


// =========================================
// STUDENT REFERENCE
// =========================================

let studentRef = null;

if (studentId) {

    studentRef =
        doc(
            db,
            "students",
            studentId
        );

}


// =========================================
// GRADE DETECTION
// =========================================

function getStudentType(
    data
) {

    const type =
        String(
            data?.studentType ||
            ""
        )
        .toLowerCase()
        .trim();


    // Grade 10

    if (
        type === "grade10" ||
        type === "grade 10"
    ) {

        return "grade10";

    }


    // Grade 11

    if (
        type === "grade11" ||
        type === "grade 11"
    ) {

        return "grade11";

    }


    // A/L

    if (
        type === "al" ||
        type === "a/l" ||
        type === "advanced" ||
        type === "advancedlevel" ||
        type === "advanced level"
    ) {

        return "al";

    }


    // Fallback using studentGrade

    const grade =
        String(
            data?.studentGrade ||
            data?.grade ||
            sessionStorage.getItem(
                "studentGrade"
            ) ||
            ""
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
        grade === "advanced level"
    ) {

        return "al";

    }


    // Final fallback

    return "grade11";

}


// =========================================
// GRADE DISPLAY NAME
// =========================================

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


    return "Advanced Level";

}


// =========================================
// GRADE PAPER LINKS
// =========================================

function getPaperLinks(
    type
) {

    if (
        type === "grade10"
    ) {

        return {

            model:
                "grade10-model-papers.html",

            past:
                "grade10-past-paper.html"

        };

    }


    if (
        type === "grade11"
    ) {

        return {

            model:
                "grade11-model-papers.html",

            past:
                "grade11-past-paper.html"

        };

    }


    // A/L

    return {

        model:
            "al-model-papers.html",

        past:
            "al-past-papers.html"

    };

}


// =========================================
// GET STUDENT NAME
// =========================================

function getStudentName(
    data
) {

    return (
        data?.name ||
        data?.studentName ||
        data?.fullName ||
        data?.displayName ||
        "Student"
    );

}


// =========================================
// TIME BASED GREETING
// =========================================

function updateGreeting(
    studentName
) {

    const hour =
        new Date().getHours();

    let greeting;


    if (
        hour >= 5 &&
        hour < 12
    ) {

        greeting =
            "Good morning";

    }

    else if (
        hour >= 12 &&
        hour < 17
    ) {

        greeting =
            "Good afternoon";

    }

    else {

        greeting =
            "Good evening";

    }


    if (greetingElement) {

        greetingElement.textContent =
            `${greeting}, ${studentName} 👋`;

    }

}


// =========================================
// LOAD STUDENT DATA
// =========================================

let currentStudentData = null;

let currentStudentType = null;


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
                "Student record not found:",
                studentId
            );

            return;

        }


        const data =
            snapshot.data();


        currentStudentData =
            data;


        // =================================
        // DETECT STUDENT TYPE
        // =================================

        const studentType =
            getStudentType(
                data
            );


        currentStudentType =
            studentType;


        const gradeName =
            getGradeName(
                studentType
            );


        const paperLinks =
            getPaperLinks(
                studentType
            );


        // =================================
        // STUDENT NAME
        // =================================

        const studentName =
            getStudentName(
                data
            );


        // =================================
        // UPDATE HEADER
        // =================================

        if (studentIdElement) {

            studentIdElement.textContent =
                studentId || "Unknown";

        }


        if (studentGradeElement) {

            studentGradeElement.textContent =
                gradeName;

        }


        if (gradeLabelElement) {

            gradeLabelElement.textContent =
                gradeName;

        }


        if (studentNameElement) {

            studentNameElement.textContent =
                studentName;

        }


        updateGreeting(
            studentName
        );


        // =================================
        // MODEL PAPERS
        // =================================

        if (modelPapersCard) {

            modelPapersCard.onclick =
                () => {

                    window.location.href =
                        paperLinks.model;

                };


            modelPapersCard.onkeydown =
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        window.location.href =
                            paperLinks.model;

                    }

                };

        }


        // =================================
        // PAST PAPERS
        // =================================

        if (pastPapersCard) {

            pastPapersCard.onclick =
                () => {

                    window.location.href =
                        paperLinks.past;

                };


            pastPapersCard.onkeydown =
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        window.location.href =
                            paperLinks.past;

                    }

                };

        }


        // =================================
        // PAPER VIEW COUNT
        // =================================

        let totalPapers = 0;

        let viewedPapers = 0;


        // Current system uses 10 papers.

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
                Object.prototype.hasOwnProperty
                    .call(
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


        // =================================
        // SUMMARY
        // =================================

        if (totalPapersElement) {

            totalPapersElement.textContent =
                totalPapers;

        }


        if (viewedPapersElement) {

            viewedPapersElement.textContent =
                viewedPapers;

        }


        const progress =
            totalPapers > 0
                ? Math.round(
                    (
                        viewedPapers /
                        totalPapers
                    ) * 100
                )
                : 0;


        if (progressValueElement) {

            progressValueElement.textContent =
                progress + "%";

        }


        console.log(
            "✅ Dashboard loaded:",
            {
                studentId,
                studentName,
                studentType,
                gradeName,
                totalPapers,
                viewedPapers,
                progress
            }
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
// UPDATE ONLINE STATUS
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


        if (
            onlineStatusElement
        ) {

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
// INITIAL LOAD
// =========================================

loadDashboard();

updateActiveStatus();


// =========================================
// HEARTBEAT
// =========================================

// Every 30 seconds.

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


// Track real user activity.

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
// AUTOMATIC LOGOUT
// =========================================

// 5 minutes without activity.

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


                // Mark offline.

                if (studentRef) {

                    try {

                        await updateDoc(
                            studentRef,
                            {
                                lastActiveAt: 0
                            }
                        );

                    }

                    catch (error) {

                        console.error(
                            "Failed to mark student offline:",
                            error
                        );

                    }

                }


                // Clear session.

                sessionStorage.removeItem(
                    "loggedIn"
                );

                sessionStorage.removeItem(
                    "studentId"
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

            // Refresh greeting when user returns.

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


            // =================================
            // MARK OFFLINE
            // =================================

            if (studentRef) {

                try {

                    await updateDoc(
                        studentRef,
                        {
                            lastActiveAt: 0
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


            // =================================
            // CLEAR SESSION
            // =================================

            sessionStorage.removeItem(
                "loggedIn"
            );

            sessionStorage.removeItem(
                "studentId"
            );

            sessionStorage.removeItem(
                "studentGrade"
            );


            // =================================
            // REDIRECT
            // =================================

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
    "🟢 Dynamic Student Dashboard Active:",
    studentId
);
