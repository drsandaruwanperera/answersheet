import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// ADMIN DASHBOARD START
// =====================================================

console.log("=================================");
console.log("ADMIN DASHBOARD JS STARTED");
console.log("=================================");


// =====================================================
// SESSION CHECK
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
// GET ADMIN DETAILS
// =====================================================

const rawRole =
    sessionStorage.getItem(
        "adminRole"
    ) || "";


const rawUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "";


// Normalize
const adminRole =
    String(rawRole)
        .trim()
        .toLowerCase()
        .replace(
            /[\s_-]+/g,
            ""
        );


const adminUsername =
    String(rawUsername)
        .trim()
        .toLowerCase();


// =====================================================
// SUPER ADMIN CHECK
// =====================================================
//
// Accept:
// superadmin
// super_admin
// super admin
// SuperAdmin
// username = superadmin
//

const isSuperAdmin =
    adminRole === "superadmin" ||
    adminUsername === "superadmin";


// =====================================================
// DEBUG
// =====================================================

console.log(
    "Admin Username:",
    adminUsername
);

console.log(
    "Admin Role:",
    adminRole
);

console.log(
    "Is Super Admin:",
    isSuperAdmin
);


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


// =====================================================
// SHOW ADMIN USER
// =====================================================

if (
    adminUsernameElement
) {

    adminUsernameElement.textContent =
        rawUsername ||
        "Admin";

}


if (
    adminRoleElement
) {

    if (
        isSuperAdmin
    ) {

        adminRoleElement.textContent =
            "Super Administrator";

    }
    else {

        adminRoleElement.textContent =
            "Administrator";

    }

}


// =====================================================
// PERMISSION SYSTEM
// =====================================================

function setupPermissions() {

    // -------------------------------------------------
    // NAVIGATION ITEMS
    // -------------------------------------------------

    const protectedNavItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    // -------------------------------------------------
    // MANAGEMENT CARDS
    // -------------------------------------------------

    const protectedCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    console.log(
        "Protected navigation items:",
        protectedNavItems.length
    );

    console.log(
        "Protected cards:",
        protectedCards.length
    );


    // =================================================
    // SUPER ADMIN
    // =================================================

    if (
        isSuperAdmin
    ) {

        console.log(
            "✅ SUPERADMIN - FULL ACCESS"
        );


        // ---------------------------------------------
        // NAV ITEMS
        // ---------------------------------------------

        protectedNavItems.forEach(
            item => {

                // Remove any previous lock
                item.classList.remove(
                    "locked"
                );

                item.classList.remove(
                    "disabled"
                );

                item.classList.remove(
                    "restricted"
                );


                // Remove attributes
                item.removeAttribute(
                    "disabled"
                );

                item.removeAttribute(
                    "aria-disabled"
                );


                // Enable
                item.style.pointerEvents =
                    "auto";

                item.style.cursor =
                    "pointer";

                item.style.opacity =
                    "1";


                // Remove JS generated locks
                item
                    .querySelectorAll(
                        ".js-lock-icon"
                    )
                    .forEach(
                        element => {
                            element.remove();
                        }
                    );

                item
                    .querySelectorAll(
                        ".lock-icon"
                    )
                    .forEach(
                        element => {
                            element.remove();
                        }
                    );

            }
        );


        // ---------------------------------------------
        // MANAGEMENT CARDS
        // ---------------------------------------------

        protectedCards.forEach(
            card => {

                card.classList.remove(
                    "locked"
                );

                card.classList.remove(
                    "disabled"
                );

                card.classList.remove(
                    "restricted"
                );


                card.style.pointerEvents =
                    "auto";

                card.style.cursor =
                    "default";

                card.style.opacity =
                    "1";


                // Remove generated lock
                card
                    .querySelectorAll(
                        ".js-lock-icon"
                    )
                    .forEach(
                        element => {
                            element.remove();
                        }
                    );

                card
                    .querySelectorAll(
                        ".lock-icon"
                    )
                    .forEach(
                        element => {
                            element.remove();
                        }
                    );

            }
        );


        return;

    }


    // =================================================
    // NORMAL ADMIN
    // =================================================

    console.log(
        "🔒 NORMAL ADMIN - LIMITED ACCESS"
    );


    // -----------------------------------------------
    // NAV ITEMS
    // -----------------------------------------------

    protectedNavItems.forEach(
        item => {

            item.classList.add(
                "locked"
            );


            item.setAttribute(
                "aria-disabled",
                "true"
            );


            item.style.cursor =
                "not-allowed";


            item.style.opacity =
                "0.55";


            // -----------------------------------------
            // Add ONE lock icon
            // -----------------------------------------

            if (
                !item.querySelector(
                    ".js-lock-icon"
                )
            ) {

                const lock =
                    document.createElement(
                        "span"
                    );


                lock.className =
                    "js-lock-icon";


                lock.textContent =
                    "🔒";


                lock.style.marginLeft =
                    "auto";


                lock.style.fontSize =
                    "13px";


                item.appendChild(
                    lock
                );

            }


            // -----------------------------------------
            // Block click
            // -----------------------------------------

            item.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();

                    showRestrictedMessage();

                },
                true
            );

        }
    );


    // -----------------------------------------------
    // MANAGEMENT CARDS
    // -----------------------------------------------

    protectedCards.forEach(
        card => {

            card.classList.add(
                "locked"
            );


            card.style.opacity =
                "0.55";


            // -----------------------------------------
            // Find link
            // -----------------------------------------

            const link =
                card.querySelector(
                    "a"
                );


            if (
                link
            ) {

                link.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();

                        showRestrictedMessage();

                    },
                    true
                );

            }

        }
    );

}


// =====================================================
// RESTRICTED MESSAGE
// =====================================================

function showRestrictedMessage() {

    const oldMessage =
        document.getElementById(
            "accessRestrictedMessage"
        );


    if (
        oldMessage
    ) {

        oldMessage.remove();

    }


    const message =
        document.createElement(
            "div"
        );


    message.id =
        "accessRestrictedMessage";


    message.innerHTML = `

        <div class="access-message-box">

            <div class="access-message-icon">
                🔒
            </div>

            <div class="access-message-text">

                <strong>
                    Access Restricted
                </strong>

                <span>
                    This section is available only
                    to Super Administrators.
                </span>

            </div>

            <button
                type="button"
                id="closeAccessMessage"
            >
                ×
            </button>

        </div>

    `;


    document.body.appendChild(
        message
    );


    const closeBtn =
        document.getElementById(
            "closeAccessMessage"
        );


    if (
        closeBtn
    ) {

        closeBtn.addEventListener(
            "click",
            () => {

                message.remove();

            }
        );

    }


    setTimeout(
        () => {

            if (
                message &&
                message.parentNode
            ) {

                message.remove();

            }

        },
        3500
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
// ACTIVE NAVIGATION
// =====================================================

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            const href =
                item
                    .getAttribute(
                        "href"
                    );


            if (
                !href
            ) {

                return;

            }


            const target =
                href
                    .split("?")[0]
                    .toLowerCase();


            if (
                target ===
                currentPage
            ) {

                item.classList.add(
                    "active"
                );

            }
            else {

                item.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =====================================================
// LOAD STUDENT DATA
// =====================================================

let students = [];


// =====================================================
// ACTIVE LIMIT
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// GET STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    if (
        data?.studentType ===
        "grade10"
    ) {

        return "grade10";

    }


    if (
        data?.studentType ===
        "grade11"
    ) {

        return "grade11";

    }


    if (
        String(
            data?.grade
        ) === "10"
    ) {

        return "grade10";

    }


    if (
        String(
            data?.grade
        ) === "11"
    ) {

        return "grade11";

    }


    return "al";

}


// =====================================================
// ACTIVE CHECK
// =====================================================

function isActive(
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


    return (
        Date.now() -
        lastActive
        <=
        ACTIVE_LIMIT
    );

}


// =====================================================
// PAPER VIEW COUNT
// =====================================================

function getPaperViews(
    data
) {

    let count = 0;


    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const number =
            String(
                i
            ).padStart(
                2,
                "0"
            );


        const field =
            "paper" +
            number +
            "Viewed";


        if (
            data?.[field] ===
            true
        ) {

            count++;

        }

    }


    return count;

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

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


        students = [];


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();


                students.push({

                    id:
                        documentSnapshot.id,

                    data:
                        data,

                    type:
                        getStudentType(
                            data
                        ),

                    active:
                        isActive(
                            data
                        ),

                    views:
                        getPaperViews(
                            data
                        )

                });

            }
        );


        console.log(
            "Students loaded:",
            students.length
        );


        updateDashboard();


    }
    catch (
        error
    ) {

        console.error(
            "Student loading error:",
            error
        );

    }

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const total =
        students.length;


    const grade10 =
        students.filter(
            student =>
                student.type ===
                "grade10"
        );


    const grade11 =
        students.filter(
            student =>
                student.type ===
                "grade11"
        );


    const al =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    const active =
        students.filter(
            student =>
                student.active
        );


    const totalViews =
        students.reduce(
            (
                total,
                student
            ) => {

                return (
                    total +
                    student.views
                );

            },
            0
        );


    // =================================================
    // SUMMARY CARDS
    // =================================================

    setText(
        "totalStudents",
        total
    );


    setText(
        "totalViewed",
        totalViews
    );


    setText(
        "activeStudents",
        active.length
    );


    // =================================================
    // ALL STUDENTS
    // =================================================

    setText(
        "reportAllTotal",
        total
    );


    setText(
        "reportAllOnline",
        active.length
    );


    setText(
        "reportAllOffline",
        total - active.length
    );


    setText(
        "reportAllViews",
        totalViews
    );


    // =================================================
    // GRADE 10
    // =================================================

    updateCategoryReport(
        grade10,
        "reportGrade10Total",
        "reportGrade10Online",
        "reportGrade10Offline",
        "reportGrade10Views"
    );


    // =================================================
    // GRADE 11
    // =================================================

    updateCategoryReport(
        grade11,
        "reportGrade11Total",
        "reportGrade11Online",
        "reportGrade11Offline",
        "reportGrade11Views"
    );


    // =================================================
    // A/L
    // =================================================

    updateCategoryReport(
        al,
        "reportALTotal",
        "reportALOnline",
        "reportALOffline",
        "reportALViews"
    );

}


// =====================================================
// CATEGORY REPORT
// =====================================================

function updateCategoryReport(
    list,
    totalId,
    onlineId,
    offlineId,
    viewsId
) {

    const total =
        list.length;


    const online =
        list.filter(
            student =>
                student.active
        ).length;


    const offline =
        total -
        online;


    const views =
        list.reduce(
            (
                sum,
                student
            ) => {

                return (
                    sum +
                    student.views
                );

            },
            0
        );


    setText(
        totalId,
        total
    );


    setText(
        onlineId,
        online
    );


    setText(
        offlineId,
        offline
    );


    setText(
        viewsId,
        views
    );

}


// =====================================================
// SET TEXT
// =====================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.textContent =
            value;

    }

}


// =====================================================
// INITIALIZE
// =====================================================

function initialize() {

    setupPermissions();

    setActiveNavigation();

    loadStudents();

}


// =====================================================
// DOM READY
// =====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

}
else {

    initialize();

}


// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(
    () => {

        loadStudents();

    },
    30000
);


// =====================================================
// FINISHED
// =====================================================

console.log(
    "✅ Admin dashboard loaded"
);
