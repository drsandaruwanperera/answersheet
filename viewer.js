// ============================================================
// A/L MODEL PAPER VIEWER
// viewer.js
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
    params.get("type") || "";


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
        "Invalid paper parameter"
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


const pageCountElement =
    document.getElementById(
        "pageCount"
    );


const loadingElement =
    document.getElementById(
        "loading"
    );


const errorElement =
    document.getElementById(
        "error"
    );


const errorMessageElement =
    document.getElementById(
        "errorMessage"
    );


// ============================================================
// FIRESTORE SETTINGS REFERENCE
// ============================================================

const settingsRef =
    doc(
        db,
        "paperSettings",
        "settings"
    );


// ============================================================
// PAPER SETTINGS ID
// ============================================================

const settingId =
    `al_model_${formattedNumber}`;


// ============================================================
// SET TITLE
// ============================================================

if (titleElement) {

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


const backButton =
    document.getElementById(
        "backButton"
    );


const errorBackButton =
    document.getElementById(
        "errorBackButton"
    );


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


// Keep available for HTML onclick

window.goBack =
    goBack;


// ============================================================
// SHOW LOADING
// ============================================================

function showLoading() {

    if (loadingElement) {

        loadingElement.style.display =
            "flex";

    }

    if (errorElement) {

        errorElement.style.display =
            "none";

    }

}


// ============================================================
// HIDE LOADING
// ============================================================

function hideLoading() {

    if (loadingElement) {

        loadingElement.style.display =
            "none";

    }

}


// ============================================================
// SHOW ERROR
// ============================================================

function showError(
    message
) {

    hideLoading();


    if (errorElement) {

        errorElement.style.display =
            "flex";

    }


    if (errorMessageElement) {

        errorMessageElement.textContent =
            message;

    }

}


// ============================================================
// GET PAGE COUNT FROM FIRESTORE
// ============================================================

async function getPageCount() {

    try {

        const snapshot =
            await getDoc(
                settingsRef
            );


        if (
            !snapshot.exists()
        ) {

            console.warn(
                "paperSettings/settings document not found."
            );


            return null;

        }


        const settings =
            snapshot.data() || {};


        const paperSettings =
            settings[
                settingId
            ];


        console.log(
            "Paper setting:",
            settingId,
            paperSettings
        );


        if (
            !paperSettings
        ) {

            console.warn(
                `Setting ${settingId} not found.`
            );


            return null;

        }


        // ----------------------------------------------------
        // CHECK ENABLED
        // ----------------------------------------------------

        if (
            paperSettings.enabled === false
        ) {

            return {
                disabled: true,
                pages: 0
            };

        }


        // ----------------------------------------------------
        // GET PAGES
        // ----------------------------------------------------

        const pages =
            parseInt(
                paperSettings.pages,
                10
            );


        if (
            !Number.isFinite(pages) ||
            pages <= 0
        ) {

            console.warn(
                `Invalid page count for ${settingId}:`,
                paperSettings.pages
            );


            return null;

        }


        return {
            disabled: false,
            pages: pages
        };

    }

    catch (error) {

        console.error(
            "Failed to load paper settings:",
            error
        );


        return null;

    }

}


// ============================================================
// CHECK IMAGE EXISTS
// ============================================================

function checkImage(
    imagePath
) {

    return new Promise(
        resolve => {

            const image =
                new Image();


            image.onload =
                () => {

                    resolve(true);

                };


            image.onerror =
                () => {

                    resolve(false);

                };


            image.src =
                imagePath;

        }
    );

}


// ============================================================
// CREATE PAPER PAGE
// ============================================================

function createPage(
    pageNumber,
    totalPages
) {

    const pageWrapper =
        document.createElement(
            "div"
        );


    pageWrapper.className =
        "paper-page";


    pageWrapper.dataset.page =
        pageNumber;


    // --------------------------------------------------------
    // PAGE LABEL
    // --------------------------------------------------------

    const pageLabel =
        document.createElement(
            "div"
        );


    pageLabel.className =
        "page-number";


    pageLabel.textContent =
        `Page ${pageNumber} / ${totalPages}`;


    // --------------------------------------------------------
    // IMAGE WRAPPER
    // --------------------------------------------------------

    const imageWrapper =
        document.createElement(
            "div"
        );


    imageWrapper.className =
        "image-wrapper";


    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    const image =
        document.createElement(
            "img"
        );


    const pageText =
        String(
            pageNumber
        ).padStart(
            2,
            "0"
        );


    const imagePath =
        `papers/${paper}/${paper}_Page_${pageText}.jpg`;


    image.src =
        imagePath;


    image.alt =
        `Model Paper ${formattedNumber} - Page ${pageNumber}`;


    image.loading =
        "eager";


    image.decoding =
        "async";


    image.draggable =
        false;


    image.setAttribute(
        "draggable",
        "false"
    );


    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    image.onload =
        () => {

            console.log(
                `✅ Page ${pageNumber} loaded:`,
                imagePath
            );

        };


    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    image.onerror =
        () => {

            console.error(
                `❌ Page ${pageNumber} failed:`,
                imagePath
            );


            imageWrapper.innerHTML = `
                <div class="page-error">
                    <strong>
                        Page ${pageNumber} could not be loaded.
                    </strong>

                    <small>
                        ${imagePath}
                    </small>
                </div>
            `;

        };


    imageWrapper.appendChild(
        image
    );


    pageWrapper.appendChild(
        pageLabel
    );


    pageWrapper.appendChild(
        imageWrapper
    );


    return pageWrapper;

}


// ============================================================
// LOAD ALL PAPER PAGES
// ============================================================

async function loadPages(
    totalPages
) {

    if (!pagesContainer) {

        console.error(
            "❌ pagesContainer not found."
        );

        return false;

    }


    pagesContainer.innerHTML =
        "";


    console.log(
        "======================================"
    );

    console.log(
        `Loading ${totalPages} pages`
    );

    console.log(
        "Paper:",
        paper
    );

    console.log(
        "Folder:",
        `papers/${paper}/`
    );

    console.log(
        "======================================"
    );


    let loadedCount =
        0;


    // ========================================================
    // CREATE EVERY PAGE
    // ========================================================

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const page =
            createPage(
                i,
                totalPages
            );


        pagesContainer.appendChild(
            page
        );


        loadedCount++;

    }


    if (pageCountElement) {

        pageCountElement.textContent =
            `${totalPages} Pages`;

    }


    console.log(
        `✅ ${loadedCount} page containers created.`
    );


    return true;

}


// ============================================================
// MARK PAPER AS VIEWED
// ============================================================

async function markAsViewed() {

    if (!studentId) {

        console.warn(
            "Student ID not found. Cannot mark viewed."
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
            "✅ PAPER MARKED AS VIEWED"
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
            "Field:",
            fieldPath
        );

        console.log(
            "======================================"
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
// CONTENT PROTECTION
// ============================================================


// ------------------------------------------------------------
// RIGHT CLICK
// ------------------------------------------------------------

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    },
    true
);


// ------------------------------------------------------------
// DRAG
// ------------------------------------------------------------

document.addEventListener(
    "dragstart",
    event => {

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            event.preventDefault();

        }

    },
    true
);


// ------------------------------------------------------------
// COPY
// ------------------------------------------------------------

document.addEventListener(
    "copy",
    event => {

        event.preventDefault();

    },
    true
);


// ------------------------------------------------------------
// KEYBOARD
// ------------------------------------------------------------

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
// INITIALIZE VIEWER
// ============================================================

async function initializeViewer() {

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
        "Setting ID:",
        settingId
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
        "======================================"
    );


    showLoading();


    // ========================================================
    // GET PAGE COUNT FROM ADMIN SETTINGS
    // ========================================================

    const configuration =
        await getPageCount();


    // --------------------------------------------------------
    // ADMIN DISABLED
    // --------------------------------------------------------

    if (
        configuration?.disabled
    ) {

        showError(
            "This paper is currently unavailable."
        );

        return;

    }


    // --------------------------------------------------------
    // SETTINGS NOT FOUND
    // --------------------------------------------------------

    if (
        !configuration
    ) {

        showError(
            `Paper settings for Model Paper ${formattedNumber} could not be loaded.`
        );

        return;

    }


    const totalPages =
        configuration.pages;


    console.log(
        "======================================"
    );

    console.log(
        "FINAL PAGE COUNT:",
        totalPages
    );

    console.log(
        "======================================"
    );


    // ========================================================
    // LOAD PAGES
    // ========================================================

    const success =
        await loadPages(
            totalPages
        );


    if (!success) {

        showError(
            "Unable to load paper pages."
        );

        return;

    }


    // ========================================================
    // HIDE LOADING
    // ========================================================

    hideLoading();


    // ========================================================
    // MARK VIEWED
    // ========================================================

    await markAsViewed();

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

} else {

    initializeViewer();

}


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "🟢 Latest viewer.js loaded."
);
