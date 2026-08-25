// =====================================================
// STUDENT DELETION
// SUPER ADMIN ONLY
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


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let unlocked =
    false;


// =====================================================
// SESSION
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
            value
        ) {

            return value;

        }

    }


    return "";

}


// =====================================================
// SUPER ADMIN
// =====================================================

function isSuperAdmin() {

    const role =
        getSessionValue(
            "adminRole",
            "userRole",
            "role"
        )
            .trim()
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
// ADMIN LOGIN
// =====================================================

function isAdminLoggedIn() {

    return [

        sessionStorage.getItem(
            "adminLoggedIn"
        ),

        sessionStorage.getItem(
            "loggedIn"
        ),

        sessionStorage.getItem(
            "adminAuthenticated"
        )

    ]
    .some(
        value =>
            value === "true"
    );

}


// =====================================================
// ACCESS CHECK
// =====================================================

if (
    !isAdminLoggedIn() ||
    !isSuperAdmin()
) {

    document.body.innerHTML = `

        <div
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f4f6fb;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    background:#fff;
                    padding:45px 30px;
                    max-width:450px;
                    width:90%;
                    border-radius:20px;
                    text-align:center;
                    box-shadow:
                        0 20px 60px
                        rgba(15,23,42,.12);
                "
            >

                <div
                    style="
                        font-size:48px;
                    "
                >
                    🔒
                </div>

                <h2>
                    Access Restricted
                </h2>

                <p
                    style="
                        color:#64748b;
                        line-height:1.6;
                    "
                >
                    Student deletion is available
                    only to the Super Administrator.
                </p>

                <button
                    onclick="
                        window.location.href='admin.html'
                    "
                    style="
                        border:0;
                        padding:12px 20px;
                        border-radius:9px;
                        background:#7c3aed;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>

    `;

}
else {

    initialise();

}


// =====================================================
// INITIALISE
// =====================================================

function initialise() {

    const adminName =
        getSessionValue(
            "adminName",
            "username",
            "adminUsername"
        );


    const adminUsername =
        document.getElementById(
            "adminUsername"
        );


    const adminRole =
        document.getElementById(
            "adminRole"
        );


    if (
        adminUsername &&
        adminName
    ) {

        adminUsername.textContent =
            adminName;

    }


    if (
        adminRole
    ) {

        adminRole.textContent =
            "Super Administrator";

    }


    // ---------------------------------------------
    // PASSWORD
    // ---------------------------------------------

    unlockBtn?.addEventListener(
        "click",
        unlockDeletion
    );


    deletePassword?.addEventListener(
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


    // ---------------------------------------------
    // FILTERS
    // ---------------------------------------------

    searchInput?.addEventListener(
        "input",
        renderStudents
    );


    categoryFilter?.addEventListener(
        "change",
        renderStudents
    );


    refreshBtn?.addEventListener(
        "click",
        loadStudents
    );


    // ---------------------------------------------
    // LOGOUT
    // ---------------------------------------------

    logoutBtn?.addEventListener(
        "click",
        () => {

            sessionStorage.clear();

            window.location.href =
                "admin-login.html";

        }
    );

}


// =====================================================
// UNLOCK
// =====================================================

function unlockDeletion() {

    const password =
        deletePassword?.value ||
        "";


    passwordError.textContent =
        "";


    if (
        password !==
        DELETE_PASSWORD
    ) {

        passwordError.textContent =
            "Incorrect deletion password.";

        deletePassword.value =
            "";

        deletePassword.focus();

        return;

    }


    unlocked =
        true;


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

    if (
        !unlocked
    ) {

        return;

    }


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
            ) => {

                return String(
                    a.id
                ).localeCompare(
                    String(
                        b.id
                    ),
                    undefined,
                    {
                        numeric:
                            true
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
            "Student loading error:",
            error
        );


        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loading"
                >
                    ❌ Unable to load students.
                    Check Firebase permissions.
                </td>

            </tr>

        `;

    }

}


// =====================================================
// STUDENT TYPE
// =====================================================

function getStudentType(
    student
) {

    const id =
        String(
            student.id
        )
            .trim()
            .toUpperCase();


    const data =
        student.data;


    const firebaseType =
        String(
            data?.studentType ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        firebaseType === "grade10" ||
        firebaseType === "grade 10"
    ) {

        return "grade10";

    }


    if (
        firebaseType === "grade11" ||
        firebaseType === "grade 11"
    ) {

        return "grade11";

    }


    if (
        firebaseType === "al" ||
        firebaseType === "a/l" ||
        firebaseType === "a level" ||
        firebaseType === "advanced level"
    ) {

        return "al";

    }


    // ---------------------------------------------
    // A/L SERIAL
    // ---------------------------------------------

    if (
        /^A27000\d+$/.test(
            id
        ) ||
        /^A28000\d+$/.test(
            id
        ) ||
        /^A29000\d+$/.test(
            id
        )
    ) {

        return "al";

    }


    // ---------------------------------------------
    // NUMERIC SERIAL
    // ---------------------------------------------

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

            return "grade11";

        }


        if (
            number >= 27000 &&
            number <= 27999
        ) {

            return "grade10";

        }

    }


    return "al";

}


// =====================================================
// SERIES
// =====================================================

function getSeries(
    id
) {

    const clean =
        String(
            id
        )
            .trim()
            .toUpperCase();


    if (
        clean.startsWith(
            "A27000"
        )
    ) {

        return "A27000";

    }


    if (
        clean.startsWith(
            "A28000"
        )
    ) {

        return "A28000";

    }


    if (
        clean.startsWith(
            "A29000"
        )
    ) {

        return "A29000";

    }


    if (
        /^\d{5}$/.test(
            clean
        )
    ) {

        const number =
            Number(
                clean
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
// CATEGORY
// =====================================================

function getCategory(
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
// SEARCH + FILTER
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
                    student.id
                );


            const data =
                student.data;


            const name =
                String(
                    data?.name ||
                    data?.studentName ||
                    data?.fullName ||
                    data?.displayName ||
                    ""
                );


            const nic =
                String(
                    data?.nicNumber ||
                    data?.nic ||
                    ""
                );


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
                search &&
                !searchable.includes(
                    search
                )
            ) {

                return false;

            }


            const cleanId =
                id
                    .trim()
                    .toUpperCase();


            if (
                filter ===
                "a27000" &&
                !cleanId.startsWith(
                    "A27000"
                )
            ) {

                return false;

            }


            if (
                filter ===
                "a28000" &&
                !cleanId.startsWith(
                    "A28000"
                )
            ) {

                return false;

            }


            if (
                filter ===
                "a29000" &&
                !cleanId.startsWith(
                    "A29000"
                )
            ) {

                return false;

            }


            if (
                filter ===
                "grade11"
            ) {

                if (
                    !/^\d{5}$/.test(
                        cleanId
                    )
                ) {

                    return false;

                }


                const number =
                    Number(
                        cleanId
                    );


                if (
                    number < 26000 ||
                    number > 26999
                ) {

                    return false;

                }

            }


            if (
                filter ===
                "grade10"
            ) {

                if (
                    !/^\d{5}$/.test(
                        cleanId
                    )
                ) {

                    return false;

                }


                const number =
                    Number(
                        cleanId
                    );


                if (
                    number < 27000 ||
                    number > 27999
                ) {

                    return false;

                }

            }


            if (
                filter ===
                "al"
            ) {

                if (
                    !(
                        cleanId.startsWith(
                            "A27000"
                        ) ||
                        cleanId.startsWith(
                            "A28000"
                        ) ||
                        cleanId.startsWith(
                            "A29000"
                        )
                    )
                ) {

                    return false;

                }

            }


            return true;

        }
    );

}


// =====================================================
// RENDER
// =====================================================

function renderStudents() {

    const filtered =
        getFilteredStudents();


    shownCount.textContent =
        filtered.length;


    resultCount.textContent =
        filtered.length +
        (
            filtered.length ===
            1
                ? " student"
                : " students"
        );


    const al =
        filtered.filter(
            student =>
                getStudentType(
                    student
                ) ===
                "al"
        ).length;


    const grade =
        filtered.length -
        al;


    alCount.textContent =
        al;


    gradeCount.textContent =
        grade;


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


    studentTable.innerHTML =
        filtered
            .map(
                (
                    student,
                    index
                ) => {

                    const data =
                        student.data;


                    const name =
                        data?.name ||
                        data?.studentName ||
                        data?.fullName ||
                        data?.displayName ||
                        "-";


                    const type =
                        getStudentType(
                            student
                        );


                    const category =
                        getCategory(
                            student
                        );


                    const series =
                        getSeries(
                            student.id
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
                                        student.id
                                    )}
                                </span>

                            </td>


                            <td>
                                ${escapeHTML(
                                    name
                                )}
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
                                        margin-top:4px;
                                        color:#94a3b8;
                                        font-size:10px;
                                    "
                                >
                                    ${series}
                                </div>

                            </td>


                            <td>
                                ••••••••
                            </td>


                            <td>

                                <button
                                    type="button"
                                    class="delete-btn"
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
                                "data-id"
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
            "Student not found."
        );

        return;

    }


    const name =
        student.data?.name ||
        student.data?.studentName ||
        student.data?.fullName ||
        "Student";


    const confirmed =
        window.confirm(
            "WARNING!\n\n" +

            "You are about to permanently delete:\n\n" +

            "Student ID: " +
            studentId +
            "\n" +

            "Name: " +
            name +
            "\n\n" +

            "This action cannot be undone.\n\n" +

            "Click OK to permanently delete this student."
        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        await deleteDoc(
            studentRef
        );


        alert(
            "Student " +
            studentId +
            " has been deleted successfully."
        );


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


        renderStudents();

    }

    catch (
        error
    ) {

        console.error(
            "Student deletion error:",
            error
        );


        alert(
            "Unable to delete the student.\n\n" +
            "Firebase may have denied the delete operation."
        );

    }

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
