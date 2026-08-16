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

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {
    window.location.href = "admin-login.html";
}


// =====================================================
// ELEMENTS
// =====================================================

const table =
    document.getElementById("studentTable");

const totalStudents =
    document.getElementById("totalStudents");

const grade10Students =
    document.getElementById("grade10Students");

const grade11Students =
    document.getElementById("grade11Students");

const alStudents =
    document.getElementById("alStudents");

const activeStudents =
    document.getElementById("activeStudents");

const totalViewed =
    document.getElementById("totalViewed");

const onlineStudents =
    document.getElementById("onlineStudents");

const searchInput =
    document.getElementById("search");

const typeFilter =
    document.getElementById("typeFilter");

const statusFilter =
    document.getElementById("statusFilter");


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

const categoryButtons =
    document.querySelectorAll(".category-btn");


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

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");

const selectAllPapers =
    document.getElementById("selectAllPapers");

const removeAllPapers =
    document.getElementById("removeAllPapers");

const resetViewed =
    document.getElementById("resetViewed");

const updateStudent =
    document.getElementById("updateStudent");

const deleteStudent =
    document.getElementById("deleteStudent");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let currentStudent = "";


// =====================================================
// SETTINGS
// =====================================================

const ACTIVE_LIMIT = 90 * 1000;

const PAPER_COUNT = 10;


// =====================================================
// STUDENT TYPE
// =====================================================

function getStudentType(data) {

    if (
        data?.studentType === "grade10"
    ) {
        return "grade10";
    }

    if (
        data?.studentType === "grade11"
    ) {
        return "grade11";
    }

    if (
        String(data?.grade || "") === "10"
    ) {
        return "grade10";
    }

    if (
        String(data?.grade || "") === "11"
    ) {
        return "grade11";
    }

    return "al";
}


// =====================================================
// STUDENT TYPE LABEL
// =====================================================

function getStudentTypeLabel(type) {

    if (type === "grade10") {
        return "Grade 10";
    }

    if (type === "grade11") {
        return "Grade 11";
    }

    return "A/L";
}


// =====================================================
// ACTIVE CHECK
// =====================================================

function isStudentActive(data) {

    const lastActive =
        Number(data?.lastActiveAt || 0);

    if (!lastActive) {
        return false;
    }

    return (
        Date.now() - lastActive <= ACTIVE_LIMIT
    );
}


// =====================================================
// PAPER VIEW COUNT
// =====================================================

function getViewedCount(data) {

    let count = 0;

    for (
        let i = 1;
        i <= PAPER_COUNT;
        i++
    ) {

        const field =
            "paper" +
            String(i).padStart(2, "0") +
            "Viewed";

        if (
            data?.[field] === true
        ) {
            count++;
        }
    }

    return count;
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// SET TEXT
// =====================================================

function setText(element, value) {

    if (element) {
        element.textContent = value;
    }
}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Logout from Admin Panel?"
                );

            if (!confirmLogout) {
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

            window.location.href =
                "admin-login.html";
        }
    );
}


// =====================================================
// RENDER SUMMARY
// =====================================================

function renderSummary() {

    let total = allStudents.length;

    let grade10 = 0;

    let grade11 = 0;

    let al = 0;

    let active = 0;

    let views = 0;


    allStudents.forEach(student => {

        const type =
            getStudentType(
                student.data
            );

        if (type === "grade10") {
            grade10++;
        }
        else if (type === "grade11") {
            grade11++;
        }
        else {
            al++;
        }


        if (
            isStudentActive(
                student.data
            )
        ) {
            active++;
        }


        views +=
            getViewedCount(
                student.data
            );

    });


    setText(
        totalStudents,
        total
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

    setText(
        activeStudents,
        active
    );

    setText(
        totalViewed,
        views
    );

    setText(
        onlineStudents,
        active
    );


    // Support old IDs too

    setText(
        document.getElementById("grade10Count"),
        grade10
    );

    setText(
        document.getElementById("grade11Count"),
        grade11
    );

    setText(
        document.getElementById("alCount"),
        al
    );

    setText(
        document.getElementById("activeCount"),
        active
    );
}


// =====================================================
// RENDER TABLE
// =====================================================

function renderTable(list) {

    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (!list.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:45px;
                        color:#64748b;
                    "
                >

                    No students found.

                </td>

            </tr>

        `;

        return;
    }


    list.forEach(student => {

        const type =
            getStudentType(
                student.data
            );


        const typeLabel =
            getStudentTypeLabel(
                type
            );


        const active =
            isStudentActive(
                student.data
            );


        const viewed =
            getViewedCount(
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


        const password =
            student.data?.password || "";


        table.innerHTML += `

            <tr>

                <!-- STUDENT ID -->

                <td>

                    <strong>
                        ${escapeHTML(
                            student.id
                        )}
                    </strong>

                </td>


                <!-- TYPE -->

                <td>

                    ${escapeHTML(
                        typeLabel
                    )}

                </td>


                <!-- VIEWED -->

                <td>

                    ${viewed}/10

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${statusText}

                    </span>

                </td>


                <!-- PASSWORD -->

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


                <!-- ACTION -->

                <td>

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        data-id="${escapeHTML(
                            student.id
                        )}"
                    >

                        Manage

                    </button>

                </td>

            </tr>

        `;
    });
}


// =====================================================
// FILTER TABLE
// =====================================================

function applyFilters() {

    const keyword =
        searchInput?.value
            .trim()
            .toLowerCase() || "";


    const selectedType =
        typeFilter?.value || "all";


    const selectedStatus =
        statusFilter?.value || "all";


    const filtered =
        allStudents.filter(student => {

            const id =
                String(
                    student.id
                ).toLowerCase();


            const type =
                getStudentType(
                    student.data
                );


            const active =
                isStudentActive(
                    student.data
                );


            // Search

            if (
                keyword &&
                !id.includes(keyword)
            ) {
                return false;
            }


            // Grade

            if (
                selectedType !== "all" &&
                type !== selectedType
            ) {
                return false;
            }


            // Status

            if (
                selectedStatus === "active" &&
                !active
            ) {
                return false;
            }


            if (
                selectedStatus === "offline" &&
                active
            ) {
                return false;
            }


            return true;

        });


    renderTable(
        filtered
    );
}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    try {

        if (table) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:45px;
                            color:#64748b;
                        "
                    >

                        Loading students...

                    </td>

                </tr>

            `;
        }


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        allStudents = [];


        snapshot.forEach(docSnap => {

            const data =
                docSnap.data();


            allStudents.push({

                id:
                    docSnap.id,

                data:
                    data,

                viewed:
                    getViewedCount(
                        data
                    )

            });

        });


        // Sort by student ID

        allStudents.sort(
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


        renderSummary();

        applyFilters();


    }
    catch (error) {

        console.error(
            "Load Students Error:",
            error
        );


        if (table) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:45px;
                            color:#dc2626;
                        "
                    >

                        Failed to load students.

                    </td>

                </tr>

            `;
        }
    }
}


// =====================================================
// SEARCH EVENT
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
// OPEN ADD MODAL
// =====================================================

function openAddModal() {

    clearAddStudentForm();


    if (addModal) {

        addModal.style.display =
            "flex";

    }
}


if (addStudentBtn) {

    addStudentBtn.addEventListener(
        "click",
        openAddModal
    );
}


// =====================================================
// CLEAR ADD FORM
// =====================================================

function clearAddStudentForm() {

    if (newStudentId) {
        newStudentId.value = "";
    }


    if (newStudentPassword) {
        newStudentPassword.value = "";
    }


    if (newMustChange) {
        newMustChange.checked = false;
    }


    if (newStudentType) {
        newStudentType.value = "";
    }


    if (newStudentGrade) {

        newStudentGrade.textContent =
            "Select a student category.";

        newStudentGrade.className =
            "grade-status";

    }


    categoryButtons.forEach(button => {

        button.classList.remove(
            "selected",
            "active"
        );

    });
}


// =====================================================
// CATEGORY BUTTONS
// =====================================================

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const type =
                button.dataset.type;


            if (newStudentType) {

                newStudentType.value =
                    type;

            }


            categoryButtons.forEach(
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

            button.classList.add(
                "active"
            );


            if (newStudentGrade) {

                if (
                    type === "grade10"
                ) {

                    newStudentGrade.textContent =
                        "Selected: Grade 10";

                }
                else if (
                    type === "grade11"
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

});


// =====================================================
// SAVE NEW STUDENT
// =====================================================

if (saveNewStudent) {

    saveNewStudent.addEventListener(
        "click",
        async () => {

            const id =
                newStudentId?.value
                    .trim() || "";


            const password =
                newStudentPassword?.value
                    .trim() || "";


            const type =
                newStudentType?.value || "";


            const mustChange =
                newMustChange?.checked ||
                false;


            // Validation

            if (!type) {

                alert(
                    "Please select Student Category."
                );

                return;
            }


            if (!id) {

                alert(
                    "Please enter Student ID."
                );

                newStudentId?.focus();

                return;
            }


            if (!password) {

                alert(
                    "Please enter Password."
                );

                newStudentPassword?.focus();

                return;
            }


            if (
                id.includes("/") ||
                id.includes("\\")
            ) {

                alert(
                    "Student ID cannot contain / or \\."
                );

                return;
            }


            saveNewStudent.disabled =
                true;

            saveNewStudent.textContent =
                "Saving...";


            try {

                // Check duplicate

                const existing =
                    await getDoc(
                        doc(
                            db,
                            "students",
                            id
                        )
                    );


                if (
                    existing.exists()
                ) {

                    alert(
                        "A student with this ID already exists."
                    );

                    return;
                }


                // Student data

                const studentData = {

                    studentType:
                        type,

                    password:
                        password,

                    mustChangePassword:
                        mustChange,

                    lastActiveAt:
                        0

                };


                // Grade field

                if (
                    type === "grade10"
                ) {

                    studentData.grade =
                        "10";

                }
                else if (
                    type === "grade11"
                ) {

                    studentData.grade =
                        "11";

                }
                else {

                    studentData.grade =
                        "AL";

                }


                // Default paper data

                for (
                    let i = 1;
                    i <= PAPER_COUNT;
                    i++
                ) {

                    const paper =
                        "paper" +
                        String(i)
                            .padStart(
                                2,
                                "0"
                            );


                    studentData[paper] =
                        false;


                    studentData[
                        paper + "Viewed"
                    ] = false;


                    studentData[
                        paper + "Pages"
                    ] = 10;

                }


                await setDoc(
                    doc(
                        db,
                        "students",
                        id
                    ),
                    studentData
                );


                alert(
                    "Student added successfully."
                );


                if (addModal) {

                    addModal.style.display =
                        "none";

                }


                clearAddStudentForm();


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

    clearAddStudentForm();


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

async function openEditStudent(studentId) {

    currentStudent =
        studentId;


    try {

        const snap =
            await getDoc(
                doc(
                    db,
                    "students",
                    studentId
                )
            );


        if (!snap.exists()) {

            alert(
                "Student not found."
            );

            currentStudent = "";

            return;
        }


        const data =
            snap.data();


        // Student ID

        if (editStudentId) {

            editStudentId.value =
                studentId;

        }


        // Password

        if (editPassword) {

            editPassword.value =
                data.password || "";

        }


        // Must change

        if (editMustChange) {

            editMustChange.checked =
                data.mustChangePassword === true;

        }


        // Paper permissions

        for (
            let i = 1;
            i <= PAPER_COUNT;
            i++
        ) {

            const field =
                "paper" +
                String(i)
                    .padStart(
                        2,
                        "0"
                    );


            const checkbox =
                document.getElementById(
                    field
                );


            if (checkbox) {

                checkbox.checked =
                    data[field] === true;

            }

        }


        if (editModal) {

            editModal.style.display =
                "flex";

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

    }
}


// =====================================================
// EDIT BUTTON EVENT
// =====================================================

if (table) {

    table.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".edit-btn"
                );


            if (!button) {
                return;
            }


            const id =
                button.dataset.id;


            if (!id) {
                return;
            }


            openEditStudent(
                id
            );

        }
    );
}


// =====================================================
// CLOSE EDIT
// =====================================================

function closeEditModal() {

    if (editModal) {

        editModal.style.display =
            "none";

    }


    currentStudent = "";
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

            if (!currentStudent) {

                alert(
                    "No student selected."
                );

                return;
            }


            const password =
                editPassword?.value.trim() ||
                "";


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
                        editMustChange?.checked ||
                        false

                };


                // Paper permissions

                for (
                    let i = 1;
                    i <= PAPER_COUNT;
                    i++
                ) {

                    const field =
                        "paper" +
                        String(i)
                            .padStart(
                                2,
                                "0"
                            );


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
                        currentStudent
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

            if (!currentStudent) {

                alert(
                    "No student selected."
                );

                return;
            }


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete student " +
                    currentStudent +
                    "?"
                );


            if (!confirmDelete) {
                return;
            }


            deleteStudent.disabled =
                true;

            deleteStudent.textContent =
                "Deleting...";


            try {

                await deleteDoc(
                    doc(
                        db,
                        "students",
                        currentStudent
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

                deleteStudent.textContent =
                    "🗑 Delete";

            }

        }
    );
}


// =====================================================
// SELECT ALL PAPERS
// =====================================================

if (selectAllPapers) {

    selectAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= PAPER_COUNT;
                i++
            ) {

                const field =
                    "paper" +
                    String(i)
                        .padStart(
                            2,
                            "0"
                        );


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
// REMOVE ALL PAPERS
// =====================================================

if (removeAllPapers) {

    removeAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= PAPER_COUNT;
                i++
            ) {

                const field =
                    "paper" +
                    String(i)
                        .padStart(
                            2,
                            "0"
                        );


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
// RESET VIEWED
// =====================================================

if (resetViewed) {

    resetViewed.addEventListener(
        "click",
        async () => {

            if (!currentStudent) {

                alert(
                    "No student selected."
                );

                return;
            }


            const confirmReset =
                confirm(
                    "Reset all viewed paper status for this student?"
                );


            if (!confirmReset) {
                return;
            }


            resetViewed.disabled =
                true;


            try {

                const updateData = {};


                for (
                    let i = 1;
                    i <= PAPER_COUNT;
                    i++
                ) {

                    const field =
                        "paper" +
                        String(i)
                            .padStart(
                                2,
                                "0"
                            ) +
                        "Viewed";


                    updateData[field] =
                        false;

                }


                await updateDoc(
                    doc(
                        db,
                        "students",
                        currentStudent
                    ),
                    updateData
                );


                // Update modal checkboxes if they exist

                for (
                    let i = 1;
                    i <= PAPER_COUNT;
                    i++
                ) {

                    const field =
                        "paper" +
                        String(i)
                            .padStart(
                                2,
                                "0"
                            ) +
                        "Viewed";


                    const checkbox =
                        document.getElementById(
                            field
                        );


                    if (checkbox) {

                        checkbox.checked =
                            false;

                    }

                }


                alert(
                    "Viewed status reset successfully."
                );


                await loadStudents();

            }
            catch (error) {

                console.error(
                    "Reset Viewed Error:",
                    error
                );


                alert(
                    "Failed to reset viewed status.\n\n" +
                    error.message
                );

            }
            finally {

                resetViewed.disabled =
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


            if (editMustChange) {

                editMustChange.checked =
                    true;

            }


            editPassword.focus();

        }
    );
}


// =====================================================
// CLICK OUTSIDE MODALS
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
            event.key !== "Escape"
        ) {
            return;
        }


        if (
            addModal &&
            addModal.style.display === "flex"
        ) {

            closeAddModal();

        }


        if (
            editModal &&
            editModal.style.display === "flex"
        ) {

            closeEditModal();

        }

    }
);


// =====================================================
// ENTER KEY - ADD STUDENT
// =====================================================

if (newStudentPassword) {

    newStudentPassword.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                saveNewStudent?.click();

            }

        }
    );
}


// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(
    async () => {

        await loadStudents();

    },
    30000
);


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


console.log(
    "✅ Students Admin Panel Loaded"
);
