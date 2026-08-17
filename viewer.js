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
// TOTAL PAPERS
// =========================================

const DEFAULT_PAGES = 10;


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
//
// IMPORTANT:
// This function is NOT awaited when the
// paper is opened.
//
// Therefore Firebase saving will happen
// in the background while the paper loads.
//

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
// CREATE PAGE
// =========================================

function createPaperPage(
    pageNumber
) {

    const page =
        document.createElement(
            "div"
        );


    page.className =
        "page";


    // =====================================
    // IMAGE
    // =====================================

    const img =
        document.createElement(
            "img"
        );


    const pageNumberText =
        String(
            pageNumber
        ).padStart(
            2,
            "0"
        );


    img.src =
        `papers/${paper}/${paper}_Page_${pageNumberText}.jpg`;


    img.alt =
        `${paper} Page ${pageNumber}`;


    // =====================================
    // PERFORMANCE
    // =====================================

    img.decoding =
        "async";


    /*
        First 2 pages load immediately.

        Remaining pages use browser lazy
        loading so the browser does not
        aggressively load everything at once.
    */

    if (
        pageNumber > 2
    ) {

        img.loading =
            "lazy";

    }
    else {

        img.loading =
            "eager";

    }


    img.draggable =
        false;


    // =====================================
    // IMAGE ERROR
    // =====================================

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
                `Page ${pageNumber} could not be loaded.`;


            page.appendChild(
                errorMessage
            );

        };


    // =====================================
    // WATERMARK
    // =====================================

    const watermark =
        document.createElement(
            "div"
        );


    watermark.className =
        "watermark";


    /*
        Create watermark only once per page.
        This keeps the existing design while
        avoiding unnecessary work.
    */

    const fragment =
        document.createDocumentFragment();


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


        fragment.appendChild(
            mark
        );

    }


    watermark.appendChild(
        fragment
    );


    // =====================================
    // ADD TO PAGE
    // =====================================

    page.appendChild(
        img
    );


    page.appendChild(
        watermark
    );


    return page;

}


// =========================================
// CREATE ALL PAPER PAGES
// =========================================

function renderPaperPages(
    totalPages
) {

    if (
        !viewer
    ) {

        return;

    }


    // =====================================
    // CLEAR VIEWER
    // =====================================

    viewer.replaceChildren();


    // =====================================
    // CREATE PAGES
    // =====================================

    const fragment =
        document.createDocumentFragment();


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const page =
            createPaperPage(
                i
            );


        fragment.appendChild(
            page
        );

    }


    // =====================================
    // ONE DOM UPDATE
    // =====================================

    viewer.appendChild(
        fragment
    );

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

        if (
            studentData[
                paper
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

            totalPages =
                DEFAULT_PAGES;

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
        // IMPORTANT:
        // RENDER PAPER FIRST
        // =================================

        renderPaperPages(
            totalPages
        );


        // =================================
        // SAVE VIEWED STATUS IN BACKGROUND
        // =================================
        //
        // DO NOT await.
        //
        // Student can see the paper while
        // Firebase saves the view.
        //

        updateDoc(
            studentRef,
            {
                [viewedField]:
                    true
            }
        )
        .then(() => {

            console.log(
                "✅ Viewed status saved:",
                viewedField
            );

        })
        .catch(
            error => {

                console.error(
                    "Viewed status save failed:",
                    error
                );

            }
        );


        // =================================
        // CATEGORY TRACKING IN BACKGROUND
        // =================================
        //
        // DO NOT await.
        //

        savePaperView(
            studentRef
        )
        .then(() => {

            console.log(
                "✅ Category tracking saved"
            );

        })
        .catch(
            error => {

                console.error(
                    "Category tracking failed:",
                    error
                );

            }
        );


    }

    catch (
        error
    ) {

        console.error(
            "Paper loading error:",
            error
        );


        if (
            viewer
        ) {

            viewer.innerHTML = `
                <div
                    style="
                        padding:40px;
                        text-align:center;
                        color:#64748b;
                    "
                >
                    Failed to load paper.
                    Please try again.
                </div>
            `;

        }

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

        // =================================
        // CTRL / CMD
        // =================================

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
