import * as firebase from "./firebase.js";

const db = firebase.db;
const collection = firebase.collection;
const getDocs = firebase.getDocs;

// Protect Admin Page
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    sessionStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";

});

const table = document.getElementById("reportTable");
const search = document.getElementById("search");

let students = [];

// Load Reports
async function loadReports() {

    const snapshot = await getDocs(collection(db, "students"));

    students = [];

    let totalStudents = 0;
    let totalViews = 0;
    let completedStudents = 0;

    snapshot.forEach(docSnap => {

        totalStudents++;

        const data = docSnap.data();

        let viewed = 0;

        for (let i = 1; i <= 10; i++) {

            if (data["paper" + String(i).padStart(2, "0") + "Viewed"]) {

                viewed++;

            }

        }

        totalViews += viewed;

        if (viewed === 10) {

            completedStudents++;

        }

        students.push({

            id: docSnap.id,
            viewed: viewed

        });

    });

    document.getElementById("totalStudents").textContent =
        totalStudents;

    document.getElementById("totalViews").textContent =
        totalViews;

    document.getElementById("averageProgress").textContent =
        totalStudents === 0
            ? "0%"
            : Math.round((totalViews / (totalStudents * 10)) * 100) + "%";

    document.getElementById("completedStudents").textContent =
        completedStudents;

    renderTable(students);

}

// Render Table
function renderTable(list) {

    table.innerHTML = "";

    list.forEach(student => {

        let progress = student.viewed * 10;

        let status = "🔴 Not Started";
        let cls = "not-started";

        if (student.viewed === 10) {

            status = "🟢 Complete";
            cls = "complete";

        } else if (student.viewed > 0) {

            status = "🟡 In Progress";
            cls = "progress";

        }

        table.innerHTML += `

        <tr>

            <td>${student.id}</td>

            <td>${student.viewed}/10</td>

            <td>${progress}%</td>

            <td class="${cls}">
                ${status}
            </td>

        </tr>

        `;

    });

}

// Search
search.addEventListener("input", () => {

    const keyword = search.value.toLowerCase();

    renderTable(

        students.filter(student =>

            student.id.toLowerCase().includes(keyword)

        )

    );

});

// Export CSV
document.getElementById("exportBtn").addEventListener("click", () => {

    let csv = "Student ID,Viewed,Progress\n";

    students.forEach(student => {

        csv += `${student.id},${student.viewed}/10,${student.viewed * 10}%\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "Student_Report.csv";

    a.click();

});

// Load
loadReports();
