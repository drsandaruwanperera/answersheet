import * as firebase from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const db = firebase.db;

const collection = firebase.collection;
const getDocs = firebase.getDocs;
const doc = firebase.doc;
const getDoc = firebase.getDoc;
const setDoc = firebase.setDoc;
const updateDoc = firebase.updateDoc;
const deleteDoc = firebase.deleteDoc;


// =====================================================
// ADMIN PROTECTION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    sessionStorage.getItem("adminRole") || "limited";


if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// PAPER SETTINGS
// =====================================================

// Existing student permission system
const TOTAL_PAPERS = 13;

// New A/L model paper system
const AL_MODEL_PAPERS = 15;

// Legacy viewed fields supported
const MAX_LEGACY_VIEWED_PAPERS = 50;

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// ELEMENTS
// =====================================================

const table =
    document.getElementById("studentTable");

const searchInput =
    document.getElementById("search");

const typeFilter =
    document.getElementById("typeFilter");

const statusFilter =
    document.getElementById("statusFilter");


// =====================================================
// SUMMARY
// =====================================================

const totalStudents =
    document.getElementById("totalStudents");

const grade10Students =
    document.getElementById("grade10Students");

const grade11Students =
    document.getElementById("grade11Students");

const alStudents =
    document.getElementById("alStudents");


// =====================================================
// ADD MODAL
// =====================================================

const addStudentBtn =
    document.getElementById("addStudentBtn");

const addModal =
    document.getElementById("addModal");

const closeAdd =
    document.getElementById("closeAdd");

const cancelAdd =
    document.getElementById("cancelAdd");

const saveNewStudent =
    document.getElementById("saveNewStudent");

const newStudentType =
    document.getElementById("newStudentType");

const newStudentGrade =
    document.getElementById("newStudentGrade");

const newStudentId =
    document.getElementById("newStudentId");

const newStudentPassword =
    document.getElementById("newStudentPassword");

const newMustChange =
    document.getElementById("newMustChange");


// =====================================================
// EDIT MODAL
// =====================================================

const editModal =
    document.getElementById("editModal");

const closeEdit =
    document.getElementById("closeEdit");

const closeEditBottom =
    document.getElementById("closeEditBottom");

const editStudentId =
    document.getElementById("editStudentId");

const editPassword =
    document.getElementById("editPassword");

const editMustChange =
    document.getElementById("editMustChange");

const updateStudent =
    document.getElementById("updateStudent");

const deleteStudent =
    document.getElementById("deleteStudent");

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");

const selectAllPapers =
    document.getElementById("selectAllPapers");

const removeAllPapers =
    document.getElementById("removeAllPapers");

const resetViewed =
    document.getElementById("resetViewed");


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let currentStudentId = "";


// =====================================================
// NAVIGATION ACCESS CONTROL
// =====================================================
//
// FULL / SUPER ADMIN:
// Dashboard
// Students
// Paper Management
// Import Students
// Reports
//
// LIMITED ADMIN:
// Dashboard
// Students
// Others LOCKED
// =====================================================

function setupNavigationAccess() {

    const paperManagement =
        document.querySelector(
            "button[onclick*='paper-settings']"
        );

    const importStudents =
        document.querySelector(
            "button[onclick*='import-students']"
        );

    const reports =
        document.querySelector(
            "button[onclick*='reports']"
        );


    // -------------------------------------------------
    // SUPER ADMIN
    // -------------------------------------------------

    if (
        adminRole === "full" ||
        adminRole === "superadmin"
    ) {

        return;

    }


    // -------------------------------------------------
    // LIMITED ADMIN
    // -------------------------------------------------

    const lockedItems = [

        paperManagement,
        importStudents,
        reports

    ];


    lockedItems.forEach(
        item => {

            if (!item) {
                return;
            }


            // Remove existing onclick
            item.onclick = null;


            // Locked class
            item.classList.add(
                "locked-nav-item"
            );


            // Prevent navigation
            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    alert(
                        "🔒 Access denied. Super Administrator only."
                    );

                }
            );


            // Add lock
            if (
                !item.querySelector(
                    ".nav-lock"
                )
            ) {

                const lock =
                    document.createElement(
                        "span"
                    );

                lock.className =
                    "nav-lock";

                lock.textContent =
                    "🔒";

                lock.style.marginLeft =
                    "auto";

                item.appendChild(
                    lock
                );

            }

        }
    );

}


// Run navigation protection
setupNavigationAccess();


// =====================================================
// HIDE ACTIVE NOW CARD
// =====================================================
//
// Dashboard already shows active students.
// =====================================================

function hideActiveCard() {

    const activeElement =
        document.getElementById(
            "activeStudents"
        );


    if (!activeElement) {
        return;
    }


    const card =
        activeElement.closest(
            ".card"
        );


    if (card) {

        card.style.display =
            "none";

    }

}


hideActiveCard();


// =====================================================
// ADMIN USER DISPLAY
// =====================================================

function loadAdminInfo() {

    const username =
        sessionStorage.getItem(
            "adminUsername"
        ) || "Admin";


    const adminName =
        document.querySelector(
            ".admin-copy strong"
        );


    const adminRoleElement =
        document.querySelector(
            ".admin-copy span"
        );


    if (adminName) {

        adminName.textContent =
            username;

    }


    if (adminRoleElement) {

        adminRoleElement.textContent =
            (
                adminRole === "full" ||
                adminRole === "superadmin"
            )
                ? "Super Administrator"
                : "Administrator";

    }

}


loadAdminInfo();


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Logout from Admin Panel?"
                );


            if (!confirmed) {
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
// STUDENT TYPE
// =====================================================

function getStudentType(data) {

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
            data?.grade || ""
        ) === "10"
    ) {

        return "grade10";

    }


    if (
        String(
            data?.grade || ""
        ) === "11"
    ) {

        return "grade11";

    }


    return "al";

}


// =====================================================
// STUDENT TYPE LABEL
// =====================================================

function getStudentTypeLabel(data) {

    const type =
        getStudentType(data);


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


    return "A/L";

}


// =====================================================
// ACTIVE CHECK
// =====================================================

function isStudentActive(data) {

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
        difference <= ACTIVE_LIMIT
    );

}


// =====================================================
// PAPER FIELD
// =====================================================

function getPaperField(number) {

    return (
        "paper" +
        String(number)
            .padStart(2, "0")
    );

}


// =====================================================
// PAPER VIEW FIELD
// =====================================================

function getPaperViewedField(number) {

    return (
        getPaperField(number) +
        "Viewed"
    );

}


// =====================================================
// PAPER PAGES FIELD
// =====================================================

function getPaperPagesField(number) {

    return (
        getPaperField(number) +
        "Pages"
    );

}


// =====================================================
// PAPER VIEW COUNT
// =====================================================

function getViewedCount(data) {

    let count = 0;


    // -------------------------------------------------
    // LEGACY VIEWED FIELDS
    // paper01Viewed ... paper50Viewed
    // -------------------------------------------------

    for (
        let i = 1;
        i <= MAX_LEGACY_VIEWED_PAPERS;
        i++
    ) {

        const field =
            getPaperViewedField(i);


        if (
            data?.[field] === true
        ) {

            count++;

        }

    }


    // -------------------------------------------------
    // A/L NESTED MODEL VIEWED FIELDS
    // paperViews.al.model.paper01 ... paper15
    //
    // Only count these if legacy fields are not already
    // representing the same paper.
    // -------------------------------------------------

    const alModel =
        data?.paperViews?.al?.model;


    if (alModel) {

        for (
            let i = 1;
            i <= AL_MODEL_PAPERS;
            i++
        ) {

            const paper =
                getPaperField(i);


            if (
                alModel[paper] === true &&
                data?.[paper + "Viewed"] !== true
            ) {

                count++;

            }

        }

    }


    return count;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

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
// SET TEXT
// =====================================================

function setText(
    element,
    value
) {

    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary() {

    let grade10 = 0;

    let grade11 = 0;

    let al = 0;


    allStudents.forEach(
        student => {

            const type =
                getStudentType(
                    student.data
                );


            if (
                type === "grade10"
            ) {

                grade10++;

            }
            else if (
                type === "grade11"
            ) {

                grade11++;

            }
            else {

                al++;

            }

        }
    );


    setText(
        totalStudents,
        allStudents.length
    );


    setText(
        grade10Students,
        grade10
    );


    setText(
        grade11Students,
        grade11
    );


    setText(
        alStudents,
        al
    );

}


// =====================================================
// RENDER TABLE
// =====================================================

function renderTable(list) {

    if (!table) {
        return;
    }


    if (!list.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#64748b;
                    "
                >

                    No students found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        list.map(
            student => {

                const type =
                    getStudentTypeLabel(
                        student.data
                    );


                const active =
                    isStudentActive(
                        student.data
                    );


                const statusClass =
                    active
                        ? "active"
                        : "offline";


                const statusText =
                    active
                        ? "🟢 Active"
                        : "⚪ Offline";


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

                            ${escapeHTML(
                                type
                            )}

                        </td>


                        <td>

                            ${student.viewed}/${TOTAL_PAPERS}

                        </td>


                        <td>

                            <span
                                class="
                                    status
                                    ${statusClass}
                                "
                            >

                                ${statusText}

                            </span>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="action-btn edit-btn"
                                data-id="${escapeHTML(
                                    student.id
                                )}"
                            >

                                ✏️ Edit

                            </button>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="
                                    action-btn
                                    manage-btn
                                "
                                data-id="${escapeHTML(
                                    student.id
                                )}"
                            >

                                ⚙️ Manage

                            </button>

                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


// =====================================================
// FILTER STUDENTS
// =====================================================

function applyFilters() {

    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const type =
        typeFilter
            ? typeFilter.value
            : "all";


    const status =
        statusFilter
            ? statusFilter.value
            : "all";


    const filtered =
        allStudents.filter(
            student => {

                // -------------------------------------
                // SEARCH
                // -------------------------------------

                if (keyword) {

                    const id =
                        String(
                            student.id
                        )
                        .toLowerCase();


                    const studentType =
                        getStudentTypeLabel(
                            student.data
                        )
                        .toLowerCase();


                    if (
                        !id.includes(
                            keyword
                        ) &&
                        !studentType.includes(
                            keyword
                        )
                    ) {

                        return false;

                    }

                }


                // -------------------------------------
                // TYPE
                // -------------------------------------

                if (
                    type !== "all" &&
                    getStudentType(
                        student.data
                    ) !== type
                ) {

                    return false;

                }


                // -------------------------------------
                // STATUS
                // -------------------------------------

                if (
                    status !== "all"
                ) {

                    const active =
                        isStudentActive(
                            student.data
                        );


                    if (
                        status === "active" &&
                        !active
                    ) {

                        return false;

                    }


                    if (
                        status === "offline" &&
                        active
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    renderTable(
        filtered
    );

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    if (!table) {
        return;
    }


    table.innerHTML = `

        <tr>

            <td
                colspan="6"
                style="
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                "
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


        const newStudents = [];


        snapshot.forEach(
            studentDoc => {

                const data =
                    studentDoc.data();


                newStudents.push({

                    id:
                        studentDoc.id,

                    data:
                        data,

                    viewed:
                        getViewedCount(
                            data
                        )

                });

            }
        );


        // Sort by student ID

        newStudents.sort(
            (a, b) =>
                String(a.id)
                    .localeCompare(
                        String(b.id),
                        undefined,
                        {
                            numeric: true
                        }
                    )
        );


        allStudents =
            newStudents;


        updateSummary();

        applyFilters();

    }
    catch (error) {

        console.error(
            "Load Students Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#dc2626;
                    "
                >

                    Failed to load students.
                    Please refresh the page.

                </td>

            </tr>

        `;

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


// =====================================================
// SEARCH
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


// =====================================================
// TYPE FILTER
// =====================================================

if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =====================================================
// STATUS FILTER
// =====================================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =====================================================
// ADD MODAL OPEN
// =====================================================

if (addStudentBtn) {

    addStudentBtn.addEventListener(
        "click",
        () => {

            clearAddForm();


            if (addModal) {

                addModal.style.display =
                    "flex";

            }

        }
    );

}


// =====================================================
// CLEAR ADD FORM
// =====================================================

function clearAddForm() {

    if (newStudentType) {

        newStudentType.value =
            "";

    }


    if (newStudentGrade) {

        newStudentGrade.textContent =
            "";

    }


    if (newStudentId) {

        newStudentId.value =
            "";

    }


    if (newStudentPassword) {

        newStudentPassword.value =
            "";

    }


    if (newMustChange) {

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
                () => {

                    const type =
                        button.dataset.type;


                    if (newStudentType) {

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


                    if (newStudentGrade) {

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

                }
            );

        }
    );


// =====================================================
// SAVE NEW STUDENT
// =====================================================

if (saveNewStudent) {

    saveNewStudent.addEventListener(
        "click",
        async () => {

            const id =
                newStudentId
                    ? newStudentId.value
                        .trim()
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


            const mustChange =
                newMustChange
                    ? newMustChange.checked
                    : false;


            // -------------------------------------
            // VALIDATION
            // -------------------------------------

            if (!type) {

                alert(
                    "Please select a student category."
                );

                return;

            }


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


            saveNewStudent.disabled =
                true;


            saveNewStudent.textContent =
                "Saving...";


            try {

                // ---------------------------------
                // CHECK DUPLICATE
                // ---------------------------------

                const studentRef =
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

                    createdAt:
                        Date.now(),

                    lastActiveAt:
                        0

                };


                // ---------------------------------
                // DEFAULT PAPERS 01 - 13
                // ---------------------------------

                for (
                    let i = 1;
                    i <= TOTAL_PAPERS;
                    i++
                ) {

                    const paper =
                        getPaperField(i);


                    // Permission

                    studentData[
                        paper
                    ] = false;


                    // Viewed

                    studentData[
                        getPaperViewedField(i)
                    ] = false;


                    // Pages

                    studentData[
                        getPaperPagesField(i)
                    ] = 10;

                }


                // ---------------------------------
                // DEFAULT A/L MODEL VIEW STRUCTURE
                // ---------------------------------

                if (
                    type === "al"
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
                            getPaperField(i);


                        studentData
                            .paperViews
                            .al
                            .model[
                                paper
                            ] = false;

                    }

                }


                // ---------------------------------
                // SAVE
                // ---------------------------------

                await setDoc(
                    studentRef,
                    studentData
                );


                alert(
                    "Student added successfully."
                );


                closeAddModal();

                await loadStudents();

            }
            catch (error) {

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

    clearAddForm();


    if (addModal) {

        addModal.style.display =
            "none";

    }

}


if (closeAdd) {

    closeAdd.addEventListener(
        "click",
        closeAddModal
    );

}


if (cancelAdd) {

    cancelAdd.addEventListener(
        "click",
        closeAddModal
    );

}


// =====================================================
// OPEN EDIT MODAL
// =====================================================

async function openEditStudent(
    studentId
) {

    if (!studentId) {
        return;
    }


    currentStudentId =
        studentId;


    if (editModal) {

        editModal.style.display =
            "flex";

    }


    if (editStudentId) {

        editStudentId.value =
            studentId;

    }


    if (editPassword) {

        editPassword.value =
            "";

    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        const snapshot =
            await getDoc(
                studentRef
            );


        if (
            !snapshot.exists()
        ) {

            alert(
                "Student not found."
            );

            closeEditModal();

            return;

        }


        const data =
            snapshot.data();


        // -------------------------------------
        // PASSWORD
        // -------------------------------------

        if (editPassword) {

            editPassword.value =
                data.password || "";

        }


        // -------------------------------------
        // MUST CHANGE
        // -------------------------------------

        if (editMustChange) {

            editMustChange.checked =
                data.mustChangePassword === true;

        }


        // -------------------------------------
        // PAPERS 01 - 13
        // -------------------------------------

        for (
            let i = 1;
            i <= TOTAL_PAPERS;
            i++
        ) {

            const field =
                getPaperField(i);


            const checkbox =
                document.getElementById(
                    field
                );


            if (checkbox) {

                checkbox.checked =
                    data[field] === true;

            }

        }

    }
    catch (error) {

        console.error(
            "Open Edit Error:",
            error
        );


        alert(
            "Failed to load student."
        );


        closeEditModal();

    }

}


// =====================================================
// TABLE CLICK
// =====================================================

if (table) {

    table.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    ".edit-btn"
                );


            const manageButton =
                event.target.closest(
                    ".manage-btn"
                );


            if (editButton) {

                openEditStudent(
                    editButton.dataset.id
                );

                return;

            }


            if (manageButton) {

                openEditStudent(
                    manageButton.dataset.id
                );

            }

        }
    );

}


// =====================================================
// CLOSE EDIT MODAL
// =====================================================

function closeEditModal() {

    currentStudentId =
        "";


    if (editModal) {

        editModal.style.display =
            "none";

    }

}


if (closeEdit) {

    closeEdit.addEventListener(
        "click",
        closeEditModal
    );

}


if (closeEditBottom) {

    closeEditBottom.addEventListener(
        "click",
        closeEditModal
    );

}


// =====================================================
// UPDATE STUDENT
// =====================================================

if (updateStudent) {

    updateStudent.addEventListener(
        "click",
        async () => {

            if (!currentStudentId) {

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


            if (!password) {

                alert(
                    "Password cannot be empty."
                );

                return;

            }


            updateStudent.disabled =
                true;


            updateStudent.textContent =
                "Saving...";


            try {

                const updateData = {

                    password:
                        password,

                    mustChangePassword:
                        editMustChange
                            ? editMustChange.checked
                            : false

                };


                // ---------------------------------
                // PAPER PERMISSIONS 01 - 13
                // ---------------------------------

                for (
                    let i = 1;
                    i <= TOTAL_PAPERS;
                    i++
                ) {

                    const field =
                        getPaperField(i);


                    const checkbox =
                        document.getElementById(
                            field
                        );


                    if (checkbox) {

                        updateData[field] =
                            checkbox.checked;

                    }

                }


                await updateDoc(
                    doc(
                        db,
                        "students",
                        currentStudentId
                    ),
                    updateData
                );


                alert(
                    "Student updated successfully."
                );


                closeEditModal();

                await loadStudents();

            }
            catch (error) {

                console.error(
                    "Update Student Error:",
                    error
                );


                alert(
                    "Update failed.\n\n" +
                    error.message
                );

            }
            finally {

                updateStudent.disabled =
                    false;

                updateStudent.textContent =
                    "💾 Save Changes";

            }

        }
    );

}


// =====================================================
// DELETE STUDENT
// =====================================================

if (deleteStudent) {

    deleteStudent.addEventListener(
        "click",
        async () => {

            if (!currentStudentId) {

                alert(
                    "No student selected."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete student " +
                    currentStudentId +
                    "?"
                );


            if (!confirmed) {
                return;
            }


            deleteStudent.disabled =
                true;


            try {

                await deleteDoc(
                    doc(
                        db,
                        "students",
                        currentStudentId
                    )
                );


                alert(
                    "Student deleted successfully."
                );


                closeEditModal();

                await loadStudents();

            }
            catch (error) {

                console.error(
                    "Delete Student Error:",
                    error
                );


                alert(
                    "Delete failed.\n\n" +
                    error.message
                );

            }
            finally {

                deleteStudent.disabled =
                    false;

            }

        }
    );

}


// =====================================================
// RESET PASSWORD
// =====================================================

if (resetPasswordBtn) {

    resetPasswordBtn.addEventListener(
        "click",
        () => {

            if (!editPassword) {
                return;
            }


            const generated =
                Math.random()
                    .toString(36)
                    .slice(2, 10);


            editPassword.value =
                generated;


            editPassword.focus();

        }
    );

}


// =====================================================
// SELECT ALL PAPERS 01 - 13
// =====================================================

if (selectAllPapers) {

    selectAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= TOTAL_PAPERS;
                i++
            ) {

                const field =
                    getPaperField(i);


                const checkbox =
                    document.getElementById(
                        field
                    );


                if (checkbox) {

                    checkbox.checked =
                        true;

                }

            }

        }
    );

}


// =====================================================
// REMOVE ALL PAPERS 01 - 13
// =====================================================

if (removeAllPapers) {

    removeAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= TOTAL_PAPERS;
                i++
            ) {

                const field =
                    getPaperField(i);


                const checkbox =
                    document.getElementById(
                        field
                    );


                if (checkbox) {

                    checkbox.checked =
                        false;

                }

            }

        }
    );

}


// =====================================================
// RESET VIEWED - ALL PAPER VIEW STATUS
// =====================================================
//
// This resets BOTH systems:
//
// 1. Legacy:
//    paper01Viewed ... paper50Viewed
//
// 2. New A/L Model:
//    paperViews.al.model.paper01
//    ...
//    paperViews.al.model.paper15
//
// =====================================================

if (resetViewed) {

    resetViewed.addEventListener(
        "click",
        async () => {

            if (!currentStudentId) {

                alert(
                    "No student selected."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Reset ALL viewed paper status for this student?"
                );


            if (!confirmed) {
                return;
            }


            resetViewed.disabled =
                true;


            const originalButtonText =
                resetViewed.textContent;


            resetViewed.textContent =
                "Resetting...";


            try {

                const updateData = {};


                // =================================================
                // 1. RESET LEGACY VIEWED FIELDS
                // =================================================
                //
                // paper01Viewed
                // paper02Viewed
                // ...
                // paper50Viewed
                //
                // =================================================

                for (
                    let i = 1;
                    i <= MAX_LEGACY_VIEWED_PAPERS;
                    i++
                ) {

                    const paper =
                        getPaperField(i);


                    updateData[
                        paper + "Viewed"
                    ] = false;

                }


                // =================================================
                // 2. RESET A/L MODEL VIEWED FIELDS
                // =================================================
                //
                // paperViews.al.model.paper01
                // ...
                // paperViews.al.model.paper15
                //
                // =================================================

                for (
                    let i = 1;
                    i <= AL_MODEL_PAPERS;
                    i++
                ) {

                    const paper =
                        getPaperField(i);


                    updateData[
                        `paperViews.al.model.${paper}`
                    ] = false;

                }


                // =================================================
                // 3. UPDATE FIRESTORE
                // =================================================

                const studentRef =
                    doc(
                        db,
                        "students",
                        currentStudentId
                    );


                await updateDoc(
                    studentRef,
                    updateData
                );


                // =================================================
                // 4. UPDATE LOCAL DATA
                // =================================================

                const localStudent =
                    allStudents.find(
                        student =>
                            student.id ===
                            currentStudentId
                    );


                if (localStudent) {

                    // ---------------------------------------------
                    // Reset legacy fields locally
                    // ---------------------------------------------

                    for (
                        let i = 1;
                        i <= MAX_LEGACY_VIEWED_PAPERS;
                        i++
                    ) {

                        const paper =
                            getPaperField(i);


                        localStudent.data[
                            paper + "Viewed"
                        ] = false;

                    }


                    // ---------------------------------------------
                    // Make sure nested structure exists
                    // ---------------------------------------------

                    if (
                        !localStudent.data.paperViews
                    ) {

                        localStudent.data.paperViews =
                            {};

                    }


                    if (
                        !localStudent.data.paperViews.al
                    ) {

                        localStudent.data.paperViews.al =
                            {};

                    }


                    if (
                        !localStudent.data.paperViews.al.model
                    ) {

                        localStudent.data
                            .paperViews
                            .al
                            .model = {};

                    }


                    // ---------------------------------------------
                    // Reset A/L model fields locally
                    // ---------------------------------------------

                    for (
                        let i = 1;
                        i <= AL_MODEL_PAPERS;
                        i++
                    ) {

                        const paper =
                            getPaperField(i);


                        localStudent.data
                            .paperViews
                            .al
                            .model[
                                paper
                            ] = false;

                    }


                    // ---------------------------------------------
                    // Reset displayed viewed count
                    // ---------------------------------------------

                    localStudent.viewed =
                        0;

                }


                // =================================================
                // 5. REFRESH TABLE
                // =================================================

                applyFilters();


                // =================================================
                // 6. SUCCESS
                // =================================================

                alert(
                    "✅ All viewed paper status reset successfully."
                );

            }
            catch (error) {

                console.error(
                    "Reset Viewed Error:",
                    error
                );


                alert(
                    "❌ Failed to reset viewed status.\n\n" +
                    error.message
                );

            }
            finally {

                resetViewed.disabled =
                    false;


                resetViewed.textContent =
                    originalButtonText ||
                    "🔄 Reset Viewed";

            }

        }
    );

}


// =====================================================
// CLOSE MODALS WHEN CLICK OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    event => {

        if (
            addModal &&
            event.target === addModal
        ) {

            closeAddModal();

        }


        if (
            editModal &&
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


// =====================================================
// ESC KEY
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeAddModal();

            closeEditModal();

        }

    }
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Students module loaded"
);

console.log(
    "📚 Legacy permission papers:",
    TOTAL_PAPERS
);

console.log(
    "📚 A/L model papers:",
    AL_MODEL_PAPERS
);

console.log(
    "👁️ Legacy viewed fields supported:",
    MAX_LEGACY_VIEWED_PAPERS
);

console.log(
    "👤 Admin role:",
    adminRole
);
