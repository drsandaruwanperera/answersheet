import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =========================================
// ADMIN PROTECTION
// =========================================

if (
    sessionStorage.getItem(
        "adminLoggedIn"
    ) !== "true"
) {

    window.location.replace(
        "admin-login.html"
    );

}


// =========================================
// ELEMENTS
// =========================================

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


// =========================================
// REPORT ELEMENTS
// =========================================

const grade10Reports =
    document.getElementById(
        "grade10Reports"
    );

const grade11ModelReports =
    document.getElementById(
        "grade11ModelReports"
    );

const grade11PastReports =
    document.getElementById(
        "grade11PastReports"
    );

const alModelReports =
    document.getElementById(
        "alModelReports"
    );

const alProvince1Reports =
    document.getElementById(
        "alProvince1Reports"
    );

const alProvince2Reports =
    document.getElementById(
        "alProvince2Reports"
    );


// =========================================
// SETTINGS
// =========================================

const ACTIVE_LIMIT =
    90 * 1000;


// =========================================
// DATA
// =========================================

let studentsData = [];


// =========================================
// STUDENT TYPE
// =========================================

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


// =========================================
// ACTIVE
// =========================================

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
        <= ACTIVE_LIMIT
    );

}


// =========================================
// OLD PAPER VIEW COUNT
// =========================================
//
// Supports existing fields:
// paper01Viewed
// paper02Viewed
// etc.
//

function getLegacyPaperViews(
    data
) {

    let total = 0;


    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const field =
            "paper" +
            String(
                i
            ).padStart(
                2,
                "0"
            ) +
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


// =========================================
// NESTED VIEW COUNT
// =========================================

function getNestedViewCount(
    value
) {

    if (
        value === true
    ) {

        return 1;

    }


    if (
        !value ||
        typeof value !==
            "object"
    ) {

        return 0;

    }


    let total = 0;


    Object.values(
        value
    ).forEach(
        child => {

            total +=
                getNestedViewCount(
                    child
                );

        }
    );


    return total;

}


// =========================================
// TOTAL PAPER VIEWS
// =========================================

function getTotalPaperViews(
    data
) {

    const legacy =
        getLegacyPaperViews(
            data
        );


    const nested =
        getNestedViewCount(
            data?.paperViews
        );


    return (
        legacy +
        nested
    );

}


// =========================================
// SAFE GET
// =========================================

function getNested(
    object,
    path
) {

    if (
        !object
    ) {

        return undefined;

    }


    const parts =
        path.split(".");


    let current =
        object;


    for (
        const part of parts
    ) {

        if (
            current ===
                undefined ||
            current === null
        ) {

            return undefined;

        }


        current =
            current[
                part
            ];

    }


    return current;

}


// =========================================
// COUNT BOOLEAN PAPERS
// =========================================

function countPaperObject(
    object
) {

    if (
        !object ||
        typeof object !==
            "object"
    ) {

        return 0;

    }


    let count = 0;


    Object.values(
        object
    ).forEach(
        value => {

            if (
                value === true
            ) {

                count++;

            }

        }
    );


    return count;

}


// =========================================
// LOAD DATA
// =========================================

async function loadData() {

    try {

        if (
            lastUpdated
        ) {

            lastUpdated.textContent =
                "Loading...";

        }


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
                        getTotalPaperViews(
                            data
                        )

                });

            }
        );


        renderReports();

        updateTime();


        console.log(
            "✅ Reports updated:",
            studentsData.length
        );

    }

    catch (
        error
    ) {

        console.error(
            "Reports error:",
            error
        );


        showReportError();

    }

}


// =========================================
// FILTER DATA
// =========================================

function getFilteredStudents() {

    const grade =
        gradeFilter?.value ||
        "all";


    const activity =
        activityFilter?.value ||
        "all";


    return studentsData.filter(
        student => {

            if (
                grade !==
                    "all" &&
                student.type !==
                    grade
            ) {

                return false;

            }


            if (
                activity ===
                    "active" &&
                !student.active
            ) {

                return false;

            }


            if (
                activity ===
                    "inactive" &&
                student.active
            ) {

                return false;

            }


            return true;

        }
    );

}


// =========================================
// RENDER ALL
// =========================================

function renderReports() {

    const filtered =
        getFilteredStudents();


    // =====================================
    // OVERVIEW
    // =====================================

    renderOverview(
        filtered
    );


    // =====================================
    // PAPER REPORTS
    // =====================================

    renderGrade10(
        filtered
    );


    renderGrade11Model(
        filtered
    );


    renderGrade11Past(
        filtered
    );


    renderALModel(
        filtered
    );


    renderALProvince1(
        filtered
    );


    renderALProvince2(
        filtered
    );


    // =====================================
    // STUDENTS
    // =====================================

    renderStudents(
        filtered
    );

}


// =========================================
// OVERVIEW
// =========================================

function renderOverview(
    students
) {

    const total =
        students.length;


    const g10 =
        students.filter(
            x =>
                x.type ===
                "grade10"
        ).length;


    const g11 =
        students.filter(
            x =>
                x.type ===
                "grade11"
        ).length;


    const al =
        students.filter(
            x =>
                x.type ===
                "al"
        ).length;


    const active =
        students.filter(
            x =>
                x.active
        ).length;


    const inactive =
        total -
        active;


    const views =
        students.reduce(
            (
                sum,
                student
            ) =>
                sum +
                student.views,
            0
        );


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

}


// =========================================
// GRADE 10 MODEL
// =========================================

function renderGrade10(
    students
) {

    if (
        !grade10Reports
    ) {

        return;

    }


    const grade10 =
        students.filter(
            student =>
                student.type ===
                "grade10"
        );


    if (
        !grade10.length
    ) {

        grade10Reports.innerHTML =
            emptyReport(
                "No Grade 10 students found."
            );

        return;

    }


    let html = "";


    for (
        let term = 1;
        term <= 3;
        term++
    ) {

        const counts =
            [];


        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const paper =
                "paper" +
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            let count = 0;


            grade10.forEach(
                student => {

                    const value =
                        getNested(
                            student.data,
                            `paperViews.grade10.model.term${term}.${paper}`
                        );


                    if (
                        value === true
                    ) {

                        count++;

                    }

                }
            );


            counts.push({

                paper,
                count

            });

        }


        html +=
            renderTermGrid(
                `Grade 10 • Term ${term}`,
                counts
            );

    }


    grade10Reports.innerHTML =
        html;

}


// =========================================
// GRADE 11 MODEL
// =========================================

function renderGrade11Model(
    students
) {

    if (
        !grade11ModelReports
    ) {

        return;

    }


    const grade11 =
        students.filter(
            student =>
                student.type ===
                "grade11"
        );


    if (
        !grade11.length
    ) {

        grade11ModelReports.innerHTML =
            emptyReport(
                "No Grade 11 students found."
            );

        return;

    }


    let html = "";


    for (
        let term = 1;
        term <= 3;
        term++
    ) {

        const counts =
            [];


        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const paper =
                "paper" +
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            let count = 0;


            grade11.forEach(
                student => {

                    const value =
                        getNested(
                            student.data,
                            `paperViews.grade11.model.term${term}.${paper}`
                        );


                    if (
                        value === true
                    ) {

                        count++;

                    }

                }
            );


            counts.push({

                paper,
                count

            });

        }


        html +=
            renderTermGrid(
                `Grade 11 • Term ${term}`,
                counts
            );

    }


    grade11ModelReports.innerHTML =
        html;

}


// =========================================
// GRADE 11 PAST PAPERS
// =========================================

function renderGrade11Past(
    students
) {

    if (
        !grade11PastReports
    ) {

        return;

    }


    const grade11 =
        students.filter(
            student =>
                student.type ===
                "grade11"
        );


    if (
        !grade11.length
    ) {

        grade11PastReports.innerHTML =
            emptyReport(
                "No Grade 11 students found."
            );

        return;

    }


    const years = [];


    for (
        let year = 2016;
        year <= 2025;
        year++
    ) {

        let count = 0;


        grade11.forEach(
            student => {

                const value =
                    getNested(
                        student.data,
                        `paperViews.grade11.past.${year}`
                    );


                if (
                    value === true
                ) {

                    count++;

                }

            }
        );


        years.push({

            year,
            count

        });

    }


    const max =
        Math.max(
            ...years.map(
                item =>
                    item.count
            ),
            1
        );


    grade11PastReports.innerHTML = `

        <div class="year-report-grid">

            ${
                years.map(
                    item => {

                        const width =
                            (
                                item.count /
                                max
                            ) *
                            100;


                        return `

                            <div
                                class="year-report-item"
                            >

                                <strong>
                                    ${item.year}
                                </strong>

                                <div
                                    class="year-report-count"
                                >
                                    ${item.count}
                                </div>

                                <div
                                    class="year-report-track"
                                >

                                    <div
                                        class="year-report-bar"
                                        style="width:${width}%"
                                    ></div>

                                </div>

                            </div>

                        `;

                    }
                ).join("")
            }

        </div>

    `;

}


// =========================================
// A/L MODEL
// =========================================

function renderALModel(
    students
) {

    if (
        !alModelReports
    ) {

        return;

    }


    const alStudents =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    if (
        !alStudents.length
    ) {

        alModelReports.innerHTML =
            emptyReport(
                "No A/L students found."
            );

        return;

    }


    const counts = [];


    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const paper =
            "paper" +
            String(
                i
            ).padStart(
                2,
                "0"
            );


        let count = 0;


        alStudents.forEach(
            student => {

                const value =
                    getNested(
                        student.data,
                        `paperViews.al.model.${paper}`
                    );


                if (
                    value === true
                ) {

                    count++;

                }

            }
        );


        counts.push({

            paper,
            count

        });

    }


    alModelReports.innerHTML =
        renderSimplePaperGrid(
            counts
        );

}


// =========================================
// A/L PROVINCE 1
// =========================================

function renderALProvince1(
    students
) {

    if (
        !alProvince1Reports
    ) {

        return;

    }


    const alStudents =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    if (
        !alStudents.length
    ) {

        alProvince1Reports.innerHTML =
            emptyReport(
                "No A/L students found."
            );

        return;

    }


    const provinces = [

        {
            key:
                "central",

            name:
                "Central Province"

        },

        {
            key:
                "western",

            name:
                "Western Province"

        },

        {
            key:
                "north-western",

            name:
                "North Western Province"

        },

        {
            key:
                "southern",

            name:
                "Southern Province"

        },

        {
            key:
                "sabaragamuwa",

            name:
                "Sabaragamuwa Province"

        }

    ];


    const counts =
        provinces.map(
            province => {

                let count = 0;


                alStudents.forEach(
                    student => {

                        const value =
                            getNested(
                                student.data,
                                `paperViews.al.province.paper1.${province.key}`
                            );


                        if (
                            value === true
                        ) {

                            count++;

                        }

                    }
                );


                return {

                    ...province,

                    count

                };

            }
        );


    alProvince1Reports.innerHTML =
        renderProvinceGrid(
            counts
        );

}


// =========================================
// A/L PROVINCE 2
// =========================================

function renderALProvince2(
    students
) {

    if (
        !alProvince2Reports
    ) {

        return;

    }


    const alStudents =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    if (
        !alStudents.length
    ) {

        alProvince2Reports.innerHTML =
            emptyReport(
                "No A/L students found."
            );

        return;

    }


    const provinces = [

        {
            key:
                "central",

            name:
                "Central Province"

        },

        {
            key:
                "western",

            name:
                "Western Province"

        },

        {
            key:
                "north-western",

            name:
                "North Western Province"

        },

        {
            key:
                "southern",

            name:
                "Southern Province"

        },

        {
            key:
                "sabaragamuwa",

            name:
                "Sabaragamuwa Province"

        }

    ];


    const counts =
        provinces.map(
            province => {

                let count = 0;


                alStudents.forEach(
                    student => {

                        const value =
                            getNested(
                                student.data,
                                `paperViews.al.province.paper2.${province.key}`
                            );


                        if (
                            value === true
                        ) {

                            count++;

                        }

                    }
                );


                return {

                    ...province,

                    count

                };

            }
        );


    alProvince2Reports.innerHTML =
        renderProvinceGrid(
            counts
        );

}


// =========================================
// TERM GRID
// =========================================

function renderTermGrid(
    title,
    counts
) {

    const max =
        Math.max(
            ...counts.map(
                item =>
                    item.count
            ),
            1
        );


    return `

        <div class="term-report">

            <div class="term-title">

                <strong>
                    ${title}
                </strong>

                <span>
                    Student views
                </span>

            </div>


            <div
                class="paper-report-grid"
            >

                ${
                    counts.map(
                        item => {

                            const width =
                                (
                                    item.count /
                                    max
                                ) *
                                100;


                            return `

                                <div
                                    class="paper-report-item"
                                >

                                    <div
                                        class="paper-report-top"
                                    >

                                        <span
                                            class="paper-report-name"
                                        >
                                            ${item.paper}
                                        </span>

                                        <strong
                                            class="paper-report-count"
                                        >
                                            ${item.count}
                                        </strong>

                                    </div>


                                    <div
                                        class="paper-report-track"
                                    >

                                        <div
                                            class="paper-report-bar"
                                            style="width:${width}%"
                                        ></div>

                                    </div>


                                    <div
                                        class="paper-report-meta"
                                    >

                                        <span>
                                            Views
                                        </span>

                                        <span>
                                            ${item.count}
                                        </span>

                                    </div>

                                </div>

                            `;

                        }
                    ).join("")
                }

            </div>

        </div>

    `;

}


// =========================================
// SIMPLE PAPER GRID
// =========================================

function renderSimplePaperGrid(
    counts
) {

    const max =
        Math.max(
            ...counts.map(
                item =>
                    item.count
            ),
            1
        );


    return `

        <div
            class="paper-report-grid"
        >

            ${
                counts.map(
                    item => {

                        const width =
                            (
                                item.count /
                                max
                            ) *
                            100;


                        return `

                            <div
                                class="paper-report-item"
                            >

                                <div
                                    class="paper-report-top"
                                >

                                    <span
                                        class="paper-report-name"
                                    >
                                        ${item.paper}
                                    </span>

                                    <strong
                                        class="paper-report-count"
                                    >
                                        ${item.count}
                                    </strong>

                                </div>


                                <div
                                    class="paper-report-track"
                                >

                                    <div
                                        class="paper-report-bar"
                                        style="width:${width}%"
                                    ></div>

                                </div>


                                <div
                                    class="paper-report-meta"
                                >

                                    <span>
                                        Student Views
                                    </span>

                                </div>

                            </div>

                        `;

                    }
                ).join("")
            }

        </div>

    `;

}


// =========================================
// PROVINCE GRID
// =========================================

function renderProvinceGrid(
    provinces
) {

    return `

        <div
            class="province-report-grid"
        >

            ${
                provinces.map(
                    province => `

                        <div
                            class="province-report-item"
                        >

                            <div
                                class="province-report-info"
                            >

                                <div
                                    class="province-report-icon"
                                >
                                    📍
                                </div>


                                <div>

                                    <strong>
                                        ${province.name}
                                    </strong>

                                    <span>
                                        Student Views
                                    </span>

                                </div>

                            </div>


                            <strong
                                class="province-count"
                            >
                                ${province.count}
                            </strong>

                        </div>

                    `
                ).join("")
            }

        </div>

    `;

}


// =========================================
// EMPTY REPORT
// =========================================

function emptyReport(
    message
) {

    return `

        <div
            class="report-empty"
        >
            ${message}
        </div>

    `;

}


// =========================================
// STUDENT TABLE
// =========================================

function renderStudents(
    students
) {

    if (
        !studentTableBody
    ) {

        return;

    }


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
        [...students].sort(
            (
                a,
                b
            ) => {

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
        sorted.map(
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
        ).join("");

}


// =========================================
// SET TEXT
// =========================================

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


// =========================================
// ESCAPE HTML
// =========================================

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


// =========================================
// UPDATE TIME
// =========================================

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


// =========================================
// ERROR
// =========================================

function showReportError() {

    const message =
        emptyReport(
            "Unable to load live report data."
        );


    if (
        grade10Reports
    ) {

        grade10Reports.innerHTML =
            message;

    }


    if (
        grade11ModelReports
    ) {

        grade11ModelReports.innerHTML =
            message;

    }


    if (
        grade11PastReports
    ) {

        grade11PastReports.innerHTML =
            message;

    }


    if (
        alModelReports
    ) {

        alModelReports.innerHTML =
            message;

    }


    if (
        alProvince1Reports
    ) {

        alProvince1Reports.innerHTML =
            message;

    }


    if (
        alProvince2Reports
    ) {

        alProvince2Reports.innerHTML =
            message;

    }

}


// =========================================
// CSV EXPORT
// =========================================

function exportCSV() {

    const students =
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


    students.forEach(
        student => {

            const lastActive =
                Number(
                    student.data
                        ?.lastActiveAt ||
                    0
                );


            rows.push([

                student.id,

                student.type ===
                    "grade10"
                    ? "Grade 10"
                    : student.type ===
                      "grade11"
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
                                `"${String(
                                    value
                                ).replace(
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


// =========================================
// EVENTS
// =========================================

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


if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        loadData
    );

}


if (
    exportBtn
) {

    exportBtn.addEventListener(
        "click",
        exportCSV
    );

}


if (
    logoutBtn
) {

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


// =========================================
// INITIAL LOAD
// =========================================

loadData();


// =========================================
// LIVE REFRESH
// =========================================

setInterval(
    loadData,
    30000
);


console.log(
    "✅ Advanced Reports Loaded"
);
