import {
    db,
    doc,
    getDoc,
    setDoc
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

    reader.onload = async function (e) {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Read worksheet as array
            const rows = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: ""
            });

            if (rows.length < 2) {
                alert("Excel file is empty.");
                return;
            }

            // Find header row automatically
            let headerRow = -1;

            for (let i = 0; i < rows.length; i++) {

                const values = rows[i].map(v =>
                    String(v).trim().toLowerCase()
                );

                if (
                    values.includes("student id") &&
                    values.includes("password")
                ) {
                    headerRow = i;
                    break;
                }

            }

            if (headerRow === -1) {
                alert("Student ID / Password columns not found.");
                return;
            }

            const headers = rows[headerRow].map(h =>
                String(h).trim().toLowerCase()
            );

            const studentIdIndex = headers.indexOf("student id");
            const passwordIndex = headers.indexOf("password");

            let imported = 0;
            let updated = 0;
            let failed = 0;

            // -------- Part 2 starts here --------            for (let r = headerRow + 1; r < rows.length; r++) {

                const row = rows[r];

                const studentId = String(row[studentIdIndex] || "").trim();
                const password = String(row[passwordIndex] || "").trim();

                // Skip completely empty rows
                if (studentId === "" && password === "") {
                    continue;
                }

                // Invalid row
                if (studentId === "" || password === "") {
                    failed++;
                    continue;
                }

                try {

                    const studentRef = doc(db, "students", studentId);
                    const studentSnap = await getDoc(studentRef);

                    const studentData = {
                        password: password,
                        mustChangePassword: true
                    };

                    // Default permissions
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

                } catch (error) {

                    console.error(error);
                    failed++;

                }

            }

            result.innerHTML = `
                <h3>✅ Import Completed</h3>
                <p>New Students : ${imported}</p>
                <p>Updated : ${updated}</p>
                <p>Failed : ${failed}</p>
            `;

        } catch (error) {

            console.error(error);

            result.innerHTML = `
                <span style="color:red">
                    Import Failed.<br>
                    Open F12 → Console and check the error.
                </span>
            `;

        }

    };

    reader.readAsArrayBuffer(file);

}
