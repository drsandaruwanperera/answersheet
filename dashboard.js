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
// LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =====================================================
// STUDENT INFORMATION
// =====================================================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );

const storedGrade =
    sessionStorage.getItem(
        "studentGrade"
    );


// =====================================================
// ELEMENTS
// =====================================================

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

const statusElement =
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

const progressElement =
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


// =====================================================
// MATERIAL CARD TEXT
// =====================================================

const modelPapersTitle =
    document.getElementById(
        "modelPapersTitle"
    );

const modelPapersDescription =
    document.getElementById(
        "modelPapersDescription"
    );

const pastPapersTitle =
    document.getElementById(
        "pastPapersTitle"
    );

const pastPapersDescription =
    document.getElementById(
        "pastPapersDescription"
    );


// =====================================================
// STUDENT REFERENCE
// =====================================================

let studentRef = null;


if (
    studentId
) {

    studentRef =
        doc(
            db,
            "students",
            studentId
        );

}


// =====================================================
// GRADE HELPER
// =====================================================

function getGradeType(
    value
) {

    const grade =
        String(
            value || ""
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
        grade === "advanced" ||
        grade === "advancedlevel" ||
        grade === "advanced level"
    ) {

        return "al";

    }


    return "grade11";

}


// =====================================================
// GRADE DISPLAY
// =====================================================

function getGradeDisplay(
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


// =====================================================
// GRADE DASHBOARD DATA
// =====================================================

function getDashboardData(
    type
) {


    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        return {

            grade:
                "Grade 10",

            model:
                "grade10-model-papers.html",

            past:
                "grade10-past-papers.html"

        };

    }


    // =================================================
    // A/L
    // =================================================
    //
    // Model Papers:
    // model-papers.html
    //
    // Province Papers:
    // province-paper1.html
    //
    // =================================================

    if (
        type === "al"
    ) {

        return {

            grade:
                "Advanced Level",

            model:
                "model-papers.html",

            past:
                "province-paper1.html"

        };

    }


    // =================================================
    // GRADE 11
    // =================================================

    return {

        grade:
            "Grade 11",

        model:
            "grade11-model-papers.html",

        past:
            "grade11-past-paper.html"

    };

}


// =====================================================
// GREETING
// =====================================================

function updateGreeting(
    studentName
) {

    const hour =
        new Date().getHours();


    let greeting =
        "Good evening";


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


    if (
        greetingElement
    ) {

        greetingElement.textContent =
            `${greeting}, ${studentName} 👋`;

    }

}


// =====================================================
// UPDATE MATERIAL TEXT
// =====================================================

function updateMaterialText(
    type
) {


    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        if (
            modelPapersTitle
        ) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (
            modelPapersDescription
        ) {

            modelPapersDescription.textContent =
                "Grade 10 Model Papers";

        }


        const modelLink =
            document.querySelector(
                "#modelPapersCard .material-link"
            );


        if (
            modelLink
        ) {

            modelLink.innerHTML = `
                Explore Model Papers
                <span>→</span>
            `;

        }


        if (
            pastPapersTitle
        ) {

            pastPapersTitle.textContent =
                "Past Papers";

        }


        if (
            pastPapersDescription
        ) {

            pastPapersDescription.textContent =
                "Grade 10 Past Papers";

        }

    }


    // =================================================
    // GRADE 11
    // =================================================

    else if (
        type === "grade11"
    ) {

        if (
            modelPapersTitle
        ) {

            modelPapersTitle.textContent =
                "TOP Ranking";

        }


        if (
            modelPapersDescription
        ) {

            modelPapersDescription.textContent =
                "Grade 11 TOP Ranking Papers";

        }


        const modelLink =
            document.querySelector(
                "#modelPapersCard .material-link"
            );


        if (
            modelLink
        ) {

            modelLink.innerHTML = `
                Explore TOP Ranking
                <span>→</span>
            `;

        }


        if (
            pastPapersTitle
        ) {

            pastPapersTitle.textContent =
                "Past Papers";

        }


        if (
            pastPapersDescription
        ) {

            pastPapersDescription.textContent =
                "Past Papers • 2016 – 2025";

        }

    }


    // =================================================
    // A/L
    // =================================================

    else if (
        type === "al"
    ) {

        if (
            modelPapersTitle
        ) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (
            modelPapersDescription
        ) {

            modelPapersDescription.textContent =
                "Advanced Level Model Papers";

        }


        const modelLink =
            document.querySelector(
                "#modelPapersCard .material-link"
            );


        if (
            modelLink
        ) {

            modelLink.innerHTML = `
                Explore Model Papers
                <span>→</span>
            `;

        }


        if (
            pastPapersTitle
        ) {

            pastPapersTitle.textContent =
                "Province Papers";

        }


        if (
            pastPapersDescription
        ) {

            pastPapersDescription.textContent =
                "Provincial Examination Papers";

        }


        // ---------------------------------------------
        // Make sure the link text is correct
        // ---------------------------------------------

        const pastLink =
            document.querySelector(
                "#pastPapersCard .material-link"
            );


        if (
            pastLink
        ) {

            pastLink.innerHTML = `
                Explore Province Papers
                <span>→</span>
            `;

        }

    }

}


// =====================================================
// SETUP MODEL CARD
// =====================================================

function setupModelCard(
    type
) {

    if (
        !modelPapersCard
    ) {

        console.error(
            "modelPapersCard not found."
        );

        return;

    }


    let modelUrl = null;


    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        modelUrl =
            "grade10-model-papers.html";

    }


    // =================================================
    // GRADE 11
    // =================================================

    else if (
        type === "grade11"
    ) {

        modelUrl =
            "grade11-model-papers.html";

    }


    // =================================================
    // A/L
    // =================================================

    else if (
        type === "al"
    ) {

        modelUrl =
            "model-papers.html";

    }


    console.log(
        "Model card URL:",
        modelUrl
    );


    // =================================================
    // REMOVE OLD EVENTS
    // =================================================

    modelPapersCard.onclick =
        null;

    modelPapersCard.onkeydown =
        null;


    // =================================================
    // CARD CLICK
    // =================================================

    modelPapersCard.onclick =
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "Model card clicked:",
                modelUrl
            );


            if (
                !modelUrl
            ) {

                console.error(
                    "Model URL not found for:",
                    type
                );

                return;

            }


            window.location.href =
                modelUrl;

        };


    // =================================================
    // KEYBOARD
    // =================================================

    modelPapersCard.onkeydown =
        function(event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                if (
                    modelUrl
                ) {

                    window.location.href =
                        modelUrl;

                }

            }

        };


    // =================================================
    // INNER LINK
    // =================================================

    const modelLink =
        modelPapersCard.querySelector(
            ".material-link"
        );


    if (
        modelLink
    ) {

        modelLink.onclick =
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                if (
                    modelUrl
                ) {

                    window.location.href =
                        modelUrl;

                }

            };

    }

}

// =====================================================
// LOAD PAPER VISIBILITY SETTINGS
// =====================================================

async function loadPaperVisibility(type) {

    try {

        // -------------------------------------------------
        // GRADE 10
        // -------------------------------------------------

        if (type === "grade10") {

            const settingsRef =
                doc(
                    db,
                    "paperSettings",
                    "grade10"
                );


            const snapshot =
                await getDoc(
                    settingsRef
                );


            if (!snapshot.exists()) {

                console.warn(
                    "Grade 10 paper settings not found."
                );

                return;

            }


            const settings =
                snapshot.data();


            console.log(
                "📚 Grade 10 Dashboard Settings:",
                settings
            );


            // =============================================
            // MODEL PAPERS
            // =============================================

            const modelEnabled =
                settings.modelPapersEnabled === true;


            if (modelPapersCard) {

                modelPapersCard.style.display =
                    modelEnabled
                        ? ""
                        : "none";

            }


            // =============================================
            // PAST PAPERS
            // =============================================

            const pastEnabled =
                settings.pastPapersEnabled === true;


            if (pastPapersCard) {

                pastPapersCard.style.display =
                    pastEnabled
                        ? ""
                        : "none";

            }


            console.log(
                "Grade 10 Model Papers:",
                modelEnabled
                    ? "VISIBLE"
                    : "HIDDEN"
            );


            console.log(
                "Grade 10 Past Papers:",
                pastEnabled
                    ? "VISIBLE"
                    : "HIDDEN"
            );

        }


        // -------------------------------------------------
        // GRADE 11
        // -------------------------------------------------

        else if (type === "grade11") {

            const settingsRef =
                doc(
                    db,
                    "paperSettings",
                    "grade11"
                );


            const snapshot =
                await getDoc(
                    settingsRef
                );


            if (!snapshot.exists()) {

                console.warn(
                    "Grade 11 paper settings not found."
                );

                return;

            }


            const settings =
                snapshot.data();


            console.log(
                "📚 Grade 11 Dashboard Settings:",
                settings
            );


            const topRankingEnabled =
                settings.topRankingEnabled === true;


            const pastEnabled =
                settings.pastPapersEnabled === true;


            if (modelPapersCard) {

                modelPapersCard.style.display =
                    topRankingEnabled
                        ? ""
                        : "none";

            }


            if (pastPapersCard) {

                pastPapersCard.style.display =
                    pastEnabled
                        ? ""
                        : "none";

            }

        }


        // -------------------------------------------------
        // A/L
        // -------------------------------------------------

        else if (type === "al") {

            const settingsRef =
                doc(
                    db,
                    "paperSettings",
                    "al"
                );


            const snapshot =
                await getDoc(
                    settingsRef
                );


            if (!snapshot.exists()) {

                console.warn(
                    "A/L paper settings not found."
                );

                return;

            }


            const settings =
                snapshot.data();


            const modelEnabled =
                settings.modelPapersEnabled === true;


            const pastEnabled =
                settings.pastPapersEnabled === true;


            if (modelPapersCard) {

                modelPapersCard.style.display =
                    modelEnabled
                        ? ""
                        : "none";

            }


            if (pastPapersCard) {

                pastPapersCard.style.display =
                    pastEnabled
                        ? ""
                        : "none";

            }

        }

    }
    catch (error) {

        console.error(
            "❌ Failed to load paper visibility:",
            error
        );

    }

}
// =====================================================
// SETUP PAST / PROVINCE CARD
// =====================================================

function setupPastCard(
    type
) {

    if (
        !pastPapersCard
    ) {

        console.error(
            "pastPapersCard not found."
        );

        return;

    }


    let pastUrl = null;


    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        pastUrl =
            "grade10-past-papers.html";

    }


    // =================================================
    // GRADE 11
    // =================================================

    else if (
        type === "grade11"
    ) {

        pastUrl =
            "grade11-past-paper.html";

    }


    // =================================================
    // A/L
    // =================================================
    //
    // IMPORTANT FIX:
    //
    // OLD:
    // al-past-papers.html
    //
    // NEW:
    // province-paper1.html
    //
    // =================================================

    else if (
        type === "al"
    ) {

        pastUrl =
            "province-paper1.html";

    }


    console.log(
        "Past / Province card URL:",
        pastUrl
    );


    // =================================================
    // REMOVE OLD EVENTS
    // =================================================

    pastPapersCard.onclick =
        null;

    pastPapersCard.onkeydown =
        null;


    // =================================================
    // CARD CLICK
    // =================================================

    pastPapersCard.onclick =
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "Past / Province card clicked:",
                pastUrl
            );


            if (
                !pastUrl
            ) {

                console.error(
                    "Past URL not found for:",
                    type
                );

                return;

            }


            window.location.href =
                pastUrl;

        };


    // =================================================
    // KEYBOARD
    // =================================================

    pastPapersCard.onkeydown =
        function(event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                if (
                    pastUrl
                ) {

                    window.location.href =
                        pastUrl;

                }

            }

        };


    // =================================================
    // INNER LINK
    // =================================================

    const pastLink =
        pastPapersCard.querySelector(
            ".material-link"
        );


    if (
        pastLink
    ) {

        pastLink.onclick =
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                if (
                    pastUrl
                ) {

                    window.location.href =
                        pastUrl;

                }

            };

    }

}


// =====================================================
// LOAD STUDENT
// =====================================================

async function loadStudent() {

    if (
        !studentRef
    ) {

        console.error(
            "Student reference not available."
        );

        return;

    }


    try {

        const snapshot =
            await getDoc(
                studentRef
            );


        if (
            !snapshot.exists()
        ) {

            console.error(
                "Student record not found."
            );

            return;

        }


        const data =
            snapshot.data();


        // =================================================
        // DETECT GRADE
        // =================================================

        const type =
            getGradeType(
                data.studentType ||
                storedGrade ||
                data.grade
            );


        const gradeInfo =
            getDashboardData(
                type
            );


        // =================================================
        // STUDENT NAME
        // =================================================

        const studentName =
            data.name ||
            data.studentName ||
            data.fullName ||
            "Student";


        // =================================================
        // STUDENT ID
        // =================================================

        if (
            studentIdElement
        ) {

            studentIdElement.textContent =
                studentId || "";

        }


        // =================================================
        // GRADE
        // =================================================

        if (
            studentGradeElement
        ) {

            studentGradeElement.textContent =
                gradeInfo.grade;

        }


        if (
            gradeLabelElement
        ) {

            gradeLabelElement.textContent =
                gradeInfo.grade;

        }


        // =================================================
        // STUDENT NAME
        // =================================================

        if (
            studentNameElement
        ) {

            studentNameElement.textContent =
                studentName;

        }


        // =================================================
        // GREETING
        // =================================================

        updateGreeting(
            studentName
        );


        // =================================================
        // MATERIAL TEXT
        // =================================================

        updateMaterialText(
            type
        );


       // =================================================
// MATERIAL CARDS
// =================================================

setupModelCard(
    type
);


setupPastCard(
    type
);


// =================================================
// LOAD ADMIN PAPER VISIBILITY
// =================================================

await loadPaperVisibility(
    type
);


        // =================================================
        // PAPER STATISTICS
        // =================================================

        let totalPapers =
            0;

        let viewedPapers =
            0;


        for (
            let i = 1;
            i <= 50;
            i++
        ) {

            const field =
                "paper" +
                String(
                    i
                ).padStart(
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


        if (
            totalPapersElement
        ) {

            totalPapersElement.textContent =
                totalPapers;

        }


        if (
            viewedPapersElement
        ) {

            viewedPapersElement.textContent =
                viewedPapers;

        }


        // =================================================
        // PROGRESS
        // =================================================

        const progress =
            totalPapers > 0
                ? Math.round(
                    (
                        viewedPapers /
                        totalPapers
                    ) * 100
                )
                : 0;


        if (
            progressElement
        ) {

            progressElement.textContent =
                progress + "%";

        }


        // =================================================
        // CONSOLE
        // =================================================

        console.log(
            "===================================="
        );

        console.log(
            "✅ STUDENT DASHBOARD LOADED"
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Grade Type:",
            type
        );

        console.log(
            "Grade:",
            gradeInfo.grade
        );

        console.log(
            "Model URL:",
            gradeInfo.model
        );

        console.log(
            "Past / Province URL:",
            gradeInfo.past
        );

        console.log(
            "===================================="
        );

    }

    catch (
        error
    ) {

        console.error(
            "Failed to load student:",
            error
        );

    }

}


// =====================================================
// UPDATE LAST ACTIVE
// =====================================================

async function updateLastActive() {

    if (
        !studentRef
    ) {

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
            statusElement
        ) {

            statusElement.textContent =
                "Online";

        }

    }

    catch (
        error
    ) {

        console.error(
            "Failed to update active status:",
            error
        );

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudent();

updateLastActive();


// =====================================================
// HEARTBEAT
// =====================================================

const heartbeat =
    setInterval(
        updateLastActive,
        30000
    );


// =====================================================
// ACTIVITY TRACKING
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
]
.forEach(
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
// AUTOMATIC LOGOUT
// =====================================================

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


                if (
                    studentRef
                ) {

                    try {

                        await updateDoc(
                            studentRef,
                            {
                                lastActiveAt:
                                    0
                            }
                        );

                    }

                    catch (
                        error
                    ) {

                        console.error(
                            "Failed to mark offline:",
                            error
                        );

                    }

                }


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

            updateLastActive();

        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (
    logoutBtn
) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (
                !confirmed
            ) {

                return;

            }


            clearInterval(
                heartbeat
            );

            clearInterval(
                idleChecker
            );


            if (
                studentRef
            ) {

                try {

                    await updateDoc(
                        studentRef,
                        {
                            lastActiveAt:
                                0
                        }
                    );

                }

                catch (
                    error
                ) {

                    console.error(
                        "Failed to update logout status:",
                        error
                    );

                }

            }


            sessionStorage.removeItem(
                "loggedIn"
            );

            sessionStorage.removeItem(
                "studentId"
            );

            sessionStorage.removeItem(
                "studentGrade"
            );


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
    "🟢 Dynamic Student Dashboard Active:",
    studentId
);
