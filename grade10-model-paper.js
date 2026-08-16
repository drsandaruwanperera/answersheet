// =========================================
// GET URL PARAMETERS
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const term =
    params.get("term");


const paper =
    params.get("paper");


// =========================================
// ELEMENTS
// =========================================

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


// =========================================
// TERM NAMES
// =========================================

const termNames = {

    "1":
        "1st Term",

    "2":
        "2nd Term",

    "3":
        "3rd Term"

};


// =========================================
// VALIDATION
// =========================================

const validTerm =
    [
        "1",
        "2",
        "3"
    ].includes(
        term
    );


const validPaper =
    /^\d{2}$/.test(
        paper || ""
    );


if (
    !validTerm ||
    !validPaper
) {

    alert(
        "Invalid Model Paper."
    );


    window.location.replace(
        "grade10-model-papers.html"
    );

}


// =========================================
// TERM NAME
// =========================================

const termName =
    termNames[
        term
    ];


// =========================================
// PAGE TITLE
// =========================================

if (
    paperTitle
) {

    paperTitle.textContent =
        "📘 Model Paper - " +
        paper;

}


if (
    paperSubtitle
) {

    paperSubtitle.textContent =
        "Grade 10 • " +
        termName;

}


// =========================================
// PDF BASE PATH
// =========================================

const basePath =
    `./papers/grade10/term${term}/paper${paper}`;


// =========================================
// MCQ PDF
// =========================================

if (
    mcqBtn
) {

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


// =========================================
// MCQ ANSWER
// =========================================

if (
    mcqAnswerBtn
) {

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


// =========================================
// QUESTION PAPER
// =========================================

if (
    questionBtn
) {

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


// =========================================
// ANSWER SCHEME
// =========================================

if (
    answerBtn
) {

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


// =========================================
// CONSOLE
// =========================================

console.log(
    "✅ Grade 10 Model Paper Loaded",
    {
        grade:
            "grade10",

        type:
            "model",

        term,

        paper,

        basePath
    }
);
