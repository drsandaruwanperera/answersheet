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
// ADMIN SESSION
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
    )
    .toLowerCase()
    .trim();


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "full";


// =====================================================
// ADMIN PROTECTION
// =====================================================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// SETTINGS
// =====================================================

const TOTAL_PAPERS =
    13;


// Student is considered online
// if lastActiveAt is within 90 seconds.

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let realtimeUnsubscribe = null;


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
// ADMIN INFORMATION
// =====================================================

function loadAdminInfo() {

    if (
        adminUsernameElement
    ) {

        adminUsernameElement.textContent =
            adminUsername;

    }


    if (
        adminRoleElement
    ) {

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
// ROLE ACCESS
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


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin) {

        superAdminNavItems.forEach(
            item => {

                item.classList.remove(
                    "locked-menu"
                );

                item.removeAttribute(
                    "aria-disabled"
                );

            }
        );


        superAdminLinks.forEach(
            link => {

                link.classList.remove(
                    "access-locked"
                );

                link.removeAttribute(
                    "aria-disabled"
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


    // =================================================
    // NORMAL ADMIN
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


            // Stop Firebase listener

            if (
                realtimeUnsubscribe
            ) {

                realtimeUnsubscribe();

                realtimeUnsubscribe =
                    null;

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
        .toLowerCase()
        .trim();


    const grade =
        String(
            data?.grade || ""
        )
        .toLowerCase()
        .trim();


    // ---------------------------------------------
    // studentType
    // ---------------------------------------------

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


    if (
        studentType === "al" ||
        studentType === "a/l" ||
        studentType === "a level" ||
        studentType === "advanced" ||
        studentType === "advanced level"
    ) {

        return "al";

    }


    // ---------------------------------------------
    // grade
    // ---------------------------------------------

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
// PAPER VIEWED FIELD
// =====================================================

function getPaperViewedField(
    number
) {

    return (
        "paper" +
        String(number)
            .padStart(
                2,
                "0"
            ) +
        "Viewed"
    );

}


// =====================================================
// PAPER VIEW COUNT
// =====================================================

function getViewedCount(data) {

    let count = 0;


    // IMPORTANT:
    // Papers 01 - 13

    for (
        let i = 1;
        i <= TOTAL_PAPERS;
        i++
    ) {

        const field =
            getPaperViewedField(
                i
            );


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
        String(
            value
        );

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const total =
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


            // Total views

            totalViewed +=
                viewed;


            // Online

            if (active) {

                totalOnline++;

            }


            // Category

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
    // SUMMARY CARDS
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


    // =================================================
    // CONSOLE
    // =================================================

    console.log(
        "📊 Dashboard updated:",
        {
            totalStudents:
                total,

            totalViewed:
                totalViewed,

            online:
                totalOnline,

            grade10:
                categories.grade10,

            grade11:
                categories.grade11,

            al:
                categories.al
        }
    );

}


// =====================================================
// INITIAL LOAD
// =====================================================

async function loadStudents() {

    try {

        console.log(
            "📥 Loading students..."
        );


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


        console.log(
            "✅ Initial students loaded:",
            allStudents.length
        );

    }
    catch (error) {

        console.error(
            "❌ Initial student load error:",
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

    console.log(
        "🔥 Starting Firestore real-time listener..."
    );


    // -------------------------------------------------
    // CHECK ON SNAPSHOT
    // -------------------------------------------------

    if (
        typeof onSnapshot !==
        "function"
    ) {

        console.error(
            "❌ onSnapshot is not exported from firebase.js"
        );


        console.error(
            "Please export onSnapshot from firebase.js"
        );


        // Fallback

        loadStudents();


        return;

    }


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        realtimeUnsubscribe =
            onSnapshot(
                studentsRef,

                snapshot => {

                    console.log(
                        "🔥 Firestore student data changed"
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


                    console.log(
                        "✅ Real-time students:",
                        allStudents.length
                    );

                },


                error => {

                    console.error(
                        "❌ Firestore real-time listener error:",
                        error
                    );

                }
            );

    }
    catch (error) {

        console.error(
            "❌ Failed to start real-time listener:",
            error
        );


        loadStudents();

    }

}


// =====================================================
// ACTIVE STATUS REFRESH
// =====================================================
//
// Firestore will notify us when:
// - login changes lastActiveAt
// - logout changes lastActiveAt
// - paperViewed changes
//
// But when 90 seconds simply passes,
// Firestore itself does NOT change.
//
// Therefore we refresh locally every 15 seconds.
// =====================================================

function refreshActiveStatus() {

    if (
        allStudents.length === 0
    ) {

        return;

    }


    updateDashboard();

}


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
// MANAGEMENT LINK SAFETY
// =====================================================

if (
    studentManagementLink
) {

    studentManagementLink.addEventListener(
        "click",
        () => {

            console.log(
                "Opening Student Management"
            );

        }
    );

}


// =====================================================
// CLEANUP
// =====================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (
            realtimeUnsubscribe
        ) {

            realtimeUnsubscribe();

            realtimeUnsubscribe =
                null;

        }

    }
);


// =====================================================
// START
// =====================================================

loadStudents();

startRealtimeUpdates();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "=========================================="
);

console.log(
    "✅ ADMIN DASHBOARD ACTIVE"
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

console.log(
    "Total Papers:",
    TOTAL_PAPERS
);

console.log(
    "Real-Time Listener:",
    typeof onSnapshot ===
    "function"
);

console.log(
    "=========================================="
);
