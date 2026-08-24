// ============================================================
// MODEL PAPER VIEWER
// ============================================================

import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// ============================================================
// LOGIN CHECK
// ============================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// ============================================================
// URL PARAMETERS
// ============================================================

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


const type =
    params.get("type") ||
    "";


// ============================================================
// VALIDATION
// ============================================================

if (!paper) {

    alert(
        "Paper not found."
    );

    window.location.replace(
        "model-papers.html"
    );

}


// ============================================================
// PAPER NUMBER
// ============================================================

const paperNumber =
    paper.replace(
        "paper",
        ""
    );


const formattedNumber =
    String(
        parseInt(
            paperNumber,
            10
        )
    ).padStart(
        2,
        "0"
    );


// ============================================================
// ELEMENTS
// ============================================================

const titleElement =
    document.getElementById(
        "paperTitle"
    );


const pagesContainer =
    document.getElementById(
        "pagesContainer"
    );


// ============================================================
// PAPER TITLE
// ============================================================

if (
    titleElement
) {

    titleElement.textContent =
        `Model Paper ${formattedNumber}`;

}


// ============================================================
// GO BACK
// ============================================================

function goBack() {

    window.location.href =
        "model-papers.html";

}


// ============================================================
// GLOBAL BACK
// ============================================================

window.goBack =
    goBack;


// ============================================================
// PAGE COUNT
// ============================================================
//
// Based on your Paper Management screenshot.
//

const PAPER_PAGE_COUNTS = {

    paper01: 12,

    paper02: 12,

    paper03: 11,

    paper04: 11,

    paper05: 13,

    paper06: 19,

    paper07: 18,

    paper08: 18,

    paper09: 15,

    paper10: 9

};


const pageCount =
    PAPER_PAGE_COUNTS[
        paper
    ] || 0;


// ============================================================
// LOAD JPG PAGES
// ============================================================

function loadPages() {

    if (!pagesContainer) {

        console.error(
            "pagesContainer not found."
        );

        return;

    }


    pagesContainer.innerHTML =
        "";


    if (
        pageCount <= 0
    ) {

        pagesContainer.innerHTML = `
            <div class="viewer-error">
                Paper pages are not configured.
            </div>
        `;

        return;

    }


    // ========================================================
    // CREATE PAGES
    // ========================================================

    for (
        let i = 1;
        i <= pageCount;
        i++
    ) {

        const pageNumber =
            String(
                i
            ).padStart(
                2,
                "0"
            );


        const imagePath =
            `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "paper-page";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            imagePath;


        image.alt =
            `Model Paper ${formattedNumber} - Page ${i}`;


        image.loading =
            i === 1
                ? "eager"
                : "lazy";


        image.draggable =
            false;


        image.addEventListener(
            "contextmenu",
            event => {
                event.preventDefault();
            }
        );


        // ====================================================
        // IMAGE ERROR
        // ====================================================

        image.addEventListener(
            "error",
            () => {

                console.error(
                    "Missing page:",
                    imagePath
                );


                wrapper.innerHTML = `
                    <div class="page-error">
                        Page ${i} could not be loaded.
                    </div>
                `;

            }
        );


        wrapper.appendChild(
            image
        );


        pagesContainer.appendChild(
            wrapper
        );

    }


    console.log(
        `✅ ${pageCount} pages loaded for ${paper}`
    );

}


// ============================================================
// TRACK VIEW
// ============================================================
//
// Only mark viewed after the viewer has successfully loaded.
// This creates:
//
// paperViews.al.model.paper01 = true
//

async function markAsViewed() {

    if (!studentId) {

        console.warn(
            "Student ID missing. Cannot track view."
        );

        return;

    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


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
            "✅ Paper marked as viewed:",
            fieldPath
        );

    }

    catch (error) {

        console.error(
            "❌ Failed to mark paper as viewed:",
            error
        );

    }

}


// ============================================================
// SECURITY - RIGHT CLICK
// ============================================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


// ============================================================
// SECURITY - KEYBOARD
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        // Ctrl + P

        if (
            event.ctrlKey &&
            key === "p"
        ) {

            event.preventDefault();

            return;

        }


        // Ctrl + S

        if (
            event.ctrlKey &&
            key === "s"
        ) {

            event.preventDefault();

            return;

        }


        // Ctrl + U

        if (
            event.ctrlKey &&
            key === "u"
        ) {

            event.preventDefault();

            return;

        }


        // Ctrl + Shift + S

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "s"
        ) {

            event.preventDefault();

            return;

        }


        // Ctrl + Shift + I

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "i"
        ) {

            event.preventDefault();

            return;

        }


        // Ctrl + Shift + J

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "j"
        ) {

            event.preventDefault();

            return;

        }


        // F12

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

            return;

        }

    }
);


// ============================================================
// PREVENT IMAGE DRAG
// ============================================================

document.addEventListener(
    "dragstart",
    event => {

        if (
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();

        }

    }
);


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "======================================"
        );

        console.log(
            "A/L MODEL PAPER VIEWER"
        );

        console.log(
            "Paper:",
            paper
        );

        console.log(
            "Pages:",
            pageCount
        );

        console.log(
            "Student:",
            studentId
        );

        console.log(
            "======================================"
        );


        // Load JPG pages

        loadPages();


        /*
         * Mark as viewed after opening.
         *
         * Therefore:
         *
         * Paper 01 → Viewed
         * Paper 02 → still Available
         */

        await markAsViewed();

    }
);
