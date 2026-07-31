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

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
            type: "array"
        });

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet);

        if (rows.length === 0) {
            alert("Excel file is empty.");
            return;
        }

        let imported = 0;
        let updated = 0;
        let failed = 0;

        for (const row of rows) {

            const studentId =
                String(row["Student ID"]).trim();

            const password =
                String(row["Password"]).trim();

            if (!studentId || !password) {
                failed++;
                continue;
            }

            try {

                const studentRef = doc(db, "students", studentId);

                const studentSnap = await getDoc(studentRef);

                // Part 2 continues here...
