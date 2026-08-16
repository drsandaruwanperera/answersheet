import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// ADMIN LOGIN PROTECTION
// =====================================================

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

// Summary

const totalStudents =
    document.getElementById(
        "totalStudents"
    );

const totalViewed =
    document.getElementById(
        "totalViewed"
    );

const activeStudents =
    document.getElementById(
        "activeStudents"
    );


// =====================================================
// CHART ELEMENTS
// =====================================================

const chartTotalStudents =
    document.getElementById(
        "chartTotalStudents"
    );

const chartTotalStudentsValue =
    document.getElementById(
        "chartTotalStudentsValue"
    );


const chartPaperViews =
    document.getElementById(
        "chartPaperViews"
    );

const chartPaperViewsValue =
    document.getElementById(
        "chartPaperViewsValue"
    );


const chartGrade10 =
    document.getElementById(
        "chartGrade10"
    );

const chartGrade10Value =
    document.getElementById(
        "chartGrade10Value"
    );


const chartGrade11 =
    document.getElementById(
        "chartGrade11"
    );

const chartGrade11Value =
    document.getElementById(
        "chartGrade11Value"
    );


const chartAL =
    document.getElementById(
        "chartAL"
    );

const chartALValue =
    document.getElementById(
        "chartALValue"
    );


const chartActive =
    document.getElementById(
        "chartActive"
    );

const chartActiveValue =
    document.getElementById(
        "chartActiveValue"
    );


// =====================================================
// LIVE REPORT ELEMENTS
// =====================================================

// ALL

const reportAllTotal =
    document.getElementById(
        "reportAllTotal"
    );

const reportAllOnline =
    document.getElementById(
        "reportAllOnline"
    );

const reportAllOffline =
    document.getElementById(
        "reportAllOffline"
    );

const reportAllViews =
    document.getElementById(
        "reportAllViews"
    );


// GRADE 10

const reportGrade10Total =
    document.getElementById(
        "reportGrade10Total"
    );

const reportGrade10Online =
    document.getElementById(
        "reportGrade10Online"
    );

const reportGrade10Offline =
    document.getElementById(
        "reportGrade10Offline"
    );

const reportGrade10Views =
    document.getElementById(
        "reportGrade10Views"
    );


// GRADE 11

const reportGrade11Total =
    document.getElementById(
        "reportGrade11Total"
    );

const reportGrade11Online =
    document.getElementById(
        "reportGrade11Online"
    );

const reportGrade11Offline =
    document.getElementById(
        "reportGrade11Offline"
    );

const reportGrade11Views =
    document.getElementById(
        "reportGrade11Views"
    );


// A/L

const reportALTotal =
    document.getElementById(
        "reportALTotal"
    );

const reportALOnline =
    document.getElementById(
        "reportALOnline"
    );

const reportALOffline =
    document.getElementById(
        "reportALOffline"
    );

const reportALViews =
    document.getElementById(
        "reportALViews"
    );


// =====================================================
// ADMIN USER
// =====================================================

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );

const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// ACTIVE LIMIT
// =====================================================
//
// Student is considered ONLINE if
// lastActiveAt was updated within
// the last 90 seconds.
//

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// STUDENT TYPE DETECTION
// =====================================================
//
// Priority:
//
// 1. Firebase studentType
// 2. Firebase grade
// 3. Student ID
//
// Student ID rules:
//
// 26000 - 26999 = Grade 11
// 27000 - 27999 = Grade 10
//
// 2005... = A/L
// 2006... = A/L
// 2007... = A/L
// 2008... = A/L
// 2009... = A/L
//
// Old NIC = A/L
//
// =====================================================

function getStudentType(
    data,
    studentId
) {

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
    // A/L 2005 - 2009
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
        /^\d{9}[VX]$/.test(
            cleanId
        )
    ) {

        return "al";

    }


    // =================================================
    // GRADE 10 / 11
    // =================================================

    if (
        /^\d{5}$/.test(
            cleanId
        )
    ) {

        const number =
            Number(
                cleanId
            );


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


    // =================================================
    // UNKNOWN
    // =================================================

    return null;

}


// =====================================================
// CHECK ONLINE
// =====================================================

function isStudentActive(
    data
) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );


    if (
        lastActive <= 0
    ) {

        return false;

    }


    const difference =
        Date.now() -
        lastActive;


    return (
        difference >= 0 &&
        difference <= ACTIVE_LIMIT
    );

}


// =====================================================
// COUNT PAPER VIEWS
// =====================================================
//
// Supports:
// paper01Viewed
// paper02Viewed
// ...
// paper10Viewed
//
// Also works if more paper fields are added.
//

function countPaperViews(
    data
) {

    let views = 0;


    // ================================================
    // Standard paper01 - paper10 fields
    // ================================================

    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const field =
            "paper" +
            String(i)
                .padStart(
                    2,
                    "0"
                ) +
            "Viewed";


        if (
            data?.[field] === true
        ) {

            views++;

        }

    }


    // ================================================
    // Also detect any additional
    // fields ending with "Viewed"
    //
    // Avoid counting paper01Viewed twice.
    // ================================================

    Object.keys(
        data || {}
    )
    .forEach(
        key => {

            if (
                !key.endsWith(
                    "Viewed"
                )
            ) {

                return;

            }


            if (
                !/^paper\d+Viewed$/i.test(
                    key
                )
            ) {

                return;

            }


            const alreadyHandled =
                /^paper(0[1-9]|10)Viewed$/i
                    .test(
                        key
                    );


            if (
                alreadyHandled
            ) {

                return;

            }


            if (
                data[key] === true
            ) {

                views++;

            }

        }
    );


    return views;

}


// =====================================================
// UPDATE ELEMENT
// =====================================================

function setText(
    element,
    value
) {

    if (
        element
    ) {

        element.textContent =
            String(
                value
            );

    }

}


// =====================================================
// UPDATE BAR
// =====================================================

function updateBar(
    bar,
    valueElement,
    value,
    maxValue
) {

    if (
        !bar ||
        !valueElement
    ) {

        return;

    }


    const safeValue =
        Number(
            value || 0
        );


    const safeMax =
        Math.max(
            Number(
                maxValue || 1
            ),
            1
        );


    const percentage =
        Math.min(
            (
                safeValue /
                safeMax
            ) * 100,
            100
        );


    bar.style.width =
        percentage + "%";


    valueElement.textContent =
        safeValue;

}


// =====================================================
// UPDATE LIVE REPORT
// =====================================================

function updateReport(
    elements,
    report
) {

    const total =
        report.total;


    const online =
        report.online;


    const offline =
        total -
        online;


    const views =
        report.views;


    setText(
        elements.total,
        total
    );


    setText(
        elements.online,
        online
    );


    setText(
        elements.offline,
        offline
    );


    setText(
        elements.views,
        views
    );

}


// =====================================================
// REPORT ELEMENT MAP
// =====================================================

const reportElements = {

    all: {

        total:
            reportAllTotal,

        online:
            reportAllOnline,

        offline:
            reportAllOffline,

        views:
            reportAllViews

    },


    grade10: {

        total:
            reportGrade10Total,

        online:
            reportGrade10Online,

        offline:
            reportGrade10Offline,

        views:
            reportGrade10Views

    },


    grade11: {

        total:
            reportGrade11Total,

        online:
            reportGrade11Online,

        offline:
            reportGrade11Offline,

        views:
            reportGrade11Views

    },


    al: {

        total:
            reportALTotal,

        online:
            reportALOnline,

        offline:
            reportALOffline,

        views:
            reportALViews

    }

};


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        console.log(
            "Loading student reports..."
        );


        // =================================================
        // GET STUDENTS
        // =================================================

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        // =================================================
        // REPORT OBJECTS
        // =================================================

        const reports = {

            all: {

                total: 0,

                online: 0,

                views: 0

            },


            grade10: {

                total: 0,

                online: 0,

                views: 0

            },


            grade11: {

                total: 0,

                online: 0,

                views: 0

            },


            al: {

                total: 0,

                online: 0,

                views: 0

            }

        };


        // =================================================
        // READ STUDENTS
        // =================================================

        snapshot.forEach(
            studentDoc => {

                const data =
                    studentDoc.data();


                const studentId =
                    studentDoc.id;


                // =========================================
                // DETECT TYPE
                // =========================================

                const type =
                    getStudentType(
                        data,
                        studentId
                    );


                // =========================================
                // PAPER VIEWS
                // =========================================

                const views =
                    countPaperViews(
                        data
                    );


                // =========================================
                // ONLINE
                // =========================================

                const active =
                    isStudentActive(
                        data
                    );


                // =========================================
                // ALL STUDENTS
                // =========================================

                reports.all.total++;

                reports.all.views +=
                    views;


                if (
                    active
                ) {

                    reports.all.online++;

                }


                // =========================================
                // CATEGORY
                // =========================================

                if (
                    type === "grade10"
                ) {

                    reports.grade10.total++;

                    reports.grade10.views +=
                        views;


                    if (
                        active
                    ) {

                        reports.grade10.online++;

                    }

                }


                else if (
                    type === "grade11"
                ) {

                    reports.grade11.total++;

                    reports.grade11.views +=
                        views;


                    if (
                        active
                    ) {

                        reports.grade11.online++;

                    }

                }


                else if (
                    type === "al"
                ) {

                    reports.al.total++;

                    reports.al.views +=
                        views;


                    if (
                        active
                    ) {

                        reports.al.online++;

                    }

                }


                else {

                    console.warn(
                        "Unknown student type:",
                        studentId,
                        data
                    );

                }

            }
        );


        // =================================================
        // UPDATE SUMMARY
        // =================================================

        setText(
            totalStudents,
            reports.all.total
        );


        setText(
            totalViewed,
            reports.all.views
        );


        setText(
            activeStudents,
            reports.all.online
        );


        // =================================================
        // UPDATE LIVE REPORTS
        // =================================================

        updateReport(
            reportElements.all,
            reports.all
        );


        updateReport(
            reportElements.grade10,
            reports.grade10
        );


        updateReport(
            reportElements.grade11,
            reports.grade11
        );


        updateReport(
            reportElements.al,
            reports.al
        );


        // =================================================
        // CHART MAX
        // =================================================

        const maxValue =
            Math.max(

                reports.all.total,

                reports.all.views,

                reports.grade10.total,

                reports.grade11.total,

                reports.al.total,

                reports.all.online,

                1

            );


        // =================================================
        // UPDATE CHARTS
        // =================================================

        updateBar(
            chartTotalStudents,
            chartTotalStudentsValue,
            reports.all.total,
            maxValue
        );


        updateBar(
            chartPaperViews,
            chartPaperViewsValue,
            reports.all.views,
            maxValue
        );


        updateBar(
            chartGrade10,
            chartGrade10Value,
            reports.grade10.total,
            maxValue
        );


        updateBar(
            chartGrade11,
            chartGrade11Value,
            reports.grade11.total,
            maxValue
        );


        updateBar(
            chartAL,
            chartALValue,
            reports.al.total,
            maxValue
        );


        updateBar(
            chartActive,
            chartActiveValue,
            reports.all.online,
            maxValue
        );


        // =================================================
        // CONSOLE REPORT
        // =================================================

        console.log(
            "======================================"
        );

        console.log(
            "ADMIN LIVE REPORT"
        );

        console.log(
            "======================================"
        );

        console.log(
            "All Students:",
            reports.all
        );

        console.log(
            "Grade 10:",
            reports.grade10
        );

        console.log(
            "Grade 11:",
            reports.grade11
        );

        console.log(
            "A/L:",
            reports.al
        );

        console.log(
            "======================================"
        );

    }

    catch (error) {

        console.error(
            "Admin dashboard loading error:",
            error
        );

    }

}


// =====================================================
// ADMIN USER DISPLAY
// =====================================================

function loadAdminUser() {

    const username =
        sessionStorage.getItem(
            "adminUsername"
        ) ||
        "Admin";


    const role =
        sessionStorage.getItem(
            "adminRole"
        ) ||
        "Administrator";


    setText(
        adminUsernameElement,
        username
    );


    // Make role look professional

    let displayRole =
        role;


    if (
        String(
            role
        ).toLowerCase() ===
        "superadmin"
    ) {

        displayRole =
            "Super Administrator";

    }

    else if (
        String(
            role
        ).toLowerCase() ===
        "admin"
    ) {

        displayRole =
            "Administrator";

    }

    else if (
        String(
            role
        ).toLowerCase() ===
        "limited"
    ) {

        displayRole =
            "Administrator";

    }


    setText(
        adminRoleElement,
        displayRole
    );

}


// =====================================================
// ROLE-BASED NAVIGATION
// =====================================================

function setupRoleAccess() {

    const role =
        String(
            sessionStorage.getItem(
                "adminRole"
            ) || ""
        )
        .toLowerCase()
        .trim();


    const superAdmin =
        role === "superadmin" ||
        role === "super admin" ||
        role === "superadministrator";


    // ================================================
    // Superadmin-only navigation
    // ================================================

    const superAdminItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    superAdminItems.forEach(
        item => {

            if (
                superAdmin
            ) {

                item.style.display =
                    "";

            }

            else {

                item.style.display =
                    "none";

            }

        }
    );


    // ================================================
    // Superadmin management cards
    // ================================================

    const superAdminCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    superAdminCards.forEach(
        card => {

            if (
                superAdmin
            ) {

                card.style.display =
                    "";

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );


    console.log(
        "Admin role:",
        role
    );

    console.log(
        "Super admin:",
        superAdmin
    );

}


// =====================================================
// LOGOUT
// =====================================================

if (
    logoutBtn
) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (
                !confirmed
            ) {

                return;

            }


            // =========================================
            // CLEAR ADMIN SESSION
            // =========================================

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            sessionStorage.removeItem(
                "adminRole"
            );

            sessionStorage.removeItem(
                "adminUsername"
            );


            // =========================================
            // LOGIN PAGE
            // =========================================

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// START
// =====================================================

loadAdminUser();

setupRoleAccess();

loadDashboard();


// =====================================================
// LIVE REFRESH
// =====================================================
//
// Refresh every 30 seconds.
//

const refreshTimer =
    setInterval(
        loadDashboard,
        30000
    );


// =====================================================
// REFRESH WHEN TAB BECOMES VISIBLE
// =====================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadDashboard();

        }

    }
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "======================================"
);

console.log(
    "✅ Admin Dashboard Loaded"
);

console.log(
    "Live reports enabled"
);

console.log(
    "Grade 10 / Grade 11 / A/L"
);

console.log(
    "======================================"
);
