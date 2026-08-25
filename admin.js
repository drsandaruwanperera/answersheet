import * as firebase from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const db =
    firebase.db;

const collection =
    firebase.collection;

const getDocs =
    firebase.getDocs;

const onSnapshot =
    firebase.onSnapshot;


// =====================================================
// SESSION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


const storedRole =
    (
        sessionStorage.getItem(
            "adminRole"
        ) || "limited"
    )
    .trim()
    .toLowerCase()
    .replace(
        /[\s_-]+/g,
        ""
    );


// =====================================================
// ROLE
// =====================================================
//
// full / superadmin = SUPER ADMIN
// limited / admin   = NORMAL ADMIN
// =====================================================

const isSuperAdmin =
    storedRole === "superadmin" ||
    storedRole === "full";


// =====================================================
// ADMIN PROTECTION
// =====================================================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================


// -----------------------------------------------------
// ADMIN INFO
// -----------------------------------------------------

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// -----------------------------------------------------
// SUMMARY
// -----------------------------------------------------

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


// -----------------------------------------------------
// MANAGEMENT LINKS
// -----------------------------------------------------

const studentManagementLink =
    document.getElementById(
        "studentManagementLink"
    );


const paperManagementLink =
    document.getElementById(
        "paperManagementLink"
    );


const importStudentsLink =
    document.getElementById(
        "importStudentsLink"
    );


const statisticsLink =
    document.getElementById(
        "statisticsLink"
    );


// =====================================================
// SETTINGS
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// DATA
// =====================================================

let allStudents = [];


// =====================================================
// ADMIN INFORMATION
// =====================================================

function loadAdminInfo() {

    if (adminUsernameElement) {

        adminUsernameElement.textContent =
            adminUsername;

    }


    if (adminRoleElement) {

        adminRoleElement.textContent =
            isSuperAdmin
                ? "Super Administrator"
                : "Administrator";

    }

}


loadAdminInfo();


// =====================================================
// ACCESS DENIED
// =====================================================

function showAccessDenied() {

    const container =
        document.getElementById(
            "accessDeniedMessage"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="access-denied-box">

            <div class="access-denied-icon">
                🔒
            </div>

            <div class="access-denied-content">

                <strong>
                    Access Restricted
                </strong>

                <p>
                    This feature is available only
                    to the Super Administrator.
                </p>

            </div>

            <button
                type="button"
                class="access-denied-close"
                aria-label="Close"
            >
                ×
            </button>

        </div>

    `;


    container.classList.add(
        "show"
    );


    const closeButton =
        container.querySelector(
            ".access-denied-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            hideAccessDenied
        );

    }


    clearTimeout(
        window.accessDeniedTimer
    );


    window.accessDeniedTimer =
        setTimeout(
            hideAccessDenied,
            3500
        );

}


// =====================================================
// HIDE ACCESS DENIED
// =====================================================

function hideAccessDenied() {

    const container =
        document.getElementById(
            "accessDeniedMessage"
        );


    if (!container) {
        return;
    }


    container.classList.remove(
        "show"
    );

}


// =====================================================
// SUPER ADMIN ACCESS CONTROL
// =====================================================
//
// IMPORTANT:
// This function DOES NOT create lock icons.
// CSS handles the single 🔒 icon.
//
// Therefore duplicate lock icons will not occur.
// =====================================================

function setupRoleAccess() {


    // =================================================
    // SIDEBAR SUPER ADMIN ITEMS
    // =================================================

    const superAdminNavItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    // =================================================
    // MANAGEMENT LINKS
    // =================================================

    const superAdminLinks =
        document.querySelectorAll(
            ".superadmin-link"
        );


    // =================================================
    // MANAGEMENT CARDS
    // =================================================

    const superAdminCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin) {


        // ---------------------------------------------
        // NAV
        // ---------------------------------------------

        superAdminNavItems.forEach(
            item => {

                item.classList.remove(
                    "locked-menu"
                );


                item.removeAttribute(
                    "aria-disabled"
                );


                item.removeAttribute(
                    "title"
                );

            }
        );


        // ---------------------------------------------
        // LINKS
        // ---------------------------------------------

        superAdminLinks.forEach(
            link => {

                link.classList.remove(
                    "access-locked"
                );


                link.removeAttribute(
                    "aria-disabled"
                );


                link.removeAttribute(
                    "title"
                );

            }
        );


        // ---------------------------------------------
        // CARDS
        // ---------------------------------------------

        superAdminCards.forEach(
            card => {

                card.classList.remove(
                    "access-locked"
                );

            }
        );


        return;

    }


    // =================================================
    // LIMITED ADMIN
    // =================================================

    superAdminNavItems.forEach(
        item => {

            item.classList.add(
                "locked-menu"
            );


            item.setAttribute(
                "aria-disabled",
                "true"
            );


            item.setAttribute(
                "title",
                "Super Administrator only"
            );


            // -----------------------------------------
            // CLICK PROTECTION
            // -----------------------------------------

            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAccessDenied();

                }
            );

        }
    );


    // =================================================
    // MANAGEMENT LINKS
    // =================================================

    superAdminLinks.forEach(
        link => {

            link.classList.add(
                "access-locked"
            );


            link.setAttribute(
                "aria-disabled",
                "true"
            );


            link.setAttribute(
                "title",
                "Super Administrator only"
            );


            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAccessDenied();

                }
            );

        }
    );


    // =================================================
    // MANAGEMENT CARDS
    // =================================================

    superAdminCards.forEach(
        card => {

            card.classList.add(
                "access-locked"
            );

        }
    );

}


setupRoleAccess();


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Logout from Admin Panel?"
                );


            if (!confirmed) {
                return;
            }


            sessionStorage.removeItem(
                "adminLoggedIn"
            );


            sessionStorage.removeItem(
                "adminRole"
            );


            sessionStorage.removeItem(
                "adminUsername"
            );


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// STUDENT TYPE
// =====================================================

function getStudentType(data) {

    const studentType =
        String(
            data?.studentType || ""
        )
        .trim()
        .toLowerCase();


    if (
        studentType === "grade10" ||
        studentType === "grade 10"
    ) {

        return "grade10";

    }


    if (
        studentType === "grade11" ||
        studentType === "grade 11"
    ) {

        return "grade11";

    }


    const grade =
        String(
            data?.grade || ""
        )
        .trim()
        .toLowerCase();


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


    return "al";

}


// =====================================================
// ACTIVE STUDENT
// =====================================================

function isStudentActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );


    if (!lastActive) {
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
// PAPER VIEW COUNT
// =====================================================

function getViewedCount(data) {

    let count = 0;


    // Supports papers 01 - 13

    for (
        let i = 1;
        i <= 13;
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

            count++;

        }

    }


    return count;

}


// =====================================================
// SET TEXT
// =====================================================

function setText(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        String(value);

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const total =
        allStudents.length;


    let totalViewed = 0;

    let totalOnline = 0;


    const categories = {

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
    // PROCESS STUDENTS
    // =================================================

    allStudents.forEach(
        student => {

            const data =
                student.data;


            const type =
                getStudentType(
                    data
                );


            const active =
                isStudentActive(
                    data
                );


            const viewed =
                getViewedCount(
                    data
                );


            totalViewed +=
                viewed;


            if (active) {

                totalOnline++;

            }


            if (
                categories[type]
            ) {

                categories[type].total++;


                categories[type].views +=
                    viewed;


                if (active) {

                    categories[type].online++;

                }

            }

        }
    );


    // =================================================
    // SUMMARY
    // =================================================

    setText(
        totalStudentsElement,
        total
    );


    setText(
        totalViewedElement,
        totalViewed
    );


    setText(
        activeStudentsElement,
        totalOnline
    );


    // =================================================
    // ALL STUDENTS
    // =================================================

    setText(
        document.getElementById(
            "reportAllTotal"
        ),
        total
    );


    setText(
        document.getElementById(
            "reportAllOnline"
        ),
        totalOnline
    );


    setText(
        document.getElementById(
            "reportAllOffline"
        ),
        total -
        totalOnline
    );


    setText(
        document.getElementById(
            "reportAllViews"
        ),
        totalViewed
    );


    // =================================================
    // GRADE 10
    // =================================================

    setText(
        document.getElementById(
            "reportGrade10Total"
        ),
        categories.grade10.total
    );


    setText(
        document.getElementById(
            "reportGrade10Online"
        ),
        categories.grade10.online
    );


    setText(
        document.getElementById(
            "reportGrade10Offline"
        ),
        categories.grade10.total -
        categories.grade10.online
    );


    setText(
        document.getElementById(
            "reportGrade10Views"
        ),
        categories.grade10.views
    );


    // =================================================
    // GRADE 11
    // =================================================

    setText(
        document.getElementById(
            "reportGrade11Total"
        ),
        categories.grade11.total
    );


    setText(
        document.getElementById(
            "reportGrade11Online"
        ),
        categories.grade11.online
    );


    setText(
        document.getElementById(
            "reportGrade11Offline"
        ),
        categories.grade11.total -
        categories.grade11.online
    );


    setText(
        document.getElementById(
            "reportGrade11Views"
        ),
        categories.grade11.views
    );


    // =================================================
    // A/L
    // =================================================

    setText(
        document.getElementById(
            "reportALTotal"
        ),
        categories.al.total
    );


    setText(
        document.getElementById(
            "reportALOnline"
        ),
        categories.al.online
    );


    setText(
        document.getElementById(
            "reportALOffline"
        ),
        categories.al.total -
        categories.al.online
    );


    setText(
        document.getElementById(
            "reportALViews"
        ),
        categories.al.views
    );

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        const students = [];


        snapshot.forEach(
            studentDoc => {

                students.push({

                    id:
                        studentDoc.id,

                    data:
                        studentDoc.data()

                });

            }
        );


        allStudents =
            students;


        updateDashboard();

    }
    catch (error) {

        console.error(
            "Dashboard student load error:",
            error
        );


        setText(
            totalStudentsElement,
            "—"
        );


        setText(
            totalViewedElement,
            "—"
        );


        setText(
            activeStudentsElement,
            "—"
        );

    }

}


// =====================================================
// REAL-TIME FIREBASE LISTENER
// =====================================================

function startRealtimeUpdates() {

    if (
        typeof onSnapshot !==
        "function"
    ) {

        console.warn(
            "onSnapshot is not available."
        );


        return;

    }


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        onSnapshot(
            studentsRef,

            snapshot => {

                const students = [];


                snapshot.forEach(
                    studentDoc => {

                        students.push({

                            id:
                                studentDoc.id,

                            data:
                                studentDoc.data()

                        });

                    }
                );


                allStudents =
                    students;


                updateDashboard();


                console.log(
                    "🔄 Student dashboard updated:",
                    students.length
                );

            },

            error => {

                console.error(
                    "Realtime dashboard error:",
                    error
                );


                loadStudents();

            }
        );

    }
    catch (error) {

        console.error(
            "Realtime listener setup error:",
            error
        );


        loadStudents();

    }

}


// =====================================================
// REFRESH ACTIVE STATUS
// =====================================================

function refreshActiveStatus() {

    if (
        !allStudents.length
    ) {

        return;

    }


    updateDashboard();

}


// =====================================================
// DIRECT PAGE PROTECTION
// =====================================================

function protectCurrentPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const restrictedPages = [

        "paper-management.html",

        "paper-settings.html",

        "import-students.html",

        "reports.html",

        "statistics.html"

    ];


    if (
        restrictedPages.includes(
            currentPage
        )
    ) {

        if (!isSuperAdmin) {

            window.location.replace(
                "admin.html"
            );

        }

    }

}


protectCurrentPage();


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


// =====================================================
// REAL-TIME
// =====================================================

startRealtimeUpdates();


// =====================================================
// ACTIVE STATUS REFRESH
// =====================================================

setInterval(
    refreshActiveStatus,
    15000
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

            refreshActiveStatus();

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
    "✅ ADMIN DASHBOARD LOADED"
);

console.log(
    "Admin:",
    adminUsername
);

console.log(
    "Role:",
    storedRole
);

console.log(
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "======================================"
);
