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
// GET STUDENT ID
// =====================================================

const studentId =
    sessionStorage.getItem(
        "studentId"
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


// =====================================================
// STUDENT FIREBASE REFERENCE
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

    // =================================================
    // SESSION TYPE FIRST
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


    // =================================================
    // CLEAN STUDENT ID
    // =================================================

    const cleanId =
        String(
            studentId || ""
        )
        .trim()
        .replace(
            /\s+/g,
            ""
        )
        .toUpperCase();


    // =================================================
    // A/L
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
    // OLD NIC = A/L
    // =================================================

    if (
        /^\d{9}[VX]$/.test(
            cleanId
        )
    ) {

        return "al";

    }


    // =================================================
    // GRADE 11
    // 26000 - 26999
    // =================================================

    if (
        /^\d{5}$/.test(
            cleanId
        )
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


    return null;

}


// =====================================================
// GRADE NAME
// =====================================================

function getGradeName(type) {

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


    if (
        type === "al"
    ) {

        return "Advanced Level";

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
        sessionStorage.getItem(
            "studentName"
        ) ||
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
// PAPER LINKS
// =====================================================
//
// Grade 10:
// grade10-model-papers.html
//
// Grade 11:
// grade11-model-papers.html
// grade11-past-papers.html
//
// A/L:
// model-papers.html
// province-paper1.html
// =====================================================

function getPaperLinks(type) {

    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        return {

            model:
                "grade10-model-papers.html",

            past:
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

            model:
                "grade11-model-papers.html",

            past:
                "grade11-past-papers.html"

        };

    }


    // =================================================
    // A/L
    // =================================================

    if (
        type === "al"
    ) {

        return {

            model:
                "model-papers.html",

            past:
                "province-paper1.html"

        };

    }


    return {

        model: null,

        past: null

    };

}


// =====================================================
// SET CARD TEXT
// =====================================================

function updateMaterialText(type) {

    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        if (modelPapersTitle) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Grade 10 Model Papers";

        }


        if (pastPapersCard) {

            pastPapersCard.style.display =
                "none";

        }

    }


    // =================================================
    // GRADE 11
    // =================================================

    else if (
        type === "grade11"
    ) {

        if (modelPapersTitle) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Grade 11 Model Papers";

        }


        if (pastPapersCard) {

            pastPapersCard.style.display =
                "";

        }


        if (pastPapersTitle) {

            pastPapersTitle.textContent =
                "Past Papers";

        }


        if (pastPapersDescription) {

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

        if (modelPapersTitle) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Advanced Level Model Papers";

        }


        if (pastPapersCard) {

            pastPapersCard.style.display =
                "";

        }


        if (pastPapersTitle) {

            pastPapersTitle.textContent =
                "Province Papers";

        }


        if (pastPapersDescription) {

            pastPapersDescription.textContent =
                "Provincial Examination Papers";

        }

    }

}


// =====================================================
// OPEN LINK
// =====================================================

function goToPage(url) {

    if (!url) {

        console.error(
            "No page URL configured."
        );

        return;

    }


    console.log(
        "Opening:",
        url
    );


    window.location.href =
        url;

}


// =====================================================
// SETUP MODEL CARD
// =====================================================

function setupModelCard(type) {

    if (!modelPapersCard) {
        return;
    }


    const links =
        getPaperLinks(
            type
        );


    // Remove previous handler

    modelPapersCard.onclick =
        null;


    // Click

    modelPapersCard.onclick =
        function () {

            goToPage(
                links.model
            );

        };


    // Keyboard

    modelPapersCard.onkeydown =
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                goToPage(
                    links.model
                );

            }

        };

}


// =====================================================
// SETUP PAST / PROVINCE CARD
// =====================================================

function setupPastCard(type) {

    if (!pastPapersCard) {
        return;
    }


    const links =
        getPaperLinks(
            type
        );


    // =================================================
    // GRADE 10
    // =================================================

    if (
        !links.past
    ) {

        pastPapersCard.style.display =
            "none";

        return;

    }


    // =================================================
    // SHOW CARD
    // =================================================

    pastPapersCard.style.display =
        "";


    // =================================================
    // CLICK
    // =================================================

    pastPapersCard.onclick =
        function () {

            goToPage(
                links.past
            );

        };


    // =================================================
    // KEYBOARD
    // =================================================

    pastPapersCard.onkeydown =
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                goToPage(
                    links.past
                );

            }

        };

}


// =====================================================
// SETUP MATERIALS
// =====================================================

function setupMaterials(type) {

    updateMaterialText(
        type
    );


    setupModelCard(
        type
    );


    setupPastCard(
        type
    );


    console.log(
        "Material setup:",
        {
            type,
            links:
                getPaperLinks(
                    type
                )
        }
    );

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    if (!studentId) {

        console.error(
            "Student ID not found in session."
        );

        sessionStorage.clear();

        window.location.replace(
            "index.html"
        );

        return;

    }


    if (!studentRef) {

        console.error(
            "Student Firebase reference not created."
        );

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


        if (
            !snapshot.exists()
        ) {

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


        if (!studentType) {

            console.error(
                "Student type could not be detected.",
                {
                    studentId,
                    data
                }
            );

            alert(
                "Student category could not be identified."
            );

            return;

        }


        // =============================================
        // GRADE NAME
        // =============================================

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
        // MATERIALS
        // =============================================

        setupMaterials(
            studentType
        );


        // =============================================
        // PAPER PROGRESS
        // =============================================

        let totalPapers =
            0;

        let viewedPapers =
            0;


        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const permissionField =
                "paper" +
                String(i)
                    .padStart(
                        2,
                        "0"
                    );


            const viewedField =
                permissionField +
                "Viewed";


            // Only count permitted papers

            if (
                data[
                    permissionField
                ] === true
            ) {

                totalPapers++;


                if (
                    data[
                        viewedField
                    ] === true
                ) {

                    viewedPapers++;

                }

            }

        }


        // =============================================
        // SUMMARY
        // =============================================

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
            progressValueElement
        ) {

            progressValueElement.textContent =
                progress + "%";

        }


        // =============================================
        // DEBUG
        // =============================================

        console.log(
            "======================================"
        );

        console.log(
            "DASHBOARD LOADED"
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "Student Type:",
            studentType
        );

        console.log(
            "Grade:",
            gradeName
        );

        console.log(
            "Model Page:",
            getPaperLinks(
                studentType
            ).model
        );

        console.log(
            "Second Page:",
            getPaperLinks(
                studentType
            ).past
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

                if (
                    studentRef
                ) {

                    await updateDoc(
                        studentRef,
                        {

                            lastActiveAt:
                                0

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


// Prevent unused-variable warnings

void heartbeat;


// =====================================================
// VISIBILITY
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
// CONSOLE
// =====================================================

console.log(
    "✅ Dashboard JS Loaded"
);

console.log(
    "Student ID:",
    studentId
);
