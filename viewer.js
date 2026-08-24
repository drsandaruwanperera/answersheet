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
// URL
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
    params.get("type") || "";


// ============================================================
// VALIDATE
// ============================================================

if (
    !/^paper\d+$/i.test(paper)
) {

    alert("Invalid paper.");

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
//
// CURRENT ACTUAL MODEL PAPER PAGE COUNTS
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
// TITLE
// ============================================================

if (titleElement) {

    titleElement.textContent =
        `Model Paper ${formattedNumber}`;

}


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
// LOAD PAGES
// ============================================================

function loadPages() {

    if (!pagesContainer) {

        console.error(
            "❌ pagesContainer not found."
        );

        return;

    }


    pagesContainer.innerHTML = "";


    if (
        !totalPages
    ) {

        pagesContainer.innerHTML = `
            <div class="page-error">
                Paper page count not configured.
            </div>
        `;

        return;

    }


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
    // CREATE ALL PAGES
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


        const imagePath =
            `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;


        console.log(
            `Page ${i}: ${imagePath}`
        );


        // ----------------------------------------------------
        // WRAPPER
        // ----------------------------------------------------

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "paper-page";


        // ----------------------------------------------------
        // PAGE LABEL
        // ----------------------------------------------------

        const label =
            document.createElement(
                "div"
            );

        label.className =
            "page-number";


        label.textContent =
            `Page ${i} / ${totalPages}`;


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
            `Model Paper ${formattedNumber} - Page ${i}`;


        image.loading =
            "eager";


        image.decoding =
            "async";


        image.draggable =
            false;


        // ----------------------------------------------------
        // IMAGE SUCCESS
        // ----------------------------------------------------

        image.onload =
            () => {

                console.log(
                    `✅ Page ${i} loaded`
                );

            };


        // ----------------------------------------------------
        // IMAGE ERROR
        // ----------------------------------------------------

        image.onerror =
            () => {

                console.error(
                    `❌ Page ${i} NOT FOUND:`,
                    imagePath
                );


                wrapper.innerHTML = `

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


        wrapper.appendChild(
            label
        );

        wrapper.appendChild(
            image
        );

        pagesContainer.appendChild(
            wrapper
        );

    }


    console.log(
        `✅ Created ${totalPages} page containers.`
    );

}


// ============================================================
// MARK VIEWED
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
            "✅ Marked as viewed:",
            fieldPath
        );

    }

    catch (error) {

        console.error(
            "❌ View tracking error:",
            error
        );

    }

}


// ============================================================
// RIGHT CLICK
// ============================================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    },
    true
);


// ============================================================
// DRAG
// ============================================================

document.addEventListener(
    "dragstart",
    event => {

        if (
            event.target?.tagName === "IMG"
        ) {

            event.preventDefault();

        }

    },
    true
);


// ============================================================
// KEYBOARD PROTECTION
// ============================================================

document.addEventListener(
    "keydown",
    event => {

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

    },
    true
);


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        loadPages();

        await markAsViewed();

    }
);


console.log(
    "🟢 NEW VIEWER JS LOADED"
);

console.log(
    "Paper:",
    paper
);

console.log(
    "Total Pages:",
    totalPages
);
