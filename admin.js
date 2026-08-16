import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// ADMIN ACCESS PROTECTION
// =====================================================

if (
    sessionStorage.getItem(
        "adminLoggedIn"
    ) !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ROLE
// =====================================================

function normalizeRole(
    role
) {

    return String(
        role || ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /[\s_-]+/g,
        ""
    );

}


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) ||
    "Admin";


const adminRole =
    normalizeRole(
        sessionStorage.getItem(
            "adminRole"
        )
    );


const isSuperAdmin =
    adminRole ===
    "superadmin";


console.log(
    "================================="
);

console.log(
    "ADMIN DASHBOARD"
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
    "Superadmin:",
    isSuperAdmin
);

console.log(
    "================================="
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
// DASHBOARD ELEMENTS
// =====================================================

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
// SETTINGS
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

        setupAdminUI();

        setupPermissions();

        setupLogout();

        loadDashboard();

    }
);


// =====================================================
// ADMIN UI
// =====================================================

function setupAdminUI() {

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


// =====================================================
// PERMISSION SYSTEM
// =====================================================

function setupPermissions() {

    const protectedItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    protectedItems.forEach(
        item => {

            // ---------------------------------------------
            // SUPERADMIN
            // ---------------------------------------------

            if (
                isSuperAdmin
            ) {

                item.classList.remove(
                    "locked"
                );

                item.removeAttribute(
                    "aria-disabled"
                );

                item.style.pointerEvents =
                    "";

                item.style.opacity =
                    "";

                // Remove JS-created locks
                item
                    .querySelectorAll(
                        ".js-lock-icon"
                    )
                    .forEach(
                        lock => lock.remove()
                    );

                return;

            }


            // ---------------------------------------------
            // NORMAL ADMIN
            // ---------------------------------------------

            item.classList.add(
                "locked"
            );

            item.setAttribute(
                "aria-disabled",
                "true"
            );


            // ---------------------------------------------
            // DON'T FOLLOW LINK
            // ---------------------------------------------

            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAccessDenied();

                }
            );


            // ---------------------------------------------
            // ADD LOCK ONLY ONCE
            // ---------------------------------------------

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
                    " 🔒";


                lock.style.marginLeft =
                    "auto";


                lock.style.fontSize =
                    "13px";


                item.appendChild(
                    lock
                );

            }

        }
    );


    // =================================================
    // MANAGEMENT CARDS
    // =================================================

    const managementCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    managementCards.forEach(
        card => {

            if (
                isSuperAdmin
            ) {

                card.classList.remove(
                    "locked"
                );

                card
                    .querySelectorAll(
                        ".js-lock-icon"
                    )
                    .forEach(
                        lock => lock.remove()
                    );

                return;

            }


            card.classList.add(
                "locked"
            );


            const link =
                card.querySelector(
                    "a"
                );


            if (
                link
            ) {

                link.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();

                        showAccessDenied();

                    }
                );

            }

        }
    );

}


// =====================================================
// ACCESS DENIED MESSAGE
// =====================================================

function showAccessDenied() {

    // Remove old message
    const old =
        document.getElementById(
            "accessDeniedMessage"
        );


    if (
        old
    ) {

        old.remove();

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
                    This section is available only
                    to Super Administrators.
                </p>

            </div>

            <button
                type="button"
                id="closeAccessDenied"
            >
                ✕
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


    setTimeout(
        () => {

            if (
                message
            ) {

                message.classList.add(
                    "show"
                );

            }

        },
        10
    );


    setTimeout(
        () => {

            if (
                message &&
                message.parentNode
            ) {

                message.remove();

            }

        },
        4000
    );

}


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    if (
        !logoutBtn
    ) {

        return;

    }


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
// STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    // ---------------------------------------------
    // studentType
    // ---------------------------------------------

    const studentType =
        String(
            data?.studentType ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        studentType ===
        "grade10"
    ) {

        return "grade10";

    }


    if (
        studentType ===
        "grade11"
    ) {

        return "grade11";

    }


    if (
        studentType ===
        "al" ||
        studentType ===
        "a/l" ||
        studentType ===
        "advancedlevel"
    ) {

        return "al";

    }


    // ---------------------------------------------
    // grade fallback
    // ---------------------------------------------

    const grade =
        String(
            data?.grade ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        grade === "10"
    ) {

        return "grade10";

    }


    if (
        grade === "11"
    ) {

        return "grade11";

    }


    // ---------------------------------------------
    // DEFAULT
    // ---------------------------------------------

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
// PAPER VIEW COUNT
// =====================================================

function getPaperViews(
    data
) {

    let total =
        0;


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

            total++;

        }

    }


    return total;

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        console.log(
            "📊 Loading dashboard..."
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


        renderDashboard();


        console.log(
            "✅ Dashboard loaded:",
            studentsData.length,
            "students"
        );

    }

    catch (
        error
    ) {

        console.error(
            "❌ Dashboard error:",
            error
        );

    }

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
    // SUMMARY CARDS
    // =================================================

    setText(
        totalStudentsElement,
        total
    );


    setText(
        totalViewedElement,
        totalViews
    );


    setText(
        activeStudentsElement,
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
        totalViews
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

    const maxStudents =
        Math.max(
            total,
            1
        );


    const maxViews =
        Math.max(
            totalViews,
            1
        );


    const maxGrade =
        Math.max(
            grade10,
            grade11,
            al,
            1
        );


    const maxActive =
        Math.max(
            total,
            1
        );


    setWidth(
        chartTotalStudents,
        (
            total /
            maxStudents
        ) * 100
    );


    setWidth(
        chartPaperViews,
        (
            totalViews /
            maxViews
        ) * 100
    );


    setWidth(
        chartGrade10,
        (
            grade10 /
            maxGrade
        ) * 100
    );


    setWidth(
        chartGrade11,
        (
            grade11 /
            maxGrade
        ) * 100
    );


    setWidth(
        chartAL,
        (
            al /
            maxGrade
        ) * 100
    );


    setWidth(
        chartActive,
        (
            active /
            maxActive
        ) * 100
    );

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
// SET WIDTH
// =====================================================

function setWidth(
    element,
    value
) {

    if (
        !element
    ) {

        return;

    }


    const safeValue =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    value
                ) || 0
            )
        );


    element.style.width =
        safeValue +
        "%";

}


// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(
    () => {

        loadDashboard();

    },
    30000
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Admin Dashboard JS loaded"
);
