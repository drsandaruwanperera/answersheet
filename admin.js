import * as firebase from "./firebase.js";

const db = firebase.db;
const collection = firebase.collection;
const getDocs = firebase.getDocs;
const doc = firebase.doc;
const getDoc = firebase.getDoc;
const updateDoc = firebase.updateDoc;
const deleteDoc = firebase.deleteDoc;


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

const table =
    document.getElementById("studentTable");


// Dashboard cards

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


// Dashboard analytics

const dashboardGrade10 =
    document.getElementById("dashboardGrade10");

const dashboardGrade11 =
    document.getElementById("dashboardGrade11");

const dashboardAL =
    document.getElementById("dashboardAL");

const dashboardActive =
    document.getElementById("dashboardActive");

const grade10Bar =
    document.getElementById("grade10Bar");

const grade11Bar =
    document.getElementById("grade11Bar");

const alBar =
    document.getElementById("alBar");


// Edit modal

const editModal =
    document.getElementById("editModal");

const closeEdit =
    document.getElementById("closeEdit");

const updateStudent =
    document.getElementById("updateStudent");

const deleteStudent =
    document.getElementById("deleteStudent");


// Edit fields

const editStudentId =
    document.getElementById("editStudentId");

const editPassword =
    document.getElementById("editPassword");

const editMustChange =
    document.getElementById("editMustChange");


// Paper tools

const selectAllPapers =
    document.getElementById("selectAllPapers");

const removeAllPapers =
    document.getElementById("removeAllPapers");

const resetViewed =
    document.getElementById("resetViewed");


// Reset password

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");


// Logout

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================
// Variables
// ==========================

let allStudents = [];

let currentStudent = null;


// Active limit
// Student active for 60 seconds

const ACTIVE_LIMIT =
    60 * 1000;


// ==========================
// Check Student Active
// ==========================

function isStudentActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
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
// Get Student Type
// ==========================

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

    return "al";

}


// ==========================
// Render Table
// ==========================

function renderTable(list) {

    if (!table) {
        return;
    }

    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
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
        // Type / Grade
        // ==========================

        const typeCell =
            document.createElement("td");

        const type =
            getStudentType(
                student.data
            );


        if (type === "grade10") {

            typeCell.textContent =
                "🎓 Grade 10";

        }

        else if (type === "grade11") {

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

        row.appendChild(
            viewedCell
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
        // Action
        // ==========================

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


        allStudents = [];


        let students = 0;

        let viewed = 0;

        let grade10Count = 0;

        let grade11Count = 0;

        let alCount = 0;

        let activeCount = 0;


        // ==========================
        // Read Students
        // ==========================

        snapshot.forEach(
            docSnap => {

                students++;


                const data =
                    docSnap.data();


                // ==========================
                // Student Type
                // ==========================

                const type =
                    getStudentType(
                        data
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
                // Active Student
                // ==========================

                if (
                    isStudentActive(
                        data
                    )
                ) {

                    activeCount++;

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


                // ==========================
                // Store Student
                // ==========================

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
        // Dashboard Cards
        // ==========================

        if (totalStudents) {

            totalStudents.textContent =
                students;

        }


        if (totalViewed) {

            totalViewed.textContent =
                viewed;

        }


        if (grade10Students) {

            grade10Students.textContent =
                grade10Count;

        }


        if (grade11Students) {

            grade11Students.textContent =
                grade11Count;

        }


        if (alStudents) {

            alStudents.textContent =
                alCount;

        }


        if (activeStudents) {

            activeStudents.textContent =
                activeCount;

        }


        // ==========================
        // Student Analytics
        // ==========================

        if (dashboardGrade10) {

            dashboardGrade10.textContent =
                grade10Count;

        }


        if (dashboardGrade11) {

            dashboardGrade11.textContent =
                grade11Count;

        }


        if (dashboardAL) {

            dashboardAL.textContent =
                alCount;

        }


        if (dashboardActive) {

            dashboardActive.textContent =
                activeCount;

        }


        // ==========================
        // Analytics Bars
        // ==========================

        const total =
            students || 1;


        if (grade10Bar) {

            grade10Bar.style.width =
                (
                    grade10Count /
                    total *
                    100
                ) +
                "%";

        }


        if (grade11Bar) {

            grade11Bar.style.width =
                (
                    grade11Count /
                    total *
                    100
                ) +
                "%";

        }


        if (alBar) {

            alBar.style.width =
                (
                    alCount /
                    total *
                    100
                ) +
                "%";

        }


        // ==========================
        // Render
        // ==========================

        renderTable(
            allStudents
        );


        console.log(
            "Students loaded:",
            students
        );

        console.log(
            "Grade 10:",
            grade10Count
        );

        console.log(
            "Grade 11:",
            grade11Count
        );

        console.log(
            "A/L:",
            alCount
        );

        console.log(
            "Active:",
            activeCount
        );

    }

    catch (error) {

        console.error(
            "Load students error:",
            error
        );

        alert(
            "Failed to load students."
        );

    }

}


// ==========================
// Edit Student
// ==========================

if (table) {

    table.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    ".edit-btn"
                );


            if (!button) {
                return;
            }


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


                // Student ID

                if (editStudentId) {

                    editStudentId.value =
                        currentStudent;

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
                    "Edit student error:",
                    error
                );

                alert(
                    "Failed to load student."
                );

            }

        }
    );

}


// ==========================
// Close Edit
// ==========================

function closeEditModal() {

    if (editModal) {

        editModal.style.display =
            "none";

    }

    currentStudent = null;

}


if (closeEdit) {

    closeEdit.addEventListener(
        "click",
        closeEditModal
    );

}


window.addEventListener(
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


// ==========================
// Select All Papers
// ==========================

if (selectAllPapers) {

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

}


// ==========================
// Remove All Papers
// ==========================

if (removeAllPapers) {

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

}


// ==========================
// Reset Viewed
// ==========================

if (resetViewed) {

    resetViewed.addEventListener(
        "click",
        async () => {

            if (!currentStudent) {

                alert(
                    "Please select a student first."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Reset viewed status for this student?"
                );


            if (!confirmed) {
                return;
            }


            const updateData = {};


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
                ] = false;

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

}


// ==========================
// Update Student
// ==========================

if (updateStudent) {

    updateStudent.addEventListener(
        "click",
        async () => {

            if (!currentStudent) {

                alert(
                    "Please select a student."
                );

                return;

            }


            const updateData = {

                password:
                    editPassword?.value.trim() || "",

                mustChangePassword:
                    editMustChange?.checked === true

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


                closeEditModal();


                await loadStudents();

            }

            catch (error) {

                console.error(
                    "Update student error:",
                    error
                );

                alert(
                    "Update failed."
                );

            }

        }
    );

}


// ==========================
// Reset Password
// ==========================

if (resetPasswordBtn) {

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


            const confirmed =
                confirm(
                    "Reset password for " +
                    currentStudent +
                    "?"
                );


            if (!confirmed) {
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


                if (editPassword) {

                    editPassword.value =
                        password;

                }


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

}


// ==========================
// Delete Student
// ==========================

if (deleteStudent) {

    deleteStudent.addEventListener(
        "click",
        async () => {

            if (!currentStudent) {

                alert(
                    "Please select a student first."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete " +
                    currentStudent +
                    "?"
                );


            if (!confirmed) {
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
                    "Delete failed."
                );

            }

        }
    );

}


// ==========================
// Admin Logout
// ==========================

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


// ==========================
// ESC Close Modal
// ==========================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeEditModal();

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
// Start
// ==========================

loadStudents();


console.log(
    "✅ Admin Dashboard Loaded"
);
