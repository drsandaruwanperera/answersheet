// =====================================================
// ADMIN DASHBOARD - admin.js
// =====================================================

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// 1. LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// 2. GET ADMIN INFORMATION
// =====================================================

const adminUsername =
    sessionStorage.getItem("adminUsername") ||
    sessionStorage.getItem("username") ||
    "Admin";


const adminRole =
    (
        sessionStorage.getItem("adminRole") ||
        sessionStorage.getItem("role") ||
        "admin"
    )
    .toLowerCase()
    .trim();


// =====================================================
// 3. CHECK SUPERADMIN
// =====================================================

const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "super_admin" ||
    adminRole === "super admin" ||
    adminRole === "superadministrator" ||
    adminRole === "super administrator";


// =====================================================
// 4. ADMIN USER DISPLAY
// =====================================================

const usernameElement =
    document.getElementById(
        "adminUsername"
    );


const roleElement =
    document.getElementById(
        "adminRole"
    );


if (usernameElement) {

    usernameElement.textContent =
        adminUsername;

}


if (roleElement) {

    roleElement.textContent =
        isSuperAdmin
            ? "Super Administrator"
            : "Administrator";

}


// =====================================================
// 5. SUPERADMIN MENU
// =====================================================
//
// Superadmin:
// Dashboard
// Students
// Paper Management
// Import Students
// Statistics
//
// Normal Admin:
// Dashboard
// Students
//

function setupAccess() {

    const superAdminItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    const superAdminCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    const allSuperAdminElements = [
        ...superAdminItems,
        ...superAdminCards
    ];


    allSuperAdminElements.forEach(
        element => {

            if (isSuperAdmin) {

                element.style.display = "";

            }
            else {

                element.style.display =
                    "none";

            }

        }
    );

}


// Run menu access
setupAccess();


// =====================================================
// 6. ELEMENTS
// =====================================================

const totalStudentsElement =
    document.getElementById(
        "totalStudents"
    );


const totalViewedElement =
    document.getElementById(
        "totalViewed"
    );


const activeStudentsElement =
    document.getElementById(
        "activeStudents"
    );


const chartTotalStudents =
    document.getElementById(
        "chartTotalStudents"
    );


const chartPaperViews =
    document.getElementById(
        "chartPaperViews"
    );


const chartGrade10 =
    document.getElementById(
        "chartGrade10"
    );


const chartGrade11 =
    document.getElementById(
        "chartGrade11"
    );


const chartAL =
    document.getElementById(
        "chartAL"
    );


const chartActive =
    document.getElementById(
        "chartActive"
    );


const chartTotalStudentsValue =
    document.getElementById(
        "chartTotalStudentsValue"
    );


const chartPaperViewsValue =
    document.getElementById(
        "chartPaperViewsValue"
    );


const chartGrade10Value =
    document.getElementById(
        "chartGrade10Value"
    );


const chartGrade11Value =
    document.getElementById(
        "chartGrade11Value"
    );


const chartALValue =
    document.getElementById(
        "chartALValue"
    );


const chartActiveValue =
    document.getElementById(
        "chartActiveValue"
    );


// =====================================================
// 7. STUDENT TYPE
// =====================================================

function getStudentType(data) {

    const studentType =
        String(
            data?.studentType ||
            ""
        )
        .toLowerCase()
        .trim();


    // Grade 10

    if (
        studentType === "grade10" ||
        studentType === "grade 10" ||
        String(data?.grade) === "10"
    ) {

        return "grade10";

    }


    // Grade 11

    if (
        studentType === "grade11" ||
        studentType === "grade 11" ||
        String(data?.grade) === "11"
    ) {

        return "grade11";

    }


    // Everything else = A/L

    return "al";

}


// =====================================================
// 8. ACTIVE STUDENT
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


function isStudentActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );


    if (!lastActive) {

        return false;

    }


    return (
        Date.now() -
        lastActive
        <= ACTIVE_LIMIT
    );

}


// =====================================================
// 9. PAPER VIEWS
// =====================================================
//
// Counts:
// paper01Viewed
// paper02Viewed
// ...
// paper50Viewed
//

function getPaperViews(data) {

    let total = 0;


    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const paperNumber =
            String(i).padStart(
                2,
                "0"
            );


        const field =
            "paper" +
            paperNumber +
            "Viewed";


        if (
            data?.[field] === true
        ) {

            total++;

        }

    }


    return total;

}


// =====================================================
// 10. LOAD DASHBOARD DATA
// =====================================================

async function loadDashboard() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        let totalStudents = 0;

        let totalViewed = 0;

        let activeStudents = 0;

        let grade10 = 0;

        let grade11 = 0;

        let al = 0;


        // =============================================
        // LOOP STUDENTS
        // =============================================

        snapshot.forEach(
            studentDoc => {

                const data =
                    studentDoc.data();


                totalStudents++;


                // -------------------------------------
                // STUDENT TYPE
                // -------------------------------------

                const type =
                    getStudentType(
                        data
                    );


                if (
                    type === "grade10"
                ) {

                    grade10++;

                }


                else if (
                    type === "grade11"
                ) {

                    grade11++;

                }


                else {

                    al++;

                }


                // -------------------------------------
                // PAPER VIEWS
                // -------------------------------------

                totalViewed +=
                    getPaperViews(
                        data
                    );


                // -------------------------------------
                // ACTIVE
                // -------------------------------------

                if (
                    isStudentActive(
                        data
                    )
                ) {

                    activeStudents++;

                }

            }
        );


        // =================================================
        // UPDATE SUMMARY CARDS
        // =================================================

        setText(
            totalStudentsElement,
            totalStudents
        );


        setText(
            totalViewedElement,
            totalViewed
        );


        setText(
            activeStudentsElement,
            activeStudents
        );


        // =================================================
        // UPDATE CHART VALUES
        // =================================================

        setText(
            chartTotalStudentsValue,
            totalStudents
        );


        setText(
            chartPaperViewsValue,
            totalViewed
        );


        setText(
            chartGrade10Value,
            grade10
        );


        setText(
            chartGrade11Value,
            grade11
        );


        setText(
            chartALValue,
            al
        );


        setText(
            chartActiveValue,
            activeStudents
        );


        // =================================================
        // UPDATE BARS
        // =================================================

        const maxValue =
            Math.max(
                totalStudents,
                totalViewed,
                grade10,
                grade11,
                al,
                activeStudents,
                1
            );


        setBar(
            chartTotalStudents,
            totalStudents,
            maxValue
        );


        setBar(
            chartPaperViews,
            totalViewed,
            maxValue
        );


        setBar(
            chartGrade10,
            grade10,
            totalStudents
        );


        setBar(
            chartGrade11,
            grade11,
            totalStudents
        );


        setBar(
            chartAL,
            al,
            totalStudents
        );


        setBar(
            chartActive,
            activeStudents,
            totalStudents
        );


        console.log(
            "================================"
        );

        console.log(
            "ADMIN DASHBOARD"
        );

        console.log(
            "Role:",
            isSuperAdmin
                ? "SUPERADMIN"
                : "ADMIN"
        );

        console.log(
            "Students:",
            totalStudents
        );

        console.log(
            "Grade 10:",
            grade10
        );

        console.log(
            "Grade 11:",
            grade11
        );

        console.log(
            "A/L:",
            al
        );

        console.log(
            "Paper Views:",
            totalViewed
        );

        console.log(
            "Active:",
            activeStudents
        );

        console.log(
            "================================"
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        setText(
            totalStudentsElement,
            "0"
        );


        setText(
            totalViewedElement,
            "0"
        );


        setText(
            activeStudentsElement,
            "0"
        );

    }

}


// =====================================================
// 11. SET TEXT
// =====================================================

function setText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        value;

}


// =====================================================
// 12. SET BAR WIDTH
// =====================================================

function setBar(
    element,
    value,
    max
) {

    if (!element) {

        return;

    }


    if (
        !max ||
        max <= 0
    ) {

        element.style.width =
            "0%";

        return;

    }


    let percentage =
        (
            Number(value) /
            Number(max)
        ) *
        100;


    // Don't exceed 100%

    percentage =
        Math.min(
            percentage,
            100
        );


    // Small values remain visible

    if (
        value > 0 &&
        percentage < 2
    ) {

        percentage = 2;

    }


    element.style.width =
        percentage + "%";

}


// =====================================================
// 13. LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            // Remove admin session

            sessionStorage.removeItem(
                "adminLoggedIn"
            );


            sessionStorage.removeItem(
                "adminUsername"
            );


            sessionStorage.removeItem(
                "adminRole"
            );


            sessionStorage.removeItem(
                "username"
            );


            sessionStorage.removeItem(
                "role"
            );


            // Go login

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// 14. PAGE ACCESS PROTECTION
// =====================================================
//
// Prevent normal Admin from opening
// Superadmin pages manually.
// =====================================================

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


const superAdminPages = [

    "paper-management.html",

    "paper-settings.html",

    "import-students.html",

    "statistics.html",

    "reports.html",

    "settings.html"

];


if (
    superAdminPages.includes(
        currentPage
    ) &&
    !isSuperAdmin
) {

    alert(
        "Access denied. Super Administrator permission required."
    );


    window.location.replace(
        "admin.html"
    );

}


// =====================================================
// 15. INITIAL LOAD
// =====================================================

loadDashboard();


// =====================================================
// 16. AUTO REFRESH
// =====================================================
//
// Refresh dashboard every 30 seconds.
// =====================================================

setInterval(
    loadDashboard,
    30000
);


// =====================================================
// 17. DEBUG
// =====================================================

console.log(
    "✅ admin.js loaded"
);

console.log(
    "Logged in:",
    adminLoggedIn
);

console.log(
    "Username:",
    adminUsername
);

console.log(
    "Role:",
    adminRole
);

console.log(
    "Superadmin:",
    isSuperAdmin
);
