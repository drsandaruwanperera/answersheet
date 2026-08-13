import * as firebase from "./firebase.js";

const db = firebase.db;
const collection = firebase.collection;
const getDocs = firebase.getDocs;
const doc = firebase.doc;
const getDoc = firebase.getDoc;
const setDoc = firebase.setDoc;
const updateDoc = firebase.updateDoc;
const deleteDoc = firebase.deleteDoc;

// ==========================
// Protect Admin Page
// ==========================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// ==========================
// Elements
// ==========================

const table =
    document.getElementById("studentTable");

const totalStudents =
    document.getElementById("totalStudents");

const totalViewed =
    document.getElementById("totalViewed");

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

const addStudentBtn =
    document.getElementById("addStudentBtn");

const studentModal =
    document.getElementById("studentModal");

const closeModal =
    document.getElementById("closeModal");

const saveStudent =
    document.getElementById("saveStudent");

const editModal =
    document.getElementById("editModal");

const closeEdit =
    document.getElementById("closeEdit");

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

const studentGradeStatus =
    document.getElementById("studentGradeStatus");

// ==========================
// Variables
// ==========================

let allStudents = [];

let currentStudent = "";

// ==========================
// Render Table
// ==========================

function renderTable(list) {

    table.innerHTML = "";

    list.forEach(student => {

        const row =
            document.createElement("tr");

        // Student ID
        const idCell =
            document.createElement("td");

        idCell.textContent =
            student.id;

        row.appendChild(idCell);

        // Type / Grade
        const typeCell =
            document.createElement("td");

        if (
            student.data?.studentType ===
            "grade10"
        ) {

            typeCell.textContent =
                "🎓 Grade 10";

        }
        else if (
            student.data?.studentType ===
            "grade11"
        ) {

            typeCell.textContent =
                "🎓 Grade 11";

        }
        else {

            typeCell.textContent =
                "📚 A/L";

        }

        row.appendChild(typeCell);

        // Viewed
        const viewedCell =
            document.createElement("td");

        let badge = "🔴";

        if (student.viewed >= 8) {
            badge = "🟢";
        }
        else if (student.viewed >= 4) {
            badge = "🟡";
        }

        viewedCell.textContent =
            badge + " " + student.viewed + "/10";

        row.appendChild(viewedCell);

        // Password
        const passwordCell =
            document.createElement("td");

        passwordCell.textContent =
            "********";

        row.appendChild(passwordCell);

        // Action
        const actionCell =
            document.createElement("td");

        const editButton =
            document.createElement("button");

        editButton.className =
            "action-btn edit-btn";

        editButton.dataset.id =
            student.id;

        editButton.textContent =
            "✏️ Edit";

        actionCell.appendChild(
            editButton
        );

        row.appendChild(
            actionCell
        );

        table.appendChild(row);

    });

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

        console.log(
            "Students loaded:",
            snapshot.size
        );

        allStudents = [];

        let students = 0;

        let viewed = 0;

        let grade10Count = 0;

        let grade11Count = 0;

        let alCount = 0;
        let activeCount = 0

        snapshot.forEach(
            docSnap => {

                students++;

                const data =
                    docSnap.data();
// ==========================
// Active Student Check
// ==========================

const lastActive =
    data.lastActiveAt || 0;

const now =
    Date.now();

const activeLimit =
    60 * 1000; // 60 seconds

if (
    lastActive > 0 &&
    (now - lastActive) <= activeLimit
) {
    activeCount++;
}
                // ==========================
                // Grade Count
                // ==========================

                if (
                    data.studentType ===
                    "grade10"
                ) {

                    grade10Count++;

                }
                else if (
                    data.studentType ===
                    "grade11"
                ) {

                    grade11Count++;

                }
                else {

                    alCount++;

                }

                // ==========================
                // Paper Views
                // ==========================

                let count = 0;

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

                        count++;

                    }

                }

                viewed += count;

                allStudents.push({

                    id:
                        docSnap.id,

                    viewed:
                        count,

                    data:
                        data

                });

            }
        );

        // ==========================
        // Dashboard
        // ==========================

        totalStudents.textContent =
            students;

        totalViewed.textContent =
            viewed;

        grade10Students.textContent =
            grade10Count;

        grade11Students.textContent =
            grade11Count;

        alStudents.textContent =
            alCount;

        // Active system will be added later
       activeStudents.textContent =
    activeCount;

        // ==========================
        // Render
        // ==========================

        renderTable(
            allStudents
        );

    }
    catch (error) {

        console.error(
            "Load Students Error:",
            error
        );

        alert(
            "Failed to load students."
        );

    }

}

// ==========================
// Search
// ==========================

search.addEventListener(
    "input",
    () => {

        const keyword =
            search.value
                .toLowerCase()
                .trim();

        const filtered =
            allStudents.filter(
                student =>
                    student.id
                        .toLowerCase()
                        .includes(keyword)
            );

        renderTable(
            filtered
        );

    }
);

// ==========================
// Live Grade Detection
// ==========================

function updateGradeStatus() {

    const input =
        document.getElementById(
            "studentId"
        );

    if (!input) return;

    const value =
        input.value.trim();

    if (!value) {

        studentGradeStatus.textContent =
            "";

        studentGradeStatus.className =
            "grade-status";

        return;

    }

    const number =
        Number(value);

    // 26000 → Grade 11

    if (
        Number.isInteger(number) &&
        number >= 26000 &&
        number <= 26999
    ) {

        studentGradeStatus.textContent =
            "✓ Grade 11 Student — 26000 Series";

        studentGradeStatus.className =
            "grade-status grade11";

        return;

    }

    // 27000 → Grade 10

    if (
        Number.isInteger(number) &&
        number >= 27000 &&
        number <= 27999
    ) {

        studentGradeStatus.textContent =
            "✓ Grade 10 Student — 27000 Series";

        studentGradeStatus.className =
            "grade-status grade10";

        return;

    }

    // Existing A/L

    studentGradeStatus.textContent =
        "✓ Existing A/L Student";

    studentGradeStatus.className =
        "grade-status al";

}

// Student ID typing

document
    .getElementById("studentId")
    .addEventListener(
        "input",
        updateGradeStatus
    );

// ==========================
// Add Student
// ==========================

saveStudent.addEventListener(
    "click",
    async () => {

        const id =
            document
                .getElementById(
                    "studentId"
                )
                .value
                .trim();

        const password =
            document
                .getElementById(
                    "studentPassword"
                )
                .value
                .trim();

        const mustChangePassword =
            document
                .getElementById(
                    "mustChange"
                )
                .checked;

        if (!id || !password) {

            alert(
                "Please enter Student ID and Password."
            );

            return;

        }

        // ==========================
        // Detect Grade
        // ==========================

        let studentType =
            "al";

        let grade =
            null;

        const studentNumber =
            Number(id);

        if (
            Number.isInteger(
                studentNumber
            ) &&
            studentNumber >= 26000 &&
            studentNumber <= 26999
        ) {

            studentType =
                "grade11";

            grade =
                11;

        }
        else if (
            Number.isInteger(
                studentNumber
            ) &&
            studentNumber >= 27000 &&
            studentNumber <= 27999
        ) {

            studentType =
                "grade10";

            grade =
                10;

        }

        // ==========================
        // Student Data
        // ==========================

        const studentData = {

            password:
                password,

            mustChangePassword:
                mustChangePassword,

            studentType:
                studentType

        };

        if (grade !== null) {

            studentData.grade =
                grade;

        }

        try {

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
                docSnap => {

                    paperSettings[
                        docSnap.id
                    ] =
                        docSnap.data();

                }
            );

            // ==========================
            // Default Permissions
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
            // Save Student
            // ==========================

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

            clearAddStudentForm();

            studentModal.style.display =
                "none";

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
// Edit Student
// ==========================

table.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".edit-btn"
            );

        if (!button) return;

        currentStudent =
            button.dataset.id;

        try {

            const snap =
                await getDoc(
                    doc(
                        db,
                        "students",
                        currentStudent
                    )
                );

            if (!snap.exists()) {

                alert(
                    "Student not found."
                );

                return;

            }

            const data =
                snap.data();

            document
                .getElementById(
                    "editStudentId"
                )
                .value =
                currentStudent;

            document
                .getElementById(
                    "editPassword"
                )
                .value =
                data.password || "";

            document
                .getElementById(
                    "editMustChange"
                )
                .checked =
                data.mustChangePassword ||
                false;

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
                        data[field] ||
                        false;

                }

            }

            editModal.style.display =
                "flex";

        }
        catch (error) {

            console.error(
                "Edit error:",
                error
            );

            alert(
                "Failed to load student."
            );

        }

    }
);

// ==========================
// Close Edit
// ==========================

closeEdit.addEventListener(
    "click",
    () => {

        editModal.style.display =
            "none";

        currentStudent =
            "";

    }
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

        const confirmReset =
            confirm(
                "Reset viewed status for " +
                currentStudent +
                "?"
            );

        if (!confirmReset)
            return;

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

        try {

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
                "Reset failed."
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

        if (!currentStudent)
            return;

        const password =
            document
                .getElementById(
                    "editPassword"
                )
                .value
                .trim();

        const mustChangePassword =
            document
                .getElementById(
                    "editMustChange"
                )
                .checked;

        const updateData = {

            password:
                password,

            mustChangePassword:
                mustChangePassword

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

                updateData[field] =
                    checkbox.checked;

            }

        }

        try {

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

            editModal.style.display =
                "none";

            currentStudent =
                "";

            await loadStudents();

        }
        catch (error) {

            console.error(
                "Update error:",
                error
            );

            alert(
                "Update failed."
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
            newPassword ===
            null
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

        const confirmed =
            confirm(
                "Reset password for " +
                currentStudent +
                "?"
            );

        if (!confirmed)
            return;

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

            document
                .getElementById(
                    "editPassword"
                )
                .value =
                password;

            alert(
                "Password reset successfully."
            );

        }
        catch (error) {

            console.error(
                "Password reset error:",
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

        if (!currentStudent)
            return;

        const confirmed =
            confirm(
                "Are you sure you want to delete " +
                currentStudent +
                "?"
            );

        if (!confirmed)
            return;

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

            editModal.style.display =
                "none";

            currentStudent =
                "";

            await loadStudents();

        }
        catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(
                "Delete failed."
            );

        }

    }
);

// ==========================
// Clear Add Student Form
// ==========================

function clearAddStudentForm() {

    document
        .getElementById(
            "studentId"
        )
        .value =
        "";

    document
        .getElementById(
            "studentPassword"
        )
        .value =
        "";

    document
        .getElementById(
            "mustChange"
        )
        .checked =
        false;

    if (studentGradeStatus) {

        studentGradeStatus.textContent =
            "";

        studentGradeStatus.className =
            "grade-status";

    }

}

// ==========================
// Close Add Modal
// ==========================

closeModal.addEventListener(
    "click",
    () => {

        clearAddStudentForm();

        studentModal.style.display =
            "none";

    }
);

// ==========================
// Open Add Student
// ==========================

addStudentBtn.addEventListener(
    "click",
    () => {

        clearAddStudentForm();

        studentModal.style.display =
            "flex";

    }
);

// ==========================
// Close Modal Outside
// ==========================

window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            studentModal
        ) {

            studentModal.style.display =
                "none";

        }

        if (
            event.target ===
            editModal
        ) {

            editModal.style.display =
                "none";

            currentStudent =
                "";

        }

    }
);

// ==========================
// ESC
// ==========================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            studentModal.style.display =
                "none";

            editModal.style.display =
                "none";

            currentStudent =
                "";

        }

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
// Console
// ==========================

console.log(
    "✅ Admin Panel Loaded Successfully"
);
// ==========================
// Admin Logout
// ==========================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmed) {
                return;
            }

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            window.location.href =
                "admin-login.html";

        }
    );

}
