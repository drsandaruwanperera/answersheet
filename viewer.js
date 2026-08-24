// ============================================================
// A/L MODEL PAPER IMAGE VIEWER
// viewer.js
// ============================================================

import {
    db,
    doc,
    updateDoc
} from "./firebase.js";

"use strict";


// ============================================================
// CONFIGURATION
// ============================================================

const MAX_PAGES = 100;

const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp"
];


// ============================================================
// DOM ELEMENTS
// ============================================================

const backButton =
    document.getElementById("backButton");

const errorBackButton =
    document.getElementById("errorBackButton");

const paperTitle =
    document.getElementById("paperTitle");

const paperType =
    document.getElementById("paperType");

const pageCount =
    document.getElementById("pageCount");

const loading =
    document.getElementById("loading");

const errorContainer =
    document.getElementById("error");

const errorMessage =
    document.getElementById("errorMessage");

const paperViewer =
    document.getElementById("paperViewer");

const pagesContainer =
    document.getElementById("pagesContainer");


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
    sessionStorage.getItem("studentId");

const type =
    params.get("type");


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeViewer
);


// ============================================================
// INITIALIZE VIEWER
// ============================================================

async function initializeViewer() {

    console.log(
        "===================================="
    );

    console.log(
        "A/L PAPER VIEWER"
    );

    console.log(
        "Paper:",
        paper
    );

    console.log(
        "Student ID:",
        studentId
    );

    console.log(
        "Type:",
        type
    );

    console.log(
        "===================================="
    );


    // --------------------------------------------------------
    // VALIDATE PAPER
    // --------------------------------------------------------

    if (!paper) {

        showError(
            "No paper was specified."
        );

        return;
    }


    // --------------------------------------------------------
    // A/L MODEL PAPER
    // --------------------------------------------------------

    if (
        type === "al-model" ||
        /^paper\d+$/i.test(paper)
    ) {

        await loadALModelPaper();

        return;
    }


    // --------------------------------------------------------
    // UNKNOWN TYPE
    // --------------------------------------------------------

    showError(
        "Unsupported paper type."
    );
}


// ============================================================
// LOAD A/L MODEL PAPER
// ============================================================

async function loadALModelPaper() {

    const normalizedPaper =
        normalizePaperId(
            paper
        );


    // --------------------------------------------------------
    // VALIDATE PAPER ID
    // --------------------------------------------------------

    if (!normalizedPaper) {

        showError(
            "Invalid paper ID."
        );

        return;
    }


    // --------------------------------------------------------
    // GET PAPER NUMBER
    // --------------------------------------------------------

    const match =
        normalizedPaper.match(
            /^paper(\d+)$/i
        );


    if (!match) {

        showError(
            "Invalid paper ID."
        );

        return;
    }


    const paperNumber =
        parseInt(
            match[1],
            10
        );


    // --------------------------------------------------------
    // FOLDER NAME
    // --------------------------------------------------------

    const folderName =
        `paper${String(
            paperNumber
        ).padStart(
            2,
            "0"
        )}`;


    // --------------------------------------------------------
    // BASE PATH
    // --------------------------------------------------------

    const basePath =
        `papers/${folderName}/`;


    // --------------------------------------------------------
    // FILE PREFIX
    // --------------------------------------------------------

    const filePrefix =
        folderName;


    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    if (paperType) {

        paperType.textContent =
            "A/L MODEL PAPER";

    }


    if (paperTitle) {

        paperTitle.textContent =
            `Model Paper ${String(
                paperNumber
            ).padStart(
                2,
                "0"
            )}`;

    }


    // --------------------------------------------------------
    // SHOW LOADING
    // --------------------------------------------------------

    showLoading();


    try {

        // ----------------------------------------------------
        // FIND ALL JPG PAGES
        // ----------------------------------------------------

        const loadedPages =
            await findPaperPages(
                basePath,
                filePrefix
            );


        // ----------------------------------------------------
        // NO PAGES
        // ----------------------------------------------------

        if (
            loadedPages.length === 0
        ) {

            showError(
                `No pages were found for ${folderName}.`
            );

            return;
        }


        // ----------------------------------------------------
        // RENDER PAGES
        // ----------------------------------------------------

        renderPages(
            loadedPages
        );


        // ----------------------------------------------------
        // IMPORTANT:
        // MARK AS VIEWED ONLY AFTER
        // THE PAPER FILES WERE FOUND.
        // ----------------------------------------------------

        await markModelPaperAsViewed();


    } catch (error) {

        console.error(
            "Paper loading error:",
            error
        );


        showError(
            "The paper could not be loaded. Please check the paper files."
        );
    }
}


// ============================================================
// NORMALIZE PAPER ID
// ============================================================

function normalizePaperId(
    value
) {

    if (!value) {
        return null;
    }


    const clean =
        String(value)
            .trim()
            .toLowerCase();


    const match =
        clean.match(
            /^paper(\d+)$/
        );


    if (!match) {
        return null;
    }


    const number =
        parseInt(
            match[1],
            10
        );


    if (
        !Number.isInteger(number) ||
        number < 1
    ) {

        return null;
    }


    return (
        `paper${String(
            number
        ).padStart(
            2,
            "0"
        )}`
    );
}


// ============================================================
// FIND PAPER PAGES
// ============================================================

async function findPaperPages(
    basePath,
    filePrefix
) {

    const pages = [];


    /*
     * Expected structure:
     *
     * papers/
     * ├── paper01/
     * │   ├── paper01_Page_01.jpg
     * │   ├── paper01_Page_02.jpg
     * │   └── ...
     * │
     * ├── paper02/
     * │   ├── paper02_Page_01.jpg
     * │   └── ...
     */


    for (
        let pageNumber = 1;
        pageNumber <= MAX_PAGES;
        pageNumber++
    ) {

        const pageText =
            String(
                pageNumber
            ).padStart(
                2,
                "0"
            );


        let found =
            false;


        for (
            const extension
            of IMAGE_EXTENSIONS
        ) {

            const fileName =
                `${filePrefix}_Page_${pageText}.${extension}`;


            const imagePath =
                `${basePath}${fileName}`;


            const exists =
                await imageExists(
                    imagePath
                );


            if (exists) {

                pages.push({

                    number:
                        pageNumber,

                    url:
                        imagePath,

                    fileName:
                        fileName

                });


                found =
                    true;


                break;
            }

        }


        /*
         * Pages are expected to be sequential.
         *
         * Example:
         * Page_01
         * Page_02
         * Page_03
         *
         * If a page is missing, stop searching.
         */

        if (!found) {

            break;
        }
    }


    return pages;
}


// ============================================================
// CHECK WHETHER IMAGE EXISTS
// ============================================================

function imageExists(
    url
) {

    return new Promise(
        (resolve) => {

            const img =
                new Image();


            let finished =
                false;


            const finish =
                (result) => {

                    if (finished) {
                        return;
                    }


                    finished =
                        true;


                    resolve(
                        result
                    );
                };


            img.onload =
                () => {

                    finish(
                        true
                    );

                };


            img.onerror =
                () => {

                    finish(
                        false
                    );

                };


            /*
             * Cache-busting query is used only
             * for checking the file.
             *
             * It does NOT change the actual
             * image path.
             */

            img.src =
                `${url}?check=${Date.now()}`;

        }
    );
}


// ============================================================
// RENDER PAGES
// ============================================================

function renderPages(
    pages
) {

    if (!pagesContainer) {
        return;
    }


    pagesContainer.innerHTML =
        "";


    // --------------------------------------------------------
    // PAGE COUNT
    // --------------------------------------------------------

    if (pageCount) {

        pageCount.textContent =
            `${pages.length} Pages`;

    }


    // --------------------------------------------------------
    // CREATE EACH PAGE
    // --------------------------------------------------------

    pages.forEach(
        (page, index) => {

            // ----------------------------------------------
            // PAGE SECTION
            // ----------------------------------------------

            const pageWrapper =
                document.createElement(
                    "section"
                );


            pageWrapper.className =
                "paper-page";


            pageWrapper.dataset.page =
                String(
                    page.number
                );


            // ----------------------------------------------
            // PAGE LABEL
            // ----------------------------------------------

            const pageHeader =
                document.createElement(
                    "div"
                );


            pageHeader.className =
                "page-label";


            pageHeader.textContent =
                `Page ${
                    index + 1
                } of ${
                    pages.length
                }`;


            // ----------------------------------------------
            // IMAGE WRAPPER
            // ----------------------------------------------

            const imageWrapper =
                document.createElement(
                    "div"
                );


            imageWrapper.className =
                "image-wrapper";


            // ----------------------------------------------
            // IMAGE
            // ----------------------------------------------

            const image =
                document.createElement(
                    "img"
                );


            image.className =
                "paper-image";


            image.alt =
                `Model Paper Page ${page.number}`;


            /*
             * First image loads immediately.
             *
             * Remaining pages use lazy loading.
             */

            image.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            image.decoding =
                "async";


            image.draggable =
                false;


            image.setAttribute(
                "draggable",
                "false"
            );


            image.src =
                page.url;


            // ----------------------------------------------
            // IMAGE ERROR
            // ----------------------------------------------

            image.onerror =
                () => {

                    imageWrapper.innerHTML =
                        "";


                    const error =
                        document.createElement(
                            "div"
                        );


                    error.className =
                        "page-image-error";


                    error.textContent =
                        `Page ${page.number} could not be loaded.`;


                    imageWrapper.appendChild(
                        error
                    );

                };


            // ----------------------------------------------
            // APPEND IMAGE
            // ----------------------------------------------

            imageWrapper.appendChild(
                image
            );


            // ----------------------------------------------
            // APPEND PAGE
            // ----------------------------------------------

            pageWrapper.appendChild(
                pageHeader
            );


            pageWrapper.appendChild(
                imageWrapper
            );


            pagesContainer.appendChild(
                pageWrapper
            );

        }
    );


    // --------------------------------------------------------
    // SHOW VIEWER
    // --------------------------------------------------------

    showViewer();
}


// ============================================================
// MARK MODEL PAPER AS VIEWED
// ============================================================

async function markModelPaperAsViewed() {

    // --------------------------------------------------------
    // GET STUDENT ID
    // --------------------------------------------------------

    const currentStudentId =
        studentId ||
        sessionStorage.getItem(
            "studentId"
        );


    // --------------------------------------------------------
    // GET PAPER ID
    // --------------------------------------------------------

    const currentPaper =
        normalizePaperId(
            paper
        );


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
        !currentStudentId
    ) {

        console.warn(
            "Student ID not found. Paper cannot be marked as viewed."
        );

        return;
    }


    if (
        !currentPaper
    ) {

        console.warn(
            "Paper ID not found. Paper cannot be marked as viewed."
        );

        return;
    }


    // --------------------------------------------------------
    // FIRESTORE
    // --------------------------------------------------------

    try {

        const studentRef =
            doc(
                db,
                "students",
                currentStudentId
            );


        /*
         * Firestore path:
         *
         * students/{studentId}
         *
         * paperViews.al.model.paper01
         *
         */

        const fieldPath =
            `paperViews.al.model.${currentPaper}`;


        await updateDoc(
            studentRef,
            {

                [fieldPath]:
                    true

            }
        );


        console.log(
            "===================================="
        );


        console.log(
            "✅ MODEL PAPER MARKED AS VIEWED"
        );


        console.log(
            "Student:",
            currentStudentId
        );


        console.log(
            "Paper:",
            currentPaper
        );


        console.log(
            "Firestore field:",
            fieldPath
        );


        console.log(
            "===================================="
        );


    } catch (error) {

        /*
         * Important:
         *
         * The paper itself has already loaded.
         * Therefore we do NOT show an error page
         * just because Firestore tracking failed.
         */

        console.error(
            "Failed to mark model paper as viewed:",
            error
        );

    }
}


// ============================================================
// SHOW LOADING
// ============================================================

function showLoading() {

    if (loading) {

        loading.style.display =
            "flex";

    }


    if (errorContainer) {

        errorContainer.style.display =
            "none";

    }


    if (paperViewer) {

        paperViewer.style.display =
            "none";

    }
}


// ============================================================
// SHOW VIEWER
// ============================================================

function showViewer() {

    if (loading) {

        loading.style.display =
            "none";

    }


    if (errorContainer) {

        errorContainer.style.display =
            "none";

    }


    if (paperViewer) {

        paperViewer.style.display =
            "block";

    }
}


// ============================================================
// SHOW ERROR
// ============================================================

function showError(
    message
) {

    if (loading) {

        loading.style.display =
            "none";

    }


    if (paperViewer) {

        paperViewer.style.display =
            "none";

    }


    if (errorContainer) {

        errorContainer.style.display =
            "flex";

    }


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }
}


// ============================================================
// BACK BUTTON
// ============================================================

function goBack() {

    /*
     * Prefer browser history when the user came
     * from the model paper page.
     */

    if (
        document.referrer &&
        document.referrer.includes(
            window.location.hostname
        )
    ) {

        window.history.back();

        return;
    }


    /*
     * Fallback.
     */

    window.location.href =
        "model-papers.html";
}


if (backButton) {

    backButton.addEventListener(
        "click",
        goBack
    );

}


if (errorBackButton) {

    errorBackButton.addEventListener(
        "click",
        goBack
    );

}


// ============================================================
// BASIC CONTENT PROTECTION
// ============================================================


// ------------------------------------------------------------
// DISABLE RIGHT CLICK
// ------------------------------------------------------------

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();

        return false;

    },
    true
);


// ------------------------------------------------------------
// DISABLE DRAGGING
// ------------------------------------------------------------

document.addEventListener(
    "dragstart",
    function(event) {

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();

            return false;

        }

    },
    true
);


// ------------------------------------------------------------
// DISABLE IMAGE SELECTION
// ------------------------------------------------------------

document.addEventListener(
    "selectstart",
    function(event) {

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();

            return false;

        }

    },
    true
);


// ============================================================
// KEYBOARD PROTECTION
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            String(
                event.key || ""
            ).toLowerCase();


        // ----------------------------------------------------
        // F12
        // ----------------------------------------------------

        if (
            event.key === "F12"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + P
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            key === "p"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + S
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            key === "s"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + SHIFT + S
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "s"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + U
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            key === "u"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + SHIFT + I
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "i"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + SHIFT + J
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "j"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // CTRL + SHIFT + C
        // ----------------------------------------------------

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "c"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }


        // ----------------------------------------------------
        // MAC COMMAND SHORTCUTS
        // ----------------------------------------------------

        if (
            event.metaKey &&
            (
                key === "p" ||
                key === "s" ||
                key === "u"
            )
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }

    },
    true
);


// ============================================================
// PREVENT PRINT USING PRINT EVENT
// ============================================================

window.addEventListener(
    "beforeprint",
    function() {

        console.warn(
            "Printing is disabled for this viewer."
        );

    }
);


// ============================================================
// PREVENT PRINT MEDIA CONTENT
// ============================================================

const printStyle =
    document.createElement(
        "style"
    );


printStyle.textContent = `
    @media print {
        body {
            display: none !important;
        }
    }
`;


document.head.appendChild(
    printStyle
);


// ============================================================
// EXTRA IMAGE PROTECTION
// ============================================================

document.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            /*
             * Prevent middle-click and
             * right-click actions on images.
             */

            if (
                event.button === 1 ||
                event.button === 2
            ) {

                event.preventDefault();

            }

        }

    },
    true
);


// ============================================================
// DISABLE COPY
// ============================================================

document.addEventListener(
    "copy",
    function(event) {

        event.preventDefault();

    },
    true
);


// ============================================================
// DISABLE CUT
// ============================================================

document.addEventListener(
    "cut",
    function(event) {

        event.preventDefault();

    },
    true
);


// ============================================================
// DISABLE SAVE/PRINT CONTEXT ACTIONS
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        /*
         * Ctrl + Shift + P
         */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "p"
        ) {

            event.preventDefault();
            event.stopPropagation();

            return false;
        }

    },
    true
);


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "🟢 A/L Model Paper Viewer Active"
);
