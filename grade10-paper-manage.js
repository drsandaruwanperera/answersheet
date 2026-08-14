import {
    db,
    storage,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


// ==========================
// Super Admin Protection
// ==========================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    sessionStorage.getItem("adminRole") || "limited";

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}

if (adminRole !== "full") {

    alert(
        "Access denied. Super Admin only."
    );

    window.location.replace(
        "admin.html"
    );

}


// ==========================
// URL Parameters
// ==========================

const params =
    new URLSearchParams(
        window.location.search
    );

const term =
    params.get("term");

const paper =
    params.get("paper");


// ==========================
// Validate
// ==========================

if (
    !["1", "2", "3"].includes(term) ||
    !/^\d{2}$/.test(paper)
) {

    alert(
        "Invalid paper."
    );

    window.location.href =
        "grade10-paper-settings.html";

}


// ==========================
// Paper ID
// ==========================

const paperId =
    `term${term}_paper${paper}`;


// ==========================
// Display Paper
// ==========================

document.getElementById(
    "paperInfo"
).textContent =
    `Grade 10 • Term ${term} • Model Paper ${paper}`;


// ==========================
// Firestore Reference
// ==========================

const paperRef =
    doc(
        db,
        "grade10Papers",
        paperId
    );


// ==========================
// Upload PDF
// ==========================

async function uploadPdf(
    inputId,
    buttonId,
    statusId,
    fieldName,
    fileName
) {

    const input =
        document.getElementById(
            inputId
        );

    const button =
        document.getElementById(
            buttonId
        );

    const status =
        document.getElementById(
            statusId
        );

    const file =
        input.files[0];


    if (!file) {

        alert(
            "Please select a PDF."
        );

        return;

    }


    if (
        file.type !==
        "application/pdf"
    ) {

        alert(
            "Please select a PDF file."
        );

        return;

    }


    try {

        button.disabled = true;

        status.textContent =
            "Uploading...";


        const storagePath =
            `grade10/term${term}/paper${paper}/${fileName}`;


        const storageRef =
            ref(
                storage,
                storagePath
            );


        await uploadBytes(
            storageRef,
            file
        );


        const url =
            await getDownloadURL(
                storageRef
            );


        await setDoc(
            paperRef,
            {
                [fieldName]: url
            },
            {
                merge: true
            }
        );


        status.textContent =
            "✅ Upload successful.";

        alert(
            "File uploaded successfully."
        );

    }
    catch (error) {

        console.error(
            error
        );

        status.textContent =
            "❌ Upload failed.";

        alert(
            error.message
        );

    }
    finally {

        button.disabled =
            false;

    }

}


// ==========================
// Upload Answer Images
// ==========================

async function uploadImages(
    inputId,
    buttonId,
    statusId,
    fieldName,
    folderName
) {

    const input =
        document.getElementById(
            inputId
        );

    const button =
        document.getElementById(
            buttonId
        );

    const status =
        document.getElementById(
            statusId
        );

    const files =
        Array.from(
            input.files
        );


    if (
        files.length === 0
    ) {

        alert(
            "Please select answer images."
        );

        return;

    }


    try {

        button.disabled = true;

        status.textContent =
            `Uploading ${files.length} image(s)...`;


        const uploadedUrls = [];


        // Sort files by filename
        files.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )
        );


        for (
            let i = 0;
            i < files.length;
            i++
        ) {

            const file =
                files[i];


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                continue;

            }


            const pageNumber =
                String(
                    i + 1
                ).padStart(
                    2,
                    "0"
                );


            const storagePath =
                `grade10/term${term}/paper${paper}/${folderName}/Page_${pageNumber}.jpg`;


            const storageRef =
                ref(
                    storage,
                    storagePath
                );


            await uploadBytes(
                storageRef,
                file
            );


            const url =
                await getDownloadURL(
                    storageRef
                );


            uploadedUrls.push(
                url
            );


            status.textContent =
                `Uploading ${i + 1} / ${files.length}...`;

        }


        await setDoc(
            paperRef,
            {
                [fieldName]:
                    uploadedUrls,

                [`${fieldName}Pages`]:
                    uploadedUrls.length
            },
            {
                merge: true
            }
        );


        status.textContent =
            `✅ ${uploadedUrls.length} image(s) uploaded.`;


        alert(
            `${uploadedUrls.length} image(s) uploaded successfully.`
        );

    }
    catch (error) {

        console.error(
            error
        );

        status.textContent =
            "❌ Upload failed.";

        alert(
            error.message
        );

    }
    finally {

        button.disabled =
            false;

    }

}


// ==========================
// MCQ PDF
// ==========================

document
    .getElementById(
        "uploadMcqBtn"
    )
    .addEventListener(
        "click",
        () => {

            uploadPdf(
                "mcqPdf",
                "uploadMcqBtn",
                "mcqStatus",
                "mcqPdfUrl",
                "mcq.pdf"
            );

        }
    );


// ==========================
// Question PDF
// ==========================

document
    .getElementById(
        "uploadQuestionBtn"
    )
    .addEventListener(
        "click",
        () => {

            uploadPdf(
                "questionPdf",
                "uploadQuestionBtn",
                "questionStatus",
                "question.pdf"
            );

        }
    );


// ==========================
// MCQ Answer Images
// ==========================

document
    .getElementById(
        "uploadMcqAnswerBtn"
    )
    .addEventListener(
        "click",
        () => {

            uploadImages(
                "mcqAnswerImages",
                "uploadMcqAnswerBtn",
                "mcqAnswerStatus",
                "mcqAnswerImages",
                "mcq-answer"
            );

        }
    );


// ==========================
// Answer Scheme Images
// ==========================

document
    .getElementById(
        "uploadAnswerBtn"
    )
    .addEventListener(
        "click",
        () => {

            uploadImages(
                "answerImages",
                "uploadAnswerBtn",
                "answerStatus",
                "answerImages",
                "answer"
            );

        }
    );
