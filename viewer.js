// ============================================================
// A/L MODEL PAPER VIEWER
// viewer.js
// ============================================================

import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


// ============================================================
// LOGIN CHECK
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
    String(
        params.get("paper") || ""
    )
    .trim()
    .toLowerCase();


const studentId =
    params.get("id") ||
    sessionStorage.getItem("studentId");


const type =
    String(
        params.get("type") || ""
    )
    .trim()
    .toLowerCase();


// ============================================================
// VALIDATE PAPER
// ============================================================

if (
    !/^paper\d+$/i.test(paper)
) {

    alert(
        "Invalid paper."
    );

    window.location.replace(
        "model-papers.html"
    );

    throw new Error(
        "Invalid paper"
    );
}


// ============================================================
// PAPER NUMBER
// ============================================================

const paperNumber =
    parseInt(
        paper.replace(
            "paper",
            ""
        ),
        10
    );


const formattedNumber =
    String(
        paperNumber
    ).padStart(
        2,
        "0"
    );


// ============================================================
// PAGE COUNTS
// ============================================================
// IMPORTANT
//
// These are the actual page counts of your
// A/L Model Papers.
//
// Paper 06 = 19 pages.
//

const PAGE_COUNTS = {

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


// ============================================================
// GET TOTAL PAGES
// ============================================================

const totalPages =
    PAGE_COUNTS[
        paper
    ];


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
// CHECK PAGE COUNT
// ============================================================

if (
    !totalPages
) {

    console.error(
        "❌ No page count configured for:",
        paper
    );

}


// ============================================================
// TITLE
// ============================================================

if (
    titleElement
) {

    titleElement.textContent =
        `Model Paper ${formattedNumber}`;

}


// ============================================================
// BACK BUTTON
// ============================================================

function goBack() {

    window.location.href =
        "model-papers.html";

}


window.goBack =
    goBack;


// ============================================================
// LOAD PAPER PAGES
// ============================================================

function loadPaperPages() {

    if (
        !pagesContainer
    ) {

        console.error(
            "❌ pagesContainer not found."
        );

        return;

    }


    pagesContainer.innerHTML =
        "";


    if (
        !totalPages
    ) {

        pagesContainer.innerHTML = `

            <div
                style="
                    padding:40px;
                    text-align:center;
                    background:#ffffff;
                    border-radius:12px;
                    color:#dc2626;
                    font-weight:600;
                "
            >

                Paper page count not configured.

            </div>

        `;

        return;

    }


    console.log(
        "======================================"
    );

    console.log(
        "🔥 NEW VIEWER VERSION 19"
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
        type
    );

    console.log(
        "TOTAL PAGES:",
        totalPages
    );

    console.log(
        "======================================"
    );


    // ========================================================
    // CREATE EVERY PAGE
    // ========================================================

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


        // ----------------------------------------------------
        // EXACT JPG PATH
        // ----------------------------------------------------

        const imagePath =
            `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;


        console.log(
            `Page ${i}:`,
            imagePath
        );


        // ----------------------------------------------------
        // PAGE WRAPPER
        // ----------------------------------------------------

        const pageWrapper =
            document.createElement(
                "div"
            );


        pageWrapper.className =
            "paper-page";


        pageWrapper.style.width =
            "100%";


        pageWrapper.style.maxWidth =
            "1000px";


        pageWrapper.style.margin =
            "0 auto 25px";


        pageWrapper.style.background =
            "#ffffff";


        pageWrapper.style.padding =
            "10px";


        pageWrapper.style.borderRadius =
            "8px";


        pageWrapper.style.boxShadow =
            "0 4px 18px rgba(0,0,0,.10)";


        // ----------------------------------------------------
        // PAGE LABEL
        // ----------------------------------------------------

        const pageLabel =
            document.createElement(
                "div"
            );


        pageLabel.className =
            "page-number";


        pageLabel.textContent =
            `Page ${i} / ${totalPages}`;


        pageLabel.style.textAlign =
            "center";


        pageLabel.style.padding =
            "8px";


        pageLabel.style.marginBottom =
            "8px";


        pageLabel.style.fontSize =
            "12px";


        pageLabel.style.fontWeight =
            "600";


        pageLabel.style.color =
            "#64748b";


        pageLabel.style.background =
            "#f8fafc";


        pageLabel.style.borderRadius =
            "6px";


        // ----------------------------------------------------
        // IMAGE
        // ----------------------------------------------------

        const image =
            document.createElement(
                "img"
            );


        image.src =
            imagePath;


        image.alt =
            `Model Paper ${formattedNumber} Page ${i}`;


        image.loading =
            "eager";


        image.decoding =
            "async";


        image.draggable =
            false;


        image.style.display =
            "block";


        image.style.width =
            "100%";


        image.style.height =
            "auto";


        image.style.maxWidth =
            "100%";


        image.style.margin =
            "0 auto";


        image.style.userSelect =
            "none";


        image.style.webkitUserDrag =
            "none";


        // ----------------------------------------------------
        // IMAGE LOADED
        // ----------------------------------------------------

        image.onload =
            function() {

                console.log(
                    `✅ Page ${i} loaded successfully`
                );

            };


        // ----------------------------------------------------
        // IMAGE ERROR
        // ----------------------------------------------------

        image.onerror =
            function() {

                console.error(
                    `❌ Page ${i} FAILED TO LOAD`
                );

                console.error(
                    "Path:",
                    imagePath
                );


                pageWrapper.innerHTML = `

                    <div
                        style="
                            min-height:220px;
                            display:flex;
                            flex-direction:column;
                            align-items:center;
                            justify-content:center;
                            text-align:center;
                            gap:8px;
                            padding:30px;
                            border:2px dashed #cbd5e1;
                            border-radius:8px;
                            background:#f8fafc;
                        "
                    >

                        <strong
                            style="
                                color:#dc2626;
                                font-size:16px;
                            "
                        >
                            Page ${i} could not be loaded
                        </strong>

                        <small
                            style="
                                color:#64748b;
                                word-break:break-all;
                            "
                        >
                            ${imagePath}
                        </small>

                    </div>

                `;

            };


        // ----------------------------------------------------
        // APPEND
        // ----------------------------------------------------

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


    console.log(
        `✅ CREATED ${totalPages} PAGE CONTAINERS`
    );

}


// ============================================================
// MARK PAPER AS VIEWED
// ============================================================

async function markPaperAsViewed() {

    if (
        !studentId
    ) {

        console.warn(
            "⚠️ Student ID not found."
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
            "======================================"
        );

        console.log(
            "✅ PAPER VIEWED"
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
            "Firestore field:",
            fieldPath
        );

        console.log(
            "======================================"
        );

    }

    catch (
        error
    ) {

        console.error(
            "❌ Failed to mark paper as viewed:",
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

    },
    true
);


// ============================================================
// IMAGE DRAG BLOCK
// ============================================================

document.addEventListener(
    "dragstart",
    function(event) {

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();

        }

    },
    true
);


// ============================================================
// COPY BLOCK
// ============================================================

document.addEventListener(
    "copy",
    function(event) {

        event.preventDefault();

    },
    true
);


// ============================================================
// KEYBOARD BLOCK
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            String(
                event.key || ""
            ).toLowerCase();


        // F12

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

            return;

        }


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


        // Ctrl + Shift + C

        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "c"
        ) {

            event.preventDefault();

            return;

        }

    },
    true
);


// ============================================================
// INITIALIZE
// ============================================================

async function initializeViewer() {

    console.log(
        "======================================"
    );

    console.log(
        "🟢 INITIALIZING NEW VIEWER"
    );

    console.log(
        "Paper:",
        paper
    );

    console.log(
        "Total Pages:",
        totalPages
    );

    console.log(
        "======================================"
    );


    // --------------------------------------------------------
    // LOAD ALL PAGES
    // --------------------------------------------------------

    loadPaperPages();


    // --------------------------------------------------------
    // MARK VIEWED
    // --------------------------------------------------------

    await markPaperAsViewed();

}


// ============================================================
// START
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeViewer
    );

}

else {

    initializeViewer();

}


// ============================================================
// FINAL CONSOLE
// ============================================================

console.log(
    "🔥🔥🔥 NEW VIEWER.JS LOADED 🔥🔥🔥"
);

console.log(
    "Paper:",
    paper
);

console.log(
    "TOTAL PAGES:",
    totalPages
);
