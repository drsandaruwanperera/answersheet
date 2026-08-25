// =====================================================
// PROTECTED ANSWER VIEWER
// =====================================================


// =====================================================
// LOGIN CHECK
// =====================================================

const loggedIn =
    sessionStorage.getItem(
        "loggedIn"
    ) === "true";


if (!loggedIn) {

    window.location.replace(
        "index.html"
    );

}


// =====================================================
// GET URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const grade =
    params.get("grade");


const term =
    params.get("term");


const paper =
    params.get("paper");


const part =
    params.get("part");


// =====================================================
// VALIDATION
// =====================================================

const validGrades = [
    "11"
];


const validTerms = [
    "term1",
    "term2",
    "term3"
];


const validParts = [
    "A",
    "B"
];


const paperNumber =
    Number(paper);


if (
    !validGrades.includes(
        grade
    ) ||

    !validTerms.includes(
        term
    ) ||

    !validParts.includes(
        part
    ) ||

    !Number.isInteger(
        paperNumber
    ) ||

    paperNumber < 1 ||

    paperNumber > 5
) {

    showError(
        "Invalid answer request."
    );

    throw new Error(
        "Invalid answer parameters."
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const viewerTitle =
    document.getElementById(
        "viewerTitle"
    );


const viewerSubtitle =
    document.getElementById(
        "viewerSubtitle"
    );


const loading =
    document.getElementById(
        "loading"
    );


const errorMessage =
    document.getElementById(
        "errorMessage"
    );


const errorText =
    document.getElementById(
        "errorText"
    );


const canvasContainer =
    document.getElementById(
        "pdfCanvasContainer"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


const errorBackBtn =
    document.getElementById(
        "errorBackBtn"
    );


// =====================================================
// TERM TITLE
// =====================================================

const termTitles = {

    term1:
        "1st Term TOP Ranking",

    term2:
        "2nd Term TOP Ranking",

    term3:
        "3rd Term TOP Ranking"

};


const paperTitle =
    "TOP Ranking - " +
    String(
        paperNumber
    ).padStart(
        2,
        "0"
    );


if (viewerTitle) {

    viewerTitle.textContent =
        paperTitle +
        " - Part " +
        part;

}


if (viewerSubtitle) {

    viewerSubtitle.textContent =
        "Grade 11 • " +
        termTitles[term];

}


// =====================================================
// BACK
// =====================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            history.back();

        }
    );

}


if (errorBackBtn) {

    errorBackBtn.addEventListener(
        "click",
        function () {

            history.back();

        }
    );

}


// =====================================================
// PDF FILE PATH
// =====================================================
//
// Current GitHub structure:
//
// answers/grade11/term3/
// top-ranking-01-part-a.pdf
//
// etc.
//
// =====================================================

function getPDFPath() {

    const number =
        String(
            paperNumber
        ).padStart(
            2,
            "0"
        );


    const partName =
        part.toLowerCase();


    return (
        "answers/grade11/" +
        term +
        "/top-ranking-" +
        number +
        "-part-" +
        partName +
        ".pdf"
    );

}


const pdfPath =
    getPDFPath();


console.log(
    "Answer path:",
    pdfPath
);


// =====================================================
// PDF.JS
// =====================================================
//
// Import PDF.js dynamically.
//
// =====================================================

async function loadPDFJS() {

    const pdfjs =
        await import(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
        );


    return pdfjs;

}


// =====================================================
// LOAD PDF
// =====================================================

async function loadAnswer() {

    try {

        if (loading) {

            loading.style.display =
                "flex";

        }


        if (canvasContainer) {

            canvasContainer.innerHTML =
                "";

        }


        // =================================================
        // LOAD PDF.JS
        // =================================================

        const pdfjs =
            await loadPDFJS();


        // =================================================
        // WORKER
        // =================================================

        pdfjs.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


        // =================================================
        // FETCH PDF
        // =================================================

        const response =
            await fetch(
                pdfPath,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Answer file not found."
            );

        }


        const buffer =
            await response.arrayBuffer();


        if (
            !buffer ||
            buffer.byteLength === 0
        ) {

            throw new Error(
                "Answer file is empty."
            );

        }


        // =================================================
        // LOAD DOCUMENT
        // =================================================

        const pdf =
            await pdfjs.getDocument(
                {
                    data:
                        buffer,

                    disableAutoFetch:
                        false,

                    disableStream:
                        false
                }
            )
            .promise;


        console.log(
            "PDF loaded. Pages:",
            pdf.numPages
        );


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


        // =================================================
        // HIDE LOADING
        // =================================================

        if (loading) {

            loading.style.display =
                "none";

        }

    }
    catch (error) {

        console.error(
            "❌ Answer loading failed:",
            error
        );


        showError(
            "The answer could not be loaded. Please try again."
        );

    }

}


// =====================================================
// RENDER PAGE
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
    // SCALE
    // =================================================

    const baseViewport =
        page.getViewport(
            {
                scale: 1
            }
        );


    const maxWidth =
        Math.min(
            1000,
            window.innerWidth - 70
        );


    const scale =
        Math.min(
            1.5,
            maxWidth /
            baseViewport.width
        );


    const viewport =
        page.getViewport(
            {
                scale:
                    scale
            }
        );


    // =================================================
    // CANVAS
    // =================================================

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.className =
        "pdf-page";


    const context =
        canvas.getContext(
            "2d"
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
        Math.floor(
            viewport.width
        ) +
        "px";


    canvas.style.height =
        Math.floor(
            viewport.height
        ) +
        "px";


    context.setTransform(
        outputScale,
        0,
        0,
        outputScale,
        0,
        0
    );


    if (canvasContainer) {

        canvasContainer.appendChild(
            canvas
        );

    }


    // =================================================
    // RENDER
    // =================================================

    await page.render(
        {
            canvasContext:
                context,

            viewport:
                viewport
        }
    )
    .promise;

}


// =====================================================
// ERROR
// =====================================================

function showError(
    message
) {

    if (loading) {

        loading.style.display =
            "none";

    }


    if (canvasContainer) {

        canvasContainer.innerHTML =
            "";

    }


    if (errorText) {

        errorText.textContent =
            message;

    }


    if (errorMessage) {

        errorMessage.style.display =
            "flex";

    }

}


// =====================================================
// BLOCK RIGHT CLICK
// =====================================================

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    }
);


// =====================================================
// BLOCK COMMON SAVE / PRINT SHORTCUTS
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            String(
                event.key
            ).toLowerCase();


        // Ctrl + S
        if (
            event.ctrlKey &&
            key === "s"
        ) {

            event.preventDefault();

        }


        // Ctrl + P
        if (
            event.ctrlKey &&
            key === "p"
        ) {

            event.preventDefault();

        }


        // Ctrl + U
        if (
            event.ctrlKey &&
            key === "u"
        ) {

            event.preventDefault();

        }


        // Ctrl + Shift + I
        if (
            event.ctrlKey &&
            event.shiftKey &&
            key === "i"
        ) {

            event.preventDefault();

        }


        // F12
        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);


// =====================================================
// BLOCK PRINT EVENT
// =====================================================

window.addEventListener(
    "beforeprint",
    function (event) {

        event.preventDefault();

    }
);


// =====================================================
// PREVENT DRAGGING
// =====================================================

document.addEventListener(
    "dragstart",
    function (event) {

        event.preventDefault();

    }
);


// =====================================================
// START
// =====================================================

loadAnswer();
