import {
    db,
    collection,
    getDocs
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
// Variables
// ==========================

let allStudents = [];

const ACTIVE_LIMIT =
    60 * 1000;

// ==========================
// Get Student Status
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
// Get Student Type
// ==========================

function getStudentType(student) {

    if (
        student.data?.studentType ===
        "grade10"
    ) {
        return "grade10";
    }

    if (
        student.data?.studentType ===
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

        // Student ID
        const idCell =
            document.createElement("td");

        idCell.textContent =
            student.id;

        row.appendChild(idCell);

        // Type
        const typeCell =
            document.createElement("td");

        const type =
            getStudentType(student);

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
            badge +
            " " +
            student.viewed +
            "/10";

        row.appendChild(viewedCell);

        // Status
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

        // Password
        const passwordCell =
            document.createElement("td");

        passwordCell.textContent =
            "********";

        row.appendChild(
            passwordCell
        );

        // Action
        const actionCell =
            document.createElement("td");

        const button =
            document.createElement("button");

        button.className =
            "action-btn";

        button.textContent =
            "✏️ Edit";

        button.addEventListener(
    "click",
    () => {

        openEditStudent(
            student.id
        );

    }
);
        actionCell.appendChild(
            button
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
// Edit Student Modal
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

async function openEditStudent(studentId) {

    const student =
        allStudents.find(
            item => item.id === studentId
        );

    if (!student) {

        alert("Student not found.");

        return;

    }

    // Current student
    currentStudent =
        studentId;

    // Student ID
    editStudentId.value =
        studentId;

    // Password
    editPassword.value =
        student.data?.password || "";

    // Force password change
    editMustChange.checked =
        student.data?.mustChangePassword === true;

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
                student.data?.[field] === true;

        }

    }

    // Open modal
    editModal.style.display =
        "flex";

}
closeEdit.addEventListener(
    "click",
    () => {

        editModal.style.display =
            "none";

        currentStudent =
            "";

    }
);

closeEditBottom.addEventListener(
    "click",
    () => {

        editModal.style.display =
            "none";

        currentStudent =
            "";

    }
);

window.addEventListener(
    "click",
    event => {

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

                let viewed = 0;

                // Paper views
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

                // Type counts
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

                // Active
                if (
                    isStudentActive(
                        student
                    )
                ) {

                    activeCount++;

                }

            }
        );

        // Dashboard cards
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

        // Table
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
// ==========================
// Add Student
// ==========================

addStudentBtn.addEventListener(
    "click",
    () => {

        alert(
            "Add Student form will be connected next."
        );

    }
);
