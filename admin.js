import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    );


// ---------------------------------------------
// Not logged in
// ---------------------------------------------

if (
    adminLoggedIn !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

    throw new Error(
        "Admin authentication required."
    );

}


// =====================================================
// ADMIN SESSION
// =====================================================

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


// =====================================================
// ROLE CHECK
// =====================================================

const isSuperAdmin =
    adminRole === "superadmin";


const isLimitedAdmin =
    adminRole === "limited" ||
    adminRole === "admin";


// =====================================================
// ELEMENTS
// =====================================================


// ---------------------------------------------
// User
// ---------------------------------------------

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


// ---------------------------------------------
// Summary
// ---------------------------------------------

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


// ---------------------------------------------
// Charts
// ---------------------------------------------

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


// ---------------------------------------------
// Navigation
// ---------------------------------------------

const dashboardMenu =
    document.getElementById(
        "dashboardMenu"
    );


const studentsMenu =
    document.getElementById(
        "studentsMenu"
    );


const papersMenu =
    document.getElementById(
        "papersMenu"
    );


const importMenu =
    document.getElementById(
        "importMenu"
    );


const statisticsMenu =
    document.getElementById(
        "statisticsMenu"
    );


// ---------------------------------------------
// Management Cards
// ---------------------------------------------

const studentManagementCard =
    document.getElementById(
        "studentManagementCard"
    );


const paperManagementCard =
    document.getElementById(
        "paperManagementCard"
    );


const importStudentCard =
    document.getElementById(
        "importStudentCard"
    );


const statisticsCard =
    document.getElementById(
        "statisticsCard"
    );


// ---------------------------------------------
// Logout
// ---------------------------------------------

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// DISPLAY ADMIN INFORMATION
// =====================================================

if (
    adminUsernameElement
) {

    adminUsernameElement.textContent =
        adminUsername;

}


if (
    adminRoleElement
) {

    if (isSuperAdmin) {

        adminRoleElement.textContent =
            "Super Administrator";

    }

    else {

        adminRoleElement.textContent =
            "Administrator";

    }

}


// =====================================================
// ROLE PERMISSIONS
// =====================================================
//
// LIMITED ADMIN
//
// Dashboard       ✅
// Students        ✅
// Paper Management ❌
// Import Student  ❌
// Statistics      ❌
// Logout          ✅
//
//
// SUPER ADMIN
//
// Dashboard       ✅
// Students        ✅
// Paper Management ✅
// Import Student  ✅
// Statistics      ✅
// Logout          ✅
// =====================================================


// =====================================================
// HIDE LIMITED ADMIN FEATURES
// =====================================================

if (
    isLimitedAdmin
) {

    // ---------------------------------------------
    // Paper Management
    // ---------------------------------------------

    if (
        papersMenu
    ) {

        papersMenu.style.display =
            "none";

    }


    // ---------------------------------------------
    // Import Student
    // ---------------------------------------------

    if (
        importMenu
    ) {

        importMenu.style.display =
            "none";

    }


    // ---------------------------------------------
    // Statistics
    // ---------------------------------------------

    if (
        statisticsMenu
    ) {

        statisticsMenu.style.display =
            "none";

    }


    // ---------------------------------------------
    // Paper Card
    // ---------------------------------------------

    if (
        paperManagementCard
    ) {

        paperManagementCard.style.display =
            "none";

    }


    // ---------------------------------------------
    // Import Card
    // ---------------------------------------------

    if (
        importStudentCard
    ) {

        importStudentCard.style.display =
            "none";

    }


    // ---------------------------------------------
    // Statistics Card
    // ---------------------------------------------

    if (
        statisticsCard
    ) {

        statisticsCard.style.display =
            "none";

    }

}


// =====================================================
// SUPER ADMIN FEATURES
// =====================================================

if (
    isSuperAdmin
) {

    if (
        papersMenu
    ) {

        papersMenu.style.display =
            "";

    }


    if (
        importMenu
    ) {

        importMenu.style.display =
            "";

    }


    if (
        statisticsMenu
    ) {

        statisticsMenu.style.display =
            "";

    }


    if (
        paperManagementCard
    ) {

        paperManagementCard.style.display =
            "";

    }


    if (
        importStudentCard
    ) {

        importStudentCard.style.display =
            "";

    }


    if (
        statisticsCard
    ) {

        statisticsCard.style.display =
            "";

    }

}


// =====================================================
// ACTIVE STUDENT SETTINGS
// =====================================================
//
// Student is considered online when
// lastActiveAt is within 90 seconds.
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// GET STUDENT TYPE
// =====================================================

function getStudentType(
    data,
    studentId
) {

    // ---------------------------------------------
    // Firebase studentType
    // ---------------------------------------------

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


    // ---------------------------------------------
    // Firebase grade
    // ---------------------------------------------

    const grade =
        String(
            data?.grade || ""
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


    // ---------------------------------------------
    // Student ID detection
    // ---------------------------------------------

    const cleanId =
        String(
            studentId || ""
        )
        .trim()
        .replace(
            /\s+/g,
            ""
        );


    // Grade 11
    // 26000 - 26999

    if (
        /^\d{5}$/.test(
            cleanId
        )
    ) {

        const number =
            Number(
                cleanId
            );


        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "grade11";

        }


        // Grade 10
        // 27000 - 27999

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // A/L 2005

    if (
        cleanId.startsWith(
            "2005"
        )
    ) {

        return "al";

    }


    // A/L 2006

    if (
        cleanId.startsWith(
            "2006"
        )
    ) {

        return "al";

    }


    // A/L 2007

    if (
        cleanId.startsWith(
            "2007"
        )
    ) {

        return "al";

    }


    // Old NIC

    if (
        /^\d{9}[vVxX]$/.test(
            cleanId
        )
    ) {

        return "al";

    }


    // Default

    return "al";

}


// =====================================================
// CHECK ACTIVE
// =====================================================

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
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );


    bar.style.width =
        percentage + "%";


    valueElement.textContent =
        value;

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        console.log(
            "Loading students..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        // ---------------------------------------------
        // Counters
        // ---------------------------------------------

        let students =
            0;

        let viewed =
            0;

        let grade10Count =
            0;

        let grade11Count =
            0;

        let alCount =
            0;

        let activeCount =
            0;


        // ---------------------------------------------
        // Read students
        // ---------------------------------------------

        snapshot.forEach(
            studentDoc => {

                students++;


                const data =
                    studentDoc.data();


                const studentId =
                    studentDoc.id;


                // -------------------------------------
                // Student type
                // -------------------------------------

                const type =
                    getStudentType(
                        data,
                        studentId
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

                else if (
                    type === "al"
                ) {

                    alCount++;

                }


                // -------------------------------------
                // Active
                // -------------------------------------

                if (
                    isStudentActive(
                        data
                    )
                ) {

                    activeCount++;

                }


                // -------------------------------------
                // Paper views
                // -------------------------------------

                for (
                    let i = 1;
                    i <= 10;
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
                        data[field] === true
                    ) {

                        viewed++;

                    }

                }

            }
        );


        // =================================================
        // SUMMARY CARDS
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
        // BAR SCALE
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
        // UPDATE BARS
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
        // CONSOLE
        // =================================================

        console.log(
            "================================"
        );

        console.log(
            "Admin Dashboard Updated"
        );

        console.log(
            "Admin:",
            adminUsername
        );

        console.log(
            "Role:",
            adminRole
        );

        console.log(
            "Students:",
            students
        );

        console.log(
            "Paper Views:",
            viewed
        );

        console.log(
            "Grade 10:",
            grade10Count
        );

        console.log(
            "Grade 11:",
            grade11Count
        );

        console.log(
            "A/L:",
            alCount
        );

        console.log(
            "Active:",
            activeCount
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


        if (
            totalStudents
        ) {

            totalStudents.textContent =
                "—";

        }


        if (
            totalViewed
        ) {

            totalViewed.textContent =
                "—";

        }


        if (
            activeStudents
        ) {

            activeStudents.textContent =
                "—";

        }

    }

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


            // -----------------------------------------
            // Clear admin session
            // -----------------------------------------

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            sessionStorage.removeItem(
                "adminRole"
            );

            sessionStorage.removeItem(
                "adminUsername"
            );


            // -----------------------------------------
            // Redirect
            // -----------------------------------------

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// PROTECT RESTRICTED LINKS
// =====================================================
//
// This is an additional protection on the dashboard.
// Hidden menu items cannot be opened from here.
// =====================================================

function protectRestrictedLink(
    element,
    allowed
) {

    if (
        !element
    ) {

        return;

    }


    element.addEventListener(
        "click",
        event => {

            if (
                !allowed
            ) {

                event.preventDefault();

                alert(
                    "You do not have permission to access this section."
                );

            }

        }
    );

}


// Limited admin restrictions

protectRestrictedLink(
    papersMenu,
    isSuperAdmin
);

protectRestrictedLink(
    importMenu,
    isSuperAdmin
);

protectRestrictedLink(
    statisticsMenu,
    isSuperAdmin
);


// Management cards

protectRestrictedLink(
    paperManagementCard,
    isSuperAdmin
);

protectRestrictedLink(
    importStudentCard,
    isSuperAdmin
);

protectRestrictedLink(
    statisticsCard,
    isSuperAdmin
);


// =====================================================
// PREVENT LIMITED ADMIN FROM DIRECT CARD ACCESS
// =====================================================

if (
    isLimitedAdmin
) {

    if (
        paperManagementCard
    ) {

        paperManagementCard.style.display =
            "none";

    }


    if (
        importStudentCard
    ) {

        importStudentCard.style.display =
            "none";

    }


    if (
        statisticsCard
    ) {

        statisticsCard.style.display =
            "none";

    }

}


// =====================================================
// LIVE REFRESH
// =====================================================

loadDashboard();


const refreshTimer =
    setInterval(
        loadDashboard,
        30000
    );


// =====================================================
// PAGE VISIBILITY
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
    "================================"
);

console.log(
    "✅ Admin Dashboard Loaded"
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
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "================================"
);
