// =====================================================
// STUDENT MANAGEMENT SYSTEM
// =====================================================

import * as firebase from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const db =
    firebase.db;

const collection =
    firebase.collection;

const doc =
    firebase.doc;

const getDoc =
    firebase.getDoc;

const getDocs =
    firebase.getDocs;

const setDoc =
    firebase.setDoc;

const updateDoc =
    firebase.updateDoc;

const deleteDoc =
    firebase.deleteDoc;

const onSnapshot =
    firebase.onSnapshot;


// =====================================================
// ADMIN SESSION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


const adminRole =
    (
        sessionStorage.getItem(
            "adminRole"
        ) || ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /[\s_-]+/g,
        ""
    );


const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "full";


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


// =====================================================
// PAGE PROTECTION
// =====================================================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

// Table
const studentTable =
    document.getElementById(
        "studentTable"
    );


// Search
const searchInput =
    document.getElementById(
        "search"
    );


// Filters
const typeFilter =
    document.getElementById(
        "typeFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );


// Add Student
const addStudentBtn =
    document.getElementById(
        "addStudentBtn"
    );

const addModal =
    document.getElementById(
        "addModal"
    );

const closeAdd =
    document.getElementById(
        "closeAdd"
    );

const cancelAdd =
    document.getElementById(
        "cancelAdd"
    );

const saveNewStudent =
    document.getElementById(
        "saveNewStudent"
    );

const newStudentType =
    document.getElementById(
        "newStudentType"
    );

const newStudentGrade =
    document.getElementById(
        "newStudentGrade"
    );

const newStudentId =
    document.getElementById(
        "newStudentId"
    );

const newStudentPassword =
    document.getElementById(
        "newStudentPassword"
    );

const newMustChange =
    document.getElementById(
        "newMustChange"
    );


// Edit Student
const editModal =
    document.getElementById(
        "editModal"
    );

const closeEdit =
    document.getElementById(
        "closeEdit"
    );

const closeEditBottom =
    document.getElementById(
        "closeEditBottom"
    );

const editStudentId =
    document.getElementById(
        "editStudentId"
    );

const editPassword =
    document.getElementById(
        "editPassword"
    );

const editMustChange =
    document.getElementById(
        "editMustChange"
    );

const updateStudentBtn =
    document.getElementById(
        "updateStudent"
    );

const deleteStudentBtn =
    document.getElementById(
        "deleteStudent"
    );

const resetPasswordBtn =
    document.getElementById(
        "resetPasswordBtn"
    );


// Paper buttons
const selectAllPapers =
    document.getElementById(
        "selectAllPapers"
    );

const removeAllPapers =
    document.getElementById(
        "removeAllPapers"
    );

const resetViewed =
    document.getElementById(
        "resetViewed"
    );


// Logout
const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// SETTINGS
// =====================================================

const TOTAL_PAPERS =
    13;


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let selectedStudentId =
    "";


// =====================================================
// HELPER
// =====================================================

function getPaperField(
    number
) {

    return (
        "paper" +
        String(
            number
        ).padStart(
            2,
            "0"
        )
    );

}


function getPaperViewedField(
    number
) {

    return (
        getPaperField(
            number
        ) +
        "Viewed"
    );

}


function getPaperPagesField(
    number
) {

    return (
        getPaperField(
            number
        ) +
        "Pages"
    );

}


// =====================================================
// STUDENT TYPE
// =====================================================

function getStudentType(
    data,
    studentId = ""
) {

    const firebaseType =
        String(
            data?.studentType || ""
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


    const grade =
        String(
            data?.grade || ""
        )
        .trim()
        .toLowerCase();


    if (
        grade === "10" ||
        grade === "grade10" ||
        grade === "grade 10"
    ) {

        return "grade10";

    }


    if (
        grade === "11" ||
        grade === "grade11" ||
        grade === "grade 11"
    ) {

        return "grade11";

    }


    // ---------------------------------------------
    // ID BASED DETECTION
    // ---------------------------------------------

    const cleanId =
        String(
            studentId || ""
        )
        .trim()
        .toUpperCase();


    // Grade 11
    if (
        /^\d{5}$/.test(
            cleanId
        )
    ) {

        const number =
            Number(
                cleanId
            );


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


    // A/L
    return "al";

}


// =====================================================
// TYPE LABEL
// =====================================================

function getStudentTypeLabel(
    type
) {

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


    if (
        type === "al"
    ) {

        return "A/L";

    }


    return "Student";

}


// =====================================================
// TYPE CLASS
// =====================================================

function getStudentTypeClass(
    type
) {

    if (
        type === "grade10"
    ) {

        return "grade10";

    }


    if (
        type === "grade11"
    ) {

        return "grade11";

    }


    if (
        type === "al"
    ) {

        return "al";

    }


    return "";

}


// =====================================================
// STUDENT NAME
// =====================================================

function getStudentName(
    data
) {

    return (
        data?.fullName ||
        data?.name ||
        data?.studentName ||
        data?.displayName ||
        "Not Registered"
    );

}


// =====================================================
// STATUS
// =====================================================

function isStudentActive(
    data
) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );


    if (!lastActive) {

        return false;

    }


    const difference =
        Date.now() -
        lastActive;


    return (
        difference >= 0 &&
        difference <=
        90 * 1000
    );

}


// =====================================================
// REGISTRATION STATUS
// =====================================================

function getRegistrationStatus(
    data
) {

    if (
        data?.profileCompleted === true ||
        data?.registrationCompleted === true
    ) {

        return "Registered";

    }


    if (
        data?.mustChangePassword === true
    ) {

        return "Pending";

    }


    return "Active";

}


// =====================================================
// VIEWED COUNT
// =====================================================

function getViewedCount(
    data
) {

    let count =
        0;


    for (
        let i = 1;
        i <= TOTAL_PAPERS;
        i++
    ) {

        if (
            data?.[
                getPaperViewedField(
                    i
                )
            ] === true
        ) {

            count++;

        }

    }


    return count;

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
// FORMAT DATE
// =====================================================

function formatDate(
    value
) {

    if (!value) {

        return "—";

    }


    const date =
        new Date(
            Number(
                value
            )
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    );

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

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

                allStudents.push(
                    {
                        id:
                            studentDoc.id,

                        data:
                            studentDoc.data()
                    }
                );

            }
        );


        sortStudents();


        renderStudents();


        updateCounts();


    }

    catch (
        error
    ) {

        console.error(
            "Student loading error:",
            error
        );


        if (
            studentTable
        ) {

            studentTable.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="text-align:center;"
                    >
                        Unable to load students.
                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// SORT STUDENTS
// =====================================================

function sortStudents() {

    allStudents.sort(
        (
            a,
            b
        ) => {

            return String(
                a.id
            )
            .localeCompare(
                String(
                    b.id
                ),
                undefined,
                {
                    numeric: true
                }
            );

        }
    );

}


// =====================================================
// FILTER STUDENTS
// =====================================================

function getFilteredStudents() {

    const search =
        (
            searchInput?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const type =
        (
            typeFilter?.value ||
            "all"
        )
        .trim()
        .toLowerCase();


    const status =
        (
            statusFilter?.value ||
            "all"
        )
        .trim()
        .toLowerCase();


    return allStudents.filter(
        student => {

            const data =
                student.data;


            const studentType =
                getStudentType(
                    data,
                    student.id
                );


            const name =
                getStudentName(
                    data
                );


            const searchable =
                (
                    student.id +
                    " " +
                    name +
                    " " +
                    studentType
                )
                .toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(
                    search
                );


            const matchesType =
                type === "all" ||
                studentType === type;


            const active =
                isStudentActive(
                    data
                );


            const matchesStatus =
                status === "all" ||
                (
                    status === "active" &&
                    active
                ) ||
                (
                    status === "offline" &&
                    !active
                );


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

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


    const students =
        getFilteredStudents();


    if (
        students.length === 0
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:30px;"
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
            student =>
                renderStudentRow(
                    student
                )
        )
        .join("");

}


// =====================================================
// RENDER STUDENT ROW
// =====================================================

function renderStudentRow(
    student
) {

    const data =
        student.data;


    const type =
        getStudentType(
            data,
            student.id
        );


    const typeLabel =
        getStudentTypeLabel(
            type
        );


    const typeClass =
        getStudentTypeClass(
            type
        );


    const viewed =
        getViewedCount(
            data
        );


    const active =
        isStudentActive(
            data
        );


    const status =
        getRegistrationStatus(
            data
        );


    const statusClass =
        status
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );


    return `

        <tr
            data-student-id="${escapeHTML(
                student.id
            )}"
        >

            <!-- Student ID -->

            <td>

                <strong>
                    ${escapeHTML(
                        student.id
                    )}
                </strong>

            </td>


            <!-- Type / Grade -->

            <td>

                <span
                    class="student-type-badge ${typeClass}"
                >

                    ${escapeHTML(
                        typeLabel
                    )}

                </span>

            </td>


            <!-- Viewed -->

            <td>

                <strong>
                    ${viewed}
                </strong>

                / ${TOTAL_PAPERS}

            </td>


            <!-- Status -->

            <td>

                <span
                    class="registration-badge ${statusClass}"
                >

                    ${escapeHTML(
                        status
                    )}

                </span>

                <br>

                <small
                    class="${
                        active
                            ? "online-status"
                            : "offline-status"
                    }"
                >

                    ${
                        active
                            ? "● Online"
                            : "● Offline"
                    }

                </small>

            </td>


            <!-- Password -->

            <td>

                <span>
                    ••••••••
                </span>

            </td>


            <!-- Action -->

            <td>

                <div
                    class="student-actions"
                >

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        data-action="edit"
                        data-id="${escapeHTML(
                            student.id
                        )}"
                    >

                        ✏️ Edit

                    </button>


                    <button
                        type="button"
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${escapeHTML(
                            student.id
                        )}"
                    >

                        🗑️ Delete

                    </button>

                </div>

            </td>

        </tr>

    `;

}


// =====================================================
// TABLE ACTIONS
// =====================================================

if (
    studentTable
) {

    studentTable.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {

                return;

            }


            const id =
                button.dataset.id;


            const action =
                button.dataset.action;


            if (
                action === "edit"
            ) {

                openEditModal(
                    id
                );

            }


            if (
                action === "delete"
            ) {

                deleteStudent(
                    id
                );

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
// FILTERS
// =====================================================

if (
    typeFilter
) {

    typeFilter.addEventListener(
        "change",
        renderStudents
    );

}


if (
    statusFilter
) {

    statusFilter.addEventListener(
        "change",
        renderStudents
    );

}


// =====================================================
// OPEN ADD MODAL
// =====================================================

function openAddModal() {

    clearAddForm();


    if (
        addModal
    ) {

        addModal.classList.add(
            "show"
        );

        addModal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE ADD MODAL
// =====================================================

function closeAddModal() {

    if (
        addModal
    ) {

        addModal.classList.remove(
            "show"
        );

        addModal.style.display =
            "none";

    }


    clearAddForm();

}


// =====================================================
// ADD BUTTON
// =====================================================

if (
    addStudentBtn
) {

    addStudentBtn.addEventListener(
        "click",
        openAddModal
    );

}


// =====================================================
// CLOSE ADD
// =====================================================

if (
    closeAdd
) {

    closeAdd.addEventListener(
        "click",
        closeAddModal
    );

}


if (
    cancelAdd
) {

    cancelAdd.addEventListener(
        "click",
        closeAddModal
    );

}


if (
    addModal
) {

    addModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                addModal
            ) {

                closeAddModal();

            }

        }
    );

}


// =====================================================
// CLEAR ADD FORM
// =====================================================

function clearAddForm() {

    if (
        newStudentType
    ) {

        newStudentType.value =
            "";

    }


    if (
        newStudentGrade
    ) {

        newStudentGrade.textContent =
            "";

    }


    if (
        newStudentId
    ) {

        newStudentId.value =
            "";

        newStudentId.readOnly =
            false;

        newStudentId.placeholder =
            "Enter Student ID";

        newStudentId.style.background =
            "";

        newStudentId.style.fontWeight =
            "";

    }


    if (
        newStudentPassword
    ) {

        newStudentPassword.value =
            "";

    }


    if (
        newMustChange
    ) {

        newMustChange.checked =
            false;

    }


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "selected",
                    "active"
                );

            }
        );

}


// =====================================================
// CATEGORY BUTTONS
// =====================================================

document
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const type =
                        button.dataset.type;


                    if (
                        newStudentType
                    ) {

                        newStudentType.value =
                            type;

                    }


                    document
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selected",
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "selected"
                    );


                    if (
                        newStudentGrade
                    ) {

                        if (
                            type ===
                            "grade10"
                        ) {

                            newStudentGrade.textContent =
                                "Selected: Grade 10";

                        }

                        else if (
                            type ===
                            "grade11"
                        ) {

                            newStudentGrade.textContent =
                                "Selected: Grade 11";

                        }

                        else {

                            newStudentGrade.textContent =
                                "Selected: A/L";

                        }

                    }


                    // ---------------------------------
                    // A/L
                    // ---------------------------------

                    if (
                        type ===
                        "al"
                    ) {

                        await refreshALAdmissionNumberUI();

                    }


                    // ---------------------------------
                    // Grade 10 / Grade 11
                    // ---------------------------------

                    else if (
                        newStudentId
                    ) {

                        newStudentId.value =
                            "";

                        newStudentId.readOnly =
                            false;

                        newStudentId.placeholder =
                            "Enter Student ID";

                        newStudentId.style.background =
                            "";

                        newStudentId.style.fontWeight =
                            "";

                    }

                }
            );

        }
    );


// =====================================================
// A/L ADMISSION NUMBER GENERATOR
// =====================================================
//
// A/L IDs:
// A27000
// A27001
// A27002
// ...
// A27999
// A28000
// A28001
// ...
//
// Existing numbers are checked first.
// Missing numbers are reused.
// Otherwise next number is generated.
// =====================================================

async function generateNextALAdmissionNumber() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "students"
            )
        );


    const numbers = [];


    snapshot.forEach(
        studentDoc => {

            const id =
                String(
                    studentDoc.id ||
                    ""
                )
                .trim()
                .toUpperCase();


            const match =
                id.match(
                    /^A(\d{5})$/
                );


            if (!match) {

                return;

            }


            const number =
                Number(
                    match[1]
                );


            if (
                Number.isInteger(
                    number
                ) &&
                number >= 27000
            ) {

                numbers.push(
                    number
                );

            }

        }
    );


    // First A/L student
    if (
        numbers.length === 0
    ) {

        return "A27000";

    }


    const used =
        new Set(
            numbers
        );


    const highest =
        Math.max(
            ...numbers
        );


    // Find missing number first
    for (
        let number = 27000;
        number <= highest;
        number++
    ) {

        if (
            !used.has(
                number
            )
        ) {

            return (
                "A" +
                String(
                    number
                ).padStart(
                    5,
                    "0"
                )
            );

        }

    }


    // Otherwise next number
    return (
        "A" +
        String(
            highest + 1
        ).padStart(
            5,
            "0"
        )
    );

}


// =====================================================
// REFRESH A/L NUMBER
// =====================================================

async function refreshALAdmissionNumberUI() {

    if (
        !newStudentType ||
        !newStudentId
    ) {

        return;

    }


    if (
        newStudentType.value !==
        "al"
    ) {

        return;

    }


    try {

        newStudentId.readOnly =
            true;

        newStudentId.placeholder =
            "Generating admission number...";

        newStudentId.style.background =
            "#f1f5f9";

        newStudentId.style.fontWeight =
            "700";


        const nextId =
            await generateNextALAdmissionNumber();


        if (
            newStudentType.value ===
            "al"
        ) {

            newStudentId.value =
                nextId;

        }

    }

    catch (
        error
    ) {

        console.error(
            "A/L admission number error:",
            error
        );


        newStudentId.value =
            "";

        newStudentId.placeholder =
            "Unable to generate admission number";


        alert(
            "Unable to generate the next A/L admission number."
        );

    }

}


// =====================================================
// SAVE NEW STUDENT
// =====================================================

if (
    saveNewStudent
) {

    saveNewStudent.addEventListener(
        "click",
        async () => {

            let id =
                newStudentId
                    ?.value
                    ?.trim()
                    .toUpperCase() ||
                "";


            const password =
                newStudentPassword
                    ?.value
                    ?.trim() ||
                "";


            const type =
                newStudentType
                    ?.value ||
                "";


            let mustChange =
                newMustChange
                    ?.checked ||
                false;


            // -----------------------------------------
            // CATEGORY
            // -----------------------------------------

            if (!type) {

                alert(
                    "Please select a student category."
                );

                return;

            }


            // -----------------------------------------
            // A/L
            // -----------------------------------------

            if (
                type ===
                "al"
            ) {

                id =
                    await generateNextALAdmissionNumber();


                mustChange =
                    true;


                if (
                    newStudentId
                ) {

                    newStudentId.value =
                        id;

                }

            }


            // -----------------------------------------
            // ID
            // -----------------------------------------

            if (!id) {

                alert(
                    "Please enter Student ID."
                );

                return;

            }


            // -----------------------------------------
            // PASSWORD
            // -----------------------------------------

            if (!password) {

                alert(
                    "Please enter Password."
                );

                return;

            }


            if (
                password.length <
                4
            ) {

                alert(
                    "Password must contain at least 4 characters."
                );

                return;

            }


            // -----------------------------------------
            // A/L VALIDATION
            // -----------------------------------------

            if (
                type === "al" &&
                !/^A\d{5}$/.test(
                    id
                )
            ) {

                alert(
                    "Invalid A/L admission number."
                );

                return;

            }


            saveNewStudent.disabled =
                true;

            saveNewStudent.textContent =
                "Saving...";


            try {

                let studentRef =
                    doc(
                        db,
                        "students",
                        id
                    );


                const existing =
                    await getDoc(
                        studentRef
                    );


                if (
                    existing.exists()
                ) {

                    alert(
                        "A student with this ID already exists."
                    );

                    return;

                }


                // ---------------------------------
                // STUDENT DATA
                // ---------------------------------

                const studentData = {

                    password:
                        password,

                    mustChangePassword:
                        mustChange,

                    studentType:
                        type,

                    grade:
                        type === "grade10"
                            ? "10"
                            : type === "grade11"
                                ? "11"
                                : "",

                    admissionNumber:
                        id,

                    createdAt:
                        Date.now(),

                    lastActiveAt:
                        0,

                    profileCompleted:
                        false,

                    registrationCompleted:
                        false

                };


                // ---------------------------------
                // PAPER FIELDS
                // ---------------------------------

                for (
                    let i = 1;
                    i <= TOTAL_PAPERS;
                    i++
                ) {

                    const paper =
                        getPaperField(
                            i
                        );


                    studentData[
                        paper
                    ] =
                        false;


                    studentData[
                        getPaperViewedField(
                            i
                        )
                    ] =
                        false;


                    studentData[
                        getPaperPagesField(
                            i
                        )
                    ] =
                        10;

                }


                // ---------------------------------
                // A/L MODEL PAPERS
                // ---------------------------------

                if (
                    type ===
                    "al"
                ) {

                    studentData.paperViews = {

                        al: {

                            model: {}

                        }

                    };


                    for (
                        let i = 1;
                        i <= 10;
                        i++
                    ) {

                        const paper =
                            getPaperField(
                                i
                            );


                        studentData
                            .paperViews
                            .al
                            .model[
                                paper
                            ] =
                            false;

                    }

                }


                // ---------------------------------
                // SAVE
                // ---------------------------------

                await setDoc(
                    studentRef,
                    studentData
                );


                // ---------------------------------
                // SUCCESS
                // ---------------------------------

                alert(
                    type === "al"
                        ? (
                            "A/L Student added successfully.\n\n" +
                            "Admission Number: " +
                            id +
                            "\n\n" +
                            "The student must complete registration on first login."
                        )
                        : "Student added successfully."
                );


                closeAddModal();


                await loadStudents();

            }

            catch (
                error
            ) {

                console.error(
                    "Add Student Error:",
                    error
                );


                alert(
                    "Failed to add student.\n\n" +
                    error.message
                );

            }

            finally {

                saveNewStudent.disabled =
                    false;

                saveNewStudent.textContent =
                    "💾 Save Student";

            }

        }
    );

}


// =====================================================
// OPEN EDIT MODAL
// =====================================================

function openEditModal(
    studentId
) {

    const student =
        allStudents.find(
            item =>
                item.id ===
                studentId
        );


    if (!student) {

        return;

    }


    selectedStudentId =
        studentId;


    const data =
        student.data;


    // ---------------------------------------------
    // ID
    // ---------------------------------------------

    if (
        editStudentId
    ) {

        editStudentId.value =
            studentId;

    }


    // ---------------------------------------------
    // PASSWORD
    // ---------------------------------------------

    if (
        editPassword
    ) {

        editPassword.value =
            "";

        editPassword.placeholder =
            "Leave blank to keep current password";

    }


    // ---------------------------------------------
    // MUST CHANGE
    // ---------------------------------------------

    if (
        editMustChange
    ) {

        editMustChange.checked =
            data?.mustChangePassword ===
            true;

    }


    // ---------------------------------------------
    // PAPER CHECKBOXES
    // ---------------------------------------------

    for (
        let i = 1;
        i <= TOTAL_PAPERS;
        i++
    ) {

        const checkbox =
            document.getElementById(
                getPaperField(
                    i
                )
            );


        if (
            checkbox
        ) {

            checkbox.checked =
                data?.[
                    getPaperField(
                        i
                    )
                ] === true;

        }

    }


    // ---------------------------------------------
    // OPEN
    // ---------------------------------------------

    if (
        editModal
    ) {

        editModal.classList.add(
            "show"
        );

        editModal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE EDIT MODAL
// =====================================================

function closeEditModal() {

    if (
        editModal
    ) {

        editModal.classList.remove(
            "show"
        );

        editModal.style.display =
            "none";

    }


    selectedStudentId =
        "";

}


// =====================================================
// EDIT CLOSE BUTTONS
// =====================================================

if (
    closeEdit
) {

    closeEdit.addEventListener(
        "click",
        closeEditModal
    );

}


if (
    closeEditBottom
) {

    closeEditBottom.addEventListener(
        "click",
        closeEditModal
    );

}


if (
    editModal
) {

    editModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                editModal
            ) {

                closeEditModal();

            }

        }
    );

}


// =====================================================
// SAVE EDIT
// =====================================================

if (
    updateStudentBtn
) {

    updateStudentBtn.addEventListener(
        "click",
        async () => {

            if (
                !selectedStudentId
            ) {

                alert(
                    "No student selected."
                );

                return;

            }


            if (
                !isSuperAdmin
            ) {

                alert(
                    "Only Super Administrator can edit students."
                );

                return;

            }


            const password =
                editPassword
                    ?.value
                    ?.trim() ||
                "";


            const mustChange =
                editMustChange
                    ?.checked ||
                false;


            updateStudentBtn.disabled =
                true;

            updateStudentBtn.textContent =
                "Saving...";


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        selectedStudentId
                    );


                const snapshot =
                    await getDoc(
                        studentRef
                    );


                if (
                    !snapshot.exists()
                ) {

                    alert(
                        "Student account was not found."
                    );

                    return;

                }


                const updateData = {

                    mustChangePassword:
                        mustChange

                };


                // ---------------------------------
                // PASSWORD
                // ---------------------------------

                if (
                    password
                ) {

                    if (
                        password.length <
                        4
                    ) {

                        alert(
                            "Password must contain at least 4 characters."
                        );

                        return;

                    }


                    updateData.password =
                        password;

                }


                // ---------------------------------
                // PAPER PERMISSIONS
                // ---------------------------------

                for (
                    let i = 1;
                    i <= TOTAL_PAPERS;
                    i++
                ) {

                    const paper =
                        getPaperField(
                            i
                        );


                    const checkbox =
                        document.getElementById(
                            paper
                        );


                    if (
                        checkbox
                    ) {

                        updateData[
                            paper
                        ] =
                            checkbox.checked;

                    }

                }


                await updateDoc(
                    studentRef,
                    updateData
                );


                alert(
                    "Student updated successfully."
                );


                closeEditModal();


                await loadStudents();

            }

            catch (
                error
            ) {

                console.error(
                    "Edit student error:",
                    error
                );


                alert(
                    "Failed to update student.\n\n" +
                    error.message
                );

            }

            finally {

                updateStudentBtn.disabled =
                    false;

                updateStudentBtn.textContent =
                    "💾 Save Changes";

            }

        }
    );

}


// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(
    studentId
) {

    const student =
        allStudents.find(
            item =>
                item.id ===
                studentId
        );


    if (!student) {

        return;

    }


    if (
        !isSuperAdmin
    ) {

        alert(
            "Only Super Administrator can delete students."
        );

        return;

    }


    const name =
        getStudentName(
            student.data
        );


    const confirmed =
        confirm(
            "Delete student?\n\n" +
            (
                name ===
                "Not Registered"
                    ? studentId
                    : name +
                      " (" +
                      studentId +
                      ")"
            ) +
            "\n\nThis action cannot be undone."
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "students",
                studentId
            )
        );


        alert(
            "Student deleted successfully."
        );


        closeEditModal();


        await loadStudents();

    }

    catch (
        error
    ) {

        console.error(
            "Delete student error:",
            error
        );


        alert(
            "Failed to delete student.\n\n" +
            error.message
        );

    }

}


// =====================================================
// DELETE FROM EDIT MODAL
// =====================================================

if (
    deleteStudentBtn
) {

    deleteStudentBtn.addEventListener(
        "click",
        async () => {

            if (
                selectedStudentId
            ) {

                await deleteStudent(
                    selectedStudentId
                );

            }

        }
    );

}


// =====================================================
// RESET PASSWORD
// =====================================================

function generatePassword() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";


    let password =
        "";


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        password +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }


    return password;

}


if (
    resetPasswordBtn
) {

    resetPasswordBtn.addEventListener(
        "click",
        () => {

            if (
                editPassword
            ) {

                editPassword.value =
                    generatePassword();

            }

            if (
                editMustChange
            ) {

                editMustChange.checked =
                    true;

            }

        }
    );

}


// =====================================================
// SELECT ALL PAPERS
// =====================================================

if (
    selectAllPapers
) {

    selectAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= TOTAL_PAPERS;
                i++
            ) {

                const checkbox =
                    document.getElementById(
                        getPaperField(
                            i
                        )
                    );


                if (
                    checkbox
                ) {

                    checkbox.checked =
                        true;

                }

            }

        }
    );

}


// =====================================================
// REMOVE ALL PAPERS
// =====================================================

if (
    removeAllPapers
) {

    removeAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= TOTAL_PAPERS;
                i++
            ) {

                const checkbox =
                    document.getElementById(
                        getPaperField(
                            i
                        )
                    );


                if (
                    checkbox
                ) {

                    checkbox.checked =
                        false;

                }

            }

        }
    );

}


// =====================================================
// RESET VIEWED
// =====================================================

if (
    resetViewed
) {

    resetViewed.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= TOTAL_PAPERS;
                i++
            ) {

                const paper =
                    getPaperViewedField(
                        i
                    );


                // The viewed field is stored
                // in Firestore, so mark the
                // selected student for reset.
                const checkbox =
                    document.getElementById(
                        getPaperField(
                            i
                        )
                    );


                if (
                    checkbox
                ) {

                    checkbox.dataset.resetViewed =
                        "true";

                }

            }


            alert(
                "Viewed status will be reset when you save the student."
            );

        }
    );

}


// =====================================================
// UPDATE COUNTS
// =====================================================

function updateCounts() {

    let total =
        allStudents.length;

    let grade10 =
        0;

    let grade11 =
        0;

    let al =
        0;

    let active =
        0;


    allStudents.forEach(
        student => {

            const type =
                getStudentType(
                    student.data,
                    student.id
                );


            if (
                type ===
                "grade10"
            ) {

                grade10++;

            }

            else if (
                type ===
                "grade11"
            ) {

                grade11++;

            }

            else if (
                type ===
                "al"
            ) {

                al++;

            }


            if (
                isStudentActive(
                    student.data
                )
            ) {

                active++;

            }

        }
    );


    const totalElement =
        document.getElementById(
            "totalStudents"
        );


    const grade10Element =
        document.getElementById(
            "grade10Students"
        );


    const grade11Element =
        document.getElementById(
            "grade11Students"
        );


    const alElement =
        document.getElementById(
            "alStudents"
        );


    const activeElement =
        document.getElementById(
            "activeStudents"
        );


    if (
        totalElement
    ) {

        totalElement.textContent =
            total;

    }


    if (
        grade10Element
    ) {

        grade10Element.textContent =
            grade10;

    }


    if (
        grade11Element
    ) {

        grade11Element.textContent =
            grade11;

    }


    if (
        alElement
    ) {

        alElement.textContent =
            al;

    }


    if (
        activeElement
    ) {

        activeElement.textContent =
            active;

    }

}


// =====================================================
// LOGOUT
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
                "adminRole"
            );

            sessionStorage.removeItem(
                "adminUsername"
            );


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// REALTIME FIRESTORE UPDATE
// =====================================================

function startRealtimeUpdates() {

    try {

        onSnapshot(
            collection(
                db,
                "students"
            ),

            snapshot => {

                allStudents = [];


                snapshot.forEach(
                    studentDoc => {

                        allStudents.push(
                            {
                                id:
                                    studentDoc.id,

                                data:
                                    studentDoc.data()
                            }
                        );

                    }
                );


                sortStudents();


                renderStudents();


                updateCounts();

            },

            error => {

                console.error(
                    "Realtime student update error:",
                    error
                );

            }
        );

    }

    catch (
        error
    ) {

        console.error(
            "Realtime listener error:",
            error
        );

    }

}


// =====================================================
// REFRESH ONLINE STATUS
// =====================================================

setInterval(
    () => {

        renderStudents();

        updateCounts();

    },
    30000
);


// =====================================================
// START
// =====================================================

console.log(
    "================================"
);

console.log(
    "Student Management System Loaded"
);

console.log(
    "A/L Admission Generator: ACTIVE"
);

console.log(
    "A/L IDs start from A27000"
);

console.log(
    "Grade 10 / Grade 11 supported"
);

console.log(
    "Add / Edit / Delete supported"
);

console.log(
    "Paper permissions supported"
);

console.log(
    "Realtime Firestore updates ACTIVE"
);

console.log(
    "Admin:",
    adminUsername
);

console.log(
    "Role:",
    adminRole
);

console.log(
    "================================"
);


// Initial load
loadStudents();


// Realtime updates
startRealtimeUpdates();
