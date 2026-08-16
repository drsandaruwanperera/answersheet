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

const distributionBar10 =
    document.getElementById(
        "distributionBar10"
    );

const distributionBar11 =
    document.getElementById(
        "distributionBar11"
    );

const distributionBarAL =
    document.getElementById(
        "distributionBarAL"
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
// PAPER REPORT ELEMENTS
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
// ACTIVE CHECK
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
// LEGACY PAPER VIEW COUNT
// =========================================

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
            String(i).padStart(
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
// NESTED TRUE COUNTER
// =========================================

function countNestedTrue(
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


    let count = 0;


    Object.values(
        value
    ).forEach(
        child => {

            count +=
                countNestedTrue(
                    child
                );

        }
    );


    return count;

}


// =========================================
// TOTAL VIEWS
// =========================================

function getTotalPaperViews(
    data
) {

    const legacy =
        getLegacyPaperViews(
            data
        );


    const nested =
        countNestedTrue(
            data?.paperViews
        );


    return (
        legacy +
        nested
    );

}


// =========================================
// NESTED VALUE
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
// LOAD FIREBASE DATA
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


        renderAll();

        updateTime();


        console.log(
            "Reports loaded:",
            studentsData
        );

    }

    catch (
        error
    ) {

        console.error(
            "Reports loading error:",
            error
        );


        showError();

    }

}


// =========================================
// FILTER
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

}


// =========================================
// RENDER ALL
// =========================================

function renderAll() {

    const students =
        getFilteredStudents();


    renderOverview(
        students
    );


    renderDistribution(
        students
    );


    renderGrade10(
        students
    );


    renderGrade11Model(
        students
    );


    renderGrade11Past(
        students
    );


    renderALModel(
        students
    );


    renderALProvince1(
        students
    );


    renderALProvince2(
        students
    );


    renderStudentTable(
        students
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
            student =>
                student.type ===
                "grade10"
        ).length;


    const g11 =
        students.filter(
            student =>
                student.type ===
                "grade11"
        ).length;


    const al =
        students.filter(
            student =>
                student.type ===
                "al"
        ).length;


    const active =
        students.filter(
            student =>
                student.active
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
        activityActive,
        active
    );


    setText(
        activityInactive,
        inactive
    );

}


// =========================================
// DISTRIBUTION
// =========================================

function renderDistribution(
    students
) {

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


    const max =
        Math.max(
            g10,
            g11,
            al,
            1
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


    if (
        distributionBar10
    ) {

        distributionBar10.style.width =
            (
                g10 /
                max *
                100
            ) + "%";

    }


    if (
        distributionBar11
    ) {

        distributionBar11.style.width =
            (
                g11 /
                max *
                100
            ) + "%";

    }


    if (
        distributionBarAL
    ) {

        distributionBarAL.style.width =
            (
                al /
                max *
                100
            ) + "%";

    }

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


    const list =
        students.filter(
            student =>
                student.type ===
                "grade10"
        );


    if (
        !list.length
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

        const papers = [];


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


            const count =
                countPath(
                    list,
                    `paperViews.grade10.model.term${term}.${paper}`
                );


            papers.push({

                name:
                    paper,

                count:
                    count

            });

        }


        html +=
            renderPaperGroup(
                "Term " + term,
                papers
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


    const list =
        students.filter(
            student =>
                student.type ===
                "grade11"
        );


    if (
        !list.length
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

        const papers = [];


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


            papers.push({

                name:
                    paper,

                count:
                    countPath(
                        list,
                        `paperViews.grade11.model.term${term}.${paper}`
                    )

            });

        }


        html +=
            renderPaperGroup(
                "Term " + term,
                papers
            );

    }


    grade11ModelReports.innerHTML =
        html;

}


// =========================================
// GRADE 11 PAST
// =========================================

function renderGrade11Past(
    students
) {

    if (
        !grade11PastReports
    ) {

        return;

    }


    const list =
        students.filter(
            student =>
                student.type ===
                "grade11"
        );


    if (
        !list.length
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

        years.push({

            name:
                String(year),

            count:
                countPath(
                    list,
                    `paperViews.grade11.past.${year}`
                )

        });

    }


    grade11PastReports.innerHTML = `

        <div class="year-report-grid">

            ${
                renderYears(
                    years
                )
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


    const list =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    if (
        !list.length
    ) {

        alModelReports.innerHTML =
            emptyReport(
                "No A/L students found."
            );

        return;

    }


    const papers = [];


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


        papers.push({

            name:
                paper,

            count:
                countPath(
                    list,
                    `paperViews.al.model.${paper}`
                )

        });

    }


    alModelReports.innerHTML = `

        <div class="paper-report-grid">

            ${renderPapers(papers)}

        </div>

    `;

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


    const list =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    if (
        !list.length
    ) {

        alProvince1Reports.innerHTML =
            emptyReport(
                "No A/L students found."
            );

        return;

    }


    const provinces =
        getProvinces();


    const data =
        provinces.map(
            province => ({

                name:
                    province.name,

                count:
                    countPath(
                        list,
                        `paperViews.al.province.paper1.${province.key}`
                    )

            })
        );


    alProvince1Reports.innerHTML = `

        <div class="province-report-grid">

            ${renderProvinces(data)}

        </div>

    `;

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


    const list =
        students.filter(
            student =>
                student.type ===
                "al"
        );


    if (
        !list.length
    ) {

        alProvince2Reports.innerHTML =
            emptyReport(
                "No A/L students found."
            );

        return;

    }


    const provinces =
        getProvinces();


    const data =
        provinces.map(
            province => ({

                name:
                    province.name,

                count:
                    countPath(
                        list,
                        `paperViews.al.province.paper2.${province.key}`
                    )

            })
        );


    alProvince2Reports.innerHTML = `

        <div class="province-report-grid">

            ${renderProvinces(data)}

        </div>

    `;

}


// =========================================
// PROVINCES
// =========================================

function getProvinces() {

    return [

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

}


// =========================================
// COUNT PATH
// =========================================

function countPath(
    students,
    path
) {

    let count = 0;


    students.forEach(
        student => {

            const value =
                getNested(
                    student.data,
                    path
                );


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
// PAPER GROUP
// =========================================

function renderPaperGroup(
    title,
    papers
) {

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


            <div class="paper-report-grid">

                ${renderPapers(papers)}

            </div>

        </div>

    `;

}


// =========================================
// PAPERS
// =========================================

function renderPapers(
    papers
) {

    const max =
        Math.max(
            ...papers.map(
                item =>
                    item.count
            ),
            1
        );


    return papers
        .map(
            paper => {

                const width =
                    (
                        paper.count /
                        max *
                        100
                    );


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
                                📄 ${escapeHTML(
                                    paper.name
                                )}
                            </span>

                            <strong
                                class="paper-report-count"
                            >
                                ${paper.count}
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
                                ${paper.count}
                            </span>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


// =========================================
// YEARS
// =========================================

function renderYears(
    years
) {

    const max =
        Math.max(
            ...years.map(
                item =>
                    item.count
            ),
            1
        );


    return years
        .map(
            year => {

                const width =
                    (
                        year.count /
                        max *
                        100
                    );


                return `

                    <div
                        class="year-report-item"
                    >

                        <strong>
                            ${year.name}
                        </strong>

                        <div
                            class="year-report-count"
                        >
                            ${year.count}
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
        )
        .join("");

}


// =========================================
// PROVINCES
// =========================================

function renderProvinces(
    provinces
) {

    return provinces
        .map(
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
                                ${escapeHTML(
                                    province.name
                                )}
                            </strong>

                            <span>
                                Student views
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
        )
        .join("");

}


// =========================================
// EMPTY
// =========================================

function emptyReport(
    message
) {

    return `

        <div
            class="report-empty"
        >
            ${escapeHTML(
                message
            )}
        </div>

    `;

}


// =========================================
// STUDENT TABLE
// =========================================

function renderStudentTable(
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

function showError() {

    const errorHTML =
        emptyReport(
            "Unable to load live report data."
        );


    if (
        grade10Reports
    ) {

        grade10Reports.innerHTML =
            errorHTML;

    }


    if (
        grade11ModelReports
    ) {

        grade11ModelReports.innerHTML =
            errorHTML;

    }


    if (
        grade11PastReports
    ) {

        grade11PastReports.innerHTML =
            errorHTML;

    }


    if (
        alModelReports
    ) {

        alModelReports.innerHTML =
            errorHTML;

    }


    if (
        alProvince1Reports
    ) {

        alProvince1Reports.innerHTML =
            errorHTML;

    }


    if (
        alProvince2Reports
    ) {

        alProvince2Reports.innerHTML =
            errorHTML;

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
// FILTER EVENTS
// =========================================

if (
    gradeFilter
) {

    gradeFilter.addEventListener(
        "change",
        renderAll
    );

}


if (
    activityFilter
) {

    activityFilter.addEventListener(
        "change",
        renderAll
    );

}


// =========================================
// REFRESH
// =========================================

if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        loadData
    );

}


// =========================================
// EXPORT
// =========================================

if (
    exportBtn
) {

    exportBtn.addEventListener(
        "click",
        exportCSV
    );

}


// =========================================
// LOGOUT
// =========================================

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
// START
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
    "✅ Reports system loaded"
);
