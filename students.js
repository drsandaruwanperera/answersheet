import {
    db,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc
} from "./firebase.js";


// ==========================
// Protect Admin Page
// ==========================

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {
    window.location.href = "admin-login.html";
}


// ==========================
// Elements
// ==========================

const addStudentBtn =
    document.getElementById("addStudentBtn");

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

const search =
    document.getElementById("search");

const typeFilter =
    document.getElementById("typeFilter");

const statusFilter =
    document.getElementById("statusFilter");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================
// Add Modal
// ==========================

const addModal =
    document.getElementById("addModal");

const closeAdd =
    document.getElementById("closeAdd");

const cancelAdd =
    document.getElementById("cancelAdd");

const newStudentId =
    document.getElementById("newStudentId");

const newStudentGrade =
    document.getElementById("newStudentGrade");

const newStudentPassword =
    document.getElementById("newStudentPassword");

const newMustChange =
    document.getElementById("newMustChange");

const saveNewStudent =
    document.getElementById("saveNewStudent");


// ==========================
// Edit Modal
// ==========================

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


// ==========================
// Variables
// ==========================

let allStudents = [];

let currentStudent = "";

const adminRole =
    sessionStorage.getItem("adminRole") || "limited";

const isFullAdmin =
    adminRole === "full";

const ACTIVE_LIMIT =
    90 * 1000;

// ==========================
// Detect Student Type
// ==========================

function detectStudentType(studentId) {

    const number =
        Number(studentId);

    // 26000 - 26999
    // Grade 11

    if (
        Number.isInteger(number) &&
        number >= 26000 &&
        number <= 26999
    ) {

        return {
            type: "grade11",
            grade: 11,
            text:
                "✓ Grade 11 Student — 26000 Series"
        };

    }


    // 27000 - 27999
    // Grade 10

    if (
        Number.isInteger(number) &&
        number >= 27000 &&
        number <= 27999
    ) {

        return {
            type: "grade10",
            grade: 10,
            text:
                "✓ Grade 10 Student — 27000 Series"
        };

    }


    // Other IDs
    // A/L

    return {
        type: "al",
        grade: null,
        text:
            "✓ A/L Student"
    };

}


// ==========================
// Get Student Type
// ==========================

function getStudentType(student) {

    const data =
        student.data || {};

    // Saved studentType

    if (
        data.studentType ===
        "grade10"
    ) {
        return "grade10";
    }

    if (
        data.studentType ===
        "grade11"
    ) {
        return "grade11";
    }


    // Saved grade

    if (
        Number(data.grade) === 10
    ) {
        return "grade10";
    }

    if (
        Number(data.grade) === 11
    ) {
        return "grade11";
    }


    // Detect from ID

    return detectStudentType(
        student.id
    ).type;

}


// ==========================
// Active Status
// ==========================

function isStudentActive(student) {

    const lastActive =
        Number(
            student.data?.lastActiveAt || 0
        );

    if (!lastActive) {
        return false;
    }

    return (
        Date.now() - lastActive
        <= ACTIVE_LIMIT
    );

}


// ==========================
// Render Table
// ==========================

function renderTable(list) {

    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(student => {

        const row =
            document.createElement("tr");


        // ==========================
        // Student ID
        // ==========================

        const idCell =
            document.createElement("td");

        idCell.textContent =
            student.id;

        row.appendChild(idCell);


        // ==========================
        // Type
        // ==========================

        const typeCell =
            document.createElement("td");

        const type =
            getStudentType(student);


        if (
            type === "grade10"
        ) {

            typeCell.textContent =
                "🎓 Grade 10";

        }
        else if (
            type === "grade11"
        ) {

            typeCell.textContent =
                "🎓 Grade 11";

        }
        else {

            typeCell.textContent =
                "📚 A/L";

        }

        row.appendChild(typeCell);


        // ==========================
        // Viewed
        // ==========================

        const viewedCell =
            document.createElement("td");

        let badge = "🔴";

        if (
            student.viewed >= 8
        ) {

            badge = "🟢";

        }
        else if (
            student.viewed >= 4
        ) {

            badge = "🟡";

        }

        viewedCell.textContent =
            badge +
            " " +
            student.viewed +
            "/10";

        row.appendChild(viewedCell);


        // ==========================
        // Status
        // ==========================

        const statusCell =
            document.createElement("td");

        const status =
            document.createElement("span");

        status.className =
            "status";


        if (
            isStudentActive(student)
        ) {

            status.classList.add(
                "active"
            );

            status.textContent =
                "🟢 Active";

        }
        else {

            status.classList.add(
                "offline"
            );

            status.textContent =
                "⚪ Offline";

        }

        statusCell.appendChild(
            status
        );

        row.appendChild(
            statusCell
        );


        // ==========================
        // Password
        // ==========================

        const passwordCell =
            document.createElement("td");

        passwordCell.textContent =
            "********";

        row.appendChild(
            passwordCell
        );


        // ==========================
        // Edit
        // ==========================

        const actionCell =
            document.createElement("td");

        const editButton =
            document.createElement("button");

        editButton.className =
            "action-btn edit-btn";

        editButton.textContent =
            "✏️ Edit";

        editButton.dataset.id =
            student.id;

        editButton.addEventListener(
            "click",
            () => {

                openEditStudent(
                    student.id
                );

            }
        );

        actionCell.appendChild(
            editButton
        );

        row.appendChild(
            actionCell
        );


        table.appendChild(
            row
        );

    });

}


// ==========================
// Apply Filters
// ==========================

function applyFilters() {

    const keyword =
        search.value
            .toLowerCase()
            .trim();

    const selectedType =
        typeFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filtered =
        allStudents.filter(
            student => {

                // Search

                if (
                    keyword &&
                    !student.id
                        .toLowerCase()
                        .includes(keyword)
                ) {

                    return false;

                }


                // Type

                const type =
                    getStudentType(
                        student
                    );

                if (
                    selectedType !==
                    "all" &&
                    type !==
                    selectedType
                ) {

                    return false;

                }


                // Status

                const active =
                    isStudentActive(
                        student
                    );

                if (
                    selectedStatus ===
                    "active" &&
                    !active
                ) {

                    return false;

                }

                if (
                    selectedStatus ===
                    "offline" &&
                    active
                ) {

                    return false;

                }


                return true;

            }
        );


    renderTable(
        filtered
    );

}


// ==========================
// Load Students
// ==========================

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


        let grade10Count = 0;

        let grade11Count = 0;

        let alCount = 0;

        let activeCount = 0;


        snapshot.forEach(
            docSnap => {

                const data =
                    docSnap.data();


                // ==========================
                // Paper Views
                // ==========================

                let viewed = 0;


                for (
                    let i = 1;
                    i <= 10;
                    i++
                ) {

                    const field =
                        "paper" +
                        String(i).padStart(
                            2,
                            "0"
                        ) +
                        "Viewed";


                    if (
                        data[field] === true
                    ) {

                        viewed++;

                    }

                }


                const student = {

                    id:
                        docSnap.id,

                    viewed:
                        viewed,

                    data:
                        data

                };


                allStudents.push(
                    student
                );


                // ==========================
                // Type Count
                // ==========================

                const type =
                    getStudentType(
                        student
                    );


                if (
                    type === "grade10"
                ) {

                    grade10Count++;

                }
                else if (
                    type === "grade11"
                ) {

                    grade11Count++;

                }
                else {

                    alCount++;

                }


                // ==========================
                // Active
                // ==========================

                if (
                    isStudentActive(
                        student
                    )
                ) {

                    activeCount++;

                }

            }
        );


        // ==========================
        // Cards
        // ==========================

        totalStudents.textContent =
            allStudents.length;

        grade10Students.textContent =
            grade10Count;

        grade11Students.textContent =
            grade11Count;

        alStudents.textContent =
            alCount;

        activeStudents.textContent =
            activeCount;


        // ==========================
        // Table
        // ==========================

        applyFilters();


        console.log(
            "Students loaded:",
            allStudents.length
        );

    }
    catch (error) {

        console.error(
            "Students page error:",
            error
        );

        alert(
            "Failed to load students."
        );

    }

}


// ==========================
// ADD STUDENT
// ==========================
// ==========================
// Student Category Selection
// ==========================

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );

const newStudentType =
    document.getElementById(
        "newStudentType"
    );


categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;


                // Remove previous selection

                categoryButtons.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                // Select current button

                button.classList.add(
                    "selected"
                );


                // Save selected type

                newStudentType.value =
                    type;


                // Show selected grade

                if (
                    type === "grade10"
                ) {

                    newStudentGrade.textContent =
                        "✓ Grade 10 Student";

                    newStudentGrade.className =
                        "grade-status grade10";

                }
                else if (
                    type === "grade11"
                ) {

                    newStudentGrade.textContent =
                        "✓ Grade 11 Student";

                    newStudentGrade.className =
                        "grade-status grade11";

                }
                else {

                    newStudentGrade.textContent =
                        "✓ A/L Student";

                    newStudentGrade.className =
                        "grade-status al";

                }

            }
        );

    }
);

newStudentId.addEventListener(
    "input",
    () => {

        const id =
            newStudentId.value
                .trim();


        if (!id) {

            newStudentGrade.textContent =
                "";

            newStudentGrade.className =
                "grade-status";

            return;

        }


        const result =
            detectStudentType(id);


        newStudentGrade.textContent =
            result.text;


        newStudentGrade.className =
            "grade-status";


        if (
            result.type ===
            "grade10"
        ) {

            newStudentGrade.classList.add(
                "grade10"
            );

        }
        else if (
            result.type ===
            "grade11"
        ) {

            newStudentGrade.classList.add(
                "grade11"
            );

        }
        else {

            newStudentGrade.classList.add(
                "al"
            );

        }

    }
);


// ==========================
// Open Add Modal
// ==========================

addStudentBtn.addEventListener(
    "click",
    () => {

        newStudentId.value =
            "";

        newStudentGrade.textContent =
            "";

        newStudentPassword.value =
            "";

        newMustChange.checked =
            false;

        addModal.style.display =
            "flex";

        newStudentId.focus();

    }
);


// ==========================
// Close Add Modal
// ==========================

function closeAddModal() {

    addModal.style.display =
        "none";

}


closeAdd.addEventListener(
    "click",
    closeAddModal
);


cancelAdd.addEventListener(
    "click",
    closeAddModal
);


window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            addModal
        ) {

            closeAddModal();

        }


        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


// ==========================
// Save New Student
// ==========================

saveNewStudent.addEventListener(
    "click",
    async () => {

        const id =
            newStudentId.value
                .trim();

        const password =
            newStudentPassword.value
                .trim();

        const mustChange =
            newMustChange.checked;


        // ==========================
        // Validation
        // ==========================

        if (!id) {

            alert(
                "Please enter Student ID."
            );

            newStudentId.focus();

            return;

        }


        if (!password) {

            alert(
                "Please enter a password."
            );

            newStudentPassword.focus();

            return;

        }


        if (
            password.length < 4
        ) {

            alert(
                "Password must contain at least 4 characters."
            );

            return;

        }


        try {

            // ==========================
            // Check Existing Student
            // ==========================

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


            // ==========================
            // Detect Type
            // ==========================

            const detected =
                detectStudentType(
                    id
                );


            // ==========================
            // Student Data
            // ==========================

            const studentData = {

                password:
                    password,

                mustChangePassword:
                    mustChange,

                studentType:
                    detected.type,

                lastActiveAt:
                    0

            };


            if (
                detected.grade !==
                null
            ) {

                studentData.grade =
                    detected.grade;

            }


            // ==========================
            // Load Paper Settings
            // ==========================

            const papersSnapshot =
                await getDocs(
                    collection(
                        db,
                        "papers"
                    )
                );


            const paperSettings =
                {};


            papersSnapshot.forEach(
                paperDoc => {

                    paperSettings[
                        paperDoc.id
                    ] =
                        paperDoc.data();

                }
            );


            // ==========================
            // Default Paper Permissions
            // ==========================

            for (
                let i = 1;
                i <= 10;
                i++
            ) {

                const paper =
                    "paper" +
                    String(i).padStart(
                        2,
                        "0"
                    );


                const settings =
                    paperSettings[
                        paper
                    ];


                studentData[
                    paper
                ] =
                    settings?.defaultAvailable === true;


                studentData[
                    paper + "Viewed"
                ] =
                    false;


                studentData[
                    paper + "Pages"
                ] =
                    settings?.pages || 10;

            }


            // ==========================
            // Save
            // ==========================

            await setDoc(
                studentRef,
                studentData
            );


            alert(
                "Student added successfully!\n\n" +
                "Student ID: " +
                id +
                "\nType: " +
                detected.type +
                (
                    detected.grade
                        ? "\nGrade: " +
                          detected.grade
                        : ""
                )
            );


            closeAddModal();


            // Reload

            await loadStudents();

        }
        catch (error) {

            console.error(
                "Add student error:",
                error
            );

            alert(
                "Failed to add student."
            );

        }

    }
);


// ==========================
// Open Edit Student
// ==========================

async function openEditStudent(
    studentId
) {

    try {

        const student =
            allStudents.find(
                item =>
                    item.id ===
                    studentId
            );


        if (!student) {

            alert(
                "Student not found."
            );

            return;

        }


        currentStudent =
            studentId;


        editStudentId.value =
            studentId;


        editPassword.value =
            student.data?.password ||
            "";


        editMustChange.checked =
            student.data
                ?.mustChangePassword === true;


        // Paper permissions

        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const field =
                "paper" +
                String(i).padStart(
                    2,
                    "0"
                );


            const checkbox =
                document.getElementById(
                    field
                );


            if (checkbox) {

                checkbox.checked =
                    student.data?.[
                        field
                    ] === true;

            }

        }


        editModal.style.display =
            "flex";

    }
    catch (error) {

        console.error(
            "Open edit error:",
            error
        );

        alert(
            "Failed to open student."
        );

    }

}


// ==========================
// Close Edit
// ==========================

function closeEditModal() {

    editModal.style.display =
        "none";

    currentStudent =
        "";

}


closeEdit.addEventListener(
    "click",
    closeEditModal
);


closeEditBottom.addEventListener(
    "click",
    closeEditModal
);


// ==========================
// Select All Papers
// ==========================

selectAllPapers.addEventListener(
    "click",
    () => {

        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const checkbox =
                document.getElementById(
                    "paper" +
                    String(i).padStart(
                        2,
                        "0"
                    )
                );


            if (checkbox) {

                checkbox.checked =
                    true;

            }

        }

    }
);


// ==========================
// Remove All Papers
// ==========================

removeAllPapers.addEventListener(
    "click",
    () => {

        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const checkbox =
                document.getElementById(
                    "paper" +
                    String(i).padStart(
                        2,
                        "0"
                    )
                );


            if (checkbox) {

                checkbox.checked =
                    false;

            }

        }

    }
);


// ==========================
// Reset Viewed
// ==========================

resetViewed.addEventListener(
    "click",
    async () => {

        if (!currentStudent) {

            alert(
                "Please select a student first."
            );

            return;

        }


        if (
            !confirm(
                "Reset viewed status for " +
                currentStudent +
                "?"
            )
        ) {

            return;

        }


        try {

            const updateData =
                {};


            for (
                let i = 1;
                i <= 10;
                i++
            ) {

                updateData[
                    "paper" +
                    String(i).padStart(
                        2,
                        "0"
                    ) +
                    "Viewed"
                ] =
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


            alert(
                "Viewed status reset successfully."
            );


            await loadStudents();

        }
        catch (error) {

            console.error(
                "Reset viewed error:",
                error
            );

            alert(
                "Failed to reset viewed status."
            );

        }

    }
);


// ==========================
// Update Student
// ==========================

updateStudent.addEventListener(
    "click",
    async () => {

        if (!currentStudent) {

            alert(
                "No student selected."
            );

            return;

        }


        try {

            const updateData = {

                password:
                    editPassword.value
                        .trim(),

                mustChangePassword:
                    editMustChange.checked

            };


            // Paper permissions

            for (
                let i = 1;
                i <= 10;
                i++
            ) {

                const field =
                    "paper" +
                    String(i).padStart(
                        2,
                        "0"
                    );


                const checkbox =
                    document.getElementById(
                        field
                    );


                if (checkbox) {

                    updateData[
                        field
                    ] =
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
                "Update student error:",
                error
            );

            alert(
                "Failed to update student."
            );

        }

    }
);


// ==========================
// Reset Password
// ==========================

resetPasswordBtn.addEventListener(
    "click",
    async () => {

        if (!currentStudent) {

            alert(
                "Please select a student first."
            );

            return;

        }


        const newPassword =
            prompt(
                "Enter new password for " +
                currentStudent
            );


        if (
            newPassword === null
        ) {

            return;

        }


        const password =
            newPassword.trim();


        if (!password) {

            alert(
                "Password cannot be empty."
            );

            return;

        }


        if (
            password.length < 4
        ) {

            alert(
                "Password must contain at least 4 characters."
            );

            return;

        }


        if (
            !confirm(
                "Reset password for " +
                currentStudent +
                "?"
            )
        ) {

            return;

        }


        try {

            await updateDoc(
                doc(
                    db,
                    "students",
                    currentStudent
                ),
                {
                    password:
                        password,

                    mustChangePassword:
                        true
                }
            );


            editPassword.value =
                password;


            alert(
                "Password reset successfully."
            );

        }
        catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            alert(
                "Failed to reset password."
            );

        }

    }
);


// ==========================
// Delete Student
// ==========================

deleteStudent.addEventListener(
    "click",
    async () => {

        if (!currentStudent) {

            alert(
                "Please select a student first."
            );

            return;

        }


        if (
            !confirm(
                "Are you sure you want to delete " +
                currentStudent +
                "?"
            )
        ) {

            return;

        }


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
                "Delete student error:",
                error
            );

            alert(
                "Failed to delete student."
            );

        }

    }
);


// ==========================
// Search
// ==========================

search.addEventListener(
    "input",
    applyFilters
);


// ==========================
// Type Filter
// ==========================

typeFilter.addEventListener(
    "change",
    applyFilters
);


// ==========================
// Status Filter
// ==========================

statusFilter.addEventListener(
    "change",
    applyFilters
);


// ==========================
// Logout
// ==========================

logoutBtn.addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "Are you sure you want to logout?"
            )
        ) {

            return;

        }


        sessionStorage.removeItem(
            "adminLoggedIn"
        );


        window.location.href =
            "admin-login.html";

    }
);


// ==========================
// Auto Refresh
// ==========================

setInterval(
    loadStudents,
    30000
);


// ==========================
// Start
// ==========================

loadStudents();


console.log(
    "✅ Students Management Loaded"
);
