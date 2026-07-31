import {
    db,
    doc,
    setDoc,
    getDoc
} from "./firebase.js";

const fileInput = document.getElementById("excelFile");
const importBtn = document.getElementById("importBtn");
const result = document.getElementById("result");

importBtn.addEventListener("click", importStudents);

async function importStudents() {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an Excel file.");
        return;
    }

    result.innerHTML = "Reading Excel file...";

    const reader = new FileReader();

    reader.onload = async (e) => {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, { type: "array" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: ""
});

if (rows.length < 2) {
    alert("Excel file is empty.");
    return;
}

let imported = 0;
let updated = 0;
let failed = 0;

// Header row
const headers = rows[0].map(h => String(h).trim().toLowerCase());

const studentIdIndex = headers.indexOf("student id");
const passwordIndex = headers.indexOf("password");

if (studentIdIndex === -1 || passwordIndex === -1) {
    alert("Excel file must contain Student ID and Password columns.");
    return;
}

for (let r = 1; r < rows.length; r++) {

    const row = rows[r];

    const studentId = String(row[studentIdIndex] || "").trim();
    const password = String(row[passwordIndex] || "").trim();
                if (!studentId || !password) {
                    failed++;
                    continue;
                }

                const studentRef = doc(db, "students", studentId);

                const studentSnap = await getDoc(studentRef);

                const studentData = {
                    password: password,
                    mustChangePassword: true
                };

                for (let i = 1; i <= 10; i++) {

                    const paper = "paper" + String(i).padStart(2, "0");

                    studentData[paper] = false;
                    studentData[paper + "Viewed"] = false;
                }

                await setDoc(studentRef, studentData);

                if (studentSnap.exists()) {
                    updated++;
                } else {
                    imported++;
                }

            }

            result.innerHTML = `
                <b>✅ Import Completed</b><br><br>
                New Students : ${imported}<br>
                Updated : ${updated}<br>
                Failed : ${failed}
            `;

        } catch (err) {

            console.error(err);

            result.innerHTML =
                "<span style='color:red'>Import Failed. Check Console (F12).</span>";
        }

    };

    reader.readAsArrayBuffer(file);

}
