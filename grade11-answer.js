// ==========================
// Get URL Parameters
// ==========================

const params =
    new URLSearchParams(
        window.location.search
    );

const term =
    params.get("term");

const paper =
    params.get("paper");

const type =
    params.get("type");


// ==========================
// Elements
// ==========================

const answerTitle =
    document.getElementById(
        "answerTitle"
    );

const answerContainer =
    document.getElementById(
        "answerContainer"
    );


// ==========================
// Check Student Login
// ==========================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.href =
        "index.html";

}


// ==========================
// Get Student ID
// ==========================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


// ==========================
// Validate
// ==========================

if (
    !["1", "2", "3"].includes(term) ||
    !/^\d{2}$/.test(paper) ||
    !["mcq", "answer"].includes(type)
) {

    alert(
        "Invalid answer request."
    );

    window.location.href =
        "grade11-model-papers.html";

}


// ==========================
// Term Names
// ==========================

const termNames = {

    "1":
        "1st Term",

    "2":
        "2nd Term",

    "3":
        "3rd Term"

};

const termName =
    termNames[term];


// ==========================
// Answer Type
// ==========================

let answerName = "";

let title = "";

if (type === "mcq") {

    answerName =
        "mcq-answer";

    title =
        "📝 MCQ Answer";

}
else {

    answerName =
        "answer";

    title =
        "📝 Answer Scheme";

}


// ==========================
// Set Title
// ==========================

answerTitle.textContent =
    title;


// ==========================
// Image Folder
// ==========================

const imageFolder =
    `papers/grade11/term${term}/paper${paper}/${answerName}/`;


// ==========================
// Number Of Pages
// ==========================

const totalPages = 10;


// ==========================
// Load Images
// ==========================

for (
    let i = 1;
    i <= totalPages;
    i++
) {

    const pageNumber =
        String(i).padStart(
            2,
            "0"
        );


    const page =
        document.createElement(
            "div"
        );

    page.className =
        "answer-page";


    // ==========================
    // Image
    // ==========================

    const img =
        document.createElement(
            "img"
        );

    img.src =
        `${imageFolder}Page_${pageNumber}.jpg`;

    img.alt =
        `${termName} Grade 11 Model Paper ${paper} Answer Page ${i}`;

    img.draggable =
        false;


    // ==========================
    // Watermark
    // ==========================

    const watermark =
        document.createElement(
            "div"
        );

    watermark.className =
        "watermark";


    for (
        let w = 0;
        w < 20;
        w++
    ) {

        const mark =
            document.createElement(
                "span"
            );

        mark.textContent =
            studentId || "";

        watermark.appendChild(
            mark
        );

    }


    // ==========================
    // Add
    // ==========================

    page.appendChild(
        img
    );

    page.appendChild(
        watermark
    );

    answerContainer.appendChild(
        page
    );

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
// Disable Common Shortcuts
// ==========================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey ||
            event.metaKey
        ) {

            const key =
                event.key.toLowerCase();

            if (
                key === "s" ||
                key === "p" ||
                key === "c" ||
                key === "x" ||
                key === "u" ||
                key === "a"
            ) {

                event.preventDefault();

            }

        }


        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

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
