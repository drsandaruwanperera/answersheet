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


const rawRole =
    sessionStorage.getItem(
        "adminRole"
    ) || "limited";


const adminRole =
    String(
        rawRole
    )
        .trim()
        .toLowerCase()
        .replace(
            /[\s_-]+/g,
            ""
        );


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "full";


// =====================================================
// LOGIN PROTECTION
// =====================================================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


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


// =====================================================
// SETTINGS
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


const TOTAL_PAPERS =
    13;


// =====================================================
// DATA
// =====================================================

let allStudents = [];


// =====================================================
// ADMIN INFO
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

        alert(
            "🔒 Access denied. Super Administrator only."
        );

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
            () => {

                container.classList.remove(
                    "show"
                );

            }
        );

    }


    clearTimeout(
        window.accessDeniedTimer
    );


    window.accessDeniedTimer =
        setTimeout(
            () => {

                container.classList.remove(
                    "show"
                );

            },
            3500
        );

}


// =====================================================
// ROLE ACCESS
// =====================================================

function setupRoleAccess() {

    // =================================================
    // SUPER ADMIN
    // =================================================

    if (isSuperAdmin) {

        console.log(
            "👑 Super Administrator access enabled."
        );


        return;

    }


    // =================================================
    // LIMITED ADMIN
    // =================================================

    console.log(
        "👤 Limited Administrator access enabled."
    );


    // ---------------------------------------------
    // Navigation items
    // ---------------------------------------------

    const restrictedNav =
        document.querySelectorAll(
            ".superadmin-only"
        );


    restrictedNav.forEach(
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


            // Add lock

            if (
                !item.querySelector(
                    ".nav-lock"
                )
            ) {

                const lock =
                    document.createElement(
                        "span"
                    );


                lock.className =
                    "nav-lock";


                lock.textContent =
                    "🔒";


                lock.style.marginLeft =
                    "auto";


                item.appendChild(
                    lock
                );

            }

        }
    );


    // ---------------------------------------------
    // Management links
    // ---------------------------------------------

    const restrictedLinks =
        document.querySelectorAll(
            ".superadmin-link"
        );


    restrictedLinks.forEach(
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


    // ---------------------------------------------
    // Management cards
    // ---------------------------------------------

    const restrictedCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    restrictedCards.forEach(
        card => {

            card.classList.add(
                "access-locked"
            );


            card.setAttribute(
                "aria-disabled",
                "true"
            );


            card.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    showAccessDenied();

                }
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


            sessionStorage.clear();


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

    const type =
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


    if (
        type === "grade10" ||
        type === "grade 10" ||
        grade === "10"
    ) {

        return "grade10";

    }


    if (
        type === "grade11" ||
        type === "grade 11" ||
        grade === "11"
    ) {

        return "grade11";

    }


    return "al";

}


// =====================================================
// ACTIVE
// =====================================================

function isStudentActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt ||
            0
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
// VIEWED COUNT
// =====================================================

function getViewedCount(data) {

    let count = 0;


    for (
        let i = 1;
        i <= TOTAL_PAPERS;
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

    if (element) {

        element.textContent =
            String(value);

    }

}


// =====================================================
// DASHBOARD
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


            categories[type].total++;


            categories[type].views +=
                viewed;


            if (active) {

                categories[type].online++;

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
    // ALL
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

function processStudents(
    snapshot
) {

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


// =====================================================
// REAL-TIME
// =====================================================

function startRealtime() {

    if (
        typeof onSnapshot !==
        "function"
    ) {

        console.error(
            "onSnapshot is not available."
        );


        return;

    }


    const studentsRef =
        collection(
            db,
            "students"
        );


    onSnapshot(
        studentsRef,

        snapshot => {

            processStudents(
                snapshot
            );


            console.log(
                "🟢 Dashboard updated in real-time"
            );

        },

        error => {

            console.error(
                "Realtime error:",
                error
            );

        }
    );

}


// =====================================================
// INITIAL LOAD
// =====================================================

async function initialLoad() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        processStudents(
            snapshot
        );


        startRealtime();

    }

    catch (error) {

        console.error(
            "Dashboard load error:",
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


initialLoad();


// =====================================================
// ACTIVE STATUS REFRESH
// =====================================================

setInterval(
    () => {

        updateDashboard();

    },
    15000
);


// =====================================================
// DIRECT URL PROTECTION
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
    "======================================"
);

console.log(
    "✅ ADMIN DASHBOARD"
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
    "======================================"
);
