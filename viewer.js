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

    throw new Error("Not logged in");
}


// =========================================
// URL PARAMETERS
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
// PAPER FORMAT
// =========================================

const paperPattern =
    /^paper(0[1-9]|10)$/;


// =========================================
// TRACKING
// =========================================

function getTrackingInfo() {

    if (
        paperType ===
        "grade10-model"
    ) {

        return {
            category: "grade10",
            type: "model"
        };

    }


    if (
        paperType ===
        "grade11-model"
    ) {

        return {
            category: "grade11",
            type: "model"
        };

    }


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
// SAVE CATEGORY VIEW
// =========================================

async function savePaperView(
    studentRef
) {

    const tracking =
        getTrackingInfo();


    if (!tracking) {
        return;
    }


    // =====================================
    // GRADE 10 / 11
    // =====================================

    if (
        tracking.category === "grade10" ||
        tracking.category === "grade11"
    ) {

        if (
            !["1", "2", "3"].includes(term)
        ) {

            console.warn(
                "Invalid term:",
                term
            );

            return;

        }


        const fieldPath =
            `paperViews.${tracking.category}.model.term${term}.${paper}`;


        await updateDoc(
            studentRef,
            {
                [fieldPath]: true
            }
        );


        return;

    }


    // =====================================
    // A/L
    // =====================================

    if (
        tracking.category === "al"
    ) {

        const fieldPath =
            `paperViews.al.model.${paper}`;


        await updateDoc(
            studentRef,
            {
                [fieldPath]: true
            }
        );

    }

}


// =========================================
// GET PAPER PAGE COUNT
// =========================================
//
// IMPORTANT:
// Page count comes from:
//
// papers
//   paper05
//      pages: 13
//
// NOT from:
//
// students
//   paper05Pages
//
// =========================================

async function getPaperPageCount() {

    const paperRef =
        doc(
            db,
            "papers",
            paper
        );


    const paperSnap =
        await getDoc(
            paperRef
        );


    if (
        !paperSnap.exists()
    ) {

        console.warn(
            "Paper settings not found:",
            paper
        );

        // Safe fallback
        return 10;

    }


    const paperData =
        paperSnap.data();


    const pages =
        Number(
            paperData.pages
        );


    if (
        !Number.isInteger(pages) ||
        pages < 1
    ) {

        console.warn(
            "Invalid page count:",
            pages
        );

        return 10;

    }


    return pages;

}


// =========================================
// LOAD PAPER
// =========================================

async function loadPaper() {

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


    if (
        !paperPattern.test(paper)
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
        // STUDENT
        // =================================

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
            studentData[paper] !== true
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
        // ALREADY VIEWED
        // =================================

        const viewedField =
            paper + "Viewed";


        if (
            studentData[viewedField] === true
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
        // GET REAL PAGE COUNT
        // =================================

        const totalPages =
            await getPaperPageCount();


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
            "Paper Type:",
            paperType
        );

        console.log(
            "Total Pages:",
            totalPages
        );

        console.log(
            "================================"
        );


        // =================================
        // MARK VIEWED
        // =================================

        await updateDoc(
            studentRef,
            {
                [viewedField]: true
            }
        );


        // =================================
        // CATEGORY TRACKING
        // =================================

        try {

            await savePaperView(
                studentRef
            );

        }

        catch (trackingError) {

            console.error(
                "Category tracking error:",
                trackingError
            );

        }


        // =================================
        // CLEAR VIEWER
        // =================================

        if (viewer) {

            viewer.innerHTML = "";

        }


        // =================================
        // CREATE ALL PAGES
        // =================================

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            const pageNumber =
                String(i).padStart(
                    2,
                    "0"
                );


            // =============================
            // PAGE CONTAINER
            // =============================

            const page =
                document.createElement(
                    "div"
                );


            page.className =
                "page";


            // =============================
            // IMAGE
            // =============================

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


            // =============================
            // IMAGE ERROR
            // =============================

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


            // =============================
            // WATERMARK
            // =============================

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


            // =============================
            // ADD
            // =============================

            page.appendChild(
                img
            );


            page.appendChild(
                watermark
            );


            if (viewer) {

                viewer.appendChild(
                    page
                );

            }

        }

    }

    catch (error) {

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
// SECURITY
// =========================================

document.addEventListener(
    "contextmenu",
    event => {
        event.preventDefault();
    }
);


document.addEventListener(
    "dragstart",
    event => {
        event.preventDefault();
    }
);


document.addEventListener(
    "copy",
    event => {
        event.preventDefault();
    }
);


document.addEventListener(
    "cut",
    event => {
        event.preventDefault();
    }
);


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


        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);
