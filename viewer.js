// ============================================================
// A/L MODEL PAPER VIEWER
// ============================================================

import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// ============================================================
// LOGIN
// ============================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
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
    sessionStorage.getItem("studentId");

const type =
    params.get("type") || "";


// ============================================================
// VALIDATE
// ============================================================

if (!paper) {

    alert("Paper not found.");

    window.location.replace(
        "model-papers.html"
    );

    throw new Error(
        "Paper parameter missing"
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
// TITLE
// ============================================================

if (titleElement) {

    titleElement.textContent =
        `Model Paper ${formattedNumber}`;

}


// ============================================================
// PAGE COUNTS
// ============================================================

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
// BACK
// ============================================================

function goBack() {

    window.location.href =
        "model-papers.html";

}

window.goBack =
    goBack;


// ============================================================
// LOAD ALL JPG PAGES
// ============================================================

function loadPages() {

    if (!pagesContainer) {

        console.error(
            "❌ pagesContainer not found in viewer.html"
        );

        return;

    }


    pagesContainer.innerHTML = "";


    if (pageCount === 0) {

        pagesContainer.innerHTML = `
            <div class="page-error">
                No page count configured for ${paper}.
            </div>
        `;

        return;

    }


    console.log(
        `📄 Loading ${pageCount} pages for ${paper}`
    );


    for (
        let i = 1;
        i <= pageCount;
        i++
    ) {

        const pageNumber =
            String(i).padStart(
                2,
                "0"
            );


        // ====================================================
        // EXACT FILE PATH
        // ====================================================

        const imagePath =
            `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;


        console.log(
            `Page ${i}:`,
            imagePath
        );


        // ====================================================
        // WRAPPER
        // ====================================================

        const pageWrapper =
            document.createElement(
                "div"
            );

        pageWrapper.className =
            "paper-page";


        // ====================================================
        // PAGE NUMBER
        // ====================================================

        const pageLabel =
            document.createElement(
                "div"
            );

        pageLabel.className =
            "page-number";

        pageLabel.textContent =
            `Page ${i} / ${pageCount}`;


        // ====================================================
        // IMAGE
        // ====================================================

        const image =
            document.createElement(
                "img"
            );


        image.src =
            imagePath;


        image.alt =
            `Model Paper ${formattedNumber} - Page ${i}`;


        // IMPORTANT:
        // Do NOT use lazy loading.
        // Load every page.

        image.loading =
            "eager";


        image.decoding =
            "async";


        image.draggable =
            false;


        image.setAttribute(
            "oncontextmenu",
            "return false;"
        );


        // ====================================================
        // SUCCESS
        // ====================================================

        image.onload =
            function() {

                console.log(
                    `✅ Page ${i} loaded successfully`
                );

            };


        // ====================================================
        // ERROR
        // ====================================================

        image.onerror =
            function() {

                console.error(
                    `❌ PAGE ${i} NOT FOUND:`,
                    imagePath
                );


                pageWrapper.classList.add(
                    "page-load-error"
                );


                pageWrapper.innerHTML = `

                    <div class="page-error">

                        <strong>
                            Page ${i} could not be loaded
                        </strong>

                        <small>
                            ${imagePath}
                        </small>

                    </div>

                `;

            };


        // ====================================================
        // APPEND
        // ====================================================

        pageWrapper.appendChild(
            pageLabel
        );

        pageWrapper.appendChild(
            image
        );

        pagesContainer.appendChild(
            pageWrapper
        );

    }

}


// ============================================================
// MARK AS VIEWED
// ============================================================

async function markAsViewed() {

    if (!studentId) {

        console.warn(
            "Student ID not found."
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
                [fieldPath]: true
            }
        );


        console.log(
            "✅ VIEWED:",
            fieldPath
        );

    }

    catch (error) {

        console.error(
            "❌ Could not mark viewed:",
            error
        );

    }

}


// ============================================================
// RIGHT CLICK BLOCK
// ============================================================

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();

    }
);


// ============================================================
// KEYBOARD PROTECTION
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

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
// DRAG BLOCK
// ============================================================

document.addEventListener(
    "dragstart",
    function(event) {

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
    async function() {

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
            "Expected Pages:",
            pageCount
        );

        console.log(
            "Student:",
            studentId
        );

        console.log(
            "======================================"
        );


        // Load ALL pages

        loadPages();


        // Mark viewed

        await markAsViewed();

    }
);
