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
// CONFIG
// =====================================================

const DELETE_PASSWORD =
    "Nimeth";


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let unlocked = false;

let deleteRunning = false;


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

const resultCount =
    document.getElementById(
        "resultCount"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// SESSION
// =====================================================

function getSessionValue(...keys) {

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
// ADMIN ROLE
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
// SUPER ADMIN
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
// ADMIN LOGIN
// =====================================================

function isAdminLoggedIn() {

    return [

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

    ].some(
        value =>
            value === "true"
    );

}


// =====================================================
// ACCESS DENIED
// =====================================================

function accessDenied() {

    document.body.innerHTML = `

        <div
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f4f6fb;
                font-family:Arial,sans-serif;
                padding:20px;
            "
        >

            <div
                style="
                    max-width:450px;
                    width:100%;
                    background:white;
                    border-radius:20px;
                    padding:40px;
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
                    Only the Super Administrator
                    can access Student Deletion.
                </p>

                <button
                    id="backBtn"
                    style="
                        border:0;
                        background:#7c3aed;
                        color:white;
                        padding:12px 20px;
                        border-radius:9px;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>

    `;


    document
        .getElementById(
            "backBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "admin.html";

            }
        );

}


// =====================================================
// INITIALISE
// =====================================================

function initialise() {

    const adminUsername =
        document.getElementById(
            "adminUsername"
        );

    const adminRole =
        document.getElementById(
            "adminRole"
        );


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


    unlockBtn?.addEventListener(
        "click",
        unlock
    );


    deletePassword?.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                unlock();

            }

        }
    );


    searchInput?.addEventListener(
        "input",
        render
    );


    categoryFilter?.addEventListener(
        "change",
        render
    );


    refreshBtn?.addEventListener(
        "click",
        loadStudents
    );


    logoutBtn?.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Are you sure you want to sign out?"
                )
            ) {

                sessionStorage.clear();

                window.location.href =
                    "admin-login.html";

            }

        }
    );


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


    document
        .getElementById(
            "deleteAllAL"
        )
        ?.addEventListener(
            "click",
            () => {

                deleteAllAL();

            }
        );

}


// =====================================================
// UNLOCK
// =====================================================

function unlock() {

    const password =
        deletePassword?.value ||
        "";


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


        deletePassword.value =
            "";

        deletePassword.focus();

        return;

    }


    if (
        passwordError
    ) {

        passwordError.textContent =
            "";

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
                            true,
                        sensitivity:
                            "base"
                    }
                );

            }
        );


        updateTotals();

        render();

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
                    style="color:#dc2626"
                >
                    ❌ Unable to load students.
                    <br><br>
                    Check Firebase Firestore permissions.
                </td>

            </tr>

        `;

    }

}


// =====================================================
// GET STUDENT TYPE
// =====================================================

function getType(
    student
) {

    const id =
        String(
            student.id
        )
            .trim()
            .toUpperCase();


    const data =
        student.data ||
        {};


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


    if (
        id.startsWith(
            "A27000"
        ) ||
        id.startsWith(
            "A28000"
        ) ||
        id.startsWith(
            "A29000"
        )
    ) {

        return "al";

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
// UPDATE TOTALS
// =====================================================

function updateTotals() {

    const totalA27000 =
        allStudents.filter(
            student =>
                getSeries(
                    student.id
                ) ===
                "A27000"
        ).length;


    const totalA28000 =
        allStudents.filter(
            student =>
                getSeries(
                    student.id
                ) ===
                "A28000"
        ).length;


    const totalA29000 =
        allStudents.filter(
            student =>
                getSeries(
                    student.id
                ) ===
                "A29000"
        ).length;


    const total26000 =
        allStudents.filter(
            student =>
                getSeries(
                    student.id
                ) ===
                "26000"
        ).length;


    const total27000 =
        allStudents.filter(
            student =>
                getSeries(
                    student.id
                ) ===
                "27000"
        ).length;


    const currentAL =
        totalA27000 +
        totalA28000 +
        totalA29000;


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
        "currentALTotal",
        currentAL
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
// GET NAME
// =====================================================

function getName(
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

        ""

    );

}


// =====================================================
// CATEGORY
// =====================================================

function getCategory(
    student
) {

    const type =
        getType(
            student
        );


    if (
        type ===
        "grade10"
    ) {

        return "Grade 10";

    }


    if (
        type ===
        "grade11"
    ) {

        return "Grade 11";

    }


    return "A/L";

}


// =====================================================
// FILTER
// =====================================================

function getFiltered() {

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
                )
                    .trim()
                    .toUpperCase();


            const data =
                student.data ||
                {};


            const name =
                getName(
                    data
                );


            const nic =
                getNIC(
                    data
                );


            if (
                search
            ) {

                const text =
                    (
                        id +
                        " " +
                        name +
                        " " +
                        nic
                    )
                        .toLowerCase();


                if (
                    !text.includes(
                        search
                    )
                ) {

                    return false;

                }

            }


            if (
                filter ===
                "all"
            ) {

                return true;

            }


            if (
                filter ===
                "al"
            ) {

                return (

                    id.startsWith(
                        "A27000"
                    ) ||

                    id.startsWith(
                        "A28000"
                    ) ||

                    id.startsWith(
                        "A29000"
                    )

                );

            }


            if (
                filter ===
                "a27000"
            ) {

                return id.startsWith(
                    "A27000"
                );

            }


            if (
                filter ===
                "a28000"
            ) {

                return id.startsWith(
                    "A28000"
                );

            }


            if (
                filter ===
                "a29000"
            ) {

                return id.startsWith(
                    "A29000"
                );

            }


            if (
                filter ===
                "grade11"
            ) {

                const number =
                    Number(
                        id
                    );


                return (
                    /^\d{5}$/.test(id) &&
                    number >= 26000 &&
                    number <= 26999
                );

            }


            if (
                filter ===
                "grade10"
            ) {

                const number =
                    Number(
                        id
                    );


                return (
                    /^\d{5}$/.test(id) &&
                    number >= 27000 &&
                    number <= 27999
                );

            }


            return true;

        }
    );

}


// =====================================================
// RENDER
// =====================================================

function render() {

    const students =
        getFiltered();


    if (
        resultCount
    ) {

        resultCount.textContent =

            students.length +
            (
                students.length === 1
                    ? " student"
                    : " students"
            );

    }


    if (
        students.length ===
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
        students
            .map(
                (
                    student,
                    index
                ) => {

                    const name =
                        getName(
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


                    const type =
                        getType(
                            student
                        );


                    const nic =
                        getNIC(
                            student.data
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

                                ${
                                    nic
                                        ? `
                                            <div
                                                style="
                                                    margin-top:4px;
                                                    font-size:10px;
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
                                        ${type}
                                    "
                                >
                                    ${category}
                                </span>

                            </td>


                            <td>
                                ${series}
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


    document
        .querySelectorAll(
            ".delete-btn"
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
        deleteRunning
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
        getName(
            student.data
        );


    const series =
        getSeries(
            studentId
        );


    const first =
        confirm(

            "⚠️ DELETE STUDENT\n\n" +

            "Student ID: " +
            studentId +
            "\n" +

            "Name: " +
            name +
            "\n" +

            "Series: " +
            series +
            "\n\n" +

            "This action cannot be undone.\n\n" +

            "Continue?"

        );


    if (
        !first
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


    await performDelete(
        [
            student
        ],
        "Student deleted successfully."
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
        students.length ===
        0
    ) {

        alert(
            "There are no students in " +
            series +
            "."
        );

        return;

    }


    const first =
        confirm(

            "⚠️ DELETE ENTIRE SERIES\n\n" +

            "Series: " +
            series +
            "\n" +

            "Students: " +
            students.length +
            "\n\n" +

            "ALL students in this series " +
            "will be permanently deleted.\n\n" +

            "Continue?"

        );


    if (
        !first
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


    await performDelete(
        students,
        series +
        " series deleted successfully."
    );

}


// =====================================================
// DELETE ALL A/L
// =====================================================

async function deleteAllAL() {

    const students =
        allStudents.filter(
            student => {

                const series =
                    getSeries(
                        student.id
                    );


                return (

                    series ===
                    "A27000"

                    ||

                    series ===
                    "A28000"

                    ||

                    series ===
                    "A29000"

                );

            }
        );


    if (
        students.length ===
        0
    ) {

        alert(
            "There are no current A/L students."
        );

        return;

    }


    const first =
        confirm(

            "⚠️ DELETE ALL CURRENT A/L STUDENTS\n\n" +

            "A27000: " +
            countSeries(
                "A27000"
            ) +

            "\nA28000: " +
            countSeries(
                "A28000"
            ) +

            "\nA29000: " +
            countSeries(
                "A29000"
            ) +

            "\n\nTOTAL A/L: " +
            students.length +

            "\n\n" +

            "ALL current A/L student accounts " +
            "will be permanently deleted.\n\n" +

            "Continue?"

        );


    if (
        !first
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


    await performDelete(
        students,
        "All current A/L students deleted successfully."
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
// PERFORM DELETE
// =====================================================

async function performDelete(
    students,
    successMessage
) {

    if (
        deleteRunning
    ) {

        return;

    }


    deleteRunning =
        true;


    try {

        let deleted =
            0;


        for (
            const student of students
        ) {

            const reference =
                doc(
                    db,
                    "students",
                    student.id
                );


            await deleteDoc(
                reference
            );


            deleted++;

        }


        // ---------------------------------------------
        // REMOVE LOCALLY
        // ---------------------------------------------

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


        updateTotals();

        render();


        alert(

            successMessage +

            "\n\nDeleted: " +
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


        if (
            error?.code ===
            "permission-denied"
        ) {

            alert(
                "Firebase denied the delete operation.\n\n" +
                "Please check Firestore Security Rules."
            );

        }
        else {

            alert(
                "Unable to complete the deletion.\n\n" +
                error.message
            );

        }

    }

    finally {

        deleteRunning =
            false;

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


// =====================================================
// START
// =====================================================

console.log(
    "===================================="
);

console.log(
    "🗑️ STUDENT DELETION SYSTEM"
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
    "===================================="
);


if (
    !isAdminLoggedIn() ||
    !isSuperAdmin()
) {

    accessDenied();

}
else {

    initialise();

}
