import {
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    setDoc
} from "./firebase.js";
async function importStudents() {

    console.log("Import Started");

    const file = fileInput.files[0];

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

    result.innerHTML = "<p>Reading Excel file...</p>";

    const reader = new FileReader();

    reader.onload = async (e) => {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });

            const sheet =
                workbook.Sheets[workbook.SheetNames[0]];

            const rows =
                XLSX.utils.sheet_to_json(sheet);

            if (rows.length === 0) {

                alert("Excel file is empty.");

                return;

            }

            // Load Paper Settings

            const paperSnapshot =
                await getDocs(collection(db, "papers"));

            const paperSettings = {};

            paperSnapshot.forEach(docSnap => {

                paperSettings[docSnap.id] =
                    docSnap.data();

            });

            let imported = 0;
            let updated = 0;
            let failed = 0;
                      for (const row of rows) {

                const studentId =
                    String(row["Student ID"] || "").trim();

                const password =
                    String(row["Password"] || "").trim();

                if (!studentId || !password) {

                    failed++;
                    continue;

                }

                try {

                    const studentRef =
                        doc(db, "students", studentId);

                    const studentSnap =
                        await getDoc(studentRef);

                    const studentData = {

                        password: password,
                        mustChangePassword: true

                    };

                    // Apply Paper Settings

                    for (let i = 1; i <= 10; i++) {

                        const paper =
                            "paper" + String(i).padStart(2, "0");

                        const settings =
                            paperSettings[paper];

                        studentData[paper] =
                            settings?.defaultAvailable === true;

                        studentData[paper + "Viewed"] = false;

                        studentData[paper + "Pages"] =
                            settings?.pages || 10;

                    }

                    await setDoc(
                        studentRef,
                        studentData,
                        { merge: true }
                    );

                    if (studentSnap.exists()) {

                        updated++;

                    } else {

                        imported++;

                    }

               } catch (err) {

    console.error("Student ID:", studentId);
    console.error("Import Error:", err);

    alert(err.message);

    failed++;

}

            }
                      result.innerHTML = `
                <h3>✅ Import Completed</h3>
                <p><strong>New Students:</strong> ${imported}</p>
                <p><strong>Updated:</strong> ${updated}</p>
                <p><strong>Failed:</strong> ${failed}</p>
            `;

        } catch (err) {

            console.error(err);

            result.innerHTML = `
                <span style="color:red">
                    ❌ Import Failed.<br>
                    Check Console (F12).
                </span>
            `;

        }

    };

    reader.readAsArrayBuffer(file);

}
