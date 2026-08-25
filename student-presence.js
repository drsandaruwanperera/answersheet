// =====================================================
// STUDENT DELETION
// =====================================================

import {
    db,
    collection,
    getDocs,
    doc,
    deleteDoc
} from "./firebase.js";


// =====================================================
// DELETE PASSWORD
// =====================================================

const DELETE_PASSWORD = "Nimeth";


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let deleteInProgress = false;


// =====================================================
// ELEMENTS
// =====================================================

const passwordCard =
    document.getElementById(
        "passwordCard"
    );

const reportPanel =
    document.getElementById(
        "reportPanel"
    );

const deletePassword =
    document.getElementById(
        "deletePassword"
    );

const passwordError =
    document.getElementById(
        "passwordError"
    );

const unlockBtn =
    document.getElementById(
        "unlockBtn"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );

const studentTable =
    document.getElementById(
        "studentTable"
    );


// =====================================================
// SESSION
// =====================================================

function sessionValue(
    ...keys
) {

    for (
        const key of keys
    ) {

        const value =
            sessionStorage.getItem(
                key
            );

        if (
            value
        ) {

            return value;

        }

    }

    return "";

}


// =====================================================
// CHECK SUPER ADMIN
// =====================================================

function isSuperAdmin() {

    const role =
        sessionValue(
            "adminRole",
            "userRole",
            "role"
        )
            .toLowerCase()
            .replace(
                /[\s_-]/g,
                ""
            );


    return (
        role === "superadmin" ||
        role === "superadministrator"
    );

}


// =====================================================
// PASSWORD UNLOCK
// =====================================================

function unlockPage() {

    const password =
        deletePassword.value;


    if (
        password !==
        DELETE_PASSWORD
    ) {

        passwordError.textContent =
            "Incorrect password.";

        deletePassword.value =
            "";

        deletePassword.focus();

        return;

    }


    passwordError.textContent =
        "";


    passwordCard.style.display =
        "none";


    reportPanel.style.display =
        "block";


    loadStudents();

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    studentTable.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="empty-row"
            >
                Loading students...
            </td>

        </tr>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        allStudents = [];


        snapshot.forEach(
            studentDoc => {

                allStudents.push({

                    id:
                        studentDoc.id,

                    data:
                        studentDoc.data()

                });

            }
        );


        allStudents.sort(
            (
                a,
                b
            ) =>

                a.id.localeCompare(
                    b.id,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )

        );


        updateCounts();

        renderStudents();

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-row"
                >
                    ❌ Unable to load students.
                </td>

            </tr>

        `;

    }

}


// =====================================================
// GET SERIES
// =====================================================

function getSeries(
    studentId
) {

    const id =
        String(
            studentId
        )
            .trim()
            .toUpperCase();


    // ---------------------------------------------
    // A/L
    // ---------------------------------------------

    if (
        id.startsWith(
            "A27000"
        )
    ) {

        return "A27000";

    }


    if (
        id.startsWith(
            "A28000"
        )
    ) {

        return "A28000";

    }


    if (
        id.startsWith(
            "A29000"
        )
    ) {

        return "A29000";

    }


    // ---------------------------------------------
    // Numeric
    // ---------------------------------------------

    if (
        /^\d{5}$/.test(
            id
        )
    ) {

        const number =
            Number(id);


        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "26000";

        }


        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "27000";

        }

    }


    return "";

}


// =====================================================
// NIC
// =====================================================

function getNIC(
    data
) {

    return (

        data?.nicNumber ||

        data?.nic ||

        data?.NIC ||

        data?.nicNo ||

        data?.NICNumber ||

        data?.nic_number ||

        ""

    );

}


// =====================================================
// STUDENT NAME
// =====================================================

function getStudentName(
    data
) {

    return (

        data?.name ||

        data?.studentName ||

        data?.fullName ||

        data?.displayName ||

        "Student"

    );

}


// =====================================================
// CATEGORY
// =====================================================

function getCategory(
    student
) {

    const series =
        getSeries(
            student.id
        );


    if (
        series ===
        "A27000" ||
        series ===
        "A28000" ||
        series ===
        "A29000"
    ) {

        return "A/L";

    }


    if (
        series ===
        "26000"
    ) {

        return "Grade 11";

    }


    if (
        series ===
        "27000"
    ) {

        return "Grade 10";

    }


    return "Other";

}


// =====================================================
// UPDATE COUNTS
// =====================================================

function updateCounts() {

    const a27000 =
        countSeries(
            "A27000"
        );


    const a28000 =
        countSeries(
            "A28000"
        );


    const a29000 =
        countSeries(
            "A29000"
        );


    const grade11 =
        countSeries(
            "26000"
        );


    const grade10 =
        countSeries(
            "27000"
        );


    const nicCount =
        allStudents.filter(
            student => {

                const nic =
                    getNIC(
                        student.data
                    );


                return String(
                    nic
                )
                    .trim()
                    .length > 0;

            }
        ).length;


    document
        .getElementById(
            "totalA27000"
        )
        .textContent =
        a27000;


    document
        .getElementById(
            "totalA28000"
        )
        .textContent =
        a28000;


    document
        .getElementById(
            "totalA29000"
        )
        .textContent =
        a29000;


    document
        .getElementById(
            "total26000"
        )
        .textContent =
        grade11;


    document
        .getElementById(
            "total27000"
        )
        .textContent =
        grade10;


    document
        .getElementById(
            "nicStudentTotal"
        )
        .textContent =
        nicCount;


    console.log(
        "A27000:",
        a27000
    );

    console.log(
        "A28000:",
        a28000
    );

    console.log(
        "A29000:",
        a29000
    );

    console.log(
        "26000:",
        grade11
    );

    console.log(
        "27000:",
        grade10
    );

    console.log(
        "NIC Students:",
        nicCount
    );

}


// =====================================================
// COUNT SERIES
// =====================================================

function countSeries(
    series
) {

    return allStudents.filter(
        student =>

            getSeries(
                student.id
            ) ===
            series

    ).length;

}


// =====================================================
// RENDER
// =====================================================

function renderStudents() {

    const search =
        String(
            searchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const filtered =
        allStudents.filter(
            student => {

                if (
                    !search
                ) {

                    return true;

                }


                const id =
                    String(
                        student.id
                    )
                        .toLowerCase();


                const name =
                    getStudentName(
                        student.data
                    )
                        .toLowerCase();


                const nic =
                    String(
                        getNIC(
                            student.data
                        )
                    )
                        .toLowerCase();


                return (

                    id.includes(
                        search
                    ) ||

                    name.includes(
                        search
                    ) ||

                    nic.includes(
                        search
                    )

                );

            }
        );


    if (
        filtered.length === 0
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-row"
                >
                    No students found.
                </td>

            </tr>

        `;

        return;

    }


    studentTable.innerHTML =
        filtered.map(
            (
                student,
                index
            ) => {

                const name =
                    getStudentName(
                        student.data
                    );


                const category =
                    getCategory(
                        student
                    );


                const series =
                    getSeries(
                        student.id
                    );


                const nic =
                    getNIC(
                        student.data
                    );


                let badgeClass =
                    "badge-al";


                if (
                    category ===
                    "Grade 10"
                ) {

                    badgeClass =
                        "badge-grade10";

                }


                if (
                    category ===
                    "Grade 11"
                ) {

                    badgeClass =
                        "badge-grade11";

                }


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <span
                                class="student-id"
                            >
                                ${escapeHTML(
                                    student.id
                                )}
                            </span>

                        </td>


                        <td>

                            <strong>
                                ${escapeHTML(
                                    name
                                )}
                            </strong>

                            ${
                                nic
                                    ? `
                                        <div
                                            style="
                                                font-size:11px;
                                                color:#94a3b8;
                                                margin-top:3px;
                                            "
                                        >
                                            NIC:
                                            ${escapeHTML(
                                                nic
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </td>


                        <td>

                            <span
                                class="badge ${badgeClass}"
                            >
                                ${category}
                            </span>

                        </td>


                        <td>
                            ${series || "-"}
                        </td>


                        <td>

                            <button
                                type="button"
                                class="individual-delete"
                                data-id="${escapeAttribute(
                                    student.id
                                )}"
                            >
                                🗑 Delete
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    document
        .querySelectorAll(
            ".individual-delete"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteIndividual(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// =====================================================
// INDIVIDUAL DELETE
// =====================================================

async function deleteIndividual(
    studentId
) {

    if (
        deleteInProgress
    ) {

        return;

    }


    const student =
        allStudents.find(
            item =>
                item.id ===
                studentId
        );


    if (
        !student
    ) {

        return;

    }


    const name =
        getStudentName(
            student.data
        );


    const confirmed =
        confirm(

            "DELETE STUDENT?\n\n" +

            "Student ID: " +
            studentId +

            "\nName: " +
            name +

            "\n\n" +

            "This action cannot be undone."

        );


    if (
        !confirmed
    ) {

        return;

    }


    const password =
        prompt(
            "Enter deletion password:"
        );


    if (
        password !==
        DELETE_PASSWORD
    ) {

        alert(
            "Incorrect password."
        );

        return;

    }


    await deleteStudents(
        [student]
    );

}


// =====================================================
// DELETE SERIES
// =====================================================

async function deleteSeries(
    series
) {

    const students =
        allStudents.filter(
            student =>
                getSeries(
                    student.id
                ) ===
                series
        );


    if (
        students.length === 0
    ) {

        alert(
            "No students found in " +
            series +
            "."
        );

        return;

    }


    const confirmed =
        confirm(

            "DELETE ALL " +
            series +
            " STUDENTS?\n\n" +

            "Total: " +
            students.length +

            "\n\n" +

            "All accounts in this series " +
            "will be permanently deleted."

        );


    if (
        !confirmed
    ) {

        return;

    }


    const password =
        prompt(
            "Enter deletion password:"
        );


    if (
        password !==
        DELETE_PASSWORD
    ) {

        alert(
            "Incorrect password."
        );

        return;

    }


    await deleteStudents(
        students
    );

}


// =====================================================
// DELETE STUDENTS
// =====================================================

async function deleteStudents(
    students
) {

    if (
        deleteInProgress
    ) {

        return;

    }


    deleteInProgress =
        true;


    try {

        let deleted =
            0;


        for (
            const student of students
        ) {

            await deleteDoc(
                doc(
                    db,
                    "students",
                    student.id
                )
            );


            deleted++;

        }


        const ids =
            new Set(
                students.map(
                    student =>
                        student.id
                )
            );


        allStudents =
            allStudents.filter(
                student =>
                    !ids.has(
                        student.id
                    )
            );


        updateCounts();

        renderStudents();


        alert(

            "Successfully deleted " +
            deleted +
            " student(s)."

        );

    }

    catch (
        error
    ) {

        console.error(
            "Delete error:",
            error
        );


        alert(

            "Delete failed.\n\n" +

            error.message

        );

    }

    finally {

        deleteInProgress =
            false;

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
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


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


// =====================================================
// EVENTS
// =====================================================

unlockBtn.addEventListener(
    "click",
    unlockPage
);


deletePassword.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            unlockPage();

        }

    }
);


searchInput.addEventListener(
    "input",
    renderStudents
);


refreshBtn.addEventListener(
    "click",
    loadStudents
);


// =====================================================
// SERIES DELETE BUTTONS
// =====================================================

document
    .querySelectorAll(
        ".delete-series-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSeries(
                        button.dataset.series
                    );

                }
            );

        }
    );


// =====================================================
// LOGOUT
// =====================================================

document
    .getElementById(
        "logoutBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            sessionStorage.clear();

            window.location.href =
                "admin-login.html";

        }
    );


// =====================================================
// START
// =====================================================

console.log(
    "Student Deletion System Loaded"
);
