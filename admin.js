import * as firebase from "./firebase.js";

const db = firebase.db;
const collection = firebase.collection;
const getDocs = firebase.getDocs;
const doc = firebase.doc;
const getDoc = firebase.getDoc;
const setDoc = firebase.setDoc;
const updateDoc = firebase.updateDoc;
const deleteDoc = firebase.deleteDoc;

// Protect Admin Page
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// Elements
const table = document.getElementById("studentTable");
const totalStudents = document.getElementById("totalStudents");
const totalViewed = document.getElementById("totalViewed");
const onlineStudents = document.getElementById("onlineStudents");
const search = document.getElementById("search");

const addStudentBtn = document.getElementById("addStudentBtn");
const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");
const saveStudent = document.getElementById("saveStudent");

const editModal = document.getElementById("editModal");
const closeEdit = document.getElementById("closeEdit");
const updateStudent = document.getElementById("updateStudent");
const deleteStudent = document.getElementById("deleteStudent");

let allStudents = [];
let currentStudent = "";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Logout from Admin Panel?")) {

        sessionStorage.removeItem("adminLoggedIn");
        window.location.href = "admin-login.html";

    }

});

// ==========================
// Render Table
// ==========================

function renderTable(list){

    table.innerHTML="";

    list.forEach(student=>{

        table.innerHTML+=`

        <tr>

            <td>${student.id}</td>

            <td>${student.viewed}/10</td>

            <td>********</td>

            <td>

                <button
                    class="action-btn edit-btn"
                    data-id="${student.id}">

                    ✏️ Edit

                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================
// Load Students
// ==========================

async function loadStudents(){

    const snapshot = await getDocs(collection(db,"students"));

    allStudents=[];

    let students=0;
    let viewed=0;

    snapshot.forEach(docSnap=>{

        students++;

        const data=docSnap.data();

        let count=0;

        for(let i=1;i<=10;i++){

            const field="paper"+String(i).padStart(2,"0")+"Viewed";

            if(data[field]===true){

                count++;

            }

        }

        viewed+=count;

        allStudents.push({

            id:docSnap.id,
            viewed:count,
            data:data

        });

    });

    renderTable(allStudents);

    totalStudents.textContent=students;
    totalViewed.textContent=viewed;
    onlineStudents.textContent=students;

}

loadStudents();

// ==========================
// Search
// ==========================

search.addEventListener("input",()=>{

    const keyword=search.value.toLowerCase();

    const filtered=allStudents.filter(student=>

        student.id.toLowerCase().includes(keyword)

    );

    renderTable(filtered);

});
// ==========================
// Add Student
// ==========================

saveStudent.addEventListener("click", async () => {

    const id = document.getElementById("studentId").value.trim();
    const password = document.getElementById("studentPassword").value.trim();
    const mustChangePassword =
        document.getElementById("mustChange").checked;

    if (!id || !password) {
        alert("Please enter Student ID and Password.");
        return;
    }

    const studentData = {
        password: password,
        mustChangePassword: mustChangePassword
    };

// Read Paper Settings
const papersSnapshot = await getDocs(collection(db, "papers"));

const paperSettings = {};

papersSnapshot.forEach((docSnap) => {

    paperSettings[docSnap.id] = docSnap.data();

});

// Apply Default Paper Permissions
for (let i = 1; i <= 10; i++) {

    const paper = "paper" + String(i).padStart(2, "0");

    const settings = paperSettings[paper];

    // Default Permission
    studentData[paper] =
        settings?.defaultAvailable === true;

    // Viewed Status
    studentData[paper + "Viewed"] = false;

    // Pages
    studentData[paper + "Pages"] =
        settings?.pages || 10;

}

    try {

        await setDoc(doc(db, "students", id), studentData);

        alert("Student added successfully.");

        document.getElementById("studentId").value = "";
        document.getElementById("studentPassword").value = "";
        document.getElementById("mustChange").checked = false;

        studentModal.style.display = "none";

        loadStudents();

    } catch (err) {

        console.error(err);
        alert("Failed to add student.");

    }

});

// ==========================
// Edit Student
// ==========================

table.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("edit-btn")) return;

    currentStudent = e.target.dataset.id;

    const snap = await getDoc(doc(db, "students", currentStudent));

    if (!snap.exists()) return;

    const data = snap.data();

    document.getElementById("editStudentId").value = currentStudent;
    document.getElementById("editPassword").value = data.password || "";
    document.getElementById("editMustChange").checked =
        data.mustChangePassword || false;

    for (let i = 1; i <= 10; i++) {

        const field = "paper" + String(i).padStart(2, "0");

        document.getElementById(field).checked =
            data[field] || false;

    }

    editModal.style.display = "flex";

});

closeEdit.addEventListener("click", () => {

    editModal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === editModal) {

        editModal.style.display = "none";

    }

});
// ==========================
// Update Student
// ==========================

updateStudent.addEventListener("click", async () => {

    const updateData = {

        password: document.getElementById("editPassword").value,
        mustChangePassword:
            document.getElementById("editMustChange").checked

    };

    // Update Paper Permissions Only
    for (let i = 1; i <= 10; i++) {

        const field = "paper" + String(i).padStart(2, "0");

        updateData[field] =
            document.getElementById(field).checked;

    }

    try {

        await updateDoc(
            doc(db, "students", currentStudent),
            updateData
        );

        alert("Student updated successfully.");

        editModal.style.display = "none";

        loadStudents();

    } catch (err) {

        console.error(err);

        alert("Update failed.");

    }

});

// ==========================
// Delete Student
// ==========================

deleteStudent.addEventListener("click", async () => {

    if (!currentStudent) return;

    const ok = confirm(
        "Are you sure you want to delete " +
        currentStudent +
        " ?"
    );

    if (!ok) return;

    try {

        await deleteDoc(doc(db, "students", currentStudent));

        alert("Student deleted successfully.");

        editModal.style.display = "none";

        currentStudent = "";

        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Delete failed.");

    }

});

// ==========================
// ESC Key Close
// ==========================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        studentModal.style.display = "none";
        editModal.style.display = "none";

    }

});

// ==========================
// Clear Add Student Form
// ==========================

function clearAddStudentForm() {

    document.getElementById("studentId").value = "";
    document.getElementById("studentPassword").value = "";
    document.getElementById("mustChange").checked = false;

}

closeModal.addEventListener("click", clearAddStudentForm);

// Open Add Student Modal
addStudentBtn.addEventListener("click", () => {

    clearAddStudentForm();
    studentModal.style.display = "flex";

});

window.addEventListener("click", (e) => {

    if (e.target === studentModal) {

        studentModal.style.display = "none";

    }

});

// ==========================
// Refresh Dashboard
// ==========================

async function refreshDashboard() {

    await loadStudents();

}

setInterval(refreshDashboard, 30000);

// ==========================
// Console
// ==========================

console.log("Admin Panel Loaded Successfully");
