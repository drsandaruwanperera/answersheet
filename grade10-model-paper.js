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
// Validate
// ==========================

if (
    !["1", "2", "3"].includes(term) ||
    !/^\d{2}$/.test(paper)
) {

    alert(
        "Invalid Model Paper."
    );

    window.location.replace(
        "grade10-model-papers.html"
    );

}


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
// Page Title
// ==========================

if (paperTitle) {

    paperTitle.textContent =
        "📘 Model Paper - " +
        paper;

}

if (paperSubtitle) {

    paperSubtitle.textContent =
        "Grade 10 • " +
        termName;

}


// ==========================
// PDF Base Path
// ==========================

const basePath =
    `./papers/grade10/term${term}/paper${paper}`;


// ==========================
// Part A - MCQ
// ==========================

if (mcqBtn) {

    mcqBtn.addEventListener(
        "click",
        () => {

            const pdf =
                `${basePath}/mcq.pdf`;

            window.open(
                pdf,
                "_blank"
            );

        }
    );

}


// ==========================
// Part A - MCQ Answer
// ==========================

if (mcqAnswerBtn) {

    mcqAnswerBtn.addEventListener(
        "click",
        () => {

            const url =
                `grade10-answer.html?` +
                `term=${encodeURIComponent(term)}` +
                `&paper=${encodeURIComponent(paper)}` +
                `&type=mcq`;

            window.location.assign(
                url
            );

        }
    );

}


// ==========================
// Part B - Question Paper
// ==========================

if (questionBtn) {

    questionBtn.addEventListener(
        "click",
        () => {

            const pdf =
                `${basePath}/question.pdf`;

            window.open(
                pdf,
                "_blank"
            );

        }
    );

}


// ==========================
// Part B - Answer
// ==========================

if (answerBtn) {

    answerBtn.addEventListener(
        "click",
        () => {

            const url =
                `grade10-answer.html?` +
                `term=${encodeURIComponent(term)}` +
                `&paper=${encodeURIComponent(paper)}` +
                `&type=answer`;

            window.location.assign(
                url
            );

        }
    );

}


console.log(
    "✅ Grade 10 Model Paper Loaded",
    {
        term,
        paper,
        basePath
    }
);
