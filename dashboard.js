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
// DISPLAY STUDENT ID
// =====================================================

if (studentIdElement) {

    studentIdElement.textContent =
        studentId || "—";

}


// =====================================================
// FIREBASE REFERENCE
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
// CURRENT DATA
// =====================================================

let currentStudentData = null;

let currentStudentType = null;


// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalize(value) {

    return String(
        value || ""
    )
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}


// =====================================================
// DETECT STUDENT TYPE
// =====================================================
//
// 26000 - 26999 = Grade 11
// 27000 - 27999 = Grade 10
//
// 2005xxxxxxxx = A/L
// 2006xxxxxxxx = A/L
// 2007xxxxxxxx = A/L
//
// 9 digits + V/X = A/L
//
// Firebase values are used as fallback.
// =====================================================

function detectStudentType(data) {

    const id =
        String(
            studentId || ""
        )
            .trim()
            .replace(/\s+/g, "");


    // =================================================
    // 1. STUDENT ID HAS HIGHEST PRIORITY
    // =================================================

    // -----------------------------------------------
    // Grade 11
    // -----------------------------------------------

    if (
        /^\d{5}$/.test(id)
    ) {

        const number =
            Number(id);


        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "grade11";

        }


        // -------------------------------------------
        // Grade 10
        // -------------------------------------------

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // =================================================
    // 2. A/L NIC / STUDENT ID
    // =================================================

    const firstFour =
        id.substring(0, 4);


    if (
        firstFour === "2005" ||
        firstFour === "2006" ||
        firstFour === "2007"
    ) {

        return "al";

    }


    // =================================================
    // 3. OLD NIC
    // =================================================

    if (
        /^\d{9}[vVxX]$/.test(id)
    ) {

        return "al";

    }


    // =================================================
    // 4. SESSION STORAGE FALLBACK
    // =================================================

    const sessionType =
        normalize(
            sessionStorage.getItem(
                "studentType"
            )
        );


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


    // =================================================
    // 5. FIREBASE studentType FALLBACK
    // =================================================

    const firebaseType =
        normalize(
            data?.studentType
        );


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


    // =================================================
    // 6. FIREBASE GRADE FALLBACK
    // =================================================

    const firebaseGrade =
        normalize(
            data?.grade
        );


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


    // =================================================
    // UNKNOWN
    // =================================================

    return null;

}


// =====================================================
// DISPLAY GRADE NAME
// =====================================================

function getGradeName(type) {

    if (
        type === "grade11"
    ) {

        return "Grade 11";

    }


    if (
        type === "grade10"
    ) {

        return "Grade 10";

    }


    if (
        type === "al"
    ) {

        return "Advanced Level";

    }


    return "Student";

}


// =====================================================
// GET STUDENT NAME
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


    greetingElement.textContent =
        `${greeting}, ${name} 👋`;

}


// =====================================================
// MATERIAL CONFIG
// =====================================================
//
// A/L
//   Model Papers
//   Province Papers
//
// Grade 10
//   Model Papers
//
// Grade 11
//   Model Papers
//   Past Papers 2016 - 2025
// =====================================================

function getMaterialConfig(type) {


    // =================================================
    // A/L
    // =================================================

    if (
        type === "al"
    ) {

        return {

            model: {

                title:
                    "Model Papers",

                description:
                    "Advanced Level Model Papers",

                url:
                    "model-papers.html"

            },


            second: {

                title:
                    "Province Papers",

                description:
                    "Provincial Examination Papers",

                url:
                    "past-papers.html"

            }

        };

    }


    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        return {

            model: {

                title:
                    "Model Papers",

                description:
                    "Grade 10 Model Papers",

                url:
                    "grade10-model-papers.html"

            },


            second:
                null

        };

    }


    // =================================================
    // GRADE 11
    // =================================================

    if (
        type === "grade11"
    ) {

        return {

            model: {

                title:
                    "Model Papers",

                description:
                    "Grade 11 Model Papers",

                url:
                    "grade11-model-papers.html"

            },


            second: {

                title:
                    "Past Papers",

                description:
                    "Grade 11 Past Papers 2016 - 2025",

                url:
                    "grade11-past-papers.html"

            }

        };

    }


    // =================================================
    // UNKNOWN
    // =================================================

    return {

        model:
            null,

        second:
            null

    };

}


// =====================================================
// UPDATE MATERIAL CARDS
// =====================================================

function updateMaterialCards(type) {

    const config =
        getMaterialConfig(type);


    // =================================================
    // MODEL CARD
    // =================================================

    if (
        modelPapersCard
    ) {

        if (
            config.model
        ) {

            modelPapersCard.style.display =
                "block";

        }

        else {

            modelPapersCard.style.display =
                "none";

        }

    }


    if (
        config.model &&
        modelPapersTitle
    ) {

        modelPapersTitle.textContent =
            config.model.title;

    }


    if (
        config.model &&
        modelPapersDescription
    ) {

        modelPapersDescription.textContent =
            config.model.description;

    }


    // =================================================
    // SECOND CARD
    // =================================================

    if (
        pastPapersCard
    ) {

        if (
            config.second
        ) {

            // IMPORTANT
            // Always force display for
            // A/L and Grade 11.

            pastPapersCard.style.display =
                "block";

            pastPapersCard.style.visibility =
                "visible";

        }

        else {

            pastPapersCard.style.display =
                "none";

        }

    }


    if (
        config.second &&
        pastPapersTitle
    ) {

        pastPapersTitle.textContent =
            config.second.title;

    }


    if (
        config.second &&
        pastPapersDescription
    ) {

        pastPapersDescription.textContent =
            config.second.description;

    }

}


// =====================================================
// SET MATERIAL LINKS
// =====================================================

function setupMaterialCards(type) {

    const config =
        getMaterialConfig(type);


    // =================================================
    // MODEL PAPERS
    // =================================================

    if (
        modelPapersCard &&
        config.model
    ) {

        modelPapersCard.onclick =
            function () {

                const url =
                    config.model.url;


                window.location.href =
                    url +
                    "?id=" +
                    encodeURIComponent(
                        studentId
                    );

            };


        modelPapersCard.onkeydown =
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    const url =
                        config.model.url;


                    window.location.href =
                        url +
                        "?id=" +
                        encodeURIComponent(
                            studentId
                        );

                }

            };

    }


    // =================================================
    // SECOND CARD
    // =================================================

    if (
        pastPapersCard &&
        config.second
    ) {

        pastPapersCard.onclick =
            function () {

                const url =
                    config.second.url;


                window.location.href =
                    url +
                    "?id=" +
                    encodeURIComponent(
                        studentId
                    );

            };


        pastPapersCard.onkeydown =
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    const url =
                        config.second.url;


                    window.location.href =
                        url +
                        "?id=" +
                        encodeURIComponent(
                            studentId
                        );

                }

            };

    }

}


// =====================================================
// PAPER PROGRESS
// =====================================================

function calculateProgress(data) {

    let total =
        0;

    let viewed =
        0;


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

            total++;


            if (
                data[field] === true
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
// DISPLAY PROGRESS
// =====================================================

function updateProgress(data) {

    const result =
        calculateProgress(data);


    if (
        totalPapersElement
    ) {

        totalPapersElement.textContent =
            result.total;

    }


    if (
        viewedPapersElement
    ) {

        viewedPapersElement.textContent =
            result.viewed;

    }


    const percentage =
        result.total > 0
            ? Math.round(
                (
                    result.viewed /
                    result.total
                ) * 100
            )
            : 0;


    if (
        progressValueElement
    ) {

        progressValueElement.textContent =
            percentage + "%";

    }

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

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


        // =================================================
        // DETECT TYPE
        // =================================================

        const studentType =
            detectStudentType(data);


        currentStudentType =
            studentType;


        // =================================================
        // DISPLAY GRADE
        // =================================================

        const gradeName =
            getGradeName(
                studentType
            );


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


        // =================================================
        // DISPLAY NAME
        // =================================================

        const name =
            getStudentName(data);


        updateGreeting(name);


        // =================================================
        // MATERIALS
        // =================================================

        updateMaterialCards(
            studentType
        );


        setupMaterialCards(
            studentType
        );


        // =================================================
        // PROGRESS
        // =================================================

        updateProgress(data);


        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "========================================"
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
            "Grade Name:",
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
            "========================================"
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
    function (eventName) {

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

const IDLE_LIMIT =
    5 * 60 * 1000;


const idleChecker =
    setInterval(
        async function () {

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


                // =================================
                // MARK OFFLINE
                // =================================

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

                    catch (error) {

                        console.error(
                            "Failed to mark offline:",
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
    function () {

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

if (
    logoutBtn
) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {
                return;
            }


            // =================================
            // STOP TIMERS
            // =================================

            clearInterval(
                heartbeat
            );

            clearInterval(
                idleChecker
            );


            // =================================
            // MARK OFFLINE
            // =================================

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
                "studentType"
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


// =====================================================
// READY
// =====================================================

console.log(
    "✅ New Dashboard JS Loaded"
);

console.log(
    "Student ID:",
    studentId
);
