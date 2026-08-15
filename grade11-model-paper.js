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


// ==========================
// Elements
// ==========================

const paperTitle =
    document.getElementById(
        "paperTitle"
    );

const paperSubtitle =
    document.getElementById(
        "paperSubtitle"
    );

const mcqBtn =
    document.getElementById(
        "mcqBtn"
    );

const mcqAnswerBtn =
    document.getElementById(
        "mcqAnswerBtn"
    );

const questionBtn =
    document.getElementById(
        "questionBtn"
    );

const answerBtn =
    document.getElementById(
        "answerBtn"
    );


// ==========================
// Validate Parameters
// ==========================

if (
    !["1", "2", "3"].includes(term) ||
    !/^\d{2}$/.test(paper)
) {

    alert(
        "Invalid Model Paper."
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
// Page Title
// ==========================

paperTitle.textContent =
    "📘 Model Paper - " +
    paper;

paperSubtitle.textContent =
    "Grade 11 • " +
    termName;


// ==========================
// PDF Base Path
// ==========================

const basePath =
    `papers/grade11/term${term}/paper${paper}`;


// ==========================
// Part A - MCQ
// ==========================

mcqBtn.addEventListener(
    "click",
    () => {

        window.open(
            `${basePath}/mcq.pdf`,
            "_blank"
        );

    }
);


// ==========================
// Part A - MCQ Answer
// ==========================

mcqAnswerBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            `grade11-answer.html?` +
            `term=${encodeURIComponent(term)}` +
            `&paper=${encodeURIComponent(paper)}` +
            `type=mcq`;

    }
);


// ==========================
// Part B - Question Paper
// ==========================

questionBtn.addEventListener(
    "click",
    () => {

        window.open(
            `${basePath}/question.pdf`,
            "_blank"
        );

    }
);


// ==========================
// Part B - Answer Scheme
// ==========================

answerBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            `grade11-answer.html?` +
            `term=${encodeURIComponent(term)}` +
            `&paper=${encodeURIComponent(paper)}` +
            `type=answer`;

    }
);
