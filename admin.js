import * as firebase from "./firebase.js";

const db = firebase.db;
const getDocs = firebase.getDocs;
const collection = firebase.collection;

// Protect Admin Page
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

const table = document.getElementById("studentTable");

const totalStudents = document.getElementById("totalStudents");
const totalViewed = document.getElementById("totalViewed");

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Logout from Admin Panel?")) {

        sessionStorage.removeItem("adminLoggedIn");

        window.location.href = "admin-login.html";

    }

});

async function loadStudents() {

    const snapshot = await getDocs(collection(db, "students"));

    let students = 0;
    let viewed = 0;

    table.innerHTML = "";

    snapshot.forEach(docSnap => {

        students++;

        const data = docSnap.data();

        let count = 0;

        for (let i = 1; i <= 10; i++) {

            const field = "paper" + String(i).padStart(2, "0");

            if (data[field] === true) count++;

        }

        viewed += count;

        table.innerHTML += `
            <tr>
                <td>${docSnap.id}</td>
                <td>${count}/10</td>
                <td>********</td>
                <td>
                    <button class="action-btn">
                        Edit
                    </button>
                </td>
            </tr>
        `;

    });

    totalStudents.textContent = students;
    totalViewed.textContent = viewed;

}

loadStudents();
