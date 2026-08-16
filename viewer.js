import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =========================================
// CHECK LOGIN
// =========================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =========================================
// GET URL PARAMETERS
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const paper =
    params.get("paper");


const studentId =
    params.get("id") ||
    sessionStorage.getItem("studentId");


const paperType =
    params.get("type") ||
    "";


const term =
    params.get("term") ||
    "";


const viewer =
    document.getElementById(
        "viewer"
    );


// =========================================
// VALID PAPER FORMAT
// =========================================

const paperPattern =
    /^paper(0[1-9]|10)$/;


// =========================================
// VALID MODEL TYPE
// =========================================

function isModelPaper() {

    return (
        paperType === "grade10-model" ||
        paperType === "grade11-model"
    );

}


// =========================================
// GET GRADE
// =========================================

function getGrade() {

    if (
        paperType ===
        "grade10-model"
    ) {

        return "grade10";

    }


    if (
        paperType ===
        "grade11-model"
    ) {

        return "grade11";

    }


    return null;

}


// =========================================
// SAVE MODEL PAPER VIEW
// =========================================

async function saveModelPaperView(
    studentRef
) {

    if (
        !isModelPaper()
    ) {

        return;

    }


    const grade =
        getGrade();


    if (
        !grade
    ) {

        return;

    }


    if (
        !["1", "2", "3"].includes(
            term
        )
    ) {

        console.warn(
            "Invalid term:",
            term
        );

        return;

    }


    if (
        !paperPattern.test(
            paper || ""
        )
    ) {

        console.warn(
            "Invalid paper:",
            paper
        );

        return;

    }


    // =====================================
    // FIREBASE FIELD
    // =====================================

    const fieldPath =
        `paperViews.${grade}.model.term${term}.${paper}`;


    try {

        await updateDoc(
            studentRef,
            {
                [fieldPath]:
                    true
            }
        );


        console.log(
            "✅ Model Paper View Saved",
            {
                grade,
                term,
                paper,
                fieldPath
            }
        );

    }

    catch (
        error
    ) {

        console.error(
            "Model Paper tracking error:",
            error
        );

    }

}


// =========================================
// LOAD PAPER
// =========================================

async function loadPaper() {

    // =====================================
    // CHECK PARAMETERS
    // =====================================

    if (
        !paper ||
        !studentId
    ) {

        alert(
            "Invalid paper request."
        );


        window.location.replace(
            "dashboard.html"
        );


        return;

    }


    // =====================================
    // CHECK PAPER
    // =====================================

    if (
        !paperPattern.test(
            paper
        )
    ) {

        alert(
            "Invalid paper."
        );


        window.location.replace(
            "dashboard.html"
        );


        return;

    }


    try {

        // =================================
        // STUDENT REFERENCE
        // =================================

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        // =================================
        // GET STUDENT
        // =================================

        const studentSnap =
            await getDoc(
                studentRef
            );


        if (
            !studentSnap.exists()
        ) {

            alert(
                "Student not found."
            );


            window.location.replace(
                "index.html"
            );


            return;

        }


        const studentData =
            studentSnap.data();


        // =================================
        // PAPER PERMISSION
        // =================================

        const permissionField =
            paper;


        if (
            studentData[
                permissionField
            ] !== true
        ) {

            alert(
                "You do not have permission to view this paper."
            );


            window.location.replace(
                "dashboard.html"
            );


            return;

        }


        // =================================
        // EXISTING VIEWED SYSTEM
        // =================================

        const viewedField =
            paper +
            "Viewed";


        if (
            studentData[
                viewedField
            ] === true
        ) {

            alert(
                "This paper has already been viewed."
            );


            window.location.replace(
                "dashboard.html"
            );


            return;

        }


        // =================================
        // NUMBER OF PAGES
        // =================================

        const pagesField =
            paper +
            "Pages";


        let totalPages =
            Number(
                studentData[
                    pagesField
                ]
            );


        if (
            !Number.isInteger(
                totalPages
            ) ||
            totalPages <= 0
        ) {

            totalPages = 10;

        }


        // =================================
        // LOG
        // =================================

        console.log(
            "================================"
        );

        console.log(
            "Paper:",
            paper
        );

        console.log(
            "Student:",
            studentId
        );

        console.log(
            "Type:",
            paperType
        );

        console.log(
            "Grade:",
            getGrade()
        );

        console.log(
            "Term:",
            term
        );

        console.log(
            "Pages:",
            totalPages
        );

        console.log(
            "================================"
        );


        // =================================
        // OLD VIEWED FIELD
        // =================================

        await updateDoc(
            studentRef,
            {
                [viewedField]:
                    true
            }
        );


        console.log(
            "✅ Existing viewed field updated:",
            viewedField
        );


        // =================================
        // NEW CATEGORY TRACKING
        // =================================

        await saveModelPaperView(
            studentRef
        );


        // =================================
        // CLEAR VIEWER
        // =================================

        if (
            viewer
        ) {

            viewer.innerHTML =
                "";

        }


        // =================================
        // CREATE PAGES
        // =================================

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            const pageNumber =
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            // =================================
            // PAGE
            // =================================

            const page =
                document.createElement(
                    "div"
                );


            page.className =
                "page";


            // =================================
            // IMAGE
            // =================================

            const img =
                document.createElement(
                    "img"
                );


            img.src =
                `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;


            img.alt =
                `${paper} Page ${i}`;


            img.draggable =
                false;


            // =================================
            // IMAGE ERROR
            // =================================

            img.onerror =
                () => {

                    console.error(
                        "Image not found:",
                        img.src
                    );


                    img.style.display =
                        "none";


                    const errorMessage =
                        document.createElement(
                            "div"
                        );


                    errorMessage.className =
                        "page-error";


                    errorMessage.textContent =
                        `Page ${i} could not be loaded.`;


                    page.appendChild(
                        errorMessage
                    );

                };


            // =================================
            // WATERMARK
            // =================================

            const watermark =
                document.createElement(
                    "div"
                );


            watermark.className =
                "watermark";


            for (
                let w = 0;
                w < 20;
                w++
            ) {

                const mark =
                    document.createElement(
                        "span"
                    );


                mark.textContent =
                    studentId;


                watermark.appendChild(
                    mark
                );

            }


            // =================================
            // ADD PAGE
            // =================================

            page.appendChild(
                img
            );


            page.appendChild(
                watermark
            );


            if (
                viewer
            ) {

                viewer.appendChild(
                    page
                );

            }

        }


    }

    catch (
        error
    ) {

        console.error(
            "Paper loading error:",
            error
        );


        alert(
            "Failed to load paper. Please try again."
        );

    }

}


// =========================================
// START
// =========================================

loadPaper();


// =========================================
// DISABLE RIGHT CLICK
// =========================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE DRAGGING
// =========================================

document.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE COPY
// =========================================

document.addEventListener(
    "copy",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE CUT
// =========================================

document.addEventListener(
    "cut",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey ||
            event.metaKey
        ) {

            const key =
                event.key.toLowerCase();


            if (
                key === "s" ||
                key === "p" ||
                key === "c" ||
                key === "x" ||
                key === "u" ||
                key === "a"
            ) {

                event.preventDefault();

            }

        }


        // F12

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);
