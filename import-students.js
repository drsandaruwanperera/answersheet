// =====================================================
// IMPORT STUDENTS
// Grade 10 / Grade 11 / A/L
// =====================================================

import {
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    setDoc
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const fileInput =
    document.getElementById(
        "excelFile"
    );


const importBtn =
    document.getElementById(
        "importBtn"
    );


const result =
    document.getElementById(
        "result"
    );


const selectedType =
    document.getElementById(
        "selectedType"
    );


const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


const downloadTemplateBtn =
    document.getElementById(
        "downloadTemplateBtn"
    );


const fileName =
    document.getElementById(
        "fileName"
    );


const previewSection =
    document.getElementById(
        "previewSection"
    );


const previewBody =
    document.getElementById(
        "previewBody"
    );


const previewCount =
    document.getElementById(
        "previewCount"
    );


const importStatus =
    document.getElementById(
        "importStatus"
    );


const importStatusTitle =
    document.getElementById(
        "importStatusTitle"
    );


const importStatusText =
    document.getElementById(
        "importStatusText"
    );


// =====================================================
// DATA
// =====================================================

let selectedRows = [];


// =====================================================
// CATEGORY SELECTION
// =====================================================

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;


                selectedType.value =
                    type;


                categoryButtons.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                console.log(
                    "Selected import type:",
                    type
                );

            }
        );

    }
);


// =====================================================
// FILE NAME
// =====================================================

if (fileInput) {

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

}


// =====================================================
// DOWNLOAD TEMPLATE
// =====================================================

if (downloadTemplateBtn) {

    downloadTemplateBtn.addEventListener(
        "click",
        downloadTemplate
    );

}


// =====================================================
// DOWNLOAD TEMPLATE FUNCTION
// =====================================================

function downloadTemplate() {

    const type =
        selectedType
            ? selectedType.value
            : "";


    let sampleData;

    let filename;


    // =================================================
    // A/L TEMPLATE
    // =================================================

    if (
        type === "al"
    ) {

        sampleData = [

            {
                "Admission Number":
                    "A27001",

                "Temporary Password":
                    "Temp1234"
            },

            {
                "Admission Number":
                    "A27002",

                "Temporary Password":
                    "Temp5678"
            },

            {
                "Admission Number":
                    "A27003",

                "Temporary Password":
                    "Temp9012"
            }

        ];


        filename =
            "AL-Student-Import-Template.xlsx";

    }


    // =================================================
    // GRADE 10 / 11 TEMPLATE
    // =================================================

    else {

        sampleData = [

            {
                "Student ID":
                    "27001",

                "Password":
                    "1234"
            },

            {
                "Student ID":
                    "27002",

                "Password":
                    "5678"
            }

        ];


        filename =
            "Student-Import-Template.xlsx";

    }


    // =================================================
    // CREATE WORKBOOK
    // =================================================

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
        filename
    );

}


// =====================================================
// IMPORT BUTTON
// =====================================================

if (importBtn) {

    importBtn.addEventListener(
        "click",
        importStudents
    );

}


// =====================================================
// DETECT STUDENT TYPE
// =====================================================

function detectStudentType(
    studentId
) {

    const value =
        String(
            studentId
        )
        .trim()
        .toUpperCase();


    // =================================================
    // A/L
    // =================================================

    if (
        /^A\d{5}$/.test(
            value
        )
    ) {

        return {

            studentType:
                "al",

            grade:
                null

        };

    }


    // =================================================
    // NUMERIC ID
    // =================================================

    const number =
        Number(
            value
        );


    // =================================================
    // GRADE 11
    // =================================================

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


    // =================================================
    // GRADE 10
    // =================================================

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


    // =================================================
    // UNKNOWN
    // =================================================

    return null;

}


// =====================================================
// VALIDATE A/L ADMISSION NUMBER
// =====================================================

function isValidALAdmissionNumber(
    admissionNumber
) {

    const value =
        String(
            admissionNumber
        )
        .trim()
        .toUpperCase();


    // A27000 - A29999
    // This covers:
    // A27000 series
    // A28000 series
    // A29000 series

    return /^A2[7-9]\d{3}$/.test(
        value
    );

}


// =====================================================
// VALIDATE PASSWORD
// =====================================================

function validatePassword(
    password
) {

    const value =
        String(
            password || ""
        )
        .trim();


    if (!value) {

        return "Password is empty.";

    }


    if (
        value.length < 4
    ) {

        return (
            "Password must contain at least 4 characters."
        );

    }


    return null;

}


// =====================================================
// SET IMPORT STATUS
// =====================================================

function setImportStatus(
    title,
    text
) {

    if (!importStatus) {
        return;
    }


    importStatus.classList.add(
        "show"
    );


    if (importStatusTitle) {

        importStatusTitle.textContent =
            title;

    }


    if (importStatusText) {

        importStatusText.textContent =
            text;

    }

}


// =====================================================
// PREVIEW
// =====================================================

function showPreview(
    rows
) {

    if (
        !previewSection ||
        !previewBody
    ) {

        return;

    }


    previewBody.innerHTML =
        "";


    rows.forEach(
        (item, index) => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <span class="admission-badge">
                        ${escapeHTML(
                            item.studentId
                        )}
                    </span>

                </td>

                <td>

                    <span class="password-badge">
                        ${escapeHTML(
                            item.password
                        )}
                    </span>

                </td>

                <td>
                    ${item.typeLabel}
                </td>

                <td class="ready">
                    ✓ Ready
                </td>

            `;


            previewBody.appendChild(
                tr
            );

        }
    );


    previewSection.classList.add(
        "show"
    );


    if (previewCount) {

        previewCount.textContent =
            rows.length +
            (
                rows.length === 1
                    ? " Student"
                    : " Students"
            );

    }

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
// IMPORT STUDENTS
// =====================================================

async function importStudents() {

    const file =
        fileInput.files[0];


    // =================================================
    // FILE VALIDATION
    // =================================================

    if (!file) {

        alert(
            "Please select an Excel file."
        );

        return;

    }


    // =================================================
    // CATEGORY VALIDATION
    // =================================================

    const selected =
        selectedType.value;


    if (
        ![
            "al",
            "grade10",
            "grade11"
        ].includes(
            selected
        )
    ) {

        alert(
            "Please select a student category first."
        );

        return;

    }


    // =================================================
    // UI
    // =================================================

    importBtn.disabled =
        true;


    importBtn.textContent =
        "⏳ Reading Excel...";


    result.innerHTML = "";


    setImportStatus(
        "Reading Excel file...",
        "Please wait while the student records are prepared."
    );


    if (previewSection) {

        previewSection.classList.remove(
            "show"
        );

    }


    selectedRows =
        [];


    // =================================================
    // FILE READER
    // =================================================

    const reader =
        new FileReader();


    reader.onload =
        async event => {

            try {

                // =========================================
                // READ EXCEL
                // =========================================

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


                // =========================================
                // PREPARE ROWS
                // =========================================

                const preparedRows =
                    [];


                const duplicateIds =
                    new Set();


                for (
                    let index = 0;
                    index < rows.length;
                    index++
                ) {

                    const row =
                        rows[index];


                    const keys =
                        Object.keys(
                            row
                        );


                    // =====================================
                    // FIND ID COLUMN
                    // =====================================

                    let studentIdKey;


                    if (
                        selected ===
                        "al"
                    ) {

                        studentIdKey =
                            keys.find(
                                key =>
                                    normalizeKey(
                                        key
                                    ) ===
                                    "admissionnumber"
                            );


                        // Allow Student ID too
                        if (
                            !studentIdKey
                        ) {

                            studentIdKey =
                                keys.find(
                                    key =>
                                        normalizeKey(
                                            key
                                        ) ===
                                        "studentid"
                                );

                            }

                    }
                    else {

                        studentIdKey =
                            keys.find(
                                key =>
                                    normalizeKey(
                                        key
                                    ) ===
                                    "studentid"
                            );


                        if (
                            !studentIdKey
                        ) {

                            studentIdKey =
                                keys.find(
                                    key =>
                                        normalizeKey(
                                            key
                                        ) ===
                                        "admissionnumber"
                                );

                        }

                    }


                    // =====================================
                    // PASSWORD COLUMN
                    // =====================================

                    let passwordKey;


                    if (
                        selected ===
                        "al"
                    ) {

                        passwordKey =
                            keys.find(
                                key =>
                                    normalizeKey(
                                        key
                                    ) ===
                                    "temporarypassword"
                            );


                        if (
                            !passwordKey
                        ) {

                            passwordKey =
                                keys.find(
                                    key =>
                                        normalizeKey(
                                            key
                                        ) ===
                                        "password"
                                );

                        }

                    }
                    else {

                        passwordKey =
                            keys.find(
                                key =>
                                    normalizeKey(
                                        key
                                    ) ===
                                    "password"
                            );

                    }


                    // =====================================
                    // COLUMN VALIDATION
                    // =====================================

                    if (
                        !studentIdKey ||
                        !passwordKey
                    ) {

                        throw new Error(
                            selected === "al"
                                ? "A/L Excel must contain 'Admission Number' and 'Temporary Password' columns."
                                : "Excel must contain 'Student ID' and 'Password' columns."
                        );

                    }


                    // =====================================
                    // VALUES
                    // =====================================

                    const studentId =
                        String(
                            row[
                                studentIdKey
                            ]
                        )
                        .trim()
                        .toUpperCase();


                    const password =
                        String(
                            row[
                                passwordKey
                            ]
                        )
                        .trim();


                    // =====================================
                    // EMPTY VALIDATION
                    // =====================================

                    if (
                        !studentId
                    ) {

                        throw new Error(
                            `Row ${
                                index + 2
                            }: Student ID / Admission Number is empty.`
                        );

                    }


                    if (
                        !password
                    ) {

                        throw new Error(
                            `Row ${
                                index + 2
                            }: Password is empty.`
                        );

                    }


                    // =====================================
                    // PASSWORD VALIDATION
                    // =====================================

                    const passwordError =
                        validatePassword(
                            password
                        );


                    if (
                        passwordError
                    ) {

                        throw new Error(
                            `Row ${
                                index + 2
                            }: ${passwordError}`
                        );

                    }


                    // =====================================
                    // A/L VALIDATION
                    // =====================================

                    if (
                        selected ===
                        "al"
                    ) {

                        if (
                            !isValidALAdmissionNumber(
                                studentId
                            )
                        ) {

                            throw new Error(
                                `Row ${
                                    index + 2
                                }: Invalid A/L Admission Number "${studentId}". Use A27000–A29999.`
                            );

                        }

                    }


                    // =====================================
                    // GRADE VALIDATION
                    // =====================================

                    const detected =
                        detectStudentType(
                            studentId
                        );


                    if (!detected) {

                        throw new Error(
                            `Row ${
                                index + 2
                            }: Unable to identify student category from "${studentId}".`
                        );

                    }


                    if (
                        detected.studentType !==
                        selected
                    ) {

                        throw new Error(
                            `Row ${
                                index + 2
                            }: ${studentId} does not belong to the selected category.`
                        );

                    }


                    // =====================================
                    // DUPLICATE IN EXCEL
                    // =====================================

                    if (
                        duplicateIds.has(
                            studentId
                        )
                    ) {

                        throw new Error(
                            `Row ${
                                index + 2
                            }: Duplicate student ID "${studentId}" found in Excel.`
                        );

                    }


                    duplicateIds.add(
                        studentId
                    );


                    // =====================================
                    // TYPE LABEL
                    // =====================================

                    let typeLabel =
                        "A/L";


                    if (
                        detected.studentType ===
                        "grade10"
                    ) {

                        typeLabel =
                            "Grade 10";

                    }


                    if (
                        detected.studentType ===
                        "grade11"
                    ) {

                        typeLabel =
                            "Grade 11";

                    }


                    preparedRows.push({

                        studentId:
                            studentId,

                        password:
                            password,

                        detected:
                            detected,

                        typeLabel:
                            typeLabel

                    });

                }


                // =========================================
                // SAVE PREPARED ROWS
                // =========================================

                selectedRows =
                    preparedRows;


                // =========================================
                // SHOW PREVIEW
                // =========================================

                showPreview(
                    preparedRows
                );


                setImportStatus(
                    "Excel validated",
                    `${preparedRows.length} student records are ready to import.`
                );


                // =========================================
                // START FIREBASE IMPORT
                // =========================================

                importBtn.textContent =
                    "⏳ Importing Students...";


                await saveStudents(
                    preparedRows,
                    selected
                );

            }

            catch (error) {

                console.error(
                    "Import error:",
                    error
                );


                showError(
                    error.message
                );

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

            showError(
                "Failed to read the Excel file."
            );


            importBtn.disabled =
                false;


            importBtn.textContent =
                "📥 Import Students";

        };


    reader.readAsArrayBuffer(
        file
    );

}


// =====================================================
// NORMALIZE COLUMN NAME
// =====================================================

function normalizeKey(
    value
) {

    return String(
        value
    )
    .trim()
    .toLowerCase()
    .replace(
        /[\s_\-\/]+/g,
        ""
    );

}


// =====================================================
// SAVE STUDENTS
// =====================================================

async function saveStudents(
    students,
    selected
) {

    let imported =
        0;

    let skipped =
        0;

    let failed =
        0;


    let grade10Count =
        0;

    let grade11Count =
        0;

    let alCount =
        0;


    const skippedIds =
        [];


    const failedRows =
        [];


    // =================================================
    // LOAD PAPER SETTINGS
    // =================================================

    let paperSettings =
        {};


    try {

        const paperSnapshot =
            await getDocs(
                collection(
                    db,
                    "papers"
                )
            );


        paperSnapshot.forEach(
            paperDoc => {

                paperSettings[
                    paperDoc.id
                ] =
                    paperDoc.data();

            }
        );

    }
    catch (error) {

        console.warn(
            "Paper settings could not be loaded:",
            error
        );

    }


    // =================================================
    // PROCESS
    // =================================================

    for (
        let index = 0;
        index < students.length;
        index++
    ) {

        const item =
            students[index];


        try {

            setImportStatus(
                "Importing students...",
                `Processing ${index + 1} of ${students.length}: ${item.studentId}`
            );


            const studentRef =
                doc(
                    db,
                    "students",
                    item.studentId
                );


            const existingSnapshot =
                await getDoc(
                    studentRef
                );


            // =================================================
            // IMPORTANT:
            // EXISTING RECORD = NEVER MODIFY
            // =================================================

            if (
                existingSnapshot.exists()
            ) {

                skipped++;


                skippedIds.push(
                    item.studentId
                );


                continue;

            }


            // =================================================
            // BASE DATA
            // =================================================

            const studentData = {

                admissionNumber:
                    item.studentId,

                password:
                    item.password,

                studentType:
                    item.detected.studentType,

                mustChangePassword:
                    true,

                profileCompleted:
                    false,

                lastActiveAt:
                    0,

                createdAt:
                    Date.now(),

                fullName:
                    "",

                nicNumber:
                    ""

            };


            // =================================================
            // GRADE
            // =================================================

            if (
                item.detected.grade !==
                null
            ) {

                studentData.grade =
                    item.detected.grade;

            }


            // =================================================
            // A/L
            // =================================================

            if (
                item.detected.studentType ===
                "al"
            ) {

                studentData.grade =
                    "AL";


                studentData.studentType =
                    "al";


                studentData.registrationCompleted =
                    false;


                // ---------------------------------------------
                // A/L PAPER SETTINGS
                // ---------------------------------------------

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


            // =================================================
            // SAVE NEW STUDENT ONLY
            // =================================================

            await setDoc(
                studentRef,
                studentData
            );


            imported++;


            // =================================================
            // COUNTERS
            // =================================================

            if (
                item.detected.studentType ===
                "grade10"
            ) {

                grade10Count++;

            }
            else if (
                item.detected.studentType ===
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
                "Student import failed:",
                item.studentId,
                error
            );


            failed++;


            failedRows.push({

                id:
                    item.studentId,

                error:
                    error.message

            });

        }

    }


    // =================================================
    // RESULT
    // =================================================

    showImportResult({

        imported:
            imported,

        skipped:
            skipped,

        failed:
            failed,

        grade10Count:
            grade10Count,

        grade11Count:
            grade11Count,

        alCount:
            alCount,

        skippedIds:
            skippedIds,

        failedRows:
            failedRows

    });


    setImportStatus(
        "Import completed",
        `${imported} new student accounts created.`
    );

}


// =====================================================
// IMPORT RESULT
// =====================================================

function showImportResult(
    stats
) {

    const skippedPreview =
        stats.skippedIds
            .slice(
                0,
                10
            );


    const failedPreview =
        stats.failedRows
            .slice(
                0,
                10
            );


    let skippedHTML =
        "";


    if (
        skippedPreview.length
    ) {

        skippedHTML = `

            <div
                style="
                    margin-top:15px;
                    padding:12px;
                    border-radius:10px;
                    background:#fff7ed;
                    border:1px solid #fed7aa;
                    color:#9a3412;
                    font-size:12px;
                "
            >

                <strong>
                    Existing records skipped:
                </strong>

                <br>

                ${skippedPreview
                    .map(
                        id =>
                            escapeHTML(id)
                    )
                    .join(
                        ", "
                    )}

                ${
                    stats.skippedIds.length > 10
                        ? " ..."
                        : ""
                }

            </div>

        `;

    }


    let failedHTML =
        "";


    if (
        failedPreview.length
    ) {

        failedHTML = `

            <div
                style="
                    margin-top:15px;
                    padding:12px;
                    border-radius:10px;
                    background:#fef2f2;
                    border:1px solid #fecaca;
                    color:#991b1b;
                    font-size:12px;
                "
            >

                <strong>
                    Failed records:
                </strong>

                <br><br>

                ${failedPreview
                    .map(
                        item =>
                            `${escapeHTML(
                                item.id
                            )}: ${escapeHTML(
                                item.error
                            )}`
                    )
                    .join(
                        "<br>"
                    )}

            </div>

        `;

    }


    result.innerHTML = `

        <div
            class="success-result"
            style="
                margin-top:20px;
                padding:20px;
                border-radius:14px;
                background:#ffffff;
                border:1px solid #e2e8f0;
            "
        >

            <h3>
                ${
                    stats.failed === 0
                        ? "✅ Import Completed"
                        : "⚠️ Import Completed with Issues"
                }
            </h3>


            <div
                class="import-stats"
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                120px,
                                1fr
                            )
                        );
                    gap:10px;
                    margin-top:15px;
                "
            >

                <div>

                    <strong>
                        ${stats.imported}
                    </strong>

                    <span>
                        New Students
                    </span>

                </div>


                <div>

                    <strong>
                        ${stats.skipped}
                    </strong>

                    <span>
                        Existing / Skipped
                    </span>

                </div>


                <div>

                    <strong>
                        ${stats.grade10Count}
                    </strong>

                    <span>
                        Grade 10
                    </span>

                </div>


                <div>

                    <strong>
                        ${stats.grade11Count}
                    </strong>

                    <span>
                        Grade 11
                    </span>

                </div>


                <div>

                    <strong>
                        ${stats.alCount}
                    </strong>

                    <span>
                        A/L
                    </span>

                </div>


                <div>

                    <strong>
                        ${stats.failed}
                    </strong>

                    <span>
                        Failed
                    </span>

                </div>

            </div>


            ${
                stats.alCount > 0
                    ? `

                        <div
                            style="
                                margin-top:15px;
                                padding:13px;
                                border-radius:10px;
                                background:#ecfdf5;
                                border:1px solid #a7f3d0;
                                color:#065f46;
                                font-size:12px;
                                line-height:1.5;
                            "
                        >

                            🔐 <strong>A/L Registration:</strong>

                            New A/L students must complete
                            their Full Name, NIC Number and
                            New Password after their first login.

                        </div>

                    `
                    : ""
            }


            ${skippedHTML}

            ${failedHTML}

        </div>

    `;

}


// =====================================================
// ERROR
// =====================================================

function showError(
    message
) {

    result.innerHTML = `

        <div
            class="error-result"
            style="
                margin-top:20px;
                padding:18px;
                border-radius:12px;
                background:#fef2f2;
                border:1px solid #fecaca;
                color:#991b1b;
            "
        >

            ❌ <strong>
                Import Failed
            </strong>

            <br><br>

            ${escapeHTML(
                message
            )}

        </div>

    `;


    setImportStatus(
        "Import failed",
        message
    );

}
