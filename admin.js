import * as firebase from "./firebase.js";

const db = firebase.db;
const collection = firebase.collection;
const getDocs = firebase.getDocs;

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

// Student list
let allStudents = [];

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Logout from Admin Panel?")) {

        sessionStorage.removeItem("adminLoggedIn");
        window.location.href = "admin-login.html";

    }

});

// Render Table
function renderTable(list){

    table.innerHTML="";

    list.forEach(student=>{

        table.innerHTML += `
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

// Load Students
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

            const field="paper"+String(i).padStart(2,"0");

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

// Live Search
search.addEventListener("input",()=>{

    const keyword=search.value.toLowerCase();

    const filtered=allStudents.filter(student=>

        student.id.toLowerCase().includes(keyword)

    );

    renderTable(filtered);

});
const doc = firebase.doc;
const setDoc = firebase.setDoc;
// =========================
// Add Student Modal
// =========================

const addStudentBtn = document.getElementById("addStudentBtn");
const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");
const saveStudent = document.getElementById("saveStudent");

addStudentBtn.addEventListener("click", () => {
    studentModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    studentModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === studentModal) {
        studentModal.style.display = "none";
    }
});

saveStudent.addEventListener("click", async () => {

    const id = document.getElementById("studentId").value.trim();
    const password = document.getElementById("studentPassword").value.trim();
    const mustChange = document.getElementById("mustChange").checked;

    if (!id || !password) {
        alert("Please enter Student ID and Password.");
        return;
    }

    const studentData = {
        password: password,
        mustChange: mustChange
    };

    // Default paper permissions
    for (let i = 1; i <= 10; i++) {
        studentData["paper" + String(i).padStart(2, "0")] = false;
    }

    try {

        await setDoc(doc(db, "students", id), studentData);

        alert("Student added successfully.");

        document.getElementById("studentId").value = "";
        document.getElementById("studentPassword").value = "";
        document.getElementById("mustChange").checked = false;

        studentModal.style.display = "none";

        loadStudents();

    } catch (error) {

        console.error(error);
        alert("Failed to add student.");

    }

});
