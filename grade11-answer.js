// =====================================================
// GRADE 11 ANSWER VIEWER
// =====================================================
// Loads PDF from:
//
// answers/grade11/term1/
// answers/grade11/term2/
// answers/grade11/term3/
//
// Example:
//
// answers/grade11/term3/top-ranking-01-part-a.pdf
//
// =====================================================


// =====================================================
// PDF.JS
// =====================================================

import * as pdfjsLib from
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";


pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


// =====================================================
// URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const file =
    params.get("file");


const title =
    params.get("title") ||
    "Grade 11 Answer";


// =====================================================
// ELEMENTS
// =====================================================

const viewer =
    document.getElementById(
        "viewer"
    );


const loading =
    document.getElementById(
        "loading"
    );


const pdfContainer =
    document.getElementById(
        "pdfContainer"
    );


const answerTitle =
    document.getElementById(
        "answerTitle"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// SET TITLE
// =====================================================

if (answerTitle) {

    answerTitle.textContent =
        title;

}


// =====================================================
// BACK BUTTON
// =====================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// =====================================================
// RIGHT CLICK BLOCK
// =====================================================

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    },
    true
);


// =====================================================
// COPY BLOCK
// =====================================================

document.addEventListener(
    "copy",
    function (event) {

        event.preventDefault();

    },
    true
);


// =====================================================
// CUT BLOCK
// =====================================================

document.addEventListener(
    "cut",
    function (event) {

        event.preventDefault();

    },
    true
);


// =====================================================
// DRAG BLOCK
// =====================================================

document.addEventListener(
    "dragstart",
    function (event) {

        event.preventDefault();

    },
    true
);


// =====================================================
// KEYBOARD PROTECTION
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            String(
                event.key
            ).toLowerCase();


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


        // Ctrl + Shift + S

        if (
            event.ctrlKey &&
            event.shiftKey &&
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


        // F12

        if (
            event.key === "F12"
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


// =====================================================
// VALIDATE FILE
// =====================================================

if (
    !file ||
    file.trim() === ""
) {

    showError(
        "No answer file was provided."
    );

}
else {

    loadPDF(
        file
    );

}


// =====================================================
// LOAD PDF
// =====================================================

async function loadPDF(
    filePath
) {

    try {

        console.log(
            "===================================="
        );

        console.log(
            "📖 GRADE 11 ANSWER VIEWER"
        );

        console.log(
            "PDF:",
            filePath
        );

        console.log(
            "TITLE:",
            title
        );

        console.log(
            "===================================="
        );


        // =================================================
        // LOAD PDF
        // =================================================

        const loadingTask =
            pdfjsLib.getDocument({

                url:
                    filePath,

                withCredentials:
                    false

            });


        const pdf =
            await loadingTask.promise;


        console.log(
            "✅ PDF loaded:",
            pdf.numPages,
            "pages"
        );


        // =================================================
        // REMOVE LOADING
        // =================================================

        if (loading) {

            loading.remove();

        }


        // =================================================
        // RENDER ALL PAGES
        // =================================================

        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            await renderPage(
                pdf,
                pageNumber
            );

        }


        console.log(
            "✅ All answer pages rendered"
        );

    }
    catch (error) {

        console.error(
            "❌ PDF loading failed:",
            error
        );


        showError(
            "Unable to load this answer. Please check the PDF file path."
        );

    }

}


// =====================================================
// RENDER PDF PAGE
// =====================================================

async function renderPage(
    pdf,
    pageNumber
) {

    const page =
        await pdf.getPage(
            pageNumber
        );


    // =================================================
    // BASE VIEWPORT
    // =================================================

    const baseViewport =
        page.getViewport({
            scale: 1
        });


    // =================================================
    // AVAILABLE WIDTH
    // =================================================

    const availableWidth =
        Math.max(
            300,
            viewer.clientWidth - 40
        );


    // =================================================
    // SCALE
    // =================================================

    const scale =
        Math.min(
            1.8,
            availableWidth /
            baseViewport.width
        );


    const viewport =
        page.getViewport({
            scale:
                scale
        });


    // =================================================
    // PAGE WRAPPER
    // =================================================

    const pageWrapper =
        document.createElement(
            "div"
        );


    pageWrapper.className =
        "pdf-page";


    pageWrapper.dataset.page =
        pageNumber;


    pageWrapper.style.width =
        `${viewport.width}px`;


    pageWrapper.style.height =
        `${viewport.height}px`;


    // =================================================
    // CANVAS
    // =================================================

    const canvas =
        document.createElement(
            "canvas"
        );


    const context =
        canvas.getContext(
            "2d",
            {
                alpha:
                    false
            }
        );


    const outputScale =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.floor(
            viewport.width *
            outputScale
        );


    canvas.height =
        Math.floor(
            viewport.height *
            outputScale
        );


    canvas.style.width =
        `${viewport.width}px`;


    canvas.style.height =
        `${viewport.height}px`;


    // =================================================
    // RENDER CONTEXT
    // =================================================

    const renderContext = {

        canvasContext:
            context,

        viewport:
            viewport,

        transform:
            outputScale !== 1

                ? [
                    outputScale,
                    0,
                    0,
                    outputScale,
                    0,
                    0
                ]

                : null

    };


    // =================================================
    // ADD TO DOM
    // =================================================

    pageWrapper.appendChild(
        canvas
    );


    pdfContainer.appendChild(
        pageWrapper
    );


    // =================================================
    // RENDER
    // =================================================

    await page.render(
        renderContext
    ).promise;

}


// =====================================================
// ERROR SCREEN
// =====================================================

function showError(
    message
) {

    if (loading) {

        loading.remove();

    }


    viewer.className =
        "error-screen";


    viewer.innerHTML = `

        <div class="error-card">

            <div class="error-icon">
                ⚠️
            </div>


            <h2>
                Unable to Open Answer
            </h2>


            <p>
                ${message}
            </p>


            <button
                type="button"
                class="error-back"
                id="errorBack"
            >

                ← Go Back

            </button>

        </div>

    `;


    const errorBack =
        document.getElementById(
            "errorBack"
        );


    if (errorBack) {

        errorBack.addEventListener(
            "click",
            function () {

                window.history.back();

            }
        );

    }

}
