// =====================================================
// ANSWER VIEWER
// Student-only PDF viewer
// =====================================================


// =====================================================
// PDF.JS WORKER
// =====================================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// =====================================================
// ELEMENTS
// =====================================================

const canvas =
    document.getElementById(
        "pdfCanvas"
    );

const ctx =
    canvas.getContext(
        "2d"
    );

const loading =
    document.getElementById(
        "loading"
    );

const errorBox =
    document.getElementById(
        "error"
    );

const pageInfo =
    document.getElementById(
        "pageInfo"
    );

const previousPageBtn =
    document.getElementById(
        "previousPage"
    );

const nextPageBtn =
    document.getElementById(
        "nextPage"
    );

const viewerTitle =
    document.getElementById(
        "viewerTitle"
    );

const viewerSubtitle =
    document.getElementById(
        "viewerSubtitle"
    );


// =====================================================
// GET PDF URL
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const pdfURL =
    params.get(
        "pdf"
    );


// =====================================================
// VALIDATE
// =====================================================

if (!pdfURL) {

    showError(
        "No answer file was specified."
    );

}
else {

    loadPDF();

}


// =====================================================
// STATE
// =====================================================

let pdfDocument =
    null;

let currentPage =
    1;

let totalPages =
    0;

let rendering =
    false;

let pendingPage =
    null;


// =====================================================
// LOAD PDF
// =====================================================

async function loadPDF() {

    try {

        loading.style.display =
            "block";


        canvas.style.display =
            "none";


        // ---------------------------------------------
        // Load PDF
        // ---------------------------------------------

        pdfDocument =
            await pdfjsLib.getDocument(
                {
                    url: pdfURL
                }
            ).promise;


        totalPages =
            pdfDocument.numPages;


        // ---------------------------------------------
        // Title
        // ---------------------------------------------

        updateTitle();


        // ---------------------------------------------
        // First page
        // ---------------------------------------------

        await renderPage(
            currentPage
        );


        loading.style.display =
            "none";


        canvas.style.display =
            "block";


        updateControls();

    }
    catch (error) {

        console.error(
            "PDF loading error:",
            error
        );


        showError(
            "Unable to load this answer file."
        );

    }

}


// =====================================================
// RENDER PAGE
// =====================================================

async function renderPage(
    pageNumber
) {

    if (
        rendering
    ) {

        pendingPage =
            pageNumber;

        return;

    }


    rendering =
        true;


    try {

        const page =
            await pdfDocument.getPage(
                pageNumber
            );


        const container =
            document.querySelector(
                ".pdf-area"
            );


        const availableWidth =
            container.clientWidth -
            40;


        const originalViewport =
            page.getViewport(
                {
                    scale: 1
                }
            );


        const scale =
            Math.min(
                1.6,
                availableWidth /
                originalViewport.width
            );


        const viewport =
            page.getViewport(
                {
                    scale:
                        Math.max(
                            scale,
                            0.7
                        )
                }
            );


        canvas.width =
            viewport.width;

        canvas.height =
            viewport.height;


        await page.render(
            {
                canvasContext:
                    ctx,

                viewport:
                    viewport
            }
        ).promise;


        currentPage =
            pageNumber;


        updateControls();

    }
    catch (error) {

        console.error(
            "Render error:",
            error
        );

        showError(
            "Unable to display this page."
        );

    }
    finally {

        rendering =
            false;


        if (
            pendingPage !== null
        ) {

            const nextPage =
                pendingPage;

            pendingPage =
                null;

            renderPage(
                nextPage
            );

        }

    }

}


// =====================================================
// PREVIOUS
// =====================================================

previousPageBtn.addEventListener(
    "click",
    function () {

        if (
            currentPage <= 1
        ) {

            return;

        }


        renderPage(
            currentPage - 1
        );

    }
);


// =====================================================
// NEXT
// =====================================================

nextPageBtn.addEventListener(
    "click",
    function () {

        if (
            currentPage >= totalPages
        ) {

            return;

        }


        renderPage(
            currentPage + 1
        );

    }
);


// =====================================================
// UPDATE CONTROLS
// =====================================================

function updateControls() {

    pageInfo.textContent =
        `Page ${currentPage} / ${totalPages}`;


    previousPageBtn.disabled =
        currentPage <= 1;


    nextPageBtn.disabled =
        currentPage >= totalPages;

}


// =====================================================
// TITLE
// =====================================================

function updateTitle() {

    const decoded =
        decodeURIComponent(
            pdfURL
        );


    const filename =
        decoded
            .split("/")
            .pop();


    viewerTitle.textContent =
        filename
            .replace(
                ".pdf",
                ""
            )
            .replaceAll(
                "-",
                " "
            )
            .toUpperCase();


    viewerSubtitle.textContent =
        "Grade 11 • Student Answer Viewer";

}


// =====================================================
// ERROR
// =====================================================

function showError(
    message
) {

    loading.style.display =
        "none";


    canvas.style.display =
        "none";


    errorBox.textContent =
        message;


    errorBox.style.display =
        "block";

}


// =====================================================
// DISABLE RIGHT CLICK
// =====================================================

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    }
);


// =====================================================
// DISABLE COMMON SHORTCUTS
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        // Ctrl + S
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

        }


        // Ctrl + P
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "p"
        ) {

            event.preventDefault();

        }


        // Ctrl + U
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "u"
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
// DISABLE DRAG
// =====================================================

document.addEventListener(
    "dragstart",
    function (event) {

        event.preventDefault();

    }
);


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    function () {

        if (
            pdfDocument
        ) {

            renderPage(
                currentPage
            );

        }

    }
);


console.log(
    "🔐 Answer Viewer loaded"
);
