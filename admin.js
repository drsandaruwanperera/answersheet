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

const adminRole =
    String(
        sessionStorage.getItem(
            "adminRole"
        ) || "limited"
    )
    .trim()
    .toLowerCase();


// =====================================================
// LOGIN CHECK
// =====================================================

if (
    adminLoggedIn !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ROLE
// =====================================================

const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "super_admin" ||
    adminRole === "super admin";


// Normal admin / limited admin
const isNormalAdmin =
    !isSuperAdmin;


// =====================================================
// ELEMENTS
// =====================================================

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


const adminUsername =
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
// SETTINGS
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// DATA
// =====================================================

let studentsData = [];


// =====================================================
// DISPLAY ADMIN USER
// =====================================================

if (
    adminUsername
) {

    adminUsername.textContent =
        sessionStorage.getItem(
            "adminUsername"
        ) || "Admin";

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
// STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    // -------------------------------
    // Explicit studentType
    // -------------------------------

    if (
        String(
            data?.studentType || ""
        ).toLowerCase()
        ===
        "grade10"
    ) {

        return "grade10";

    }


    if (
        String(
            data?.studentType || ""
        ).toLowerCase()
        ===
        "grade11"
    ) {

        return "grade11";

    }


    if (
        String(
            data?.studentType || ""
        ).toLowerCase()
        ===
        "al"
    ) {

        return "al";

    }


    // -------------------------------
    // Grade field
    // -------------------------------

    const grade =
        String(
            data?.grade || ""
        )
        .trim()
        .toLowerCase();


    if (
        grade === "10" ||
        grade === "grade 10" ||
        grade === "grade10"
    ) {

        return "grade10";

    }


    if (
        grade === "11" ||
        grade === "grade 11" ||
        grade === "grade11"
    ) {

        return "grade11";

    }


    // -------------------------------
    // Default
    // -------------------------------

    return "al";

}


// =====================================================
// ACTIVE STUDENT
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


    /*
     * Supports paper01
     * through paper50.
     */

    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const number =
            String(i)
            .padStart(
                2,
                "0"
            );


        const field =
            "paper" +
            number +
            "Viewed";


        if (
            data[field] === true
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

    if (
        element
    ) {

        element.textContent =
            value;

    }

}


// =====================================================
// SET BAR
// =====================================================

function setBar(
    element,
    value,
    maximum
) {

    if (
        !element
    ) {

        return;

    }


    if (
        maximum <= 0
    ) {

        element.style.width =
            "0%";

        return;

    }


    let percentage =
        (
            value /
            maximum
        ) * 100;


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    element.style.width =
        percentage + "%";

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadDashboardData() {

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


        studentsData = [];


        snapshot.forEach(
            docSnap => {

                const data =
                    docSnap.data();


                const type =
                    getStudentType(
                        data
                    );


                const active =
                    isActive(
                        data
                    );


                const views =
                    getPaperViews(
                        data
                    );


                studentsData.push({

                    id:
                        docSnap.id,

                    data:
                        data,

                    type:
                        type,

                    active:
                        active,

                    views:
                        views

                });

            }
        );


        updateDashboard();


        console.log(
            "Dashboard loaded:",
            studentsData.length
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
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const total =
        studentsData.length;


    const grade10 =
        studentsData.filter(
            student =>
                student.type ===
                "grade10"
        ).length;


    const grade11 =
        studentsData.filter(
            student =>
                student.type ===
                "grade11"
        ).length;


    const al =
        studentsData.filter(
            student =>
                student.type ===
                "al"
        ).length;


    const active =
        studentsData.filter(
            student =>
                student.active
        ).length;


    const paperViews =
        studentsData.reduce(
            (
                total,
                student
            ) =>
                total +
                student.views,
            0
        );


    // =================================================
    // SUMMARY CARDS
    // =================================================

    setText(
        totalStudents,
        total
    );


    setText(
        totalViewed,
        paperViews
    );


    setText(
        activeStudents,
        active
    );


    // =================================================
    // CHART VALUES
    // =================================================

    setText(
        chartTotalStudentsValue,
        total
    );


    setText(
        chartPaperViewsValue,
        paperViews
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
        active
    );


    // =================================================
    // CHART BARS
    // =================================================

    const maximum =
        Math.max(
            total,
            paperViews,
            grade10,
            grade11,
            al,
            active,
            1
        );


    setBar(
        chartTotalStudents,
        total,
        maximum
    );


    setBar(
        chartPaperViews,
        paperViews,
        maximum
    );


    setBar(
        chartGrade10,
        grade10,
        maximum
    );


    setBar(
        chartGrade11,
        grade11,
        maximum
    );


    setBar(
        chartAL,
        al,
        maximum
    );


    setBar(
        chartActive,
        active,
        maximum
    );

}


// =====================================================
// ACCESS DENIED POPUP
// =====================================================

function showAccessDenied(
    pageName
) {

    const oldMessage =
        document.getElementById(
            "accessDeniedMessage"
        );


    if (
        oldMessage
    ) {

        oldMessage.remove();

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "accessDeniedMessage";


    overlay.innerHTML = `

        <div class="access-denied-box">

            <div class="access-denied-icon">
                🔒
            </div>

            <div class="access-denied-content">

                <strong>
                    Access Restricted
                </strong>

                <p>
                    You don't have permission
                    to access
                    <b>${escapeHTML(
                        pageName
                    )}</b>.
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


    document.body.appendChild(
        overlay
    );


    const closeButton =
        overlay.querySelector(
            ".access-denied-close"
        );


    if (
        closeButton
    ) {

        closeButton.addEventListener(
            "click",
            () => {

                overlay.remove();

            }
        );

    }


    setTimeout(
        () => {

            if (
                overlay &&
                document.body.contains(
                    overlay
                )
            ) {

                overlay.remove();

            }

        },
        3500
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// =====================================================
// PROTECTED PAGE DETECTION
// =====================================================

function getProtectedPageName(
    link
) {

    const href =
        String(
            link.getAttribute(
                "href"
            ) || ""
        )
        .toLowerCase();


    const text =
        String(
            link.textContent || ""
        )
        .toLowerCase();


    if (
        href.includes(
            "paper-management"
        ) ||
        href.includes(
            "paper-settings"
        ) ||
        text.includes(
            "paper management"
        ) ||
        text.includes(
            "papers"
        )
    ) {

        return "Paper Management";

    }


    if (
        href.includes(
            "import-students"
        ) ||
        text.includes(
            "import students"
        )
    ) {

        return "Import Students";

    }


    if (
        href.includes(
            "reports"
        ) ||
        text.includes(
            "reports"
        )
    ) {

        return "Reports";

    }


    if (
        href.includes(
            "statistics"
        ) ||
        text.includes(
            "statistics"
        )
    ) {

        return "Statistics";

    }


    if (
        href.includes(
            "settings"
        ) ||
        text.includes(
            "settings"
        )
    ) {

        return "Settings";

    }


    return null;

}


// =====================================================
// ROLE BASED NAVIGATION
// =====================================================

function setupRoleProtection() {

    const links =
        document.querySelectorAll(
            "a"
        );


    links.forEach(
        link => {

            const pageName =
                getProtectedPageName(
                    link
                );


            if (
                !pageName
            ) {

                return;

            }


            // -----------------------------------------
            // SUPER ADMIN
            // -----------------------------------------

            if (
                isSuperAdmin
            ) {

                link.classList.remove(
                    "locked-menu"
                );


                link.removeAttribute(
                    "aria-disabled"
                );


                return;

            }


            // -----------------------------------------
            // NORMAL ADMIN
            // -----------------------------------------

            link.classList.add(
                "locked-menu"
            );


            link.setAttribute(
                "aria-disabled",
                "true"
            );


            link.setAttribute(
                "title",
                "Access restricted"
            );


            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    showAccessDenied(
                        pageName
                    );

                }
            );

        }
    );


    // =================================================
    // ALSO PROTECT ELEMENTS WITH
    // .superadmin-only
    // =================================================

    const protectedElements =
        document.querySelectorAll(
            ".superadmin-only"
        );


    protectedElements.forEach(
        element => {

            if (
                isSuperAdmin
            ) {

                element.classList.remove(
                    "locked-menu"
                );

                return;

            }


            element.classList.add(
                "locked-menu"
            );


            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const name =
                        element.textContent
                            .trim()
                            .replace(
                                /\s+/g,
                                " "
                            );


                    showAccessDenied(
                        name || "this section"
                    );

                }
            );

        }
    );

}


// =====================================================
// PROTECT DIRECT DASHBOARD LINKS
// =====================================================
//
// This catches management cards too.
// Example:
// <a href="reports.html">
// <a href="import-students.html">
// <a href="paper-management.html">
//
// =====================================================

function protectAllDashboardLinks() {

    if (
        isSuperAdmin
    ) {

        return;

    }


    const links =
        document.querySelectorAll(
            'a[href]'
        );


    links.forEach(
        link => {

            const pageName =
                getProtectedPageName(
                    link
                );


            if (
                !pageName
            ) {

                return;

            }


            link.classList.add(
                "locked-menu"
            );


            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    showAccessDenied(
                        pageName
                    );

                }
            );

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

            const confirmLogout =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (
                !confirmLogout
            ) {

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
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRoleProtection();

        protectAllDashboardLinks();

        loadDashboardData();

    }
);


// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(
    () => {

        loadDashboardData();

    },
    30000
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "===================================="
);

console.log(
    "ADMIN DASHBOARD"
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
    "===================================="
);
