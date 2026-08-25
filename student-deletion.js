// =====================================================
// STUDENT DELETION SYSTEM
// =====================================================
//
// SUPER ADMIN ONLY
//
// Deletion password:
// Nimeth
//
// Firebase collection:
// students
//
// Supported student series:
//
// A27000xxxxx
// A28000xxxxx
// A29000xxxxx
//
// Grade 11:
// 26000 - 26999
//
// Grade 10:
// 27000 - 27999
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
// CONFIGURATION
// =====================================================

const DELETE_PASSWORD =
    "Nimeth";


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


const unlockBtn =
    document.getElementById(
        "unlockBtn"
    );


const passwordError =
    document.getElementById(
        "passwordError"
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


const shownCount =
    document.getElementById(
        "shownCount"
    );


const alCount =
    document.getElementById(
        "alCount"
    );


const gradeCount =
    document.getElementById(
        "gradeCount"
    );


const resultCount =
    document.getElementById(
        "resultCount"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const adminUsername =
    document.getElementById(
        "adminUsername"
    );


const adminRole =
    document.getElementById(
        "adminRole"
    );


// =====================================================
// GLOBAL DATA
// =====================================================

let allStudents = [];

let unlocked = false;

let deletingStudent = false;


// =====================================================
// SESSION VALUE
// =====================================================

function getSessionValue(
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
            value !== null &&
            value !== ""
        ) {

            return value;

        }

    }


    return "";

}


// =====================================================
// GET ADMIN ROLE
// =====================================================

function getAdminRole() {

    return getSessionValue(

        "adminRole",

        "userRole",

        "role",

        "admin_role",

        "user_role"

    )
        .trim()
        .toLowerCase()
        .replace(
            /[\s_-]+/g,
            ""
        );

}


// =====================================================
// SUPER ADMIN CHECK
// =====================================================

function isSuperAdmin() {

    const role =
        getAdminRole();


    return (

        role ===
        "superadmin"

        ||

        role ===
        "superadministrator"

        ||

        role ===
        "superadminuser"

    );

}


// =====================================================
// ADMIN LOGIN CHECK
// =====================================================

function isAdminLoggedIn() {

    const values = [

        sessionStorage.getItem(
            "adminLoggedIn"
        ),

        sessionStorage.getItem(
            "adminAuthenticated"
        ),

        sessionStorage.getItem(
            "isAdmin"
        ),

        sessionStorage.getItem(
            "loggedIn"
        )

    ];


    return values.some(
        value =>
            value === "true"
    );

}


// =====================================================
// ACCESS DENIED PAGE
// =====================================================

function showAccessDenied() {

    document.body.innerHTML = `

        <div
            style="
                min-height:100vh;
                width:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f4f6fb;
                font-family:Arial,Helvetica,sans-serif;
                padding:20px;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:460px;
                    background:#ffffff;
                    border:1px solid #e2e8f0;
                    border-radius:22px;
                    padding:42px 30px;
                    text-align:center;
                    box-shadow:
                        0 20px 60px
                        rgba(15,23,42,.10);
                "
            >

                <div
                    style="
                        width:70px;
                        height:70px;
                        margin:0 auto 20px;
                        border-radius:20px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#fef2f2;
                        font-size:34px;
                    "
                >
                    🔒
                </div>


                <h2
                    style="
                        margin:0 0 10px;
                        color:#172033;
                    "
                >
                    Access Restricted
                </h2>


                <p
                    style="
                        margin:0 0 24px;
                        color:#64748b;
                        line-height:1.6;
                        font-size:14px;
                    "
                >
                    Student deletion is available
                    only to the Super Administrator.
                </p>


                <button
                    type="button"
                    id="backToAdmin"
                    style="
                        border:0;
                        padding:12px 22px;
                        border-radius:10px;
                        background:#7c3aed;
                        color:#ffffff;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>

    `;


    const backButton =
        document.getElementById(
            "backToAdmin"
        );


    if (
        backButton
    ) {

        backButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "admin.html";

            }
        );

    }

}


// =====================================================
// INITIALISE
// =====================================================

function initialise() {

    // ---------------------------------------------
    // ADMIN DISPLAY
    // ---------------------------------------------

    const username =
        getSessionValue(

            "adminUsername",

            "adminName",

            "username",

            "displayName"

        );


    if (
        adminUsername &&
        username
    ) {

        adminUsername.textContent =
            username;

    }


    if (
        adminRole
    ) {

        adminRole.textContent =
            "Super Administrator";

    }


    // ---------------------------------------------
    // UNLOCK BUTTON
    // ---------------------------------------------

    if (
        unlockBtn
    ) {

        unlockBtn.addEventListener(
            "click",
            unlockDeletion
        );

    }


    // ---------------------------------------------
    // PASSWORD ENTER
    // ---------------------------------------------

    if (
        deletePassword
    ) {

        deletePassword.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    unlockDeletion();

                }

            }
        );

    }


    // ---------------------------------------------
    // SEARCH
    // ---------------------------------------------

    if (
        searchInput
    ) {

        searchInput.addEventListener(
            "input",
            renderStudents
        );

    }


    // ---------------------------------------------
    // FILTER
    // ---------------------------------------------

    if (
        categoryFilter
    ) {

        categoryFilter.addEventListener(
            "change",
            renderStudents
        );

    }


    // ---------------------------------------------
    // REFRESH
    // ---------------------------------------------

    if (
        refreshBtn
    ) {

        refreshBtn.addEventListener(
            "click",
            loadStudents
        );

    }


    // ---------------------------------------------
    // LOGOUT
    // ---------------------------------------------

    if (
        logoutBtn
    ) {

        logoutBtn.addEventListener(
            "click",
            logoutAdmin
        );

    }

}


// =====================================================
// UNLOCK DELETION
// =====================================================

function unlockDeletion() {

    if (
        !deletePassword
    ) {

        return;

    }


    const enteredPassword =
        String(
            deletePassword.value ||
            ""
        );


    if (
        passwordError
    ) {

        passwordError.textContent =
            "";

    }


    // ---------------------------------------------
    // EMPTY
    // ---------------------------------------------

    if (
        !enteredPassword
    ) {

        if (
            passwordError
        ) {

            passwordError.textContent =
                "Please enter the deletion password.";

        }


        deletePassword.focus();

        return;

    }


    // ---------------------------------------------
    // CHECK PASSWORD
    // ---------------------------------------------

    if (
        enteredPassword !==
        DELETE_PASSWORD
    ) {

        if (
            passwordError
        ) {

            passwordError.textContent =
                "Incorrect deletion password.";

        }


        deletePassword.value =
            "";


        deletePassword.focus();

        return;

    }


    // ---------------------------------------------
    // UNLOCK
    // ---------------------------------------------

    unlocked =
        true;


    if (
        passwordCard
    ) {

        passwordCard.style.display =
            "none";

    }


    if (
        reportPanel
    ) {

        reportPanel.style.display =
            "block";

    }


    loadStudents();

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    if (
        !unlocked
    ) {

        return;

    }


    if (
        studentTable
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading"
                >
                    Loading student accounts...
                </td>

            </tr>

        `;

    }


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        const snapshot =
            await getDocs(
                studentsRef
            );


        allStudents =
            [];


        snapshot.forEach(
            studentDocument => {

                allStudents.push({

                    id:
                        studentDocument.id,

                    data:
                        studentDocument.data()

                });

            }
        );


        // ---------------------------------------------
        // SORT BY STUDENT ID
        // ---------------------------------------------

        allStudents.sort(
            (
                first,
                second
            ) => {

                return String(
                    first.id
                )
                    .localeCompare(
                        String(
                            second.id
                        ),
                        undefined,
                        {
                            numeric:
                                true,
                            sensitivity:
                                "base"
                        }
                    );

            }
        );


        renderStudents();

    }

    catch (
        error
    ) {

        console.error(
            "================================"
        );

        console.error(
            "STUDENT LOAD ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        if (
            studentTable
        ) {

            studentTable.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="loading"
                        style="
                            color:#dc2626;
                        "
                    >
                        ❌ Unable to load students.
                        <br><br>
                        Check your Firestore permissions.
                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// GET STUDENT TYPE
// =====================================================

function getStudentType(
    student
) {

    const studentId =
        String(
            student?.id ||
            ""
        )
            .trim()
            .toUpperCase();


    const data =
        student?.data ||
        {};


    // ---------------------------------------------
    // FIREBASE studentType
    // ---------------------------------------------

    const firebaseType =
        String(
            data?.studentType ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        firebaseType ===
        "grade10"
        ||
        firebaseType ===
        "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseType ===
        "grade11"
        ||
        firebaseType ===
        "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseType ===
        "al"
        ||
        firebaseType ===
        "a/l"
        ||
        firebaseType ===
        "a level"
        ||
        firebaseType ===
        "advanced"
        ||
        firebaseType ===
        "advanced level"
    ) {

        return "al";

    }


    // ---------------------------------------------
    // FIREBASE grade
    // ---------------------------------------------

    const firebaseGrade =
        String(
            data?.grade ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        firebaseGrade ===
        "10"
        ||
        firebaseGrade ===
        "grade10"
        ||
        firebaseGrade ===
        "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseGrade ===
        "11"
        ||
        firebaseGrade ===
        "grade11"
        ||
        firebaseGrade ===
        "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseGrade ===
        "al"
        ||
        firebaseGrade ===
        "a/l"
        ||
        firebaseGrade ===
        "a level"
        ||
        firebaseGrade ===
        "advanced"
        ||
        firebaseGrade ===
        "advanced level"
    ) {

        return "al";

    }


    // ---------------------------------------------
    // A/L SERIES
    // ---------------------------------------------

    if (
        studentId.startsWith(
            "A27000"
        )
        ||
        studentId.startsWith(
            "A28000"
        )
        ||
        studentId.startsWith(
            "A29000"
        )
    ) {

        return "al";

    }


    // ---------------------------------------------
    // NUMERIC IDS
    // ---------------------------------------------

    if (
        /^\d{5}$/.test(
            studentId
        )
    ) {

        const number =
            Number(
                studentId
            );


        // Grade 11

        if (
            number >= 26000 &&
            number <= 26999
        ) {

            return "grade11";

        }


        // Grade 10

        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    // ---------------------------------------------
    // DEFAULT
    // ---------------------------------------------

    return "al";

}


// =====================================================
// GET SERIES
// =====================================================

function getSeries(
    studentId
) {

    const id =
        String(
            studentId ||
            ""
        )
            .trim()
            .toUpperCase();


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


    if (
        /^\d{5}$/.test(
            id
        )
    ) {

        const number =
            Number(
                id
            );


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


    return "-";

}


// =====================================================
// GET CATEGORY NAME
// =====================================================

function getCategoryName(
    student
) {

    const type =
        getStudentType(
            student
        );


    if (
        type ===
        "grade11"
    ) {

        return "Grade 11";

    }


    if (
        type ===
        "grade10"
    ) {

        return "Grade 10";

    }


    return "A/L";

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

        "-"

    );

}


// =====================================================
// GET STUDENT NIC
// =====================================================

function getStudentNIC(
    data
) {

    return (

        data?.nicNumber ||

        data?.nic ||

        data?.NIC ||

        data?.nicNo ||

        ""

    );

}


// =====================================================
// GET FILTERED STUDENTS
// =====================================================

function getFilteredStudents() {

    const search =
        String(
            searchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const filter =
        categoryFilter?.value ||
        "all";


    return allStudents.filter(
        student => {

            const id =
                String(
                    student.id ||
                    ""
                )
                    .trim()
                    .toUpperCase();


            const data =
                student.data ||
                {};


            const name =
                String(
                    getStudentName(
                        data
                    )
                );


            const nic =
                String(
                    getStudentNIC(
                        data
                    )
                );


            // -----------------------------------------
            // SEARCH
            // -----------------------------------------

            if (
                search
            ) {

                const searchable =
                    (
                        id +
                        " " +
                        name +
                        " " +
                        nic
                    )
                        .toLowerCase();


                if (
                    !searchable.includes(
                        search
                    )
                ) {

                    return false;

                }

            }


            // -----------------------------------------
            // ALL
            // -----------------------------------------

            if (
                filter ===
                "all"
            ) {

                return true;

            }


            // -----------------------------------------
            // A27000
            // -----------------------------------------

            if (
                filter ===
                "a27000"
            ) {

                return id.startsWith(
                    "A27000"
                );

            }


            // -----------------------------------------
            // A28000
            // -----------------------------------------

            if (
                filter ===
                "a28000"
            ) {

                return id.startsWith(
                    "A28000"
                );

            }


            // -----------------------------------------
            // A29000
            // -----------------------------------------

            if (
                filter ===
                "a29000"
            ) {

                return id.startsWith(
                    "A29000"
                );

            }


            // -----------------------------------------
            // A/L
            // -----------------------------------------

            if (
                filter ===
                "al"
            ) {

                return (

                    id.startsWith(
                        "A27000"
                    )

                    ||

                    id.startsWith(
                        "A28000"
                    )

                    ||

                    id.startsWith(
                        "A29000"
                    )

                );

            }


            // -----------------------------------------
            // GRADE 11
            // 26000 - 26999
            // -----------------------------------------

            if (
                filter ===
                "grade11"
            ) {

                if (
                    !/^\d{5}$/.test(
                        id
                    )
                ) {

                    return false;

                }


                const number =
                    Number(
                        id
                    );


                return (

                    number >=
                    26000

                    &&

                    number <=
                    26999

                );

            }


            // -----------------------------------------
            // GRADE 10
            // 27000 - 27999
            // -----------------------------------------

            if (
                filter ===
                "grade10"
            ) {

                if (
                    !/^\d{5}$/.test(
                        id
                    )
                ) {

                    return false;

                }


                const number =
                    Number(
                        id
                    );


                return (

                    number >=
                    27000

                    &&

                    number <=
                    27999

                );

            }


            return true;

        }
    );

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


    const filtered =
        getFilteredStudents();


    // ---------------------------------------------
    // COUNTS
    // ---------------------------------------------

    if (
        shownCount
    ) {

        shownCount.textContent =
            filtered.length;

    }


    if (
        resultCount
    ) {

        resultCount.textContent =

            filtered.length ===
            1

                ? "1 student"

                : filtered.length +
                  " students";

    }


    const totalAL =
        filtered.filter(
            student =>
                getStudentType(
                    student
                ) ===
                "al"
        ).length;


    const totalGrade =
        filtered.length -
        totalAL;


    if (
        alCount
    ) {

        alCount.textContent =
            totalAL;

    }


    if (
        gradeCount
    ) {

        gradeCount.textContent =
            totalGrade;

    }


    // ---------------------------------------------
    // EMPTY
    // ---------------------------------------------

    if (
        filtered.length ===
        0
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading"
                >
                    No students found.
                </td>

            </tr>

        `;

        return;

    }


    // ---------------------------------------------
    // TABLE
    // ---------------------------------------------

    studentTable.innerHTML =
        filtered
            .map(
                (
                    student,
                    index
                ) => {

                    const data =
                        student.data ||
                        {};


                    const studentId =
                        student.id;


                    const name =
                        getStudentName(
                            data
                        );


                    const category =
                        getCategoryName(
                            student
                        );


                    const series =
                        getSeries(
                            studentId
                        );


                    const type =
                        getStudentType(
                            student
                        );


                    const nic =
                        getStudentNIC(
                            data
                        );


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
                                        studentId
                                    )}
                                </span>

                            </td>


                            <td>
                                ${escapeHTML(
                                    name
                                )}

                                ${
                                    nic
                                    ? `
                                        <div
                                            style="
                                                margin-top:4px;
                                                color:#94a3b8;
                                                font-size:10px;
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
                                        ${type}
                                    "
                                >
                                    ${category}
                                </span>


                                <div
                                    style="
                                        margin-top:5px;
                                        color:#94a3b8;
                                        font-size:10px;
                                        font-weight:600;
                                    "
                                >
                                    Series:
                                    ${escapeHTML(
                                        series
                                    )}
                                </div>

                            </td>


                            <td>

                                <span
                                    style="
                                        color:#64748b;
                                        font-size:12px;
                                    "
                                >
                                    Protected
                                </span>

                            </td>


                            <td>

                                <button
                                    type="button"
                                    class="delete-btn"
                                    data-student-id="${escapeAttribute(
                                        studentId
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


    // ---------------------------------------------
    // DELETE BUTTONS
    // ---------------------------------------------

    document
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.getAttribute(
                                "data-student-id"
                            );


                        deleteStudent(
                            id
                        );

                    }
                );

            }
        );

}


// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(
    studentId
) {

    if (
        !unlocked
    ) {

        alert(
            "Deletion panel is locked."
        );

        return;

    }


    if (
        deletingStudent
    ) {

        return;

    }


    const student =
        allStudents.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    studentId
                )
        );


    if (
        !student
    ) {

        alert(
            "Student account was not found."
        );

        return;

    }


    const data =
        student.data ||
        {};


    const name =
        getStudentName(
            data
        );


    const category =
        getCategoryName(
            student
        );


    const series =
        getSeries(
            studentId
        );


    // ---------------------------------------------
    // FIRST CONFIRMATION
    // ---------------------------------------------

    const firstConfirm =
        window.confirm(

            "⚠️ PERMANENT STUDENT DELETION\n\n" +

            "Student ID: " +
            studentId +
            "\n\n" +

            "Student Name: " +
            name +
            "\n\n" +

            "Category: " +
            category +
            "\n\n" +

            "Series: " +
            series +
            "\n\n" +

            "This student account will be permanently " +
            "removed from the Firestore students collection.\n\n" +

            "Do you want to continue?"

        );


    if (
        !firstConfirm
    ) {

        return;

    }


    // ---------------------------------------------
    // SECOND CONFIRMATION
    // ---------------------------------------------

    const secondConfirm =
        window.confirm(

            "FINAL CONFIRMATION\n\n" +

            "Delete Student ID:\n" +

            studentId +

            "\n\n" +

            "This action CANNOT be undone.\n\n" +

            "Press OK to permanently delete."

        );


    if (
        !secondConfirm
    ) {

        return;

    }


    deletingStudent =
        true;


    try {

        // -----------------------------------------
        // FIRESTORE DOCUMENT
        // -----------------------------------------

        const studentReference =
            doc(
                db,
                "students",
                studentId
            );


        // -----------------------------------------
        // DELETE
        // -----------------------------------------

        await deleteDoc(
            studentReference
        );


        // -----------------------------------------
        // REMOVE FROM LOCAL ARRAY
        // -----------------------------------------

        allStudents =
            allStudents.filter(
                item =>
                    String(
                        item.id
                    ) !==
                    String(
                        studentId
                    )
            );


        // -----------------------------------------
        // REFRESH TABLE
        // -----------------------------------------

        renderStudents();


        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

        alert(

            "Student deleted successfully.\n\n" +

            "Student ID: " +
            studentId

        );

    }

    catch (
        error
    ) {

        console.error(
            "================================"
        );

        console.error(
            "STUDENT DELETE ERROR"
        );

        console.error(
            "Student ID:",
            studentId
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        let message =
            "Unable to delete the student.";


        // -----------------------------------------
        // FIRESTORE PERMISSION
        // -----------------------------------------

        if (
            error?.code ===
            "permission-denied"
        ) {

            message =
                "Firebase denied the delete operation.\n\n" +
                "Please check your Firestore Security Rules.";

        }


        // -----------------------------------------
        // NOT FOUND
        // -----------------------------------------

        if (
            error?.code ===
            "not-found"
        ) {

            message =
                "The student document was not found in Firebase.";

        }


        alert(
            message
        );

    }

    finally {

        deletingStudent =
            false;

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logoutAdmin() {

    const confirmLogout =
        window.confirm(
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
// HTML ESCAPE
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
// ATTRIBUTE ESCAPE
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
// START SYSTEM
// =====================================================

console.log(
    "========================================"
);

console.log(
    "🗑️ STUDENT DELETION SYSTEM"
);

console.log(
    "========================================"
);

console.log(
    "Super Admin:",
    isSuperAdmin()
);

console.log(
    "Admin Logged In:",
    isAdminLoggedIn()
);

console.log(
    "Deletion Protection: ACTIVE"
);

console.log(
    "========================================"
);


// =====================================================
// START
// =====================================================

if (
    !isAdminLoggedIn() ||
    !isSuperAdmin()
) {

    showAccessDenied();

}
else {

    initialise();

}
