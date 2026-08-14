import {
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    setDoc
} from "./firebase.js";


// ==================================================
// ELEMENTS
// ==================================================

const fileInput =
    document.getElementById("excelFile");

const importBtn =
    document.getElementById("importBtn");

const result =
    document.getElementById("result");

const selectedType =
    document.getElementById("selectedType");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const downloadTemplateBtn =
    document.getElementById(
        "downloadTemplateBtn"
    );

const fileName =
    document.getElementById("fileName");


// ==================================================
// CATEGORY SELECTION
// ==================================================

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const type =
                button.dataset.type;


            selectedType.value =
                type;


            categoryButtons.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            button.classList.add(
                "selected"
            );


            console.log(
                "Selected import type:",
                type
            );

        }
    );

});


// ==================================================
// FILE NAME
// ==================================================

fileInput.addEventListener(
    "change",
    () => {

        const file =
            fileInput.files[0];


        if (file) {

            fileName.textContent =
                "📄 " + file.name;

        }
        else {

            fileName.textContent =
                "No file selected";

        }

    }
);


// ==================================================
// DOWNLOAD SAMPLE TEMPLATE
// ==================================================

downloadTemplateBtn.addEventListener(
    "click",
    () => {

        const sampleData = [

            {
                "Student ID": "001",
                "Password": "1234"
            },

            {
                "Student ID": "002",
                "Password": "5678"
            }

        ];


        const worksheet =
            XLSX.utils.json_to_sheet(
                sampleData
            );


        const workbook =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Students"
        );


        XLSX.writeFile(
            workbook,
            "Student-Import-Template.xlsx"
        );

    }
);


// ==================================================
// IMPORT BUTTON
// ==================================================

importBtn.addEventListener(
    "click",
    importStudents
);


// ==================================================
// DETECT STUDENT TYPE
// ==================================================

function detectStudentType(
    studentId
) {

    const number =
        Number(studentId);


    // ----------------------------------------------
    // Grade 11
    // 26000 - 26999
    // ----------------------------------------------

    if (
        Number.isInteger(number) &&
        number >= 26000 &&
        number <= 26999
    ) {

        return {

            studentType:
                "grade11",

            grade:
                11

        };

    }


    // ----------------------------------------------
    // Grade 10
    // 27000 - 27999
    // ----------------------------------------------

    if (
        Number.isInteger(number) &&
        number >= 27000 &&
        number <= 27999
    ) {

        return {

            studentType:
                "grade10",

            grade:
                10

        };

    }


    // ----------------------------------------------
    // Everything else = A/L
    // ----------------------------------------------

    return {

        studentType:
            "al",

        grade:
            null

    };

}


// ==================================================
// IMPORT STUDENTS
// ==================================================

async function importStudents() {

    const file =
        fileInput.files[0];


    // ------------------------------------------------
    // File validation
    // ------------------------------------------------

    if (!file) {

        alert(
            "Please select an Excel file."
        );

        return;

    }


    // ------------------------------------------------
    // Category validation
    // ------------------------------------------------

    const selected =
        selectedType.value;


    if (
        ![
            "al",
            "grade10",
            "grade11"
        ].includes(selected)
    ) {

        alert(
            "Please select a student category first."
        );

        return;

    }


    // ------------------------------------------------
    // UI
    // ------------------------------------------------

    importBtn.disabled =
        true;

    importBtn.textContent =
        "⏳ Importing...";


    result.innerHTML = `
        <p>
            📖 Reading Excel file...
        </p>
    `;


    const reader =
        new FileReader();


    reader.onload =
        async (event) => {

            try {

                // ==========================================
                // Read Excel
                // ==========================================

                const data =
                    new Uint8Array(
                        event.target.result
                    );


                const workbook =
                    XLSX.read(
                        data,
                        {
                            type:
                                "array"
                        }
                    );


                if (
                    !workbook.SheetNames.length
                ) {

                    throw new Error(
                        "Excel file does not contain a worksheet."
                    );

                }


                const sheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        sheet,
                        {
                            defval: ""
                        }
                    );


                if (
                    rows.length === 0
                ) {

                    throw new Error(
                        "Excel file is empty."
                    );

                }


                // ==========================================
                // Load Paper Settings
                // ==========================================

                const paperSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "papers"
                        )
                    );


                const paperSettings =
                    {};


                paperSnapshot.forEach(
                    paperDoc => {

                        paperSettings[
                            paperDoc.id
                        ] =
                            paperDoc.data();

                    }
                );


                // ==========================================
                // Counters
                // ==========================================

                let imported =
                    0;

                let updated =
                    0;

                let failed =
                    0;

                let grade10Count =
                    0;

                let grade11Count =
                    0;

                let alCount =
                    0;


                // ==========================================
                // Process Rows
                // ==========================================

                for (
                    let index = 0;
                    index < rows.length;
                    index++
                ) {

                    const row =
                        rows[index];


                    try {

                        // ----------------------------------
                        // Find columns
                        // ----------------------------------

                        const keys =
                            Object.keys(
                                row
                            );


                        const studentIdKey =
                            keys.find(
                                key =>
                                    key
                                        .trim()
                                        .toLowerCase() ===
                                    "student id"
                            );


                        const passwordKey =
                            keys.find(
                                key =>
                                    key
                                        .trim()
                                        .toLowerCase() ===
                                    "password"
                            );


                        if (
                            !studentIdKey ||
                            !passwordKey
                        ) {

                            throw new Error(
                                "Missing Student ID or Password column."
                            );

                        }


                        // ----------------------------------
                        // Get values
                        // ----------------------------------

                        const studentId =
                            String(
                                row[
                                    studentIdKey
                                ]
                            )
                                .trim();


                        const password =
                            String(
                                row[
                                    passwordKey
                                ]
                            )
                                .trim();


                        // ----------------------------------
                        // Validation
                        // ----------------------------------

                        if (
                            !studentId ||
                            !password
                        ) {

                            throw new Error(
                                "Student ID or Password is empty."
                            );

                        }


                        if (
                            password.length < 4
                        ) {

                            throw new Error(
                                "Password must contain at least 4 characters."
                            );

                        }


                        // ==================================
                        // Detect Type From ID
                        // ==================================

                        const detected =
                            detectStudentType(
                                studentId
                            );


                        // ==================================
                        // Warn if selected category
                        // doesn't match ID
                        // ==================================

                        if (
                            selected !==
                            detected.studentType
                        ) {

                            console.warn(
                                "Category mismatch:",
                                studentId,
                                "Selected:",
                                selected,
                                "Detected:",
                                detected.studentType
                            );

                        }


                        // ==================================
                        // Student Reference
                        // ==================================

                        const studentRef =
                            doc(
                                db,
                                "students",
                                studentId
                            );


                        const studentSnap =
                            await getDoc(
                                studentRef
                            );


                        // ==================================
                        // Base Student Data
                        // ==================================

                        const studentData = {

                            password:
                                password,

                            mustChangePassword:
                                true,

                            studentType:
                                detected.studentType,

                            lastActiveAt:
                                0

                        };


                        // ==================================
                        // Grade
                        // ==================================

                        if (
                            detected.grade !==
                            null
                        ) {

                            studentData.grade =
                                detected.grade;

                        }


                        // ==================================
                        // A/L Paper Settings
                        // ==================================

                        if (
                            detected.studentType ===
                            "al"
                        ) {

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


                                const settings =
                                    paperSettings[
                                        paper
                                    ];


                                studentData[
                                    paper
                                ] =
                                    settings
                                        ?.defaultAvailable === true;


                                studentData[
                                    paper +
                                    "Viewed"
                                ] =
                                    false;


                                studentData[
                                    paper +
                                    "Pages"
                                ] =
                                    settings
                                        ?.pages ||
                                    10;

                            }

                        }


                        // ==================================
                        // Save Student
                        // ==================================

                        await setDoc(
                            studentRef,
                            studentData,
                            {
                                merge:
                                    true
                            }
                        );


                        // ==================================
                        // Counters
                        // ==================================

                        if (
                            studentSnap.exists()
                        ) {

                            updated++;

                        }
                        else {

                            imported++;

                        }


                        if (
                            detected.studentType ===
                            "grade10"
                        ) {

                            grade10Count++;

                        }
                        else if (
                            detected.studentType ===
                            "grade11"
                        ) {

                            grade11Count++;

                        }
                        else {

                            alCount++;

                        }

                    }

                    catch (error) {

                        console.error(
                            "Row " +
                            (index + 2) +
                            " failed:",
                            error
                        );


                        failed++;

                    }

                }


                // ==========================================
                // Completed
                // ==========================================

                result.innerHTML = `

                    <div class="success-result">

                        <h3>
                            ✅ Import Completed
                        </h3>

                        <div class="import-stats">

                            <div>
                                <strong>
                                    ${imported}
                                </strong>

                                <span>
                                    New Students
                                </span>
                            </div>


                            <div>
                                <strong>
                                    ${updated}
                                </strong>

                                <span>
                                    Updated
                                </span>
                            </div>


                            <div>
                                <strong>
                                    ${grade10Count}
                                </strong>

                                <span>
                                    Grade 10
                                </span>
                            </div>


                            <div>
                                <strong>
                                    ${grade11Count}
                                </strong>

                                <span>
                                    Grade 11
                                </span>
                            </div>


                            <div>
                                <strong>
                                    ${alCount}
                                </strong>

                                <span>
                                    A/L
                                </span>
                            </div>


                            <div>
                                <strong>
                                    ${failed}
                                </strong>

                                <span>
                                    Failed
                                </span>
                            </div>

                        </div>

                        <p>
                            🔐 All imported students must
                            change their password on first login.
                        </p>

                    </div>

                `;

            }

            catch (error) {

                console.error(
                    "Import error:",
                    error
                );


                result.innerHTML = `

                    <div class="error-result">

                        ❌ <strong>
                            Import Failed
                        </strong>

                        <br><br>

                        ${error.message}

                    </div>

                `;

            }

            finally {

                importBtn.disabled =
                    false;

                importBtn.textContent =
                    "📥 Import Students";

            }

        };


    reader.onerror =
        () => {

            importBtn.disabled =
                false;

            importBtn.textContent =
                "📥 Import Students";


            result.innerHTML = `

                <div class="error-result">

                    ❌ Failed to read the Excel file.

                </div>

            `;

        };


    reader.readAsArrayBuffer(
        file
    );

}
