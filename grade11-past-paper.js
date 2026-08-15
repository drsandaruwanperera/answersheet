// ==========================
// Get URL Parameters
// ==========================

const params =
    new URLSearchParams(
        window.location.search
    );

const year =
    params.get("year");


// ==========================
// Elements
// ==========================

const paperTitle =
    document.getElementById(
        "paperTitle"
    );

const partABtn =
    document.getElementById(
        "partABtn"
    );

const partAAnswerBtn =
    document.getElementById(
        "partAAnswerBtn"
    );

const partBBtn =
    document.getElementById(
        "partBBtn"
    );

const partBAnswerBtn =
    document.getElementById(
        "partBAnswerBtn"
    );


// ==========================
// Validate Year
// ==========================

const yearNumber =
    Number(year);

if (
    !Number.isInteger(yearNumber) ||
    yearNumber < 2016 ||
    yearNumber > 2025
) {

    alert(
        "Invalid Past Paper."
    );

    window.location.href =
        "grade11-past-papers.html";

}


// ==========================
// Login Check
// ==========================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.href =
        "index.html";

}


// ==========================
// Set Title
// ==========================

paperTitle.textContent =
    "📚 Grade 11 Past Paper - " +
    year;


// ==========================
// PDF Folder
// ==========================

const basePath =
    `papers/grade11/past/${year}/`;


// ==========================
// Part A PDF
// ==========================

partABtn.addEventListener(
    "click",
    () => {

        window.open(
            `${basePath}part-a.pdf`,
            "_blank"
        );

    }
);


// ==========================
// Part A Answer
// ==========================

partAAnswerBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            `grade11-past-answer.html?` +
            `year=${encodeURIComponent(year)}` +
            `&part=a`;

    }
);


// ==========================
// Part B PDF
// ==========================

partBBtn.addEventListener(
    "click",
    () => {

        window.open(
            `${basePath}part-b.pdf`,
            "_blank"
        );

    }
);


// ==========================
// Part B Answer
// ==========================

partBAnswerBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            `grade11-past-answer.html?` +
            `year=${encodeURIComponent(year)}` +
            `&part=b`;

    }
);


console.log(
    "✅ Grade 11 Past Paper Loaded:",
    year
);
