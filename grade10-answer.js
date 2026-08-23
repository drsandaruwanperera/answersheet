// ==========================
// Get URL Parameters
// ==========================

const params = new URLSearchParams(window.location.search);

const term = params.get("term");
const paper = params.get("paper");
const type = params.get("type");


// ==========================
// Elements
// ==========================

const answerTitle = document.getElementById("answerTitle");
const answerContainer = document.getElementById("answerContainer");


// ==========================
// Login Check
// ==========================

if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.replace("index.html");
}


// ==========================
// Student ID
// ==========================

const studentId = sessionStorage.getItem("studentId") || "";


// ==========================
// Validation
// ==========================

if (!["1", "2", "3"].includes(term)) {
    window.location.replace("grade10-model-papers.html");
}

const paperNumber = Number(paper);

if (!Number.isInteger(paperNumber) || paperNumber < 1) {
    window.location.replace(`grade10-term.html?term=${term}`);
}


// ==========================
// Names
// ==========================

const termNames = {
    "1": "1st Term",
    "2": "2nd Term",
    "3": "3rd Term"
};

const termName = termNames[term];

const paperFolder = `paper${String(paperNumber).padStart(2, "0")}`;

let answerFolder;
let title;

if (type === "mcq") {
    answerFolder = "mcq-answer";
    title = "📝 MCQ Answer";
} else {
    answerFolder = "answer";
    title = "📝 Answer Scheme";
}


// ==========================
// Title
// ==========================

answerTitle.textContent =
    `${title} - ${termName} - Paper ${String(paperNumber).padStart(2, "0")}`;


// ==========================
// Possible image names
// ==========================

const base =
    `papers/grade10/term${term}/${paperFolder}/${answerFolder}/`;

const possibleNames = [
    n => `Page_${String(n).padStart(2, "0")}.jpg`,
    n => `page_${String(n).padStart(2, "0")}.jpg`,
    n => `Page_${String(n).padStart(2, "0")}.png`,
    n => `page_${String(n).padStart(2, "0")}.png`,
    n => `${n}.jpg`,
    n => `${n}.png`
];

let pageNumber = 1;
let loaded = 0;


// ==========================
// Load page
// ==========================

function tryNames(index) {

    if (index >= possibleNames.length) {

        if (loaded === 0) {

            answerContainer.innerHTML = `
                <div class="no-answer">
                    <h2>Answer Not Available</h2>
                    <p>No answer image files were found.</p>
                    <p style="font-size:13px;color:#777;">
                        Expected folder: ${base}
                    </p>
                </div>
            `;
        }

        return;
    }

    const path =
        base + possibleNames[index](pageNumber);

    const img = new Image();

    img.src = path;

    img.onload = () => {

        const page = document.createElement("div");
        page.className = "answer-page";

        const watermark = document.createElement("div");
        watermark.className = "watermark";

        for (let i = 0; i < 20; i++) {
            const span = document.createElement("span");
            span.textContent = studentId;
            watermark.appendChild(span);
        }

        page.appendChild(img);
        page.appendChild(watermark);

        answerContainer.appendChild(page);

        loaded++;
        pageNumber++;

        tryNames(0);
    };

    img.onerror = () => {
        tryNames(index + 1);
    };
}


// ==========================
// Start
// ==========================

tryNames(0);
