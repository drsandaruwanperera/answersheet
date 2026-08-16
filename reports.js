// =====================================================
// REPORTS.JS
// Student Assessment Portal
// =====================================================

import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =====================================================
// 1. ADMIN LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// 2. ELEMENTS
// =====================================================

const totalStudents =
    document.getElementById(
        "totalStudents"
    );

const grade10Count =
    document.getElementById(
        "grade10Count"
    );

const grade11Count =
    document.getElementById(
        "grade11Count"
    );

const alCount =
    document.getElementById(
        "alCount"
    );

const activeCount =
    document.getElementById(
        "activeCount"
    );

const paperViews =
    document.getElementById(
        "paperViews"
    );

const distribution10 =
    document.getElementById(
        "distribution10"
    );

const distribution11 =
    document.getElementById(
        "distribution11"
    );

const distributionAL =
    document.getElementById(
        "distributionAL"
    );

const activityActive =
    document.getElementById(
        "activityActive"
    );

const activityInactive =
    document.getElementById(
        "activityInactive"
    );

const paperUsage =
    document.getElementById(
        "paperUsage"
    );

const studentTableBody =
    document.getElementById(
        "studentTableBody"
    );

const gradeFilter =
    document.getElementById(
        "gradeFilter"
    );

const activityFilter =
    document.getElementById(
        "activityFilter"
    );

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );

const exportBtn =
    document.getElementById(
        "exportBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const lastUpdated =
    document.getElementById(
        "lastUpdated"
    );


// =====================================================
// 3. SETTINGS
// =====================================================

// Student considered active if last activity
// happened within 90 seconds.

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// 4. DATA
// =====================================================

let studentsData = [];


// =====================================================
// 5. STUDENT TYPE
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


    // -----------------------------------------------
    // Grade 10
    // -----------------------------------------------

    if (
        studentType === "grade10" ||
        studentType === "grade 10" ||
        studentType === "10" ||
        grade === "10" ||
        grade === "grade10" ||
        grade === "grade 10"
    ) {

        return "grade10";

    }


    // -----------------------------------------------
    // Grade 11
    // -----------------------------------------------

    if (
        studentType === "grade11" ||
        studentType === "grade 11" ||
        studentType === "11" ||
        grade === "11" ||
        grade === "grade11" ||
        grade === "grade 11"
    ) {

        return "grade11";

    }


    // -----------------------------------------------
    // A/L
    // -----------------------------------------------

    if (
        studentType === "al" ||
        studentType === "a/l" ||
        studentType === "a-l" ||
        studentType === "advanced" ||
        studentType === "advanced level" ||
        grade === "al" ||
        grade === "a/l" ||
        grade === "advanced"
    ) {

        return "al";

    }


    // -----------------------------------------------
    // Default
    // -----------------------------------------------

    return "al";

}


// =====================================================
// 6. STUDENT TYPE LABEL
// =====================================================

function getStudentTypeLabel(type) {

    if (
        type === "grade10"
    ) {

        return "Grade 10";

    }


    if (
        type === "grade11"
    ) {

        return "Grade 11";

    }


    return "A/L";

}


// =====================================================
// 7. ACTIVE CHECK
// =====================================================

function isActive(data) {

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
        <= ACTIVE_LIMIT
    );

}


// =====================================================
// 8. PAPER VIEW COUNT
// =====================================================
//
// Existing system uses:
//
// paper01Viewed
// paper02Viewed
// ...
// paper50Viewed
//
// This function counts those fields.
//

function getPaperViews(data) {

    let total = 0;


    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const number =
            String(i).padStart(
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


    return total;

}


// =====================================================
// 9. GET VIEWED PAPERS
// =====================================================

function getViewedPapers(data) {

    const papers = [];


    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const number =
            String(i).padStart(
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

            papers.push(
                number
            );

        }

    }


    return papers;

}


// =====================================================
// 10. GET PAPER LABEL
// =====================================================
//
// IMPORTANT:
//
// At the moment your Firebase viewed fields are:
//
// paper01Viewed
// paper02Viewed
// ...
//
// The exact paper category is not stored inside
// those field names.
//
// Therefore this function safely labels the existing
// tracked papers without inventing Firebase data.
//
// Later, if you create separate fields for
// Past Papers / Province Papers, they can be added here.
//

function getPaperLabel(
    studentType,
    paperNumber
) {

    const number =
        String(
            paperNumber
        ).padStart(
            2,
            "0"
        );


    if (
        studentType === "grade10"
    ) {

        return (
            "Model Paper " +
            number
        );

    }


    if (
        studentType === "grade11"
    ) {

        return (
            "Model Paper " +
            number
        );

    }


    if (
        studentType === "al"
    ) {

        return (
            "Model Paper " +
            number
        );

    }


    return (
        "Paper " +
        number
    );

}


// =====================================================
// 11. LOAD DATA
// =====================================================

async function loadData() {

    // -----------------------------------------------
    // Show loading state
    // -----------------------------------------------

    if (
        paperUsage
    ) {

        paperUsage.innerHTML = `

            <div class="empty-state">

                Loading paper usage...

            </div>

        `;

    }


    if (
        studentTableBody
    ) {

        studentTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-cell"
                >

                    Loading student data...

                </td>

            </tr>

        `;

    }


    try {

        // -------------------------------------------
        // Firebase
        // -------------------------------------------

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        studentsData = [];


        // -------------------------------------------
        // Read every student
        // -------------------------------------------

        snapshot.forEach(
            studentDoc => {

                const data =
                    studentDoc.data();


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
                        studentDoc.id,

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


        console.log(
            "================================="
        );

        console.log(
            "REPORT DATA LOADED"
        );

        console.log(
            "Students:",
            studentsData.length
        );

        console.log(
            "================================="
        );


        // -------------------------------------------
        // Render
        // -------------------------------------------

        renderReports();


        updateTime();

    }

    catch (
        error
    ) {

        console.error(
            "❌ Reports loading error:",
            error
        );


        // -------------------------------------------
        // Paper usage error
        // -------------------------------------------

        if (
            paperUsage
        ) {

            paperUsage.innerHTML = `

                <div class="empty-state">

                    Unable to load paper usage.

                    <br>

                    <small>
                        Check browser console for details.
                    </small>

                </div>

            `;

        }


        // -------------------------------------------
        // Student table error
        // -------------------------------------------

        if (
            studentTableBody
        ) {

            studentTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="loading-cell"
                    >

                        Unable to load reports.

                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// 12. GET FILTERED STUDENTS
// =====================================================

function getFilteredStudents() {

    const grade =
        gradeFilter?.value ||
        "all";


    const activity =
        activityFilter?.value ||
        "all";


    return studentsData.filter(
        student => {

            // -----------------------------------------
            // Grade filter
            // -----------------------------------------

            if (
                grade !== "all" &&
                student.type !== grade
            ) {

                return false;

            }


            // -----------------------------------------
            // Active filter
            // -----------------------------------------

            if (
                activity === "active" &&
                !student.active
            ) {

                return false;

            }


            // -----------------------------------------
            // Inactive filter
            // -----------------------------------------

            if (
                activity === "inactive" &&
                student.active
            ) {

                return false;

            }


            return true;

        }
    );

}


// =====================================================
// 13. RENDER REPORTS
// =====================================================

function renderReports() {

    const filtered =
        getFilteredStudents();


    // =================================================
    // COUNTS
    // =================================================

    const total =
        filtered.length;


    const grade10 =
        filtered.filter(
            student =>
                student.type ===
                "grade10"
        ).length;


    const grade11 =
        filtered.filter(
            student =>
                student.type ===
                "grade11"
        ).length;


    const al =
        filtered.filter(
            student =>
                student.type ===
                "al"
        ).length;


    const active =
        filtered.filter(
            student =>
                student.active
        ).length;


    const inactive =
        total -
        active;


    const views =
        filtered.reduce(
            (
                totalViews,
                student
            ) => {

                return (
                    totalViews +
                    student.views
                );

            },
            0
        );


    // =================================================
    // OVERVIEW CARDS
    // =================================================

    setText(
        totalStudents,
        total
    );


    setText(
        grade10Count,
        grade10
    );


    setText(
        grade11Count,
        grade11
    );


    setText(
        alCount,
        al
    );


    setText(
        activeCount,
        active
    );


    setText(
        paperViews,
        views
    );


    // =================================================
    // DISTRIBUTION
    // =================================================

    setText(
        distribution10,
        grade10
    );


    setText(
        distribution11,
        grade11
    );


    setText(
        distributionAL,
        al
    );


    // =================================================
    // ACTIVITY
    // =================================================

    setText(
        activityActive,
        active
    );


    setText(
        activityInactive,
        inactive
    );


    // =================================================
    // PAPER USAGE
    // =================================================

    renderPaperUsage(
        filtered
    );


    // =================================================
    // STUDENT TABLE
    // =================================================

    renderStudents(
        filtered
    );

}


// =====================================================
// 14. SET TEXT
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
// 15. RENDER PAPER USAGE
// =====================================================
//
// Creates:
//
// Grade 10
//   Model Paper 01
//   Model Paper 02
//
// Grade 11
//   Model Paper 01
//
// A/L
//   Model Paper 01
//
// Only papers which have actual Viewed=true
// are shown.
//

function renderPaperUsage(
    students
) {

    if (
        !paperUsage
    ) {

        return;

    }


    // =================================================
    // CATEGORY DATA
    // =================================================

    const usage = {

        grade10: {},

        grade11: {},

        al: {}

    };


    // =================================================
    // LOOP STUDENTS
    // =================================================

    students.forEach(
        student => {

            const viewed =
                getViewedPapers(
                    student.data
                );


            viewed.forEach(
                paperNumber => {

                    const type =
                        student.type;


                    if (
                        !usage[type]
                    ) {

                        return;

                    }


                    if (
                        !usage[type][
                            paperNumber
                        ]
                    ) {

                        usage[type][
                            paperNumber
                        ] = 0;

                    }


                    usage[type][
                        paperNumber
                    ]++;

                }
            );

        }
    );


    // =================================================
    // CHECK ANY DATA
    // =================================================

    const totalUsage =
        Object.values(
            usage
        )
        .reduce(
            (
                total,
                group
            ) => {

                return (
                    total +
                    Object.values(
                        group
                    ).reduce(
                        (
                            sum,
                            value
                        ) =>
                            sum +
                            value,
                        0
                    )
                );

            },
            0
        );


    if (
        totalUsage === 0
    ) {

        paperUsage.innerHTML = `

            <div class="empty-state">

                No paper-view data available.

                <br>

                <small>
                    Papers will appear here after a tracked
                    paper is viewed by a student.
                </small>

            </div>

        `;

        return;

    }


    // =================================================
    // MAX VALUE
    // =================================================

    let max =
        1;


    Object.values(
        usage
    )
    .forEach(
        group => {

            Object.values(
                group
            )
            .forEach(
                value => {

                    if (
                        value > max
                    ) {

                        max =
                            value;

                    }

                }
            );

        }
    );


    // =================================================
    // BUILD HTML
    // =================================================

    let html = "";


    // =================================================
    // GRADE 10
    // =================================================

    html += createPaperUsageSection(
        "🎓",
        "Grade 10",
        "Model Papers",
        usage.grade10,
        "grade10",
        max
    );


    // =================================================
    // GRADE 11
    // =================================================

    html += createPaperUsageSection(
        "🎓",
        "Grade 11",
        "Model Papers",
        usage.grade11,
        "grade11",
        max
    );


    // =================================================
    // A/L
    // =================================================

    html += createPaperUsageSection(
        "🎓",
        "A/L",
        "Model Papers",
        usage.al,
        "al",
        max
    );


    paperUsage.innerHTML =
        html;

}


// =====================================================
// 16. CREATE PAPER USAGE SECTION
// =====================================================

function createPaperUsageSection(
    icon,
    title,
    subtitle,
    data,
    studentType,
    max
) {

    const entries =
        Object.entries(
            data
        )
        .sort(
            (
                a,
                b
            ) => {

                return (
                    Number(a[0]) -
                    Number(b[0])
                );

            }
        );


    // -----------------------------------------------
    // No data
    // -----------------------------------------------

    if (
        !entries.length
    ) {

        return `

            <div
                class="paper-usage-section"
                style="
                    margin-bottom:24px;
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        margin-bottom:12px;
                    "
                >

                    <div
                        style="
                            font-size:24px;
                        "
                    >
                        ${icon}
                    </div>

                    <div>

                        <strong
                            style="
                                display:block;
                                font-size:16px;
                            "
                        >
                            ${title}
                        </strong>

                        <span
                            style="
                                font-size:12px;
                                color:#6b7280;
                            "
                        >
                            ${subtitle}
                        </span>

                    </div>

                </div>


                <div
                    class="empty-state"
                    style="
                        padding:18px;
                        background:#f9fafb;
                        border-radius:12px;
                    "
                >

                    No recorded views.

                </div>

            </div>

        `;

    }


    // -----------------------------------------------
    // Build rows
    // -----------------------------------------------

    let rows = "";


    entries.forEach(
        (
            [paperNumber, value]
        ) => {

            const percentage =
                Math.max(
                    3,
                    (
                        value /
                        max
                    ) *
                    100
                );


            const label =
                getPaperLabel(
                    studentType,
                    paperNumber
                );


            rows += `

                <div
                    class="paper-row"
                >

                    <div
                        class="paper-name"
                    >

                        ${escapeHTML(
                            label
                        )}

                    </div>


                    <div
                        class="paper-track"
                    >

                        <div
                            class="paper-bar"
                            style="
                                width:${percentage}%;
                            "
                        ></div>

                    </div>


                    <div
                        class="paper-value"
                    >

                        ${value}

                    </div>

                </div>

            `;

        }
    );


    // -----------------------------------------------
    // Section
    // -----------------------------------------------

    return `

        <div
            class="paper-usage-section"
            style="
                margin-bottom:28px;
            "
        >


            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                    margin-bottom:16px;
                    padding-bottom:12px;
                    border-bottom:1px solid #e5e7eb;
                "
            >

                <div
                    style="
                        width:44px;
                        height:44px;
                        border-radius:12px;
                        background:#ede9fe;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:22px;
                    "
                >
                    ${icon}
                </div>


                <div>

                    <strong
                        style="
                            display:block;
                            font-size:17px;
                            color:#111827;
                        "
                    >
                        ${title}
                    </strong>


                    <span
                        style="
                            display:block;
                            font-size:12px;
                            color:#6b7280;
                            margin-top:3px;
                        "
                    >
                        ${subtitle}
                    </span>

                </div>

            </div>


            <div
                class="paper-usage-list"
            >

                ${rows}

            </div>

        </div>

    `;

}


// =====================================================
// 17. STUDENT TABLE
// =====================================================

function renderStudents(
    students
) {

    if (
        !studentTableBody
    ) {

        return;

    }


    // =================================================
    // EMPTY
    // =================================================

    if (
        !students.length
    ) {

        studentTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-cell"
                >

                    No students found.

                </td>

            </tr>

        `;

        return;

    }


    // =================================================
    // SORT
    // =================================================

    const sorted =
        [...students]
        .sort(
            (
                a,
                b
            ) => {

                // Active first

                if (
                    a.active !==
                    b.active
                ) {

                    return a.active
                        ? -1
                        : 1;

                }


                return String(
                    a.id
                )
                .localeCompare(
                    String(
                        b.id
                    )
                );

            }
        );


    // =================================================
    // TABLE
    // =================================================

    studentTableBody.innerHTML =
        sorted
        .map(
            student => {

                const lastActive =
                    Number(
                        student.data
                            ?.lastActiveAt ||
                        0
                    );


                const lastActiveText =
                    lastActive
                        ? new Date(
                            lastActive
                        )
                        .toLocaleString()
                        : "Never";


                const grade =
                    getStudentTypeLabel(
                        student.type
                    );


                return `

                    <tr>


                        <td>

                            <strong>

                                ${escapeHTML(
                                    student.id
                                )}

                            </strong>

                        </td>


                        <td>

                            ${grade}

                        </td>


                        <td>

                            <span
                                class="status ${
                                    student.active
                                        ? "active"
                                        : "inactive"
                                }"
                            >

                                ${
                                    student.active
                                        ? "🟢 Active"
                                        : "Offline"
                                }

                            </span>

                        </td>


                        <td>

                            ${student.views}

                        </td>


                        <td>

                            ${escapeHTML(
                                lastActiveText
                            )}

                        </td>


                    </tr>

                `;

            }
        )
        .join("");

}


// =====================================================
// 18. ESCAPE HTML
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
// 19. UPDATE TIME
// =====================================================

function updateTime() {

    if (
        !lastUpdated
    ) {

        return;

    }


    lastUpdated.textContent =
        "Last updated: " +
        new Date()
            .toLocaleTimeString();

}


// =====================================================
// 20. EXPORT CSV
// =====================================================

function exportCSV() {

    const filtered =
        getFilteredStudents();


    const rows = [

        [
            "Student ID",
            "Grade",
            "Status",
            "Paper Views",
            "Last Active"
        ]

    ];


    filtered.forEach(
        student => {

            const lastActive =
                Number(
                    student.data
                        ?.lastActiveAt ||
                    0
                );


            rows.push([

                student.id,

                getStudentTypeLabel(
                    student.type
                ),

                student.active
                    ? "Active"
                    : "Offline",

                student.views,

                lastActive
                    ? new Date(
                        lastActive
                    )
                    .toLocaleString()
                    : "Never"

            ]);

        }
    );


    // =================================================
    // CSV
    // =================================================

    const csv =
        rows
        .map(
            row => {

                return row
                    .map(
                        value => {

                            return (
                                '"' +
                                String(
                                    value
                                )
                                .replace(
                                    /"/g,
                                    '""'
                                ) +
                                '"'
                            );

                        }
                    )
                    .join(",");

            }
        )
        .join("\n");


    // =================================================
    // DOWNLOAD
    // =================================================

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "student-report-" +
        new Date()
            .toISOString()
            .slice(
                0,
                10
            ) +
        ".csv";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


// =====================================================
// 21. FILTER EVENTS
// =====================================================

if (
    gradeFilter
) {

    gradeFilter.addEventListener(
        "change",
        renderReports
    );

}


if (
    activityFilter
) {

    activityFilter.addEventListener(
        "change",
        renderReports
    );

}


// =====================================================
// 22. REFRESH
// =====================================================

if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        () => {

            loadData();

        }
    );

}


// =====================================================
// 23. EXPORT
// =====================================================

if (
    exportBtn
) {

    exportBtn.addEventListener(
        "click",
        exportCSV
    );

}


// =====================================================
// 24. LOGOUT
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
                "adminUsername"
            );


            sessionStorage.removeItem(
                "adminRole"
            );


            sessionStorage.removeItem(
                "username"
            );


            sessionStorage.removeItem(
                "role"
            );


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// 25. INITIAL LOAD
// =====================================================

loadData();


// =====================================================
// 26. AUTO REFRESH
// =====================================================

setInterval(
    () => {

        loadData();

    },
    30000
);


// =====================================================
// 27. READY
// =====================================================

console.log(
    "✅ reports.js loaded successfully"
);
