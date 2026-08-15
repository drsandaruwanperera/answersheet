import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// ADMIN ACCESS PROTECTION
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
// ADMIN ELEMENTS
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const adminUsername =
    document.getElementById(
        "adminUsername"
    );


const adminRole =
    document.getElementById(
        "adminRole"
    );


// =====================================================
// MANAGEMENT CARDS
// =====================================================

const studentManagementCard =
    document.getElementById(
        "studentManagementCard"
    );


const paperManagementCard =
    document.getElementById(
        "paperManagementCard"
    );


// =====================================================
// SETTINGS
// =====================================================

// Student is considered active when
// lastActiveAt is within 90 seconds.

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// SHOW ADMIN INFORMATION
// =====================================================

function loadAdminInformation() {

    const username =
        sessionStorage.getItem(
            "adminUsername"
        );


    const role =
        sessionStorage.getItem(
            "adminRole"
        );


    if (
        adminUsername
    ) {

        adminUsername.textContent =
            username ||
            "Admin";

    }


    if (
        adminRole
    ) {

        if (
            role
        ) {

            adminRole.textContent =
                formatRole(
                    role
                );

        }

        else {

            adminRole.textContent =
                "Administrator";

        }

    }

}


// =====================================================
// FORMAT ROLE
// =====================================================

function formatRole(
    role
) {

    const cleanRole =
        String(
            role || ""
        )
        .trim()
        .toLowerCase();


    if (
        cleanRole ===
        "superadmin"
    ) {

        return "Super Admin";

    }


    if (
        cleanRole ===
        "admin"
    ) {

        return "Administrator";

    }


    if (
        cleanRole ===
        "limited"
    ) {

        return "Limited";

    }


    if (
        cleanRole ===
        "manager"
    ) {

        return "Manager";

    }


    return role || "Administrator";

}


// =====================================================
// DETECT STUDENT TYPE
// =====================================================
//
// Rules:
//
// 26000 - 26999 = Grade 11
// 27000 - 27999 = Grade 10
// 2005...       = A/L
// 2006...       = A/L
// 2007...       = A/L
//
// Firebase studentType / grade are also supported.
// =====================================================

function getStudentType(
    data,
    studentId
) {

    const cleanId =
        String(
            studentId || ""
        )
        .trim()
        .replace(
            /\s+/g,
            ""
        );


    // =================================================
    // STUDENT ID DETECTION
    // =================================================

    const studentNumber =
        Number(
            cleanId
        );


    // -------------------------------------------------
    // GRADE 11
    // -------------------------------------------------

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


    // -------------------------------------------------
    // GRADE 10
    // -------------------------------------------------

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


    // -------------------------------------------------
    // A/L - 2005
    // -------------------------------------------------

    if (
        cleanId.startsWith(
            "2005"
        )
    ) {

        return "al";

    }


    // -------------------------------------------------
    // A/L - 2006
    // -------------------------------------------------

    if (
        cleanId.startsWith(
            "2006"
        )
    ) {

        return "al";

    }


    // -------------------------------------------------
    // A/L - 2007
    // -------------------------------------------------

    if (
        cleanId.startsWith(
            "2007"
        )
    ) {

        return "al";

    }


    // -------------------------------------------------
    // OLD NIC
    // Example:
    // 123456789V
    // -------------------------------------------------

    if (
        /^\d{9}[VvXx]$/.test(
            cleanId
        )
    ) {

        return "al";

    }


    // =================================================
    // FIREBASE studentType
    // =================================================

    const firebaseType =
        String(
            data?.studentType ||
            ""
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


    // =================================================
    // FIREBASE grade
    // =================================================

    const firebaseGrade =
        String(
            data?.grade ||
            ""
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


    // =================================================
    // UNKNOWN
    // =================================================

    return "al";

}


// =====================================================
// CHECK ACTIVE STUDENT
// =====================================================

function isStudentActive(
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


    const difference =
        Date.now() -
        lastActive;


    if (
        difference < 0
    ) {

        return false;

    }


    return (
        difference <=
        ACTIVE_LIMIT
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
            ) *
            100;

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
        percentage +
        "%";


    valueElement.textContent =
        value;

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        console.log(
            "Loading admin dashboard..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        // =================================================
        // COUNTERS
        // =================================================

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


        // =================================================
        // READ STUDENTS
        // =================================================

        snapshot.forEach(
            (
                docSnap
            ) => {

                students++;


                const data =
                    docSnap.data();


                const studentId =
                    docSnap.id;


                // =========================================
                // STUDENT TYPE
                // =========================================

                const type =
                    getStudentType(
                        data,
                        studentId
                    );


                if (
                    type ===
                    "grade10"
                ) {

                    grade10Count++;

                }

                else if (
                    type ===
                    "grade11"
                ) {

                    grade11Count++;

                }

                else {

                    alCount++;

                }


                // =========================================
                // ACTIVE
                // =========================================

                if (
                    isStudentActive(
                        data
                    )
                ) {

                    activeCount++;

                }


                // =========================================
                // PAPER VIEWS
                // =========================================

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
                        data[field] ===
                        true
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
        // CHART SCALE
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
        // TOTAL STUDENTS
        // =================================================

        updateBar(
            chartTotalStudents,
            chartTotalStudentsValue,
            students,
            maxValue
        );


        // =================================================
        // PAPER VIEWS
        // =================================================

        updateBar(
            chartPaperViews,
            chartPaperViewsValue,
            viewed,
            maxValue
        );


        // =================================================
        // GRADE 10
        // =================================================

        updateBar(
            chartGrade10,
            chartGrade10Value,
            grade10Count,
            maxValue
        );


        // =================================================
        // GRADE 11
        // =================================================

        updateBar(
            chartGrade11,
            chartGrade11Value,
            grade11Count,
            maxValue
        );


        // =================================================
        // A/L
        // =================================================

        updateBar(
            chartAL,
            chartALValue,
            alCount,
            maxValue
        );


        // =================================================
        // ACTIVE
        // =================================================

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
            "Dashboard updated:",
            {
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


// =====================================================
// OPEN STUDENT MANAGEMENT
// =====================================================

function openStudentManagement() {

    window.location.href =
        "students.html";

}


// =====================================================
// STUDENT MANAGEMENT CARD
// =====================================================

if (
    studentManagementCard
) {

    studentManagementCard.addEventListener(
        "click",
        openStudentManagement
    );


    studentManagementCard.addEventListener(
        "keydown",
        (
            event
        ) => {

            if (
                event.key ===
                    "Enter" ||
                event.key ===
                    " "
            ) {

                event.preventDefault();

                openStudentManagement();

            }

        }
    );

}


// =====================================================
// OPEN PAPER MANAGEMENT
// =====================================================

function openPaperManagement() {

    window.location.href =
        "paper-management.html";

}


// =====================================================
// PAPER MANAGEMENT CARD
// =====================================================

if (
    paperManagementCard
) {

    paperManagementCard.addEventListener(
        "click",
        openPaperManagement
    );


    paperManagementCard.addEventListener(
        "keydown",
        (
            event
        ) => {

            if (
                event.key ===
                    "Enter" ||
                event.key ===
                    " "
            ) {

                event.preventDefault();

                openPaperManagement();

            }

        }
    );

}


// =====================================================
// SIDEBAR STUDENTS LINK
// =====================================================

const studentsNav =
    document.querySelector(
        'a[href="students.html"]'
    );


if (
    studentsNav
) {

    studentsNav.addEventListener(
        "click",
        (
            event
        ) => {

            event.preventDefault();

            window.location.href =
                "students.html";

        }
    );

}


// =====================================================
// SIDEBAR PAPER MANAGEMENT
// =====================================================

const paperManagementNav =
    document.querySelector(
        'a[href="paper-management.html"]'
    );


if (
    paperManagementNav
) {

    paperManagementNav.addEventListener(
        "click",
        (
            event
        ) => {

            event.preventDefault();

            window.location.href =
                "paper-management.html";

        }
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
            // GO TO LOGIN
            // =========================================

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// INITIALIZE ADMIN INFORMATION
// =====================================================

loadAdminInformation();


// =====================================================
// INITIAL DASHBOARD LOAD
// =====================================================

loadDashboard();


// =====================================================
// LIVE REFRESH
// =====================================================
//
// Refresh dashboard every 30 seconds.
//

const refreshTimer =
    setInterval(
        loadDashboard,
        30000
    );


// =====================================================
// TAB VISIBILITY
// =====================================================
//
// Reload immediately when admin returns to tab.
//

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
    "===================================="
);

console.log(
    "✅ Admin Dashboard Loaded"
);

console.log(
    "Admin:",
    sessionStorage.getItem(
        "adminUsername"
    )
);

console.log(
    "Role:",
    sessionStorage.getItem(
        "adminRole"
    )
);

console.log(
    "===================================="
);
