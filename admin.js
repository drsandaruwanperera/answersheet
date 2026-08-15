import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =========================================================
// ADMIN LOGIN PROTECTION
// =========================================================

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =========================================================
// ADMIN SESSION
// =========================================================

const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


const adminRole =
    String(
        sessionStorage.getItem(
            "adminRole"
        ) || "limited"
    )
    .toLowerCase()
    .trim();


// =========================================================
// ELEMENTS
// =========================================================

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


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


// =========================================================
// DISPLAY ADMIN USER
// =========================================================

if (
    adminUsernameElement
) {

    adminUsernameElement.textContent =
        adminUsername;

}


if (
    adminRoleElement
) {

    if (
        adminRole === "superadmin"
    ) {

        adminRoleElement.textContent =
            "Super Administrator";

    }

    else {

        adminRoleElement.textContent =
            "Administrator";

    }

}


// =========================================================
// SUPER ADMIN PERMISSIONS
// =========================================================

function applyPermissions() {

    const superAdmin =
        adminRole === "superadmin";


    const superAdminItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    superAdminItems.forEach(
        item => {

            if (superAdmin) {

                item.style.display =
                    "";

            }

            else {

                item.style.display =
                    "none";

            }

        }
    );


    const superAdminCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    superAdminCards.forEach(
        card => {

            if (superAdmin) {

                card.style.display =
                    "";

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );

}


// =========================================================
// ACTIVE LIMIT
// =========================================================
//
// Student active if lastActiveAt
// is within the last 90 seconds.
// =========================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =========================================================
// STUDENT TYPE
// =========================================================

function getStudentType(
    data
) {

    const type =
        String(
            data?.studentType || ""
        )
        .toLowerCase()
        .trim();


    const grade =
        String(
            data?.grade || ""
        )
        .toLowerCase()
        .trim();


    // Grade 10

    if (
        type === "grade10" ||
        type === "grade 10" ||
        grade === "10" ||
        grade === "grade10" ||
        grade === "grade 10"
    ) {

        return "grade10";

    }


    // Grade 11

    if (
        type === "grade11" ||
        type === "grade 11" ||
        grade === "11" ||
        grade === "grade11" ||
        grade === "grade 11"
    ) {

        return "grade11";

    }


    // A/L

    if (
        type === "al" ||
        type === "a/l" ||
        type === "a level" ||
        type === "advanced" ||
        type === "advanced level" ||
        grade === "al" ||
        grade === "a/l" ||
        grade === "a level" ||
        grade === "advanced" ||
        grade === "advanced level"
    ) {

        return "al";

    }


    // Student ID fallback

    return "al";

}


// =========================================================
// ACTIVE STUDENT
// =========================================================

function isStudentActive(
    data
) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );


    if (
        !lastActive
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


// =========================================================
// UPDATE BAR
// =========================================================

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


    let percentage = 0;


    if (
        maxValue > 0
    ) {

        percentage =
            (
                value /
                maxValue
            ) * 100;

    }


    percentage =
        Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );


    bar.style.width =
        percentage + "%";


    valueElement.textContent =
        value;

}


// =========================================================
// LOAD DASHBOARD
// =========================================================

async function loadDashboard() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        let students = 0;

        let viewed = 0;

        let grade10Count = 0;

        let grade11Count = 0;

        let alCount = 0;

        let activeCount = 0;


        // =================================================
        // READ ALL STUDENTS
        // =================================================

        snapshot.forEach(
            studentDoc => {

                students++;


                const data =
                    studentDoc.data();


                // -----------------------------------------
                // STUDENT TYPE
                // -----------------------------------------

                const type =
                    getStudentType(
                        data
                    );


                if (
                    type === "grade10"
                ) {

                    grade10Count++;

                }

                else if (
                    type === "grade11"
                ) {

                    grade11Count++;

                }

                else {

                    alCount++;

                }


                // -----------------------------------------
                // ACTIVE
                // -----------------------------------------

                if (
                    isStudentActive(
                        data
                    )
                ) {

                    activeCount++;

                }


                // -----------------------------------------
                // PAPER VIEWS
                // -----------------------------------------

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
                        data[field] === true
                    ) {

                        viewed++;

                    }

                }

            }
        );


        // =================================================
        // SUMMARY
        // =================================================

        if (
            totalStudents
        ) {

            totalStudents.textContent =
                students;

        }


        if (
            totalViewed
        ) {

            totalViewed.textContent =
                viewed;

        }


        if (
            activeStudents
        ) {

            activeStudents.textContent =
                activeCount;

        }


        // =================================================
        // CHART MAX
        // =================================================

        const maxValue =
            Math.max(
                students,
                viewed,
                grade10Count,
                grade11Count,
                alCount,
                activeCount,
                1
            );


        // =================================================
        // UPDATE CHARTS
        // =================================================

        updateBar(
            chartTotalStudents,
            chartTotalStudentsValue,
            students,
            maxValue
        );


        updateBar(
            chartPaperViews,
            chartPaperViewsValue,
            viewed,
            maxValue
        );


        updateBar(
            chartGrade10,
            chartGrade10Value,
            grade10Count,
            maxValue
        );


        updateBar(
            chartGrade11,
            chartGrade11Value,
            grade11Count,
            maxValue
        );


        updateBar(
            chartAL,
            chartALValue,
            alCount,
            maxValue
        );


        updateBar(
            chartActive,
            chartActiveValue,
            activeCount,
            maxValue
        );


        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "Admin Dashboard Updated",
            {
                adminUsername,
                adminRole,
                students,
                viewed,
                grade10Count,
                grade11Count,
                alCount,
                activeCount
            }
        );

    }

    catch (
        error
    ) {

        console.error(
            "Dashboard load error:",
            error
        );

    }

}


// =========================================================
// LOGOUT
// =========================================================

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


            // Clear admin session

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            sessionStorage.removeItem(
                "adminRole"
            );

            sessionStorage.removeItem(
                "adminUsername"
            );


            // Redirect

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =========================================================
// START
// =========================================================

applyPermissions();

loadDashboard();


// =========================================================
// AUTO REFRESH
// =========================================================

setInterval(
    loadDashboard,
    30000
);


// =========================================================
// CONSOLE
// =========================================================

console.log(
    "✅ Admin Dashboard Loaded"
);

console.log(
    "Admin:",
    adminUsername
);

console.log(
    "Role:",
    adminRole
);
