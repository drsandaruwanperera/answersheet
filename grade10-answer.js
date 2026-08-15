// ==========================
// Get URL Parameters
// ==========================

const params = new URLSearchParams(
    window.location.search
);

const term = params.get("term");
const paper = params.get("paper");
const type = params.get("type");


// ==========================
// Elements
// ==========================

const answerTitle =
    document.getElementById("answerTitle");

const answerContainer =
    document.getElementById("answerContainer");


// ==========================
// Login Check
// ==========================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


// ==========================
// Student ID
// ==========================

const studentId =
    sessionStorage.getItem("studentId") || "";


// ==========================
// Validate Term
// ==========================

if (
    !["1", "2", "3"].includes(term)
) {

    alert("Invalid term.");

    window.location.replace(
        "grade10-model-papers.html"
    );

}


// ==========================
// Validate Paper
// ==========================

// Accept 1 or 01

const paperNumber =
    Number(paper);

if (
    !Number.isInteger(paperNumber) ||
    paperNumber < 1 ||
    paperNumber > 99
) {

    alert("Invalid paper.");

    window.location.replace(
        `grade10-term.html?term=${encodeURIComponent(term)}`
    );

}


// ==========================
// Paper Format
// ==========================

const paperFolder =
    `paper${String(paperNumber).padStart(2, "0")}`;


// ==========================
// Term Names
// ==========================

const termNames = {

    "1": "1st Term",
    "2": "2nd Term",
    "3": "3rd Term"

};

const termName =
    termNames[term];


// ==========================
// Answer Type
// ==========================

let answerFolder = "";
let title = "";

if (type === "mcq") {

    answerFolder = "mcq-answer";

    title = "📝 MCQ Answer";

}
else if (type === "answer") {

    answerFolder = "answer";

    title = "📝 Answer Scheme";

}
else {

    alert("Invalid answer type.");

    window.location.replace(
        `grade10-term.html?term=${encodeURIComponent(term)}`
    );

}


// ==========================
// Set Title
// ==========================

if (answerTitle) {

    answerTitle.textContent =
        `${title} - ${termName} - Paper ${String(
            paperNumber
        ).padStart(2, "0")}`;

}


// ==========================
// Image Folder
// ==========================

const imageFolder =
    `papers/grade10/term${term}/${paperFolder}/${answerFolder}/`;


// ==========================
// Load Answer Images
// ==========================

let pageNumber = 1;


// ==========================
// Load Next Image
// ==========================

function loadNextPage() {

    const number =
        String(pageNumber).padStart(2, "0");

    const imagePath =
        `${imageFolder}Page_${number}.jpg`;


    const img =
        document.createElement("img");

    img.src = imagePath;

    img.alt =
        `${termName} Model Paper ${paperNumber} Answer Page ${pageNumber}`;

    img.draggable = false;


    // ==========================
    // Image Loaded
    // ==========================

    img.onload = function () {

        const page =
            document.createElement("div");

        page.className =
            "answer-page";


        // ==========================
        // Watermark
        // ==========================

        const watermark =
            document.createElement("div");

        watermark.className =
            "watermark";


        for (
            let w = 0;
            w < 20;
            w++
        ) {

            const mark =
                document.createElement("span");

            mark.textContent =
                studentId;

            watermark.appendChild(mark);

        }


        // ==========================
        // Add Image
        // ==========================

        page.appendChild(img);

        page.appendChild(watermark);

        answerContainer.appendChild(page);


        // ==========================
        // Next Page
        // ==========================

        pageNumber++;

        loadNextPage();

    };


    // ==========================
    // Image Not Found
    // ==========================

    img.onerror = function () {

        console.log(
            "No more answer pages."
        );

        // Remove broken image
        img.remove();

        // If no pages loaded
        if (
            answerContainer.children.length === 0
        ) {

            answerContainer.innerHTML = `

                <div class="no-answer">

                    <h2>
                        Answer Not Available
                    </h2>

                    <p>
                        The answer pages are not available yet.
                    </p>

                </div>

            `;

        }

    };

}


// ==========================
// Start Loading
// ==========================

if (answerContainer) {

    loadNextPage();

}


// ==========================
// Disable Right Click
// ==========================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Dragging
// ==========================

document.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Copy
// ==========================

document.addEventListener(
    "copy",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Cut
// ==========================

document.addEventListener(
    "cut",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Text Selection
// ==========================

document.addEventListener(
    "selectstart",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Shortcuts
// ==========================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        // Ctrl / Cmd shortcuts

        if (
            event.ctrlKey ||
            event.metaKey
        ) {

            if (
                [
                    "s",
                    "p",
                    "c",
                    "x",
                    "u",
                    "a"
                ].includes(key)
            ) {

                event.preventDefault();

            }

        }


        // F12

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);


console.log(
    "✅ Grade 10 Answer Viewer Loaded",
    {
        term,
        paper: paperFolder,
        type,
        imageFolder
    }
);
