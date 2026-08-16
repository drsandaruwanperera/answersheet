// =====================================================
// ADMIN DASHBOARD JS
// =====================================================

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// START
// =====================================================

console.log("=================================");
console.log("ADMIN DASHBOARD JS STARTED");
console.log("=================================");


// =====================================================
// SESSION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    );


if (
    adminLoggedIn !== "true"
) {

    console.warn(
        "Admin is not logged in."
    );

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// GET ROLE
// =====================================================

const adminRole =
    String(
        sessionStorage.getItem(
            "adminRole"
        ) ||
        sessionStorage.getItem(
            "role"
        ) ||
        "admin"
    )
    .trim()
    .toLowerCase();


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) ||
    "Admin";


// =====================================================
// SUPER ADMIN CHECK
// =====================================================

const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "super_admin" ||
    adminRole === "super admin";


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
// ACTIVE LIMIT
// =====================================================
//
// Student is considered online if the last activity
// was within the last 90 seconds.
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// DATA
// =====================================================

let studentsData = [];


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAdmin();

    }
);


// =====================================================
// INITIALIZE
// =====================================================

function initializeAdmin() {

    console.log(
        "Initializing Admin Dashboard..."
    );


    setupAdminInfo();

    setupRoleProtection();

    setupNavigation();

    setupLogout();

    setupRefresh();

    loadDashboardData();

}


// =====================================================
// ADMIN INFO
// =====================================================

function setupAdminInfo() {

    const usernameElements =
        document.querySelectorAll(
            "#adminUsername"
        );


    usernameElements.forEach(
        element => {

            element.textContent =
                adminUsername;

        }
    );


    const roleText =
        isSuperAdmin
            ? "Super Administrator"
            : "Administrator";


    const roleElements =
        document.querySelectorAll(
            "#adminRole"
        );


    roleElements.forEach(
        element => {

            element.textContent =
                roleText;

        }
    );


    // Optional page role labels

    const roleLabels =
        document.querySelectorAll(
            ".admin-role"
        );


    roleLabels.forEach(
        element => {

            element.textContent =
                roleText;

        }
    );

}


// =====================================================
// ROLE PROTECTION
// =====================================================

function setupRoleProtection() {

    console.log(
        "Setting role protection..."
    );


    // =================================================
    // ITEMS THAT REQUIRE SUPERADMIN
    // =================================================

    const protectedItems =
        document.querySelectorAll(
            ".superadmin-only, " +
            ".full-admin-only, " +
            "[data-superadmin-only]"
        );


    console.log(
        "Protected menu items:",
        protectedItems.length
    );


    // =================================================
    // SUPERADMIN
    // =================================================

    if (
        isSuperAdmin
    ) {

        console.log(
            "SUPERADMIN ACCESS ENABLED"
        );


        protectedItems.forEach(
            item => {

                // Remove all lock classes
                item.classList.remove(
                    "locked-menu"
                );

                item.classList.remove(
                    "locked"
                );

                item.classList.remove(
                    "disabled-menu"
                );


                // Remove lock indicators
                item
                    .querySelectorAll(
                        ".lock-icon, " +
                        ".menu-lock, " +
                        ".access-lock"
                    )
                    .forEach(
                        lock => {

                            lock.remove();

                        }
                    );


                // Remove aria disabled
                item.removeAttribute(
                    "aria-disabled"
                );


                // Remove title
                item.removeAttribute(
                    "title"
                );


                // Restore normal appearance
                item.style.pointerEvents =
                    "";

                item.style.cursor =
                    "";

                item.style.opacity =
                    "";

                item.style.filter =
                    "";


                // =================================================
                // If it is an anchor, restore normal navigation
                // =================================================

                if (
                    item.tagName === "A"
                ) {

                    item.style.pointerEvents =
                        "";

                }

            }
        );


        return;

    }


    // =================================================
    // NORMAL ADMIN
    // =================================================

    console.log(
        "NORMAL ADMIN ACCESS MODE"
    );


    protectedItems.forEach(
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
                "Super Administrator access required"
            );


            item.style.cursor =
                "not-allowed";


            // =================================================
            // Add lock icon if not already there
            // =================================================

            const existingLock =
                item.querySelector(
                    ".lock-icon"
                );


            if (
                !existingLock
            ) {

                const lock =
                    document.createElement(
                        "span"
                    );


                lock.className =
                    "lock-icon";


                lock.textContent =
                    " 🔒";


                lock.style.marginLeft =
                    "auto";


                lock.style.fontSize =
                    "12px";


                item.appendChild(
                    lock
                );

            }


            // =================================================
            // Capture click
            // =================================================

            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAccessDenied();

                },
                true
            );

        }
    );

}


// =====================================================
// ACCESS DENIED MESSAGE
// =====================================================

function showAccessDenied() {

    // Remove existing message
    const oldMessage =
        document.getElementById(
            "accessDeniedMessage"
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
        "accessDeniedMessage";


    message.innerHTML = `

        <div class="access-denied-box">

            <div class="access-denied-icon">
                🔒
            </div>

            <div>

                <strong>
                    Access Restricted
                </strong>

                <p>
                    This section is available
                    only to Super Administrators.
                </p>

            </div>

            <button
                type="button"
                id="closeAccessDenied"
            >
                OK
            </button>

        </div>

    `;


    document.body.appendChild(
        message
    );


    const closeBtn =
        document.getElementById(
            "closeAccessDenied"
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


    // Auto close
    setTimeout(
        () => {

            if (
                message
            ) {

                message.remove();

            }

        },
        4000
    );

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    const navigationItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navigationItems.forEach(
        item => {

            item.addEventListener(
                "click",
                event => {

                    const href =
                        item.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {

                        return;

                    }


                    // =================================================
                    // Protected page check
                    // =================================================

                    const isProtected =
                        item.classList.contains(
                            "superadmin-only"
                        ) ||
                        item.classList.contains(
                            "full-admin-only"
                        ) ||
                        item.hasAttribute(
                            "data-superadmin-only"
                        );


                    if (
                        isProtected &&
                        !isSuperAdmin
                    ) {

                        event.preventDefault();

                        event.stopPropagation();

                        showAccessDenied();

                    }

                }
            );

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, .logout-btn"
        );


    logoutButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    console.log(
                        "Logging out..."
                    );


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
    );

}


// =====================================================
// REFRESH
// =====================================================

function setupRefresh() {

    const refreshButtons =
        document.querySelectorAll(
            "#refreshBtn, .refresh-btn"
        );


    refreshButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    await loadDashboardData();

                }
            );

        }
    );

}


// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboardData() {

    console.log(
        "Loading dashboard data..."
    );


    try {

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


                studentsData.push({

                    id:
                        docSnap.id,

                    data:
                        data,

                    type:
                        getStudentType(
                            data
                        ),

                    active:
                        isStudentActive(
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
            studentsData.length
        );


        renderDashboard();


        updateSystemStatus(
            true
        );


    }
    catch (
        error
    ) {

        console.error(
            "Dashboard data error:",
            error
        );


        updateSystemStatus(
            false
        );

    }

}


// =====================================================
// GET STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    // =================================================
    // Explicit studentType
    // =================================================

    const studentType =
        String(
            data?.studentType ||
            ""
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


    if (
        studentType === "al" ||
        studentType === "a/l" ||
        studentType === "advanced" ||
        studentType === "advanced level"
    ) {

        return "al";

    }


    // =================================================
    // Grade field
    // =================================================

    const grade =
        String(
            data?.grade ||
            ""
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


    // =================================================
    // Everything else = A/L
    // =================================================

    return "al";

}


// =====================================================
// ACTIVE CHECK
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


    return (
        Date.now() -
        lastActive
        <=
        ACTIVE_LIMIT
    );

}


// =====================================================
// PAPER VIEWS
// =====================================================

function getPaperViews(
    data
) {

    let total =
        0;


    // =================================================
    // Standard paper fields
    // paper01Viewed
    // paper02Viewed
    // ...
    // =================================================

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


    // =================================================
    // Also support totalPaperViews if you use it
    // =================================================

    if (
        total === 0 &&
        Number(
            data?.totalPaperViews
        ) > 0
    ) {

        total =
            Number(
                data.totalPaperViews
            );

    }


    return total;

}


// =====================================================
// RENDER DASHBOARD
// =====================================================

function renderDashboard() {

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


    const totalViews =
        studentsData.reduce(
            (
                sum,
                student
            ) =>
                sum +
                student.views,
            0
        );


    // =================================================
    // SUMMARY
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
        active
    );


    // =================================================
    // DASHBOARD CHART VALUES
    // =================================================

    setText(
        "chartTotalStudentsValue",
        total
    );


    setText(
        "chartPaperViewsValue",
        totalViews
    );


    setText(
        "chartGrade10Value",
        grade10
    );


    setText(
        "chartGrade11Value",
        grade11
    );


    setText(
        "chartALValue",
        al
    );


    setText(
        "chartActiveValue",
        active
    );


    // =================================================
    // CHART BARS
    // =================================================

    updateBar(
        "chartTotalStudents",
        total,
        total
    );


    updateBar(
        "chartPaperViews",
        totalViews,
        Math.max(
            totalViews,
            1
        )
    );


    updateBar(
        "chartGrade10",
        grade10,
        total
    );


    updateBar(
        "chartGrade11",
        grade11,
        total
    );


    updateBar(
        "chartAL",
        al,
        total
    );


    updateBar(
        "chartActive",
        active,
        total
    );


    // =================================================
    // LIVE REPORT CARDS
    // =================================================

    renderLiveReports(
        total,
        grade10,
        grade11,
        al,
        active,
        totalViews
    );


    // =================================================
    // Last updated
    // =================================================

    setText(
        "lastUpdated",
        "Last updated: " +
        new Date().toLocaleTimeString()
    );

}


// =====================================================
// LIVE REPORT CARDS
// =====================================================

function renderLiveReports(
    total,
    grade10,
    grade11,
    al,
    active,
    totalViews
) {

    const reports =
        document.querySelectorAll(
            ".student-report-card, " +
            ".live-report-card, " +
            "[data-report-type]"
        );


    reports.forEach(
        card => {

            const type =
                card.getAttribute(
                    "data-report-type"
                );


            let count =
                0;


            if (
                type === "all"
            ) {

                count =
                    total;

            }
            else if (
                type === "grade10"
            ) {

                count =
                    grade10;

            }
            else if (
                type === "grade11"
            ) {

                count =
                    grade11;

            }
            else if (
                type === "al"
            ) {

                count =
                    al;

            }


            const totalElement =
                card.querySelector(
                    "[data-total]"
                );


            if (
                totalElement
            ) {

                totalElement.textContent =
                    count;

            }


            const onlineElement =
                card.querySelector(
                    "[data-online]"
                );


            if (
                onlineElement
            ) {

                if (
                    type === "all"
                ) {

                    onlineElement.textContent =
                        active;

                }
                else {

                    const typeActive =
                        studentsData.filter(
                            student =>
                                student.type ===
                                    type &&
                                student.active
                        ).length;


                    onlineElement.textContent =
                        typeActive;

                }

            }


            const offlineElement =
                card.querySelector(
                    "[data-offline]"
                );


            if (
                offlineElement
            ) {

                const online =
                    type === "all"
                        ? active
                        : studentsData.filter(
                            student =>
                                student.type ===
                                    type &&
                                student.active
                        ).length;


                offlineElement.textContent =
                    count -
                    online;

            }


            const viewsElement =
                card.querySelector(
                    "[data-views]"
                );


            if (
                viewsElement
            ) {

                const views =
                    type === "all"
                        ? totalViews
                        : studentsData
                            .filter(
                                student =>
                                    student.type ===
                                    type
                            )
                            .reduce(
                                (
                                    sum,
                                    student
                                ) =>
                                    sum +
                                    student.views,
                                0
                            );


                viewsElement.textContent =
                    views;

            }

        }
    );

}


// =====================================================
// SET TEXT BY ID
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
// UPDATE BAR
// =====================================================

function updateBar(
    id,
    value,
    max
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element
    ) {

        return;

    }


    let percentage =
        0;


    if (
        max > 0
    ) {

        percentage =
            (
                value /
                max
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


    element.style.width =
        percentage +
        "%";

}


// =====================================================
// SYSTEM STATUS
// =====================================================

function updateSystemStatus(
    online
) {

    const statusElements =
        document.querySelectorAll(
            "#onlineStatus, " +
            ".system-status"
        );


    statusElements.forEach(
        element => {

            if (
                element.classList.contains(
                    "system-status"
                )
            ) {

                element.innerHTML = online
                    ? `
                        <span class="status-dot"></span>
                        System Online
                    `
                    : `
                        <span class="status-dot offline"></span>
                        System Offline
                    `;

            }

        }
    );

}


// =====================================================
// AUTO REFRESH
// =====================================================
//
// Refresh every 30 seconds.
// =====================================================

setInterval(
    () => {

        if (
            sessionStorage.getItem(
                "adminLoggedIn"
            ) === "true"
        ) {

            loadDashboardData();

        }

    },
    30000
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "================================="
);

console.log(
    "ADMIN ROLE:",
    adminRole
);

console.log(
    "SUPERADMIN:",
    isSuperAdmin
);

console.log(
    "================================="
);
