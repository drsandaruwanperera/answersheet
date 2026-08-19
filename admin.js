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

const doc =
    firebase.doc;

const getDoc =
    firebase.getDoc;

const onSnapshot =
    firebase.onSnapshot;


// =====================================================
// SESSION / ADMIN PROTECTION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


const adminRole =
    (
        sessionStorage.getItem(
            "adminRole"
        ) || "admin"
    ).toLowerCase();


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


const isSuperAdmin =
    adminRole === "superadmin";


// ---------------------------------------------
// NOT LOGGED IN
// ---------------------------------------------

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================


// Admin information

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


// Logout

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// Summary

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


// Management links

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
// ADMIN USER DISPLAY
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
// ACCESS DENIED MESSAGE
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
// BLOCK SUPERADMIN LINKS FOR NORMAL ADMIN
// =====================================================

function setupRoleAccess() {

    const superAdminNavItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    const superAdminLinks =
        document.querySelectorAll(
            ".superadmin-link"
        );


    const superAdminCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    // ---------------------------------------------
    // SUPERADMIN
    // ---------------------------------------------

    if (isSuperAdmin) {

        superAdminNavItems.forEach(
            item => {

                item.classList.remove(
                    "locked-menu"
                );

            }
        );


        superAdminLinks.forEach(
            link => {

                link.classList.remove(
                    "access-locked"
                );

            }
        );


        superAdminCards.forEach(
            card => {

                card.classList.remove(
                    "access-locked"
                );

            }
        );


        return;

    }


    // ---------------------------------------------
    // NORMAL ADMIN
    // ---------------------------------------------

    superAdminNavItems.forEach(
        item => {

            item.classList.add(
                "locked-menu"
            );


            item.setAttribute(
                "aria-disabled",
                "true"
            );


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


    superAdminLinks.forEach(
        link => {

            link.classList.add(
                "access-locked"
            );


            link.setAttribute(
                "aria-disabled",
                "true"
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

    if (
        data?.studentType === "grade10"
    ) {

        return "grade10";

    }


    if (
        data?.studentType === "grade11"
    ) {

        return "grade11";

    }


    if (
        String(
            data?.grade || ""
        ) === "10"
    ) {

        return "grade10";

    }


    if (
        String(
            data?.grade || ""
        ) === "11"
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

    let total =
        allStudents.length;


    let totalViewed =
        0;


    let totalOnline =
        0;


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


    // ---------------------------------------------
    // PROCESS STUDENTS
    // ---------------------------------------------

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
        total - totalOnline
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

            },
            error => {

                console.error(
                    "Realtime dashboard error:",
                    error
                );


                // If realtime listener fails,
                // normal loading still works.

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

    if (!allStudents.length) {
        return;
    }


    updateDashboard();

}


// =====================================================
// STUDENT MANAGEMENT LINK
// =====================================================

if (studentManagementLink) {

    studentManagementLink.addEventListener(
        "click",
        event => {

            // Students are available
            // to normal admin and superadmin.

        }
    );

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


// =====================================================
// START REALTIME UPDATES
// =====================================================

startRealtimeUpdates();


// =====================================================
// REFRESH ACTIVE STUDENT STATUS
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
// PREVENT SUPERADMIN PAGES BY DIRECT URL
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
// CONSOLE
// =====================================================

console.log(
    "✅ Admin Dashboard loaded"
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
    "Super Admin:",
    isSuperAdmin
);
