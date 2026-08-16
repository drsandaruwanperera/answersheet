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

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    );


if (
    adminLoggedIn !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// 2. GET SESSION ROLE
// =====================================================

const rawRole =
    sessionStorage.getItem(
        "adminRole"
    ) ||
    sessionStorage.getItem(
        "role"
    ) ||
    sessionStorage.getItem(
        "userRole"
    ) ||
    "";


const adminRole =
    String(
        rawRole
    )
    .toLowerCase()
    .trim();


// =====================================================
// 3. SUPERADMIN DETECTION
// =====================================================
//
// Supports:
//
// superadmin
// super_admin
// super admin
// Super Administrator
// SUPERADMIN
//

const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "super_admin" ||
    adminRole === "super admin" ||
    adminRole === "superadministrator" ||
    adminRole === "super administrator" ||
    adminRole.includes("superadmin") ||
    adminRole.includes("super administrator");


// =====================================================
// 4. ADMIN USERNAME
// =====================================================

const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) ||
    sessionStorage.getItem(
        "username"
    ) ||
    "Admin";


// =====================================================
// 5. DISPLAY ADMIN USER
// =====================================================

const usernameElement =
    document.getElementById(
        "adminUsername"
    );


const roleElement =
    document.getElementById(
        "adminRole"
    );


if (
    usernameElement
) {

    usernameElement.textContent =
        adminUsername;

}


if (
    roleElement
) {

    roleElement.textContent =
        isSuperAdmin
            ? "Super Administrator"
            : "Administrator";

}


// =====================================================
// 6. ROLE ACCESS
// =====================================================
//
// IMPORTANT
//
// Superadmin:
// Dashboard
// Students
// Paper Management
// Import Students
// Statistics
//
// Admin:
// Dashboard
// Students
//

function applyRoleAccess() {

    const superAdminElements =
        document.querySelectorAll(
            ".superadmin-only, .superadmin-card"
        );


    superAdminElements.forEach(
        element => {

            if (
                isSuperAdmin
            ) {

                // SHOW

                element.hidden =
                    false;

                element.style.removeProperty(
                    "display"
                );

                element.classList.remove(
                    "role-hidden"
                );

            }
            else {

                // HIDE

                element.hidden =
                    true;

                element.classList.add(
                    "role-hidden"
                );

            }

        }
    );


    console.log(
        "Admin role:",
        adminRole
    );


    console.log(
        "Is Superadmin:",
        isSuperAdmin
    );


    console.log(
        "Superadmin elements:",
        superAdminElements.length
    );

}


// Apply after DOM is ready

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        applyRoleAccess
    );

}
else {

    applyRoleAccess();

}


// =====================================================
// 7. ELEMENTS
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


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// 8. ACTIVE LIMIT
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// 9. STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    const studentType =
        String(
            data?.studentType ||
            ""
        )
        .toLowerCase()
        .trim();


    const grade =
        String(
            data?.grade ||
            ""
        )
        .toLowerCase()
        .trim();


    // Grade 10

    if (
        studentType === "grade10" ||
        studentType === "grade 10" ||
        grade === "10" ||
        grade === "grade10" ||
        grade === "grade 10"
    ) {

        return "grade10";

    }


    // Grade 11

    if (
        studentType === "grade11" ||
        studentType === "grade 11" ||
        grade === "11" ||
        grade === "grade11" ||
        grade === "grade 11"
    ) {

        return "grade11";

    }


    // A/L

    return "al";

}


// =====================================================
// 10. ACTIVE CHECK
// =====================================================

function isActive(
    data
) {

    const lastActive =
        Number(
            data?.lastActiveAt ||
            0
        );


    if (
        !lastActive
    ) {

        return false;

    }


    return (
        Date.now() -
        lastActive <=
        ACTIVE_LIMIT
    );

}


// =====================================================
// 11. PAPER VIEWS
// =====================================================

function getPaperViews(
    data
) {

    let total = 0;


    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const number =
            String(
                i
            )
            .padStart(
                2,
                "0"
            );


        const field =
            "paper" +
            number +
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
// 12. LOAD DASHBOARD
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


        // =================================================
        // LOOP STUDENTS
        // =================================================

        snapshot.forEach(
            studentDoc => {

                const data =
                    studentDoc.data();


                totalStudents++;


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


                totalViewed +=
                    getPaperViews(
                        data
                    );


                if (
                    isActive(
                        data
                    )
                ) {

                    activeStudents++;

                }

            }
        );


        // =================================================
        // SUMMARY
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
        // CHART VALUES
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
        // CHART BARS
        // =================================================

        setBar(
            chartTotalStudents,
            totalStudents,
            totalStudents
        );


        setBar(
            chartPaperViews,
            totalViewed,
            Math.max(
                totalStudents,
                totalViewed,
                1
            )
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
            "Dashboard data loaded:",
            {
                totalStudents,
                grade10,
                grade11,
                al,
                totalViewed,
                activeStudents
            }
        );

    }

    catch (
        error
    ) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// =====================================================
// 13. SET TEXT
// =====================================================

function setText(
    element,
    value
) {

    if (
        element
    ) {

        element.textContent =
            value;

    }

}


// =====================================================
// 14. SET BAR
// =====================================================

function setBar(
    element,
    value,
    max
) {

    if (
        !element
    ) {

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


    percentage =
        Math.min(
            percentage,
            100
        );


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
// 15. LOGOUT
// =====================================================

if (
    logoutBtn
) {

    logoutBtn.addEventListener(
        "click",
        () => {

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

            sessionStorage.removeItem(
                "userRole"
            );


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// 16. INITIAL LOAD
// =====================================================

loadDashboard();


// =====================================================
// 17. AUTO REFRESH
// =====================================================

setInterval(
    loadDashboard,
    30000
);


// =====================================================
// 18. DEBUG
// =====================================================

console.log(
    "================================="
);

console.log(
    "ADMIN DASHBOARD READY"
);

console.log(
    "Username:",
    adminUsername
);

console.log(
    "Raw role:",
    rawRole
);

console.log(
    "Normalized role:",
    adminRole
);

console.log(
    "Superadmin:",
    isSuperAdmin
);

console.log(
    "================================="
);
