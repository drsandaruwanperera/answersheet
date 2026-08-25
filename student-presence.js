// =====================================================
// STUDENT DELETION SYSTEM
// =====================================================

import {
    db,
    collection,
    getDocs,
    doc,
    deleteDoc
} from "./firebase.js";


// =====================================================
// CONFIGURATION
// =====================================================

const DELETE_PASSWORD = "Nimeth";


// =====================================================
// GLOBAL DATA
// =====================================================

let allStudents = [];

let deleteInProgress = false;


// =====================================================
// DOM ELEMENTS
// =====================================================

let passwordCard;
let reportPanel;
let deletePassword;
let passwordError;
let unlockBtn;

let searchInput;
let refreshBtn;
let studentTable;

let logoutBtn;


// =====================================================
// INITIALIZE PAGE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "===================================="
        );

        console.log(
            "STUDENT DELETION SYSTEM"
        );

        console.log(
            "Page loaded successfully"
        );

        console.log(
            "===================================="
        );


        // ---------------------------------------------
        // GET ELEMENTS
        // ---------------------------------------------

        passwordCard =
            document.getElementById(
                "passwordCard"
            );


        reportPanel =
            document.getElementById(
                "reportPanel"
            );


        deletePassword =
            document.getElementById(
                "deletePassword"
            );


        passwordError =
            document.getElementById(
                "passwordError"
            );


        unlockBtn =
            document.getElementById(
                "unlockBtn"
            );


        searchInput =
            document.getElementById(
                "searchInput"
            );


        refreshBtn =
            document.getElementById(
                "refreshBtn"
            );


        studentTable =
            document.getElementById(
                "studentTable"
            );


        logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        // ---------------------------------------------
        // DEBUG
        // ---------------------------------------------

        console.log(
            "passwordCard:",
            passwordCard
        );

        console.log(
            "reportPanel:",
            reportPanel
        );

        console.log(
            "deletePassword:",
            deletePassword
        );

        console.log(
            "unlockBtn:",
            unlockBtn
        );

        console.log(
            "studentTable:",
            studentTable
        );


        // ---------------------------------------------
        // CHECK REQUIRED ELEMENTS
        // ---------------------------------------------

        if (
            !passwordCard ||
            !reportPanel ||
            !deletePassword ||
            !unlockBtn
        ) {

            console.error(
                "Required Student Deletion HTML elements are missing."
            );

            return;

        }


        // ---------------------------------------------
        // EVENTS
        // ---------------------------------------------

        unlockBtn.addEventListener(
            "click",
            unlockStudentDeletion
        );


        deletePassword.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    unlockStudentDeletion();

                }

            }
        );


        if (
            searchInput
        ) {

            searchInput.addEventListener(
                "input",
                renderStudents
            );

        }


        if (
            refreshBtn
        ) {

            refreshBtn.addEventListener(
                "click",
                loadStudents
            );

        }


        if (
            logoutBtn
        ) {

            logoutBtn.addEventListener(
                "click",
                logout
            );

        }


        // ---------------------------------------------
        // SERIES DELETE BUTTONS
        // ---------------------------------------------

        document
            .querySelectorAll(
                ".delete-series-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const series =
                                button.dataset.series;

                            deleteSeries(
                                series
                            );

                        }
                    );

                }
            );


        // ---------------------------------------------
        // FOCUS PASSWORD
        // ---------------------------------------------

        deletePassword.focus();

    }
);


// =====================================================
// UNLOCK STUDENT DELETION
// =====================================================

async function unlockStudentDeletion() {

    console.log(
        "Unlock button clicked."
    );


    const password =
        String(
            deletePassword?.value || ""
        ).trim();


    // =================================================
    // VALIDATE PASSWORD
    // =================================================

    if (
        password !==
        DELETE_PASSWORD
    ) {

        console.warn(
            "Incorrect deletion password."
        );


        if (
            passwordError
        ) {

            passwordError.textContent =
                "Incorrect deletion password.";

        }


        if (
            deletePassword
        ) {

            deletePassword.value =
                "";

            deletePassword.focus();

        }


        return;

    }


    // =================================================
    // CORRECT PASSWORD
    // =================================================

    console.log(
        "Deletion password accepted."
    );


    if (
        passwordError
    ) {

        passwordError.textContent =
            "";

    }


    // =================================================
    // SHOW LOADING
    // =================================================

    if (
        unlockBtn
    ) {

        unlockBtn.disabled =
            true;

        unlockBtn.textContent =
            "Loading students...";

    }


    // =================================================
    // HIDE PASSWORD SCREEN
    // =================================================

    if (
        passwordCard
    ) {

        passwordCard.style.display =
            "none";

    }


    // =================================================
    // SHOW REPORT
    // =================================================

    if (
        reportPanel
    ) {

        reportPanel.style.display =
            "block";

    }


    // =================================================
    // LOAD FIREBASE DATA
    // =================================================

    try {

        await loadStudents();

    }

    catch (
        error
    ) {

        console.error(
            "Unable to load students:",
            error
        );


        // ---------------------------------------------
        // SHOW PASSWORD SCREEN AGAIN
        // ---------------------------------------------

        if (
            passwordCard
        ) {

            passwordCard.style.display =
                "block";

        }


        if (
            reportPanel
        ) {

            reportPanel.style.display =
                "none";

        }


        if (
            passwordError
        ) {

            passwordError.textContent =
                "Unable to load student data. Please check Firebase.";

        }

    }

    finally {

        if (
            unlockBtn
        ) {

            unlockBtn.disabled =
                false;

            unlockBtn.textContent =
                "🔓 Unlock Student Deletion";

        }

    }

}


// =====================================================
// LOAD STUDENTS FROM FIRESTORE
// =====================================================

async function loadStudents() {

    console.log(
        "Loading students from Firestore..."
    );


    if (
        studentTable
    ) {

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

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        console.log(
            "Students found:",
            snapshot.size
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


        // =================================================
        // SORT STUDENTS
        // =================================================

        allStudents.sort(
            (
                first,
                second
            ) => {

                return String(
                    first.id
                ).localeCompare(
                    String(
                        second.id
                    ),
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );

            }
        );


        // =================================================
        // UPDATE COUNTS
        // =================================================

        updateCounts();


        // =================================================
        // DISPLAY STUDENTS
        // =================================================

        renderStudents();


        console.log(
            "Student deletion data loaded successfully."
        );

    }

    catch (
        error
    ) {

        console.error(
            "Firebase error:",
            error
        );


        if (
            studentTable
        ) {

            studentTable.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="empty-row"
                        style="color:#dc2626;"
                    >

                        ❌ Unable to load students.

                        <br><br>

                        ${escapeHTML(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }


        throw error;

    }

}


// =====================================================
// GET STUDENT SERIES
// =====================================================

function getSeries(
    studentId
) {

    const id =
        String(
            studentId || ""
        )
            .trim()
            .toUpperCase();


    // =================================================
    // A27000
    // =================================================

    if (
        id.startsWith(
            "A27000"
        )
    ) {

        return "A27000";

    }


    // =================================================
    // A28000
    // =================================================

    if (
        id.startsWith(
            "A28000"
        )
    ) {

        return "A28000";

    }


    // =================================================
    // A29000
    // =================================================

    if (
        id.startsWith(
            "A29000"
        )
    ) {

        return "A29000";

    }


    // =================================================
    // NUMERIC SERIES
    // =================================================

    if (
        /^\d{5}$/.test(
            id
        )
    ) {

        const number =
            Number(
                id
            );


        // ---------------------------------------------
        // 26000 - 26999
        // ---------------------------------------------

        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "26000";

        }


        // ---------------------------------------------
        // 27000 - 27999
        // ---------------------------------------------

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
// GET STUDENT NAME
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
// GET NIC
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
// GET CATEGORY
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
// UPDATE TOTAL COUNTS
// =====================================================

function updateCounts() {

    // =================================================
    // A27000
    // =================================================

    const totalA27000 =
        countSeries(
            "A27000"
        );


    // =================================================
    // A28000
    // =================================================

    const totalA28000 =
        countSeries(
            "A28000"
        );


    // =================================================
    // A29000
    // =================================================

    const totalA29000 =
        countSeries(
            "A29000"
        );


    // =================================================
    // 26000
    // =================================================

    const total26000 =
        countSeries(
            "26000"
        );


    // =================================================
    // 27000
    // =================================================

    const total27000 =
        countSeries(
            "27000"
        );


    // =================================================
    // NIC STUDENTS
    // =================================================

    const totalNIC =
        allStudents.filter(
            student => {

                const nic =
                    getNIC(
                        student.data
                    );


                return String(
                    nic || ""
                )
                    .trim()
                    .length > 0;

            }
        ).length;


    // =================================================
    // DISPLAY
    // =================================================

    setText(
        "totalA27000",
        totalA27000
    );


    setText(
        "totalA28000",
        totalA28000
    );


    setText(
        "totalA29000",
        totalA29000
    );


    setText(
        "total26000",
        total26000
    );


    setText(
        "total27000",
        total27000
    );


    setText(
        "nicStudentTotal",
        totalNIC
    );


    // =================================================
    // CONSOLE
    // =================================================

    console.log(
        "------------------------------"
    );

    console.log(
        "A27000:",
        totalA27000
    );

    console.log(
        "A28000:",
        totalA28000
    );

    console.log(
        "A29000:",
        totalA29000
    );

    console.log(
        "26000:",
        total26000
    );

    console.log(
        "27000:",
        total27000
    );

    console.log(
        "NIC Students:",
        totalNIC
    );

    console.log(
        "------------------------------"
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
// RENDER STUDENT TABLE
// =====================================================

function renderStudents() {

    if (
        !studentTable
    ) {

        return;

    }


    const search =
        String(
            searchInput?.value || ""
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
                    String(
                        getStudentName(
                            student.data
                        )
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


    // =================================================
    // NO RESULTS
    // =================================================

    if (
        filtered.length ===
        0
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


    // =================================================
    // TABLE
    // =================================================

    studentTable.innerHTML =
        filtered
            .map(
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
                                                    margin-top:4px;
                                                    font-size:11px;
                                                    color:#94a3b8;
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
                                    class="
                                        badge
                                        ${badgeClass}
                                    "
                                >
                                    ${category}
                                </span>

                            </td>


                            <td>

                                ${escapeHTML(
                                    series || "-"
                                )}

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
            )
            .join("");


    // =================================================
    // DELETE BUTTON EVENTS
    // =================================================

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

        alert(
            "Student not found."
        );

        return;

    }


    const name =
        getStudentName(
            student.data
        );


    const series =
        getSeries(
            student.id
        );


    const confirmDelete =
        confirm(

            "⚠️ DELETE STUDENT\n\n" +

            "Student ID: " +
            studentId +

            "\nName: " +
            name +

            "\nSeries: " +
            series +

            "\n\n" +

            "This action cannot be undone.\n\n" +

            "Continue?"

        );


    if (
        !confirmDelete
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
            "Incorrect deletion password."
        );

        return;

    }


    await deleteStudents(
        [student]
    );

}


// =====================================================
// DELETE ENTIRE SERIES
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
        students.length ===
        0
    ) {

        alert(
            "No students found in " +
            series +
            "."
        );

        return;

    }


    const confirmDelete =
        confirm(

            "⚠️ DELETE ALL " +
            series +
            " STUDENTS\n\n" +

            "Total students: " +
            students.length +

            "\n\n" +

            "All accounts in this series " +
            "will be permanently deleted.\n\n" +

            "Continue?"

        );


    if (
        !confirmDelete
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
            "Incorrect deletion password."
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

        let deletedCount =
            0;


        // =================================================
        // DELETE FIRESTORE DOCUMENTS
        // =================================================

        for (
            const student of students
        ) {

            console.log(
                "Deleting:",
                student.id
            );


            await deleteDoc(
                doc(
                    db,
                    "students",
                    student.id
                )
            );


            deletedCount++;

        }


        // =================================================
        // REMOVE FROM LOCAL ARRAY
        // =================================================

        const deletedIds =
            new Set(
                students.map(
                    student =>
                        student.id
                )
            );


        allStudents =
            allStudents.filter(
                student =>
                    !deletedIds.has(
                        student.id
                    )
            );


        // =================================================
        // UPDATE SCREEN
        // =================================================

        updateCounts();

        renderStudents();


        // =================================================
        // SUCCESS
        // =================================================

        alert(

            "Successfully deleted " +
            deletedCount +
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
// LOGOUT
// =====================================================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to sign out?"
        );


    if (
        !confirmLogout
    ) {

        return;

    }


    sessionStorage.clear();


    window.location.href =
        "admin-login.html";

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


// =====================================================
// ESCAPE ATTRIBUTE
// =====================================================

function escapeAttribute(
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
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


// =====================================================
// SYSTEM READY
// =====================================================

console.log(
    "===================================="
);

console.log(
    "🗑 Student Deletion JS Loaded"
);

console.log(
    "Password: Nimeth"
);

console.log(
    "Series deletion: ENABLED"
);

console.log(
    "Individual deletion: ENABLED"
);

console.log(
    "NIC counting: ENABLED"
);

console.log(
    "===================================="
);
