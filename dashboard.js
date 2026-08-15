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

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


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

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =========================================
// DISPLAY STUDENT ID
// =========================================

if (
    studentIdElement
) {

    studentIdElement.textContent =
        studentId || "";

}


// =========================================
// FIREBASE STUDENT REFERENCE
// =========================================

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


// =========================================
// CURRENT DATA
// =========================================

let currentStudentData =
    null;

let currentStudentType =
    null;


// =========================================
// GET STUDENT TYPE
// =========================================
//
// Priority:
// 1. sessionStorage
// 2. Student ID
// 3. Firebase studentType
// 4. Firebase grade
//
// IMPORTANT:
//
// 26000-26999 = Grade 11
// 27000-27999 = Grade 10
// 2005xxxxxxx = A/L
// 2006xxxxxxx = A/L
// 2007xxxxxxx = A/L
//

function getStudentType(
    data
) {

    // =====================================
    // SESSION STORAGE
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
        sessionType ===
            "grade10" ||
        sessionType ===
            "grade 10"
    ) {

        return "grade10";

    }


    if (
        sessionType ===
            "grade11" ||
        sessionType ===
            "grade 11"
    ) {

        return "grade11";

    }


    if (
        sessionType ===
            "al" ||
        sessionType ===
            "a/l" ||
        sessionType ===
            "a level" ||
        sessionType ===
            "advanced" ||
        sessionType ===
            "advanced level"
    ) {

        return "al";

    }


    // =====================================
    // CLEAN STUDENT ID
    // =====================================

    const cleanId =
        String(
            studentId || ""
        )
        .trim()
        .replace(
            /\s+/g,
            ""
        );


    // =====================================
    // GRADE 11
    // =====================================

    const studentNumber =
        Number(
            cleanId
        );


    if (
        /^\d{5}$/.test(
            cleanId
        ) &&
        Number.isInteger(
            studentNumber
        ) &&
        studentNumber >=
            26000 &&
        studentNumber <=
            26999
    ) {

        return "grade11";

    }


    // =====================================
    // GRADE 10
    // =====================================

    if (
        /^\d{5}$/.test(
            cleanId
        ) &&
        Number.isInteger(
            studentNumber
        ) &&
        studentNumber >=
            27000 &&
        studentNumber <=
            27999
    ) {

        return "grade10";

    }


    // =====================================
    // A/L - 2005
    // =====================================

    if (
        cleanId.startsWith(
            "2005"
        )
    ) {

        return "al";

    }


    // =====================================
    // A/L - 2006
    // =====================================

    if (
        cleanId.startsWith(
            "2006"
        )
    ) {

        return "al";

    }


    // =====================================
    // A/L - 2007
    // =====================================

    if (
        cleanId.startsWith(
            "2007"
        )
    ) {

        return "al";

    }


    // =====================================
    // A/L OLD NIC
    // =====================================

    if (
        /^\d{9}[VvXx]$/.test(
            cleanId
        )
    ) {

        return "al";

    }


    // =====================================
    // FIREBASE STUDENT TYPE
    // =====================================

    const firebaseType =
        String(
            data?.studentType || ""
        )
        .toLowerCase()
        .trim();


    if (
        firebaseType ===
            "grade10" ||
        firebaseType ===
            "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseType ===
            "grade11" ||
        firebaseType ===
            "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseType ===
            "al" ||
        firebaseType ===
            "a/l" ||
        firebaseType ===
            "a level" ||
        firebaseType ===
            "advanced" ||
        firebaseType ===
            "advanced level"
    ) {

        return "al";

    }


    // =====================================
    // FIREBASE GRADE
    // =====================================

    const firebaseGrade =
        String(
            data?.grade || ""
        )
        .toLowerCase()
        .trim();


    if (
        firebaseGrade ===
            "10" ||
        firebaseGrade ===
            "grade10" ||
        firebaseGrade ===
            "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseGrade ===
            "11" ||
        firebaseGrade ===
            "grade11" ||
        firebaseGrade ===
            "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseGrade ===
            "al" ||
        firebaseGrade ===
            "a/l" ||
        firebaseGrade ===
            "a level" ||
        firebaseGrade ===
            "advanced" ||
        firebaseGrade ===
            "advanced level"
    ) {

        return "al";

    }


    // =====================================
    // NO TYPE
    // =====================================

    return null;

}


// =========================================
// GET DISPLAY NAME
// =========================================

function getGradeName(
    type
) {

    if (
        type ===
        "grade10"
    ) {

        return "Grade 10";

    }


    if (
        type ===
        "grade11"
    ) {

        return "Grade 11";

    }


    if (
        type ===
        "al"
    ) {

        return "Advanced Level";

    }


    return "Student";

}


// =========================================
// GET PAPER LINKS
// =========================================

function getPaperLinks(
    type
) {

    // =====================================
    // GRADE 10
    // =====================================

    if (
        type ===
        "grade10"
    ) {

        return {

            model:
                "grade10-model-paper.html",

            past:
                "grade10-past-paper.html"

        };

    }


    // =====================================
    // GRADE 11
    // =====================================

    if (
        type ===
        "grade11"
    ) {

        return {

            model:
                "grade11-model-papers.html",

            past:
                "grade11-past-papers.html"

        };

    }


    // =====================================
    // A/L
    // =====================================

    if (
        type ===
        "al"
    ) {

        return {

            model:
                "model-papers.html",

            past:
                "past-papers.html"

        };

    }


    // =====================================
    // UNKNOWN
    // =====================================

    return {

        model:
            "#",

        past:
            "#"

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
    name
) {

    if (
        !greetingElement
    ) {

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


// =========================================
// UPDATE MATERIAL TEXT
// =========================================

function updateMaterialText(
    type
) {

    // =====================================
    // A/L
    // =====================================

    if (
        type ===
        "al"
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

    }


    // =====================================
    // GRADE 10
    // =====================================

    else if (
        type ===
        "grade10"
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


    // =====================================
    // GRADE 11
    // =====================================

    else if (
        type ===
        "grade11"
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
                "Grade 11 Model Papers";

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
                "Grade 11 Past Papers";

        }

    }

}


// =========================================
// SET CARD LINKS
// =========================================

function setupMaterialCards(
    type
) {

    const links =
        getPaperLinks(
            type
        );


    // =====================================
    // MODEL PAPERS
    // =====================================

    if (
        modelPapersCard
    ) {

        modelPapersCard.onclick =
            () => {

                if (
                    links.model &&
                    links.model !== "#"
                ) {

                    window.location.href =
                        links.model;

                }

            };

    }


    // =====================================
    // PAST / PROVINCE PAPERS
    // =====================================

    if (
        pastPapersCard
    ) {

        pastPapersCard.onclick =
            () => {

                if (
                    links.past &&
                    links.past !== "#"
                ) {

                    window.location.href =
                        links.past;

                }

            };

    }

}


// =========================================
// LOAD DASHBOARD
// =========================================

async function loadDashboard() {

    if (
        !studentRef
    ) {

        console.error(
            "Student ID not found."
        );

        return;

    }


    try {

        // =================================
        // GET STUDENT
        // =================================

        const snapshot =
            await getDoc(
                studentRef
            );


        if (
            !snapshot.exists()
        ) {

            console.error(
                "Student not found."
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


        // =================================
        // DISPLAY GRADE
        // =================================

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


        // =================================
        // STUDENT NAME
        // =================================

        const studentName =
            getStudentName(
                data
            );


        updateGreeting(
            studentName
        );


        // =================================
        // MATERIAL TEXT
        // =================================

        updateMaterialText(
            studentType
        );


        // =================================
        // MATERIAL LINKS
        // =================================

        setupMaterialCards(
            studentType
        );


        // =================================
        // PAPER PROGRESS
        // =================================

        let totalPapers =
            0;

        let viewedPapers =
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

                totalPapers++;


                if (
                    data[field] === true
                ) {

                    viewedPapers++;

                }

            }

        }


        // =================================
        // DISPLAY TOTAL PAPERS
        // =================================

        if (
            totalPapersElement
        ) {

            totalPapersElement.textContent =
                totalPapers;

        }


        // =================================
        // DISPLAY VIEWED PAPERS
        // =================================

        if (
            viewedPapersElement
        ) {

            viewedPapersElement.textContent =
                viewedPapers;

        }


        // =================================
        // PROGRESS
        // =================================

        const progress =
            totalPapers > 0
                ? Math.round(
                    (
                        viewedPapers /
                        totalPapers
                    ) *
                    100
                )
                : 0;


        if (
            progressValueElement
        ) {

            progressValueElement.textContent =
                progress + "%";

        }


        // =================================
        // DEBUG
        // =================================

        console.log(
            "================================"
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Session Type:",
            sessionStorage.getItem(
                "studentType"
            )
        );

        console.log(
            "Firebase Type:",
            data.studentType
        );

        console.log(
            "Firebase Grade:",
            data.grade
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
            "Paper Links:",
            getPaperLinks(
                studentType
            )
        );

        console.log(
            "================================"
        );

    }

    catch (
        error
    ) {

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
            onlineStatusElement
        ) {

            onlineStatusElement.innerHTML =
                `
                <span class="online-dot"></span>
                Online
                `;

        }

    }

    catch (
        error
    ) {

        console.error(
            "Active status update failed:",
            error
        );

    }

}


// =========================================
// START DASHBOARD
// =========================================

loadDashboard();

updateActiveStatus();


// =========================================
// HEARTBEAT
// =========================================
//
// Every 30 seconds
//

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


                // =========================
                // MARK OFFLINE
                // =========================

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


                // =========================
                // LOGOUT
                // =========================

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


            // =============================
            // STOP TIMERS
            // =============================

            clearInterval(
                heartbeat
            );

            clearInterval(
                idleChecker
            );


            // =============================
            // MARK OFFLINE
            // =============================

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
