// =====================================================
// STUDENT DELETION PAGE
// =====================================================
//
// FEATURES
//
// ✅ Load ALL students from Firestore
// ✅ NO 5 student limit
// ✅ NO pagination
// ✅ Search Student ID / Name / NIC
// ✅ A27000 - A27999 = A/L
// ✅ A28000 - A28999 = A/L
// ✅ A29000 - A29999 = A/L
// ✅ 26000 - 26999 = Grade 11
// ✅ 27000 - 27999 = Grade 10
// ✅ 9-11 digit Student ID = NIC
// ✅ 9-11 digit NIC field = NIC
// ✅ Old NIC 123456789V / X
// ✅ Individual delete
// ✅ Delete complete series
// ✅ Delete all NIC students
// ✅ Password = Nimeth
//
// =====================================================


// =====================================================
// FIREBASE
// =====================================================

import {

    db,

    collection,
    getDocs,
    doc,
    deleteDoc

} from "./firebase.js";


// =====================================================
// SUPER ADMIN DELETE PASSWORD
// =====================================================

const DELETE_PASSWORD = "Nimeth";


// =====================================================
// GLOBAL STUDENT ARRAY
// =====================================================

let allStudents = [];


// =====================================================
// DELETE LOCK
// =====================================================

let deleteInProgress = false;


// =====================================================
// DOM ELEMENTS
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


const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );


const studentTable =
    document.getElementById(
        "studentTable"
    );


const resultCount =
    document.getElementById(
        "resultCount"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// PAGE READY
// =====================================================

console.log(
    "======================================"
);

console.log(
    "STUDENT DELETION PAGE"
);

console.log(
    "JavaScript loaded successfully"
);

console.log(
    "======================================"
);


// =====================================================
// UNLOCK BUTTON
// =====================================================

if (
    unlockBtn
) {

    unlockBtn.addEventListener(
        "click",
        unlockDeletion
    );

}


// =====================================================
// ENTER KEY PASSWORD
// =====================================================

if (
    deletePassword
) {

    deletePassword.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                unlockDeletion();

            }

        }
    );

}


// =====================================================
// SEARCH
// =====================================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        renderStudents
    );

}


// =====================================================
// FILTER
// =====================================================

if (
    categoryFilter
) {

    categoryFilter.addEventListener(
        "change",
        renderStudents
    );

}


// =====================================================
// REFRESH
// =====================================================

if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        async () => {

            await loadStudents();

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
        logout
    );

}


// =====================================================
// UNLOCK DELETION
// =====================================================

async function unlockDeletion() {

    const password =
        String(
            deletePassword?.value || ""
        ).trim();


    // =================================================
    // CHECK PASSWORD
    // =================================================

    if (
        password !==
        DELETE_PASSWORD
    ) {

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
    // CLEAR ERROR
    // =================================================

    if (
        passwordError
    ) {

        passwordError.textContent =
            "";

    }


    // =================================================
    // LOADING
    // =================================================

    if (
        unlockBtn
    ) {

        unlockBtn.disabled =
            true;

        unlockBtn.textContent =
            "Loading all students...";

    }


    try {

        await loadStudents();


        // =============================================
        // HIDE PASSWORD
        // =============================================

        if (
            passwordCard
        ) {

            passwordCard.style.display =
                "none";

        }


        // =============================================
        // SHOW REPORT
        // =============================================

        if (
            reportPanel
        ) {

            reportPanel.style.display =
                "block";

        }

    }

    catch (
        error
    ) {

        console.error(
            "Unable to unlock deletion:",
            error
        );


        if (
            passwordError
        ) {

            passwordError.textContent =
                "Unable to load students. Check Firebase configuration.";

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
// LOAD ALL STUDENTS
// =====================================================

async function loadStudents() {

    console.log(
        "Loading ALL students from Firestore..."
    );


    // =================================================
    // LOADING TABLE
    // =================================================

    if (
        studentTable
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading"
                >

                    Loading all students...

                </td>

            </tr>

        `;

    }


    // =================================================
    // FIRESTORE
    // =================================================
    //
    // IMPORTANT:
    //
    // getDocs() WITHOUT limit()
    // loads every document in students collection.
    //
    // =================================================

    const snapshot =
        await getDocs(
            collection(
                db,
                "students"
            )
        );


    // =================================================
    // CLEAR OLD DATA
    // =================================================

    allStudents =
        [];


    // =================================================
    // READ EVERY DOCUMENT
    // =================================================

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
    // SORT
    // =================================================

    allStudents.sort(
        (
            a,
            b
        ) => {

            return String(
                a.id
            ).localeCompare(
                String(
                    b.id
                ),
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        }
    );


    console.log(
        "======================================"
    );

    console.log(
        "ALL STUDENTS LOADED:",
        allStudents.length
    );

    console.log(
        "======================================"
    );


    // =================================================
    // UPDATE SUMMARY
    // =================================================

    updateTotals();


    // =================================================
    // RENDER ALL
    // =================================================

    renderStudents();

}


// =====================================================
// GET SERIES
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
    // A/L SERIES
    // =================================================

    if (
        /^A\d{5}$/.test(
            id
        )
    ) {

        const number =
            Number(
                id.substring(1)
            );


        // ---------------------------------------------
        // A27000 - A27999
        // ---------------------------------------------

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "A27000";

        }


        // ---------------------------------------------
        // A28000 - A28999
        // ---------------------------------------------

        if (
            number >= 28000 &&
            number <= 28999
        ) {

            return "A28000";

        }


        // ---------------------------------------------
        // A29000 - A29999
        // ---------------------------------------------

        if (
            number >= 29000 &&
            number <= 29999
        ) {

            return "A29000";

        }


        return "";

    }


    // =================================================
    // NORMAL SERIES
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
// GET NIC
// =====================================================

function getNIC(
    data
) {

    if (
        !data
    ) {

        return "";

    }


    return (

        data.nicNumber ||

        data.nic ||

        data.NIC ||

        data.nicNo ||

        data.NICNumber ||

        data.nic_number ||

        data.nationalId ||

        data.nationalID ||

        data.national_id ||

        ""

    );

}


// =====================================================
// CHECK NIC
// =====================================================
//
// Valid:
//
// 123456789
// 1234567890
// 12345678901
//
// Old:
//
// 123456789V
// 123456789X
//
// Also checks Student ID itself.
//
// =====================================================

function hasNIC(
    data,
    studentId
) {

    // =================================================
    // STUDENT ID
    // =================================================

    const cleanStudentId =
        String(
            studentId || ""
        )
            .trim()
            .replace(
                /\s+/g,
                ""
            )
            .toUpperCase();


    // =================================================
    // STUDENT ID = NIC
    // =================================================

    if (
        /^\d{9,11}$/.test(
            cleanStudentId
        )
    ) {

        return true;

    }


    // =================================================
    // FIRESTORE NIC FIELD
    // =================================================

    const nic =
        getNIC(
            data
        );


    const cleanNIC =
        String(
            nic || ""
        )
            .trim()
            .replace(
                /\s+/g,
                ""
            )
            .toUpperCase();


    // =================================================
    // 9 - 11 DIGIT
    // =================================================

    if (
        /^\d{9,11}$/.test(
            cleanNIC
        )
    ) {

        return true;

    }


    // =================================================
    // OLD NIC
    // =================================================

    if (
        /^\d{9}[VX]$/.test(
            cleanNIC
        )
    ) {

        return true;

    }


    return false;

}


// =====================================================
// GET NAME
// =====================================================

function getStudentName(
    data
) {

    if (
        !data
    ) {

        return "Student";

    }


    return (

        data.fullName ||

        data.name ||

        data.studentName ||

        data.displayName ||

        data.full_name ||

        "Student"

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


    // =================================================
    // A/L
    // =================================================

    if (
        series === "A27000" ||
        series === "A28000" ||
        series === "A29000"
    ) {

        return "A/L";

    }


    // =================================================
    // GRADE 11
    // =================================================

    if (
        series === "26000"
    ) {

        return "Grade 11";

    }


    // =================================================
    // GRADE 10
    // =================================================

    if (
        series === "27000"
    ) {

        return "Grade 10";

    }


    // =================================================
    // NIC
    // =================================================

    if (
        hasNIC(
            student.data,
            student.id
        )
    ) {

        return "NIC Student";

    }


    return "Other";

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
// UPDATE TOTALS
// =====================================================

function updateTotals() {

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


    const nic =
        allStudents.filter(
            student =>

                hasNIC(
                    student.data,
                    student.id
                )

        ).length;


    // =================================================
    // UPDATE HTML
    // =================================================

    setText(
        "totalA27000",
        a27000
    );


    setText(
        "totalA28000",
        a28000
    );


    setText(
        "totalA29000",
        a29000
    );


    setText(
        "total26000",
        grade11
    );


    setText(
        "total27000",
        grade10
    );


    setText(
        "nicStudentTotal",
        nic
    );


    // =================================================
    // DEBUG
    // =================================================

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
        "NIC:",
        nic
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
// RENDER STUDENTS
// =====================================================

function renderStudents() {

    if (
        !studentTable
    ) {

        return;

    }


    // =================================================
    // SEARCH
    // =================================================

    const search =
        String(
            searchInput?.value || ""
        )
            .trim()
            .toLowerCase();


    // =================================================
    // FILTER
    // =================================================

    const filter =
        String(
            categoryFilter?.value ||
            "all"
        )
            .trim()
            .toLowerCase();


    // =================================================
    // FILTER ALL STUDENTS
    // =================================================

    const filtered =
        allStudents.filter(
            student => {

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


                const series =
                    getSeries(
                        student.id
                    ).toLowerCase();


                const category =
                    getCategory(
                        student
                    ).toLowerCase();


                // =====================================
                // SEARCH MATCH
                // =====================================

                const searchMatch =

                    !search ||

                    id.includes(
                        search
                    ) ||

                    name.includes(
                        search
                    ) ||

                    nic.includes(
                        search
                    );


                if (
                    !searchMatch
                ) {

                    return false;

                }


                // =====================================
                // ALL
                // =====================================

                if (
                    filter ===
                    "all"
                ) {

                    return true;

                }


                // =====================================
                // CURRENT A/L
                // =====================================

                if (
                    filter ===
                    "al"
                ) {

                    return (

                        series === "a27000" ||

                        series === "a28000" ||

                        series === "a29000"

                    );

                }


                // =====================================
                // A27000
                // =====================================

                if (
                    filter ===
                    "a27000"
                ) {

                    return (
                        series ===
                        "a27000"
                    );

                }


                // =====================================
                // A28000
                // =====================================

                if (
                    filter ===
                    "a28000"
                ) {

                    return (
                        series ===
                        "a28000"
                    );

                }


                // =====================================
                // A29000
                // =====================================

                if (
                    filter ===
                    "a29000"
                ) {

                    return (
                        series ===
                        "a29000"
                    );

                }


                // =====================================
                // GRADE 11
                // =====================================

                if (
                    filter ===
                    "grade11"
                ) {

                    return (
                        series ===
                        "26000"
                    );

                }


                // =====================================
                // GRADE 10
                // =====================================

                if (
                    filter ===
                    "grade10"
                ) {

                    return (
                        series ===
                        "27000"
                    );

                }


                // =====================================
                // NIC
                // =====================================

                if (
                    filter ===
                    "nic"
                ) {

                    return hasNIC(
                        student.data,
                        student.id
                    );

                }


                // =====================================
                // OTHER
                // =====================================

                if (
                    filter ===
                    "other"
                ) {

                    return (
                        category ===
                        "other"
                    );

                }


                return true;

            }
        );


    // =================================================
    // RESULT COUNT
    // =================================================

    if (
        resultCount
    ) {

        resultCount.textContent =

            filtered.length.toLocaleString() +

            (
                filtered.length === 1
                    ? " student"
                    : " students"
            );

    }


    // =================================================
    // EMPTY
    // =================================================

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


    // =================================================
    // IMPORTANT
    // =================================================
    //
    // DO NOT USE:
    //
    // .slice(0, 5)
    //
    // DO NOT USE:
    //
    // .slice(0, 10)
    //
    // DO NOT USE:
    //
    // pagination
    //
    // ALL FILTERED STUDENTS ARE RENDERED.
    //
    // =================================================

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


                const nic =
                    getNIC(
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


                // =====================================
                // BADGE CLASS
                // =====================================

                let badgeClass =
                    "other";


                if (
                    category ===
                    "A/L"
                ) {

                    badgeClass =
                        "al";

                }


                else if (
                    category ===
                    "Grade 10"
                ) {

                    badgeClass =
                        "grade10";

                }


                else if (
                    category ===
                    "Grade 11"
                ) {

                    badgeClass =
                        "grade11";

                }


                // NIC class
                //
                // CSS doesn't currently have a .nic
                // class, so it will still display safely.
                //

                else if (
                    category ===
                    "NIC Student"
                ) {

                    badgeClass =
                        "other";

                }


                // =====================================
                // NIC DISPLAY
                // =====================================

                let nicHTML =
                    "";


                if (
                    nic
                ) {

                    nicHTML = `

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

                    `;

                }


                // =====================================
                // ROW
                // =====================================

                return `

                    <tr>

                        <td>

                            ${index + 1}

                        </td>


                        <td>

                            <strong
                                class="student-id"
                            >

                                ${escapeHTML(
                                    student.id
                                )}

                            </strong>

                        </td>


                        <td>

                            <strong>

                                ${escapeHTML(
                                    name
                                )}

                            </strong>

                            ${nicHTML}

                        </td>


                        <td>

                            <span
                                class="
                                    badge
                                    ${badgeClass}
                                "
                            >

                                ${escapeHTML(
                                    category
                                )}

                            </span>

                        </td>


                        <td>

                            ${
                                series
                                    ? escapeHTML(
                                        series
                                    )
                                    : "-"
                            }

                        </td>


                        <td>

                            <button
                                type="button"
                                class="delete-btn individual-delete"
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
    // INDIVIDUAL DELETE BUTTONS
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


    const nic =
        getNIC(
            student.data
        );


    const category =
        getCategory(
            student
        );


    const confirmed =
        confirm(

            "⚠️ DELETE STUDENT\n\n" +

            "Student ID: " +
            studentId +

            "\nName: " +
            name +

            "\nCategory: " +
            category +

            (
                nic
                    ? "\nNIC: " + nic
                    : ""
            ) +

            "\n\n" +

            "This student account will be " +
            "permanently deleted.\n\n" +

            "Continue?"

        );


    if (
        !confirmed
    ) {

        return;

    }


    // =================================================
    // PASSWORD
    // =================================================

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


    await deleteStudentList(
        [student]
    );

}


// =====================================================
// DELETE SERIES
// =====================================================

async function deleteSeries(
    series
) {

    if (
        deleteInProgress
    ) {

        return;

    }


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

            "⚠️ DELETE ALL " +
            series +
            "\n\n" +

            "Students found: " +
            students.length +

            "\n\n" +

            "This will permanently delete " +
            "ALL students in this series.\n\n" +

            "This action cannot be undone.\n\n" +

            "Continue?"

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
            "Incorrect deletion password."
        );

        return;

    }


    await deleteStudentList(
        students
    );

}


// =====================================================
// DELETE ALL NIC STUDENTS
// =====================================================

async function deleteAllNICStudents() {

    if (
        deleteInProgress
    ) {

        return;

    }


    const nicStudents =
        allStudents.filter(
            student =>

                hasNIC(
                    student.data,
                    student.id
                )

        );


    if (
        nicStudents.length === 0
    ) {

        alert(
            "No NIC students found."
        );

        return;

    }


    const confirmed =
        confirm(

            "⚠️ DELETE ALL NIC STUDENTS\n\n" +

            "Total NIC students: " +
            nicStudents.length +

            "\n\n" +

            "This includes students whose " +
            "Student ID OR NIC field contains " +
            "a valid 9-11 digit NIC number.\n\n" +

            "All matching student accounts will " +
            "be permanently deleted.\n\n" +

            "This action cannot be undone.\n\n" +

            "Continue?"

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
            "Incorrect deletion password."
        );

        return;

    }


    await deleteStudentList(
        nicStudents
    );

}


// =====================================================
// DELETE STUDENT LIST
// =====================================================

async function deleteStudentList(
    students
) {

    if (
        deleteInProgress
    ) {

        return;

    }


    if (
        !students ||
        students.length === 0
    ) {

        return;

    }


    deleteInProgress =
        true;


    try {

        let deleted =
            0;


        // =================================================
        // DELETE EVERY DOCUMENT
        // =================================================

        for (
            const student
            of students
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


            deleted++;

        }


        // =================================================
        // REMOVE LOCAL
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
        // UPDATE
        // =================================================

        updateTotals();

        renderStudents();


        // =================================================
        // SUCCESS
        // =================================================

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
// GLOBAL DELETE SERIES BUTTONS
// =====================================================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (
            !button
        ) {

            return;

        }


        // =================================================
        // NIC
        // =================================================

        if (
            button.id ===
            "deleteAllNIC"
        ) {

            deleteAllNICStudents();

            return;

        }


        // =================================================
        // SERIES
        // =================================================

        if (
            button.classList.contains(
                "delete-series-btn"
            )
        ) {

            const series =
                button.dataset.series;


            if (
                series
            ) {

                deleteSeries(
                    series
                );

            }

        }

    }
);


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
// LOGOUT
// =====================================================

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to sign out?"
        );


    if (
        !confirmed
    ) {

        return;

    }


    sessionStorage.clear();


    window.location.href =
        "admin-login.html";

}


// =====================================================
// FINAL
// =====================================================

console.log(
    "======================================"
);

console.log(
    "STUDENT DELETION JS READY"
);

console.log(
    "NO 5-STUDENT LIMIT"
);

console.log(
    "ALL FIRESTORE STUDENTS WILL BE LOADED"
);

console.log(
    "======================================"
);
