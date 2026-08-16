import * as firebase from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const db =
    firebase.db;

const collection =
    firebase.collection;

const getDocs =
    firebase.getDocs;

const doc =
    firebase.doc;

const getDoc =
    firebase.getDoc;

const setDoc =
    firebase.setDoc;

const updateDoc =
    firebase.updateDoc;

const deleteDoc =
    firebase.deleteDoc;


// =====================================================
// ADMIN PROTECTION
// =====================================================

if (
    sessionStorage.getItem(
        "adminLoggedIn"
    ) !== "true"
) {

    window.location.href =
        "admin-login.html";

}


// =====================================================
// ELEMENTS
// =====================================================

const table =
    document.getElementById(
        "studentTable"
    );

const totalStudents =
    document.getElementById(
        "totalStudents"
    );

const totalViewed =
    document.getElementById(
        "totalViewed"
    );

const onlineStudents =
    document.getElementById(
        "onlineStudents"
    );

const search =
    document.getElementById(
        "search"
    );


const addStudentBtn =
    document.getElementById(
        "addStudentBtn"
    );

const studentModal =
    document.getElementById(
        "studentModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const saveStudent =
    document.getElementById(
        "saveStudent"
    );


const editModal =
    document.getElementById(
        "editModal"
    );

const closeEdit =
    document.getElementById(
        "closeEdit"
    );

const updateStudent =
    document.getElementById(
        "updateStudent"
    );

const deleteStudent =
    document.getElementById(
        "deleteStudent"
    );


// =====================================================
// DATA
// =====================================================

let allStudents = [];

let currentStudent = "";


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Logout from Admin Panel?"
                )
            ) {

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

        }
    );

}


// =====================================================
// STUDENT TYPE
// =====================================================

function getStudentType(
    data
) {

    if (
        data?.studentType ===
        "grade10"
    ) {

        return "Grade 10";

    }


    if (
        data?.studentType ===
        "grade11"
    ) {

        return "Grade 11";

    }


    if (
        String(
            data?.grade || ""
        ) === "10"
    ) {

        return "Grade 10";

    }


    if (
        String(
            data?.grade || ""
        ) === "11"
    ) {

        return "Grade 11";

    }


    return "A/L";

}


// =====================================================
// ACTIVE CHECK
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


    return (
        Date.now() -
        lastActive
        <=
        90 * 1000
    );

}


// =====================================================
// PAPER VIEW COUNT
// =====================================================

function getViewedCount(
    data
) {

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


    return count;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value
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
// RENDER TABLE
// =====================================================

function renderTable(
    list
) {

    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (
        !list.length
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
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


    list.forEach(
        student => {

            const type =
                getStudentType(
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


            table.innerHTML += `

                <tr>

                    <td>

                        <strong>
                            ${escapeHTML(
                                student.id
                            )}
                        </strong>

                    </td>


                    <td>

                        ${type}

                    </td>


                    <td>

                        ${student.viewed}/10

                    </td>


                    <td>

                        <span
                            class="status ${statusClass}"
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

                </tr>

            `;

        }
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
                        colspan="5"
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

        }


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        allStudents = [];


        let studentsCount = 0;

        let viewedCount = 0;

        let activeCount = 0;

        let grade10Count = 0;

        let grade11Count = 0;

        let alCount = 0;


        snapshot.forEach(
            docSnap => {

                studentsCount++;


                const data =
                    docSnap.data();


                const viewed =
                    getViewedCount(
                        data
                    );


                const type =
                    getStudentType(
                        data
                    );


                const active =
                    isStudentActive(
                        data
                    );


                viewedCount +=
                    viewed;


                if (active) {

                    activeCount++;

                }


                if (
                    type ===
                    "Grade 10"
                ) {

                    grade10Count++;

                }
                else if (
                    type ===
                    "Grade 11"
                ) {

                    grade11Count++;

                }
                else {

                    alCount++;

                }


                allStudents.push({

                    id:
                        docSnap.id,

                    viewed:
                        viewed,

                    data:
                        data

                });

            }
        );


        renderTable(
            allStudents
        );


        // =================================================
        // SUMMARY CARDS
        // =================================================

        setElementText(
            "totalStudents",
            studentsCount
        );


        setElementText(
            "totalViewed",
            viewedCount
        );


        setElementText(
            "onlineStudents",
            activeCount
        );


        // Optional counters if HTML has them

        setElementText(
            "grade10Count",
            grade10Count
        );


        setElementText(
            "grade11Count",
            grade11Count
        );


        setElementText(
            "alCount",
            alCount
        );


        setElementText(
            "activeCount",
            activeCount
        );


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
                        colspan="5"
                        style="
                            text-align:center;
                            padding:40px;
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
// SET ELEMENT TEXT
// =====================================================

function setElementText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


// =====================================================
// SEARCH
// =====================================================

if (search) {

    search.addEventListener(
        "input",
        () => {

            const keyword =
                search.value
                    .trim()
                    .toLowerCase();


            const filtered =
                allStudents.filter(
                    student => {

                        const id =
                            String(
                                student.id
                            )
                            .toLowerCase();


                        const type =
                            getStudentType(
                                student.data
                            )
                            .toLowerCase();


                        return (
                            id.includes(
                                keyword
                            ) ||
                            type.includes(
                                keyword
                            )
                        );

                    }
                );


            renderTable(
                filtered
            );

        }
    );

}


// =====================================================
// ADD STUDENT
// =====================================================

if (saveStudent) {

    saveStudent.addEventListener(
        "click",
        async () => {

            const id =
                document
                    .getElementById(
                        "studentId"
                    )
                    ?.value
                    .trim();


            const password =
                document
                    .getElementById(
                        "studentPassword"
                    )
                    ?.value
                    .trim();


            const mustChange =
                document
                    .getElementById(
                        "mustChange"
                    )
                    ?.checked ||
                false;


            if (
                !id ||
                !password
            ) {

                alert(
                    "Please enter Student ID and Password."
                );

                return;

            }


            // =================================================
            // CHECK DUPLICATE
            // =================================================

            try {

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


                // =================================================
                // CREATE STUDENT
                // =================================================

                const studentData = {

                    password:
                        password,

                    mustChangePassword:
                        mustChange

                };


                // =================================================
                // DEFAULT PAPER DATA
                // =================================================

                for (
                    let i = 1;
                    i <= 10;
                    i++
                ) {

                    const paper =
                        "paper" +
                        String(i)
                            .padStart(
                                2,
                                "0"
                            );


                    studentData[
                        paper
                    ] = false;


                    studentData[
                        paper +
                        "Viewed"
                    ] = false;


                    studentData[
                        paper +
                        "Pages"
                    ] = 10;

                }


                // =================================================
                // SAVE
                // =================================================

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


                if (
                    studentModal
                ) {

                    studentModal.style.display =
                        "none";

                }


                await loadStudents();

            }

            catch (error) {

                console.error(
                    "Add Student Error:",
                    error
                );


                alert(
                    "Failed to add student."
                );

            }

        }
    );

}


// =====================================================
// EDIT STUDENT
// =====================================================

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


            if (
                !currentStudent
            ) {

                return;

            }


            try {

                const snap =
                    await getDoc(
                        doc(
                            db,
                            "students",
                            currentStudent
                        )
                    );


                if (
                    !snap.exists()
                ) {

                    alert(
                        "Student not found."
                    );

                    return;

                }


                const data =
                    snap.data();


                // =================================================
                // ID
                // =================================================

                const editId =
                    document.getElementById(
                        "editStudentId"
                    );


                if (editId) {

                    editId.value =
                        currentStudent;

                }


                // =================================================
                // PASSWORD
                // =================================================

                const editPassword =
                    document.getElementById(
                        "editPassword"
                    );


                if (editPassword) {

                    editPassword.value =
                        data.password ||
                        "";

                }


                // =================================================
                // MUST CHANGE
                // =================================================

                const editMustChange =
                    document.getElementById(
                        "editMustChange"
                    );


                if (editMustChange) {

                    editMustChange.checked =
                        data.mustChangePassword ||
                        false;

                }


                // =================================================
                // PAPER PERMISSIONS
                // =================================================

                for (
                    let i = 1;
                    i <= 10;
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
                            data[field] ===
                            true;

                    }

                }


                // =================================================
                // VIEWED STATUS
                // =================================================

                for (
                    let i = 1;
                    i <= 10;
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


                    const viewed =
                        document.getElementById(
                            field
                        );


                    if (viewed) {

                        viewed.checked =
                            data[field] ===
                            true;

                    }

                }


                if (
                    editModal
                ) {

                    editModal.style.display =
                        "flex";

                }

            }

            catch (error) {

                console.error(
                    "Edit Student Error:",
                    error
                );


                alert(
                    "Failed to load student."
                );

            }

        }
    );

}


// =====================================================
// CLOSE EDIT
// =====================================================

if (closeEdit) {

    closeEdit.addEventListener(
        "click",
        () => {

            if (
                editModal
            ) {

                editModal.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// UPDATE STUDENT
// =====================================================

if (updateStudent) {

    updateStudent.addEventListener(
        "click",
        async () => {

            if (
                !currentStudent
            ) {

                alert(
                    "No student selected."
                );

                return;

            }


            const editPassword =
                document.getElementById(
                    "editPassword"
                );


            const editMustChange =
                document.getElementById(
                    "editMustChange"
                );


            const updateData = {

                password:
                    editPassword
                        ? editPassword.value
                        : "",

                mustChangePassword:
                    editMustChange
                        ? editMustChange.checked
                        : false

            };


            // =================================================
            // PAPER PERMISSIONS
            // =================================================

            for (
                let i = 1;
                i <= 10;
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


                if (
                    editModal
                ) {

                    editModal.style.display =
                        "none";

                }


                currentStudent =
                    "";


                await loadStudents();

            }

            catch (error) {

                console.error(
                    "Update Student Error:",
                    error
                );


                alert(
                    "Update failed."
                );

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

            if (
                !currentStudent
            ) {

                return;

            }


            const ok =
                confirm(
                    "Are you sure you want to delete " +
                    currentStudent +
                    " ?"
                );


            if (!ok) {

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


                if (
                    editModal
                ) {

                    editModal.style.display =
                        "none";

                }


                currentStudent =
                    "";


                await loadStudents();

            }

            catch (error) {

                console.error(
                    "Delete Student Error:",
                    error
                );


                alert(
                    "Delete failed."
                );

            }

        }
    );

}


// =====================================================
// ESC KEY
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                studentModal
            ) {

                studentModal.style.display =
                    "none";

            }


            if (
                editModal
            ) {

                editModal.style.display =
                    "none";

            }

        }

    }
);


// =====================================================
// CLEAR ADD FORM
// =====================================================

function clearAddStudentForm() {

    const studentId =
        document.getElementById(
            "studentId"
        );


    const password =
        document.getElementById(
            "studentPassword"
        );


    const mustChange =
        document.getElementById(
            "mustChange"
        );


    if (studentId) {

        studentId.value = "";

    }


    if (password) {

        password.value = "";

    }


    if (mustChange) {

        mustChange.checked =
            false;

    }

}


// =====================================================
// OPEN ADD STUDENT MODAL
// =====================================================

if (addStudentBtn) {

    addStudentBtn.addEventListener(
        "click",
        () => {

            clearAddStudentForm();


            if (
                studentModal
            ) {

                studentModal.style.display =
                    "flex";

            }

        }
    );

}


// =====================================================
// CLOSE ADD MODAL
// =====================================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            clearAddStudentForm();


            if (
                studentModal
            ) {

                studentModal.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// CLICK OUTSIDE MODAL
// =====================================================

window.addEventListener(
    "click",
    event => {

        if (
            studentModal &&
            event.target ===
            studentModal
        ) {

            studentModal.style.display =
                "none";

        }


        if (
            editModal &&
            event.target ===
            editModal
        ) {

            editModal.style.display =
                "none";

        }

    }
);


// =====================================================
// SELECT ALL PAPERS
// =====================================================

const selectAllPapers =
    document.getElementById(
        "selectAllPapers"
    );


if (selectAllPapers) {

    selectAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= 10;
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

const removeAllPapers =
    document.getElementById(
        "removeAllPapers"
    );


if (removeAllPapers) {

    removeAllPapers.addEventListener(
        "click",
        () => {

            for (
                let i = 1;
                i <= 10;
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

const resetViewed =
    document.getElementById(
        "resetViewed"
    );


if (resetViewed) {

    resetViewed.addEventListener(
        "click",
        async () => {

            if (
                !currentStudent
            ) {

                return;

            }


            const ok =
                confirm(
                    "Reset all viewed paper status for this student?"
                );


            if (!ok) {

                return;

            }


            const updateData = {};


            for (
                let i = 1;
                i <= 10;
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
                    "Reset Viewed Error:",
                    error
                );


                alert(
                    "Failed to reset viewed status."
                );

            }

        }
    );

}


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPasswordBtn =
    document.getElementById(
        "resetPasswordBtn"
    );


if (resetPasswordBtn) {

    resetPasswordBtn.addEventListener(
        "click",
        () => {

            const password =
                document.getElementById(
                    "editPassword"
                );


            if (!password) {

                return;

            }


            const generated =
                Math.random()
                    .toString(
                        36
                    )
                    .slice(
                        2,
                        10
                    );


            password.value =
                generated;


            password.focus();

        }
    );

}


// =====================================================
// AUTO REFRESH
// =====================================================

async function refreshDashboard() {

    await loadStudents();

}


setInterval(
    refreshDashboard,
    30000
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Students Admin Panel Loaded"
);
