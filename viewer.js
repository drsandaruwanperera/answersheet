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
    sessionStorage.getItem(
        "studentId"
    );


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
// GET TRACKING TYPE
// =========================================

function getTrackingInfo() {

    // =====================================
    // GRADE 10 MODEL
    // =====================================

    if (
        paperType ===
        "grade10-model"
    ) {

        return {
            category: "grade10",
            type: "model"
        };

    }


    // =====================================
    // GRADE 11 MODEL
    // =====================================

    if (
        paperType ===
        "grade11-model"
    ) {

        return {
            category: "grade11",
            type: "model"
        };

    }


    // =====================================
    // A/L MODEL
    // =====================================

    if (
        paperType ===
        "al-model"
    ) {

        return {
            category: "al",
            type: "model"
        };

    }


    return null;

}


// =========================================
// SAVE PAPER VIEW
// =========================================

async function savePaperView(
    studentRef
) {

    const tracking =
        getTrackingInfo();


    if (
        !tracking
    ) {

        console.log(
            "No category tracking type."
        );

        return;

    }


    // =====================================
    // GRADE 10 / GRADE 11
    // =====================================

    if (
        tracking.category ===
            "grade10" ||

        tracking.category ===
            "grade11"
    ) {

        if (
            !["1", "2", "3"].includes(
                term
            )
        ) {

            console.warn(
                "Invalid model paper term:",
                term
            );

            return;

        }


        const fieldPath =
            `paperViews.${tracking.category}.model.term${term}.${paper}`;


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
                grade:
                    tracking.category,

                term,

                paper,

                fieldPath
            }
        );


        return;

    }


    // =====================================
    // A/L MODEL
    // =====================================

    if (
        tracking.category ===
        "al"
    ) {

        const fieldPath =
            `paperViews.al.model.${paper}`;


        await updateDoc(
            studentRef,
            {
                [fieldPath]:
                    true
            }
        );


        console.log(
            "✅ A/L Model Paper View Saved",
            {
                paper,

                fieldPath
            }
        );

    }

}


// =========================================
// LOAD PAPER
// =========================================

async function loadPaper() {

    // =====================================
    // BASIC VALIDATION
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
    // PAPER VALIDATION
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
        // PERMISSION
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
        // DEBUG
        // =================================

        console.log(
            "================================"
        );


        console.log(
            "Student:",
            studentId
        );


        console.log(
            "Paper:",
            paper
        );


        console.log(
            "Type:",
            paperType
        );


        console.log(
            "Term:",
            term
        );


        console.log(
            "Tracking:",
            getTrackingInfo()
        );


        console.log(
            "Pages:",
            totalPages
        );


        console.log(
            "================================"
        );


        // =================================
        // UPDATE EXISTING VIEWED FIELD
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
        // SAVE CATEGORY TRACKING
        // =================================

        try {

            await savePaperView(
                studentRef
            );

        }

        catch (
            trackingError
        ) {

            console.error(
                "Category tracking failed:",
                trackingError
            );

        }


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
        // CREATE PAPER PAGES
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
            // ADD PAGE ELEMENTS
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


        // =================================
        // F12
        // =================================

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);
