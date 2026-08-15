import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// ==========================
// Protect Admin
// ==========================

if (
    sessionStorage.getItem(
        "adminLoggedIn"
    ) !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// ==========================
// Elements
// ==========================

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


// ==========================
// Settings
// ==========================

const ACTIVE_LIMIT =
    90 * 1000;


// ==========================
// Data
// ==========================

let studentsData = [];


// ==========================
// Student Type
// ==========================

function getStudentType(data) {

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
        String(data?.grade) ===
        "10"
    ) {

        return "grade10";

    }


    if (
        String(data?.grade) ===
        "11"
    ) {

        return "grade11";

    }


    return "al";

}


// ==========================
// Active Check
// ==========================

function isActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );

    if (!lastActive) {
        return false;
    }

    return (
        Date.now() -
        lastActive
        <= ACTIVE_LIMIT
    );

}


// ==========================
// Paper Views
// ==========================

function getPaperViews(data) {

    let total = 0;

    for (
        let i = 1;
        i <= 50;
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
            data[field] === true
        ) {

            total++;

        }

    }

    return total;

}


// ==========================
// Load Data
// ==========================

async function loadData() {

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
                        getStudentType(data),

                    active:
                        isActive(data),

                    views:
                        getPaperViews(data)

                });

            }
        );


        renderReports();

        updateTime();

    }
    catch (error) {

        console.error(
            "Reports error:",
            error
        );


        if (studentTableBody) {

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


// ==========================
// Render Reports
// ==========================

function renderReports() {

    const grade =
        gradeFilter?.value ||
        "all";

    const activity =
        activityFilter?.value ||
        "all";


    let filtered =
        studentsData.filter(
            student => {

                if (
                    grade !== "all" &&
                    student.type !== grade
                ) {

                    return false;

                }


                if (
                    activity === "active" &&
                    !student.active
                ) {

                    return false;

                }


                if (
                    activity === "inactive" &&
                    student.active
                ) {

                    return false;

                }


                return true;

            }
        );


    // ==========================
    // Counts
    // ==========================

    const total =
        filtered.length;


    const g10 =
        filtered.filter(
            x => x.type === "grade10"
        ).length;


    const g11 =
        filtered.filter(
            x => x.type === "grade11"
        ).length;


    const al =
        filtered.filter(
            x => x.type === "al"
        ).length;


    const active =
        filtered.filter(
            x => x.active
        ).length;


    const inactive =
        total - active;


    const views =
        filtered.reduce(
            (
                sum,
                student
            ) =>
                sum +
                student.views,
            0
        );


    // ==========================
    // Cards
    // ==========================

    setText(
        totalStudents,
        total
    );

    setText(
        grade10Count,
        g10
    );

    setText(
        grade11Count,
        g11
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


    setText(
        distribution10,
        g10
    );

    setText(
        distribution11,
        g11
    );

    setText(
        distributionAL,
        al
    );


    setText(
        activityActive,
        active
    );

    setText(
        activityInactive,
        inactive
    );


    renderPaperUsage(
        filtered
    );


    renderStudents(
        filtered
    );

}


// ==========================
// Set Text
// ==========================

function setText(
    element,
    value
) {

    if (element) {

        element.textContent =
            value;

    }

}


// ==========================
// Paper Usage
// ==========================

function renderPaperUsage(
    students
) {

    const counts = {};


    students.forEach(
        student => {

            for (
                let i = 1;
                i <= 50;
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
                    student.data[field] ===
                    true
                ) {

                    const name =
                        "Paper " +
                        String(i).padStart(
                            2,
                            "0"
                        );


                    counts[name] =
                        (
                            counts[name] ||
                            0
                        ) + 1;

                }

            }

        }
    );


    const entries =
        Object.entries(
            counts
        )
        .sort(
            (
                a,
                b
            ) =>
                b[1] -
                a[1]
        );


    if (
        !entries.length
    ) {

        paperUsage.innerHTML = `

            <div class="empty-state">
                No paper-view data available.
            </div>

        `;

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                x => x[1]
            ),
            1
        );


    paperUsage.innerHTML =
        entries
            .slice(0, 15)
            .map(
                ([name, value]) => `

                    <div class="paper-row">

                        <div class="paper-name">
                            ${name}
                        </div>

                        <div class="paper-track">

                            <div
                                class="paper-bar"
                                style="width:${(
                                    value /
                                    max
                                ) * 100}%"
                            ></div>

                        </div>

                        <div class="paper-value">
                            ${value}
                        </div>

                    </div>

                `
            )
            .join("");

}


// ==========================
// Student Table
// ==========================

function renderStudents(
    students
) {

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


    const sorted =
        [...students]
            .sort(
                (a, b) => {

                    if (
                        a.active !==
                        b.active
                    ) {

                        return a.active
                            ? -1
                            : 1;

                    }

                    return a.id.localeCompare(
                        b.id
                    );

                }
            );


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
                            ).toLocaleString()
                            : "Never";


                    const grade =
                        student.type ===
                        "grade10"
                            ? "Grade 10"
                            : student.type ===
                              "grade11"
                                ? "Grade 11"
                                : "A/L";


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
                                ${lastActiveText}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


// ==========================
// Escape HTML
// ==========================

function escapeHTML(
    value
) {

    return String(value)
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


// ==========================
// Update Time
// ==========================

function updateTime() {

    if (!lastUpdated) {
        return;
    }

    lastUpdated.textContent =
        "Last updated: " +
        new Date()
            .toLocaleTimeString();

}


// ==========================
// CSV Export
// ==========================

function exportCSV() {

    const grade =
        gradeFilter?.value ||
        "all";

    const activity =
        activityFilter?.value ||
        "all";


    const filtered =
        studentsData.filter(
            student => {

                if (
                    grade !== "all" &&
                    student.type !== grade
                ) {

                    return false;

                }


                if (
                    activity === "active" &&
                    !student.active
                ) {

                    return false;

                }


                if (
                    activity === "inactive" &&
                    student.active
                ) {

                    return false;

                }


                return true;

            }
        );


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

                student.type === "grade10"
                    ? "Grade 10"
                    : student.type === "grade11"
                        ? "Grade 11"
                        : "A/L",

                student.active
                    ? "Active"
                    : "Offline",

                student.views,

                lastActive
                    ? new Date(
                        lastActive
                    ).toLocaleString()
                    : "Never"

            ]);

        }
    );


    const csv =
        rows
            .map(
                row =>
                    row
                        .map(
                            value =>
                                `"${String(value)
                                    .replace(
                                        /"/g,
                                        '""'
                                    )}"`
                        )
                        .join(",")
            )
            .join("\n");


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
        "student-report.csv";

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );

}


// ==========================
// Events
// ==========================

if (gradeFilter) {

    gradeFilter.addEventListener(
        "change",
        renderReports
    );

}


if (activityFilter) {

    activityFilter.addEventListener(
        "change",
        renderReports
    );

}


if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadData
    );

}


if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        exportCSV
    );

}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// ==========================
// Initial Load
// ==========================

loadData();


// ==========================
// Auto Refresh
// ==========================

setInterval(
    loadData,
    30000
);


console.log(
    "✅ Reports module loaded"
);
