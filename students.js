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
// SESSION
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

// -----------------------------------------------------
// STUDENT TABLE
// -----------------------------------------------------

const studentsTableBody =
    document.getElementById(
        "studentsTableBody"
    );


// -----------------------------------------------------
// SEARCH
// -----------------------------------------------------

const searchInput =
    document.getElementById(
        "searchInput"
    );


// -----------------------------------------------------
// FILTER
// -----------------------------------------------------

const typeFilter =
    document.getElementById(
        "typeFilter"
    );


// -----------------------------------------------------
// ADD STUDENT
// -----------------------------------------------------

const addStudentBtn =
    document.getElementById(
        "addStudentBtn"
    );


const addStudentModal =
    document.getElementById(
        "addStudentModal"
    );


const closeAddModalBtn =
    document.getElementById(
        "closeAddModal"
    );


const cancelAddBtn =
    document.getElementById(
        "cancelAddBtn"
    );


const saveNewStudent =
    document.getElementById(
        "saveNewStudent"
    );


const newStudentId =
    document.getElementById(
        "newStudentId"
    );


const newStudentPassword =
    document.getElementById(
        "newStudentPassword"
    );


const newStudentType =
    document.getElementById(
        "newStudentType"
    );


const newStudentGrade =
    document.getElementById(
        "newStudentGrade"
    );


const newMustChange =
    document.getElementById(
        "newMustChange"
    );


// -----------------------------------------------------
// DELETE MODAL
// -----------------------------------------------------

const deleteModal =
    document.getElementById(
        "deleteModal"
    );


const closeDeleteModalBtn =
    document.getElementById(
        "closeDeleteModal"
    );


const cancelDeleteBtn =
    document.getElementById(
        "cancelDeleteBtn"
    );


const confirmDeleteBtn =
    document.getElementById(
        "confirmDeleteBtn"
    );


const deleteStudentName =
    document.getElementById(
        "deleteStudentName"
    );


// -----------------------------------------------------
// EDIT MODAL
// -----------------------------------------------------

const editModal =
    document.getElementById(
        "editModal"
    );


const closeEditModalBtn =
    document.getElementById(
        "closeEditModal"
    );


const cancelEditBtn =
    document.getElementById(
        "cancelEditBtn"
    );


const saveEditBtn =
    document.getElementById(
        "saveEditBtn"
    );


const editStudentId =
    document.getElementById(
        "editStudentId"
    );


const editPassword =
    document.getElementById(
        "editPassword"
    );


const editType =
    document.getElementById(
        "editType"
    );


const editGrade =
    document.getElementById(
        "editGrade"
    );


const editMustChange =
    document.getElementById(
        "editMustChange"
    );


// =====================================================
// SETTINGS
// =====================================================

const TOTAL_PAPERS =
    13;


const AL_MODEL_PAPERS =
    10;


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let selectedStudentId =
    "";

let selectedEditStudentId =
    "";


// =====================================================
// HELPER
// =====================================================

function getStudentType(
    data
) {

    const type =
        String(
            data?.studentType || ""
        )
        .trim()
        .toLowerCase();


    if (
        type === "grade10" ||
        type === "grade 10"
    ) {

        return "grade10";

    }


    if (
        type === "grade11" ||
        type === "grade 11"
    ) {

        return "grade11";

    }


    if (
        type === "al" ||
        type === "a/l" ||
        type === "a level" ||
        type === "advanced level"
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
// REGISTRATION STATUS
// =====================================================

function getRegistrationStatus(
    data
) {

    if (
        data?.profileCompleted === true ||
        data?.registrationCompleted === true
    ) {

        return {

            text:
                "Registered",

            className:
                "registered"

        };

    }


    if (
        data?.mustChangePassword === true
    ) {

        return {

            text:
                "Pending Registration",

            className:
                "pending"

        };

    }


    return {

        text:
            "Active",

        className:
            "active"

    };

}


// =====================================================
// PAPER FIELD
// =====================================================

function getPaperField(
    number
) {

    return (
        "paper" +
        String(
            number
        )
        .padStart(
            2,
            "0"
        )
    );

}


// =====================================================
// PAPER VIEWED FIELD
// =====================================================

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


// =====================================================
// PAPER PAGES FIELD
// =====================================================

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
// GET PAPER VIEW COUNT
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
// ACTIVE STATUS
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
// SET TEXT
// =====================================================

function setText(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        String(
            value
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


        const students = [];


        snapshot.forEach(
            studentDoc => {

                students.push({

                    id:
                        studentDoc.id,

                    data:
                        studentDoc.data()

                });

            }
        );


        allStudents =
            students;


        renderStudents();

        updateStudentCount();

    }

    catch (error) {

        console.error(
            "Student loading error:",
            error
        );


        if (
            studentsTableBody
        ) {

            studentsTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="10"
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
// UPDATE STUDENT COUNT
// =====================================================

function updateStudentCount() {

    const countElements =
        document.querySelectorAll(
            "[data-student-count]"
        );


    countElements.forEach(
        element => {

            element.textContent =
                allStudents.length;

        }
    );


    const totalElement =
        document.getElementById(
            "totalStudents"
        );


    if (totalElement) {

        totalElement.textContent =
            allStudents.length;

    }

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


    const filter =
        (
            typeFilter?.value ||
            "all"
        )
        .trim()
        .toLowerCase();


    return allStudents.filter(
        student => {

            const data =
                student.data;


            const type =
                getStudentType(
                    data
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
                    type
                )
                .toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(
                    search
                );


            const matchesType =
                filter === "all" ||
                type === filter;


            return (
                matchesSearch &&
                matchesType
            );

        }
    );

}


// =====================================================
// RENDER STUDENTS
// =====================================================

function renderStudents() {

    if (
        !studentsTableBody
    ) {

        return;

    }


    const students =
        getFilteredStudents();


    if (
        students.length ===
        0
    ) {

        studentsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="text-align:center;"
                >

                    No students found.

                </td>

            </tr>

        `;


        return;

    }


    studentsTableBody.innerHTML =
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
            data
        );


    const typeLabel =
        getStudentTypeLabel(
            type
        );


    const typeClass =
        getStudentTypeClass(
            type
        );


    const name =
        getStudentName(
            data
        );


    const status =
        getRegistrationStatus(
            data
        );


    const active =
        isStudentActive(
            data
        );


    const viewed =
        getViewedCount(
            data
        );


    const grade =
        data?.grade ||
        (
            type === "grade10"
                ? "10"
                : type === "grade11"
                    ? "11"
                    : "A/L"
        );


    return `

        <tr
            data-student-id="${escapeHTML(student.id)}"
        >

            <td>

                <strong>
                    ${escapeHTML(student.id)}
                </strong>

            </td>


            <td>

                <div
                    class="student-name-cell"
                >

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                </div>

            </td>


            <td>

                <span
                    class="student-type-badge ${typeClass}"
                >

                    ${escapeHTML(typeLabel)}

                </span>

            </td>


            <td>

                ${escapeHTML(grade)}

            </td>


            <td>

                <span
                    class="registration-badge ${status.className}"
                >

                    ${escapeHTML(status.text)}

                </span>

            </td>


            <td>

                <span
                    class="${
                        active
                            ? "online-status"
                            : "offline-status"
                    }"
                >

                    <span></span>

                    ${
                        active
                            ? "Online"
                            : "Offline"
                    }

                </span>

            </td>


            <td>

                ${viewed}

            </td>


            <td>

                ${formatDate(
                    data?.createdAt
                )}

            </td>


            <td>

                <div
                    class="student-actions"
                >

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        data-action="edit"
                        data-id="${escapeHTML(student.id)}"
                    >

                        ✏️

                        Edit

                    </button>


                    <button
                        type="button"
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${escapeHTML(student.id)}"
                    >

                        🗑️

                        Delete

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
    studentsTableBody
) {

    studentsTableBody.addEventListener(
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

                openDeleteModal(
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
// FILTER
// =====================================================

if (
    typeFilter
) {

    typeFilter.addEventListener(
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
        addStudentModal
    ) {

        addStudentModal.classList.add(
            "show"
        );

        addStudentModal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE ADD MODAL
// =====================================================

function closeAddModal() {

    if (
        addStudentModal
    ) {

        addStudentModal.classList.remove(
            "show"
        );

        addStudentModal.style.display =
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
// CLOSE ADD MODAL BUTTON
// =====================================================

if (
    closeAddModalBtn
) {

    closeAddModalBtn.addEventListener(
        "click",
        closeAddModal
    );

}


// =====================================================
// CANCEL ADD
// =====================================================

if (
    cancelAddBtn
) {

    cancelAddBtn.addEventListener(
        "click",
        closeAddModal
    );

}


// =====================================================
// MODAL BACKGROUND CLICK
// =====================================================

if (
    addStudentModal
) {

    addStudentModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                addStudentModal
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


                    // =================================================
                    // A/L
                    // =================================================

                    if (
                        type ===
                        "al"
                    ) {

                        await refreshALAdmissionNumberUI();

                    }


                    // =================================================
                    // GRADE 10 / GRADE 11
                    // =================================================

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


    // =================================================
    // FIRST A/L STUDENT
    // =================================================

    if (
        numbers.length ===
        0
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


    // =================================================
    // FIND FIRST AVAILABLE NUMBER
    // =================================================

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
                )
                .padStart(
                    5,
                    "0"
                )
            );

        }

    }


    // =================================================
    // NEXT AFTER HIGHEST
    // =================================================

    return (
        "A" +
        String(
            highest + 1
        )
        .padStart(
            5,
            "0"
        )
    );

}


// =====================================================
// UPDATE A/L ADMISSION NUMBER
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
                    ? newStudentId.value
                        .trim()
                        .toUpperCase()
                    : "";


            const password =
                newStudentPassword
                    ? newStudentPassword.value
                        .trim()
                    : "";


            const type =
                newStudentType
                    ? newStudentType.value
                    : "";


            let mustChange =
                newMustChange
                    ? newMustChange.checked
                    : false;


            // =================================================
            // CATEGORY VALIDATION
            // =================================================

            if (!type) {

                alert(
                    "Please select a student category."
                );

                return;

            }


            // =================================================
            // A/L STUDENT
            // =================================================

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


            // =================================================
            // ID VALIDATION
            // =================================================

            if (!id) {

                alert(
                    "Please enter Student ID."
                );

                return;

            }


            if (!password) {

                alert(
                    "Please enter Password."
                );

                return;

            }


            // =================================================
            // A/L ID VALIDATION
            // =================================================

            if (
                type ===
                "al" &&
                !/^A\d{5}$/.test(
                    id
                )
            ) {

                alert(
                    "Invalid A/L admission number."
                );

                return;

            }


            // =================================================
            // SAVE BUTTON
            // =================================================

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


                let existing =
                    await getDoc(
                        studentRef
                    );


                // =================================================
                // DUPLICATE CHECK
                // =================================================

                if (
                    existing.exists()
                ) {

                    if (
                        type ===
                        "al"
                    ) {

                        id =
                            await generateNextALAdmissionNumber();


                        if (
                            newStudentId
                        ) {

                            newStudentId.value =
                                id;

                        }


                        studentRef =
                            doc(
                                db,
                                "students",
                                id
                            );


                        existing =
                            await getDoc(
                                studentRef
                            );


                        if (
                            existing.exists()
                        ) {

                            alert(
                                "Unable to generate a unique A/L admission number. Please try again."
                            );

                            return;

                        }

                    }

                    else {

                        alert(
                            "A student with this ID already exists."
                        );

                        return;

                    }

                }


                // =================================================
                // STUDENT DATA
                // =================================================

                const studentData = {

                    password:
                        password,


                    mustChangePassword:
                        mustChange,


                    studentType:
                        type,


                    grade:
                        type ===
                        "grade10"
                            ? "10"
                            : type ===
                              "grade11"
                                ? "11"
                                : "",


                    admissionNumber:
                        id,


                    createdAt:
                        Date.now(),


                    lastActiveAt:
                        0

                };


                // =================================================
                // PAPER FIELDS
                // =================================================

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


                // =================================================
                // A/L MODEL PAPERS
                // =================================================

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
                        i <= AL_MODEL_PAPERS;
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


                // =================================================
                // FIRESTORE
                // =================================================

                await setDoc(
                    studentRef,
                    studentData
                );


                // =================================================
                // SUCCESS
                // =================================================

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
// CLOSE ADD MODAL
// =====================================================

function closeAddModal() {

    if (
        addStudentModal
    ) {

        addStudentModal.classList.remove(
            "show"
        );

        addStudentModal.style.display =
            "none";

    }


    clearAddForm();

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


    selectedEditStudentId =
        studentId;


    const data =
        student.data;


    // =================================================
    // STUDENT ID
    // =================================================

    if (
        editStudentId
    ) {

        editStudentId.value =
            studentId;

        editStudentId.readOnly =
            true;

    }


    // =================================================
    // PASSWORD
    // =================================================

    if (
        editPassword
    ) {

        editPassword.value =
            "";

        editPassword.placeholder =
            "Leave blank to keep current password";

    }


    // =================================================
    // TYPE
    // =================================================

    if (
        editType
    ) {

        editType.value =
            getStudentType(
                data
            );

    }


    // =================================================
    // GRADE
    // =================================================

    if (
        editGrade
    ) {

        const type =
            getStudentType(
                data
            );


        editGrade.value =
            data?.grade ||
            (
                type === "grade10"
                    ? "10"
                    : type === "grade11"
                        ? "11"
                        : ""
            );

    }


    // =================================================
    // MUST CHANGE PASSWORD
    // =================================================

    if (
        editMustChange
    ) {

        editMustChange.checked =
            data?.mustChangePassword ===
            true;

    }


    // =================================================
    // SHOW MODAL
    // =================================================

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


    selectedEditStudentId =
        "";

}


// =====================================================
// EDIT CLOSE BUTTON
// =====================================================

if (
    closeEditModalBtn
) {

    closeEditModalBtn.addEventListener(
        "click",
        closeEditModal
    );

}


// =====================================================
// EDIT CANCEL BUTTON
// =====================================================

if (
    cancelEditBtn
) {

    cancelEditBtn.addEventListener(
        "click",
        closeEditModal
    );

}


// =====================================================
// EDIT MODAL BACKGROUND
// =====================================================

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
    saveEditBtn
) {

    saveEditBtn.addEventListener(
        "click",
        async () => {

            // =============================================
            // VALIDATION
            // =============================================

            if (
                !selectedEditStudentId
            ) {

                alert(
                    "No student selected."
                );

                return;

            }


            const password =
                editPassword
                    ? editPassword.value
                        .trim()
                    : "";


            const type =
                editType
                    ? editType.value
                    : "";


            const grade =
                editGrade
                    ? editGrade.value
                        .trim()
                    : "";


            const mustChange =
                editMustChange
                    ? editMustChange.checked
                    : false;


            if (!type) {

                alert(
                    "Please select student type."
                );

                return;

            }


            // =============================================
            // SUPER ADMIN CHECK
            // =============================================

            if (
                !isSuperAdmin
            ) {

                alert(
                    "Only Super Administrator can edit students."
                );

                return;

            }


            // =============================================
            // BUTTON
            // =============================================

            saveEditBtn.disabled =
                true;


            saveEditBtn.textContent =
                "Saving...";


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        selectedEditStudentId
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

                    studentType:
                        type,


                    grade:
                        type === "grade10"
                            ? "10"
                            : type === "grade11"
                                ? "11"
                                : "",


                    mustChangePassword:
                        mustChange

                };


                // =============================================
                // PASSWORD
                // =============================================

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


                // =============================================
                // SAVE
                // =============================================

                await updateDoc(
                    studentRef,
                    updateData
                );


                alert(
                    "Student updated successfully."
                );


                closeEditModal();

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

                saveEditBtn.disabled =
                    false;


                saveEditBtn.textContent =
                    "💾 Save Changes";

            }

        }
    );

}


// =====================================================
// OPEN DELETE MODAL
// =====================================================

function openDeleteModal(
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


    const name =
        getStudentName(
            data
        );


    if (
        deleteStudentName
    ) {

        deleteStudentName.textContent =
            name === "Not Registered"
                ? studentId
                : (
                    name +
                    " (" +
                    studentId +
                    ")"
                );

    }


    if (
        deleteModal
    ) {

        deleteModal.classList.add(
            "show"
        );

        deleteModal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE DELETE MODAL
// =====================================================

function closeDeleteModal() {

    if (
        deleteModal
    ) {

        deleteModal.classList.remove(
            "show"
        );

        deleteModal.style.display =
            "none";

    }


    selectedStudentId =
        "";

}


// =====================================================
// DELETE CLOSE BUTTON
// =====================================================

if (
    closeDeleteModalBtn
) {

    closeDeleteModalBtn.addEventListener(
        "click",
        closeDeleteModal
    );

}


// =====================================================
// DELETE CANCEL BUTTON
// =====================================================

if (
    cancelDeleteBtn
) {

    cancelDeleteBtn.addEventListener(
        "click",
        closeDeleteModal
    );

}


// =====================================================
// DELETE MODAL BACKGROUND
// =====================================================

if (
    deleteModal
) {

    deleteModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                deleteModal
            ) {

                closeDeleteModal();

            }

        }
    );

}


// =====================================================
// CONFIRM DELETE
// =====================================================

if (
    confirmDeleteBtn
) {

    confirmDeleteBtn.addEventListener(
        "click",
        async () => {

            // =============================================
            // SUPER ADMIN ONLY
            // =============================================

            if (
                !isSuperAdmin
            ) {

                alert(
                    "Only Super Administrator can delete students."
                );

                return;

            }


            if (
                !selectedStudentId
            ) {

                return;

            }


            confirmDeleteBtn.disabled =
                true;


            confirmDeleteBtn.textContent =
                "Deleting...";


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        selectedStudentId
                    );


                await deleteDoc(
                    studentRef
                );


                alert(
                    "Student deleted successfully."
                );


                closeDeleteModal();

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

            finally {

                confirmDeleteBtn.disabled =
                    false;


                confirmDeleteBtn.textContent =
                    "🗑️ Delete Student";

            }

        }
    );

}


// =====================================================
// DELETE ALL STUDENTS BY CATEGORY
// =====================================================
//
// These functions are intentionally Super Admin only.
//
// They are used by the category management controls
// if those controls exist in students.html.
//
// =====================================================

async function deleteStudentsByType(
    studentType
) {

    if (
        !isSuperAdmin
    ) {

        alert(
            "Only Super Administrator can remove students."
        );

        return;

    }


    const typeLabel =
        getStudentTypeLabel(
            studentType
        );


    const students =
        allStudents.filter(
            student =>
                getStudentType(
                    student.data
                ) ===
                studentType
        );


    if (
        students.length ===
        0
    ) {

        alert(
            "There are no " +
            typeLabel +
            " students to remove."
        );

        return;

    }


    const confirmed =
        confirm(
            "WARNING!\n\n" +
            "You are about to permanently delete " +
            students.length +
            " " +
            typeLabel +
            " student account(s).\n\n" +
            "This action cannot be undone.\n\n" +
            "Continue?"
        );


    if (
        !confirmed
    ) {

        return;

    }


    // =============================================
    // SECOND CONFIRMATION
    // =============================================

    const secondConfirmed =
        confirm(
            "FINAL CONFIRMATION\n\n" +
            "Remove ALL " +
            typeLabel +
            " students?"
        );


    if (
        !secondConfirmed
    ) {

        return;

    }


    let deleted =
        0;


    let failed =
        0;


    for (
        const student of students
    ) {

        try {

            await deleteDoc(
                doc(
                    db,
                    "students",
                    student.id
                )
            );


            deleted++;

        }

        catch (
            error
        ) {

            console.error(
                "Failed to delete:",
                student.id,
                error
            );


            failed++;

        }

    }


    alert(
        typeLabel +
        " removal completed.\n\n" +
        "Deleted: " +
        deleted +
        "\n" +
        "Failed: " +
        failed
    );

}


// =====================================================
// REMOVE ALL A/L
// =====================================================

const removeAllALBtn =
    document.getElementById(
        "removeAllALBtn"
    );


if (
    removeAllALBtn
) {

    removeAllALBtn.addEventListener(
        "click",
        () => {

            deleteStudentsByType(
                "al"
            );

        }
    );

}


// =====================================================
// REMOVE ALL GRADE 10
// =====================================================

const removeAllGrade10Btn =
    document.getElementById(
        "removeAllGrade10Btn"
    );


if (
    removeAllGrade10Btn
) {

    removeAllGrade10Btn.addEventListener(
        "click",
        () => {

            deleteStudentsByType(
                "grade10"
            );

        }
    );

}


// =====================================================
// REMOVE ALL GRADE 11
// =====================================================

const removeAllGrade11Btn =
    document.getElementById(
        "removeAllGrade11Btn"
    );


if (
    removeAllGrade11Btn
) {

    removeAllGrade11Btn.addEventListener(
        "click",
        () => {

            deleteStudentsByType(
                "grade11"
            );

        }
    );

}


// =====================================================
// REAL-TIME STUDENT UPDATES
// =====================================================

function startRealtimeUpdates() {

    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        onSnapshot(
            studentsRef,

            snapshot => {

                const students =
                    [];


                snapshot.forEach(
                    studentDoc => {

                        students.push({

                            id:
                                studentDoc.id,

                            data:
                                studentDoc.data()

                        });

                    }
                );


                allStudents =
                    students;


                renderStudents();

                updateStudentCount();


                console.log(
                    "Student list updated:",
                    students.length
                );

            },

            error => {

                console.error(
                    "Student realtime listener error:",
                    error
                );


                loadStudents();

            }
        );

    }

    catch (
        error
    ) {

        console.error(
            "Realtime setup error:",
            error
        );


        loadStudents();

    }

}


// =====================================================
// REFRESH TABLE
// =====================================================

function refreshStudentTable() {

    renderStudents();

    updateStudentCount();

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


// =====================================================
// REAL-TIME
// =====================================================

startRealtimeUpdates();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "======================================"
);

console.log(
    "✅ STUDENTS MANAGEMENT LOADED"
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
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "A/L Admission Generator: ACTIVE"
);

console.log(
    "A/L Format: A27000, A27001..."
);

console.log(
    "======================================"
);
// =====================================================
// PAGE VISIBILITY REFRESH
// =====================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshStudentTable();

        }

    }
);


// =====================================================
// WINDOW FOCUS REFRESH
// =====================================================

window.addEventListener(
    "focus",
    () => {

        refreshStudentTable();

    }
);


// =====================================================
// ESCAPE KEY
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        // ---------------------------------------------
        // Close Add Modal
        // ---------------------------------------------

        if (
            addStudentModal &&
            addStudentModal.classList.contains(
                "show"
            )
        ) {

            closeAddModal();

            return;

        }


        // ---------------------------------------------
        // Close Edit Modal
        // ---------------------------------------------

        if (
            editModal &&
            editModal.classList.contains(
                "show"
            )
        ) {

            closeEditModal();

            return;

        }


        // ---------------------------------------------
        // Close Delete Modal
        // ---------------------------------------------

        if (
            deleteModal &&
            deleteModal.classList.contains(
                "show"
            )
        ) {

            closeDeleteModal();

        }

    }
);


// =====================================================
// ADD STUDENT PASSWORD VISIBILITY
// =====================================================

const toggleNewPassword =
    document.getElementById(
        "toggleNewPassword"
    );


if (
    toggleNewPassword &&
    newStudentPassword
) {

    toggleNewPassword.addEventListener(
        "click",
        () => {

            const isPassword =
                newStudentPassword.type ===
                "password";


            newStudentPassword.type =
                isPassword
                    ? "text"
                    : "password";


            toggleNewPassword.textContent =
                isPassword
                    ? "🙈"
                    : "🙊";

        }
    );

}


// =====================================================
// EDIT PASSWORD VISIBILITY
// =====================================================

const toggleEditPassword =
    document.getElementById(
        "toggleEditPassword"
    );


if (
    toggleEditPassword &&
    editPassword
) {

    toggleEditPassword.addEventListener(
        "click",
        () => {

            const isPassword =
                editPassword.type ===
                "password";


            editPassword.type =
                isPassword
                    ? "text"
                    : "password";


            toggleEditPassword.textContent =
                isPassword
                    ? "🙈"
                    : "🙊";

        }
    );

}


// =====================================================
// CATEGORY SELECT CHANGE
// =====================================================

if (
    newStudentType
) {

    newStudentType.addEventListener(
        "change",
        async () => {

            const type =
                newStudentType.value;


            if (
                type ===
                "al"
            ) {

                await refreshALAdmissionNumberUI();

            }

            else {

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

            }


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

                else if (
                    type ===
                    "al"
                ) {

                    newStudentGrade.textContent =
                        "Selected: A/L";

                }

                else {

                    newStudentGrade.textContent =
                        "";

                }

            }

        }
    );

}


// =====================================================
// EDIT TYPE CHANGE
// =====================================================

if (
    editType
) {

    editType.addEventListener(
        "change",
        () => {

            const type =
                editType.value;


            if (
                editGrade
            ) {

                if (
                    type ===
                    "grade10"
                ) {

                    editGrade.value =
                        "10";

                }

                else if (
                    type ===
                    "grade11"
                ) {

                    editGrade.value =
                        "11";

                }

                else {

                    editGrade.value =
                        "";

                }

            }

        }
    );

}


// =====================================================
// AUTO FORCE PASSWORD CHANGE FOR A/L
// =====================================================

if (
    newStudentType
) {

    newStudentType.addEventListener(
        "change",
        () => {

            if (
                newStudentType.value ===
                "al"
            ) {

                if (
                    newMustChange
                ) {

                    newMustChange.checked =
                        true;

                    newMustChange.disabled =
                        true;

                }

            }

            else {

                if (
                    newMustChange
                ) {

                    newMustChange.disabled =
                        false;

                }

            }

        }
    );

}


// =====================================================
// ADD MODAL OPEN STATE
// =====================================================

if (
    addStudentBtn
) {

    addStudentBtn.addEventListener(
        "click",
        async () => {

            // ---------------------------------------------
            // Reset first
            // ---------------------------------------------

            clearAddForm();


            // ---------------------------------------------
            // Open
            // ---------------------------------------------

            if (
                addStudentModal
            ) {

                addStudentModal.classList.add(
                    "show"
                );

                addStudentModal.style.display =
                    "flex";

            }

        }
    );

}


// =====================================================
// AUTO GENERATE A/L WHEN MODAL OPENS
// =====================================================

if (
    addStudentModal
) {

    const observer =
        new MutationObserver(
            async () => {

                if (
                    addStudentModal.classList.contains(
                        "show"
                    ) &&
                    newStudentType &&
                    newStudentType.value ===
                    "al"
                ) {

                    await refreshALAdmissionNumberUI();

                }

            }
        );


    observer.observe(
        addStudentModal,
        {

            attributes:
                true,

            attributeFilter:
                [
                    "class",
                    "style"
                ]

        }
    );

}


// =====================================================
// STUDENT ID INPUT
// =====================================================

if (
    newStudentId
) {

    newStudentId.addEventListener(
        "input",
        () => {

            // A/L ID is system generated.
            if (
                newStudentType &&
                newStudentType.value ===
                "al"
            ) {

                return;

            }


            newStudentId.value =
                newStudentId.value
                    .trim();

        }
    );

}


// =====================================================
// PASSWORD INPUT
// =====================================================

if (
    newStudentPassword
) {

    newStudentPassword.addEventListener(
        "input",
        () => {

            const value =
                newStudentPassword.value;


            if (
                value.length > 0 &&
                value.length < 4
            ) {

                newStudentPassword.classList.add(
                    "input-warning"
                );

            }

            else {

                newStudentPassword.classList.remove(
                    "input-warning"
                );

            }

        }
    );

}


// =====================================================
// EDIT PASSWORD INPUT
// =====================================================

if (
    editPassword
) {

    editPassword.addEventListener(
        "input",
        () => {

            const value =
                editPassword.value;


            if (
                value.length > 0 &&
                value.length < 4
            ) {

                editPassword.classList.add(
                    "input-warning"
                );

            }

            else {

                editPassword.classList.remove(
                    "input-warning"
                );

            }

        }
    );

}


// =====================================================
// GENERATE RANDOM TEMPORARY PASSWORD
// =====================================================

function generateTemporaryPassword(
    length = 8
) {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";


    let password =
        "";


    for (
        let i = 0;
        i < length;
        i++
    ) {

        password +=
            characters.charAt(
                Math.floor(
                    Math.random() *
                    characters.length
                )
            );

    }


    return password;

}


// =====================================================
// GENERATE PASSWORD BUTTON
// =====================================================

const generatePasswordBtn =
    document.getElementById(
        "generatePasswordBtn"
    );


if (
    generatePasswordBtn &&
    newStudentPassword
) {

    generatePasswordBtn.addEventListener(
        "click",
        () => {

            newStudentPassword.value =
                generateTemporaryPassword(
                    8
                );


            newStudentPassword.type =
                "text";


            if (
                toggleNewPassword
            ) {

                toggleNewPassword.textContent =
                    "🙈";

            }


            newStudentPassword.dispatchEvent(
                new Event(
                    "input"
                )
            );

        }
    );

}


// =====================================================
// COPY STUDENT ID
// =====================================================

async function copyText(
    value
) {

    try {

        await navigator.clipboard.writeText(
            value
        );


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "Copy failed:",
            error
        );


        return false;

    }

}


// =====================================================
// COPY BUTTON DELEGATION
// =====================================================

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-copy-id]"
            );


        if (!button) {

            return;

        }


        const id =
            button.dataset.copyId;


        if (!id) {

            return;

        }


        const copied =
            await copyText(
                id
            );


        if (
            copied
        ) {

            const original =
                button.innerHTML;


            button.innerHTML =
                "✓";


            setTimeout(
                () => {

                    button.innerHTML =
                        original;

                },
                1200
            );

        }

    }
);


// =====================================================
// UPDATE SUMMARY COUNTS
// =====================================================

function updateCategoryCounts() {

    const counts = {

        all:
            0,

        grade10:
            0,

        grade11:
            0,

        al:
            0

    };


    allStudents.forEach(
        student => {

            const type =
                getStudentType(
                    student.data
                );


            counts.all++;


            if (
                counts[
                    type
                ] !==
                undefined
            ) {

                counts[
                    type
                ]++;

            }

        }
    );


    setText(
        document.getElementById(
            "allStudentCount"
        ),
        counts.all
    );


    setText(
        document.getElementById(
            "grade10StudentCount"
        ),
        counts.grade10
    );


    setText(
        document.getElementById(
            "grade11StudentCount"
        ),
        counts.grade11
    );


    setText(
        document.getElementById(
            "alStudentCount"
        ),
        counts.al
    );

}


// =====================================================
// UPDATE STUDENT COUNT OVERRIDE
// =====================================================

const originalUpdateStudentCount =
    updateStudentCount;


// =====================================================
// CATEGORY COUNT REFRESH
// =====================================================

function refreshAllCounts() {

    originalUpdateStudentCount();

    updateCategoryCounts();

}


// =====================================================
// REFRESH COUNTS AFTER TABLE UPDATE
// =====================================================

const originalRenderStudents =
    renderStudents;


// =====================================================
// PATCH REALTIME COUNT DISPLAY
// =====================================================

function updateDashboardCounts() {

    updateCategoryCounts();

    originalUpdateStudentCount();

}


// =====================================================
// ADMIN ROLE DISPLAY
// =====================================================

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


if (
    adminUsernameElement
) {

    adminUsernameElement.textContent =
        adminUsername;

}


if (
    adminRoleElement
) {

    adminRoleElement.textContent =
        isSuperAdmin
            ? "Super Administrator"
            : "Administrator";

}


// =====================================================
// SUPER ADMIN ACCESS
// =====================================================

function setupSuperAdminAccess() {

    const superAdminElements =
        document.querySelectorAll(
            ".superadmin-only, .superadmin-link, .superadmin-card"
        );


    superAdminElements.forEach(
        element => {

            if (
                isSuperAdmin
            ) {

                element.classList.remove(
                    "access-locked",
                    "locked-menu"
                );

                element.removeAttribute(
                    "aria-disabled"
                );

            }

            else {

                element.classList.add(
                    "access-locked"
                );

                element.setAttribute(
                    "aria-disabled",
                    "true"
                );


                element.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        alert(
                            "This feature is available only to the Super Administrator."
                        );

                    }
                );

            }

        }
    );

}


setupSuperAdminAccess();


// =====================================================
// PROTECT DIRECT PAGE
// =====================================================

function protectCurrentPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (
        currentPage !==
        "students.html"
    ) {

        return;

    }


    // Students page is available to admins.
    // Destructive category actions remain
    // Super Admin only.

}


protectCurrentPage();


// =====================================================
// BACK TO ADMIN
// =====================================================

const backToAdminBtn =
    document.getElementById(
        "backToAdminBtn"
    );


if (
    backToAdminBtn
) {

    backToAdminBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "admin.html";

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (
    logoutBtn
) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Logout from Admin Panel?"
                );


            if (
                !confirmed
            ) {

                return;

            }


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
// PERIODIC REFRESH
// =====================================================

setInterval(
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshStudentTable();

        }

    },
    15000
);


// =====================================================
// KEEP A/L NUMBER FRESH
// =====================================================

let alNumberRefreshTimer =
    null;


function startALNumberRefresh() {

    if (
        alNumberRefreshTimer
    ) {

        clearInterval(
            alNumberRefreshTimer
        );

    }


    alNumberRefreshTimer =
        setInterval(
            async () => {

                if (
                    !addStudentModal ||
                    !newStudentType ||
                    !newStudentId
                ) {

                    return;

                }


                if (
                    !addStudentModal.classList.contains(
                        "show"
                    )
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

                    const nextId =
                        await generateNextALAdmissionNumber();


                    // Don't overwrite if user somehow
                    // switched category while request
                    // was running.
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
                        "A/L number refresh error:",
                        error
                    );

                }

            },
            10000
        );

}


startALNumberRefresh();


// =====================================================
// CLEANUP BEFORE PAGE UNLOAD
// =====================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (
            alNumberRefreshTimer
        ) {

            clearInterval(
                alNumberRefreshTimer
            );

        }

    }
);


// =====================================================
// FINAL INITIALIZATION
// =====================================================

setTimeout(
    () => {

        refreshStudentTable();

        updateCategoryCounts();

    },
    500
);


// =====================================================
// FINAL CONSOLE
// =====================================================

console.log(
    "--------------------------------------"
);

console.log(
    "Students Management Ready"
);

console.log(
    "A/L Admission Number System:",
    "A27000+"
);

console.log(
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "--------------------------------------"
);
// =====================================================
// FINAL STUDENT MANAGEMENT HELPERS
// =====================================================


// =====================================================
// REFRESH AFTER ANY FIRESTORE CHANGE
// =====================================================

async function refreshStudentsFromFirestore() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        const students =
            [];


        snapshot.forEach(
            studentDoc => {

                students.push({

                    id:
                        studentDoc.id,

                    data:
                        studentDoc.data()

                });

            }
        );


        allStudents =
            students;


        renderStudents();

        updateStudentCount();

        updateCategoryCounts();


    }
    catch (
        error
    ) {

        console.error(
            "Student refresh error:",
            error
        );

    }

}


// =====================================================
// RESET SEARCH
// =====================================================

const clearSearchBtn =
    document.getElementById(
        "clearSearchBtn"
    );


if (
    clearSearchBtn
) {

    clearSearchBtn.addEventListener(
        "click",
        () => {

            if (
                searchInput
            ) {

                searchInput.value =
                    "";

            }


            if (
                typeFilter
            ) {

                typeFilter.value =
                    "all";

            }


            renderStudents();

        }
    );

}


// =====================================================
// CATEGORY COUNT CARDS
// =====================================================

const categoryCards =
    document.querySelectorAll(
        "[data-filter-type]"
    );


categoryCards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const type =
                    card.dataset.filterType;


                if (
                    typeFilter
                ) {

                    typeFilter.value =
                        type ||
                        "all";

                }


                renderStudents();

            }
        );

    }
);


// =====================================================
// STUDENT TABLE SORT
// =====================================================

const sortableHeaders =
    document.querySelectorAll(
        "[data-sort]"
    );


let currentSortField =
    "";


let currentSortDirection =
    "asc";


sortableHeaders.forEach(
    header => {

        header.addEventListener(
            "click",
            () => {

                const field =
                    header.dataset.sort;


                if (
                    currentSortField ===
                    field
                ) {

                    currentSortDirection =
                        currentSortDirection ===
                        "asc"
                            ? "desc"
                            : "asc";

                }
                else {

                    currentSortField =
                        field;

                    currentSortDirection =
                        "asc";

                }


                sortStudents();

            }
        );

    }
);


// =====================================================
// SORT STUDENTS
// =====================================================

function sortStudents() {

    if (
        !currentSortField
    ) {

        renderStudents();

        return;

    }


    allStudents.sort(
        (
            first,
            second
        ) => {

            let firstValue =
                "";

            let secondValue =
                "";


            if (
                currentSortField ===
                "id"
            ) {

                firstValue =
                    first.id;

                secondValue =
                    second.id;

            }


            else if (
                currentSortField ===
                "name"
            ) {

                firstValue =
                    getStudentName(
                        first.data
                    );

                secondValue =
                    getStudentName(
                        second.data
                    );

            }


            else if (
                currentSortField ===
                "type"
            ) {

                firstValue =
                    getStudentType(
                        first.data
                    );

                secondValue =
                    getStudentType(
                        second.data
                    );

            }


            else {

                return 0;

            }


            firstValue =
                String(
                    firstValue
                )
                .toLowerCase();


            secondValue =
                String(
                    secondValue
                )
                .toLowerCase();


            let result;


            if (
                firstValue <
                secondValue
            ) {

                result =
                    -1;

            }

            else if (
                firstValue >
                secondValue
            ) {

                result =
                    1;

            }

            else {

                result =
                    0;

            }


            return (
                currentSortDirection ===
                "asc"
                    ? result
                    : -result
            );

        }
    );


    renderStudents();

}


// =====================================================
// EXPORT CURRENT STUDENT DATA
// =====================================================

const exportStudentsBtn =
    document.getElementById(
        "exportStudentsBtn"
    );


if (
    exportStudentsBtn
) {

    exportStudentsBtn.addEventListener(
        "click",
        () => {

            exportStudents();

        }
    );

}


// =====================================================
// EXPORT STUDENTS
// =====================================================

function exportStudents() {

    if (
        !allStudents.length
    ) {

        alert(
            "There are no students to export."
        );

        return;

    }


    const rows =
        allStudents.map(
            student => {

                const data =
                    student.data;


                return {

                    "Student ID":
                        student.id,

                    "Admission Number":
                        data?.admissionNumber ||
                        student.id,

                    "Full Name":
                        getStudentName(
                            data
                        ),

                    "Student Type":
                        getStudentTypeLabel(
                            getStudentType(
                                data
                            )
                        ),

                    "Grade":
                        data?.grade ||
                        "",

                    "Registration":
                        getRegistrationStatus(
                            data
                        ).text,

                    "Must Change Password":
                        data?.mustChangePassword ===
                        true
                            ? "Yes"
                            : "No",

                    "Paper Views":
                        getViewedCount(
                            data
                        ),

                    "Created Date":
                        formatDate(
                            data?.createdAt
                        )

                };

            }
        );


    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel export library is not available."
        );

        return;

    }


    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Students"
    );


    XLSX.writeFile(
        workbook,
        "Student-List.xlsx"
    );

}


// =====================================================
// DELETE CATEGORY BUTTONS - PASSWORD PROTECTION
// =====================================================
//
// If these buttons exist in students.html, they will
// require the Super Admin password before deletion.
//
// Password:
// Nimeth
//
// NOTE:
// This is a client-side protection only. Firestore
// Security Rules should ALSO restrict delete access.
// =====================================================

const SUPER_ADMIN_PASSWORD =
    "Nimeth";


// =====================================================
// PASSWORD PROMPT
// =====================================================

function requestSuperAdminPassword() {

    const password =
        window.prompt(
            "Super Administrator Password:"
        );


    if (
        password ===
        null
    ) {

        return false;

    }


    if (
        password !==
        SUPER_ADMIN_PASSWORD
    ) {

        alert(
            "Incorrect Super Administrator password."
        );


        return false;

    }


    return true;

}


// =====================================================
// PROTECTED DELETE
// =====================================================

async function protectedDeleteStudentsByType(
    type
) {

    if (
        !isSuperAdmin
    ) {

        alert(
            "Access denied.\n\nSuper Administrator only."
        );

        return;

    }


    if (
        !requestSuperAdminPassword()
    ) {

        return;

    }


    const students =
        allStudents.filter(
            student =>
                getStudentType(
                    student.data
                ) ===
                type
        );


    const label =
        getStudentTypeLabel(
            type
        );


    if (
        students.length ===
        0
    ) {

        alert(
            "No " +
            label +
            " students found."
        );

        return;

    }


    const confirmed =
        window.confirm(
            "WARNING!\n\n" +
            "You are about to permanently remove ALL " +
            label +
            " students.\n\n" +
            "Students found: " +
            students.length +
            "\n\n" +
            "This action cannot be undone.\n\n" +
            "Continue?"
        );


    if (
        !confirmed
    ) {

        return;

    }


    let deleted =
        0;


    let failed =
        0;


    for (
        const student of students
    ) {

        try {

            await deleteDoc(
                doc(
                    db,
                    "students",
                    student.id
                )
            );


            deleted++;

        }

        catch (
            error
        ) {

            console.error(
                "Delete failed:",
                student.id,
                error
            );


            failed++;

        }

    }


    await refreshStudentsFromFirestore();


    alert(
        label +
        " removal completed.\n\n" +
        "Deleted: " +
        deleted +
        "\n" +
        "Failed: " +
        failed
    );

}


// =====================================================
// REMOVE ALL A/L
// =====================================================

if (
    removeAllALBtn
) {

    removeAllALBtn.onclick =
        () => {

            protectedDeleteStudentsByType(
                "al"
            );

        };

}


// =====================================================
// REMOVE ALL GRADE 10
// =====================================================

if (
    removeAllGrade10Btn
) {

    removeAllGrade10Btn.onclick =
        () => {

            protectedDeleteStudentsByType(
                "grade10"
            );

        };

}


// =====================================================
// REMOVE ALL GRADE 11
// =====================================================

if (
    removeAllGrade11Btn
) {

    removeAllGrade11Btn.onclick =
        () => {

            protectedDeleteStudentsByType(
                "grade11"
            );

        };

}


// =====================================================
// FIREBASE CONNECTION TEST
// =====================================================

async function testFirebaseConnection() {

    try {

        await getDocs(
            collection(
                db,
                "students"
            )
        );


        console.log(
            "✅ Firestore connection OK"
        );


        return true;

    }

    catch (
        error
    ) {

        console.error(
            "❌ Firestore connection failed:",
            error
        );


        return false;

    }

}


// =====================================================
// INITIAL FIREBASE TEST
// =====================================================

testFirebaseConnection();


// =====================================================
// FINAL PAGE READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateStudentCount();

        updateCategoryCounts();

        renderStudents();

    }
);


// =====================================================
// FINAL LOG
// =====================================================

console.log(
    "======================================"
);

console.log(
    "✅ STUDENTS.JS FULL SYSTEM READY"
);

console.log(
    "======================================"
);

console.log(
    "Student Management: ACTIVE"
);

console.log(
    "A/L Admission Generator: ACTIVE"
);

console.log(
    "A/L Format: A27000+"
);

console.log(
    "First Login Registration: SUPPORTED"
);

console.log(
    "Super Admin Delete Protection: ACTIVE"
);

console.log(
    "======================================"
);
