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
    ["1", "2", "3"].includes(
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

    window.location.replace(
        "grade11-model-papers.html"
    );

}
else {

    // =====================================
    // TERM NAME
    // =====================================

    const termName =
        termNames[term];


    // =====================================
    // PAGE TITLE
    // =====================================

    if (
        paperTitle
    ) {

        paperTitle.textContent =
            "🏆 TOP Ranking - " +
            paper;

    }


    if (
        paperSubtitle
    ) {

        paperSubtitle.textContent =
            "Grade 11 • " +
            termName;

    }


    // =====================================
    // PDF BASE PATH
    // =====================================

    const basePath =
        `papers/grade11/term${term}/paper${paper}`;


    // =====================================
    // MCQ PDF
    // =====================================

    if (
        mcqBtn
    ) {

        mcqBtn.addEventListener(
            "click",
            () => {

                window.open(
                    `${basePath}/mcq.pdf`,
                    "_blank"
                );

            }
        );

    }


    // =====================================
    // MCQ ANSWER
    // =====================================

    if (
        mcqAnswerBtn
    ) {

        mcqAnswerBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    `grade11-answer.html?` +
                    `term=${encodeURIComponent(
                        term
                    )}` +
                    `&paper=${encodeURIComponent(
                        paper
                    )}` +
                    `&type=mcq`;

            }
        );

    }


    // =====================================
    // QUESTION PAPER
    // =====================================

    if (
        questionBtn
    ) {

        questionBtn.addEventListener(
            "click",
            () => {

                window.open(
                    `${basePath}/question.pdf`,
                    "_blank"
                );

            }
        );

    }


    // =====================================
    // ANSWER SCHEME
    // =====================================

    if (
        answerBtn
    ) {

        answerBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    `grade11-answer.html?` +
                    `term=${encodeURIComponent(
                        term
                    )}` +
                    `&paper=${encodeURIComponent(
                        paper
                    )}` +
                    `&type=answer`;

            }
        );

    }

}


// =========================================
// CONSOLE
// =========================================

console.log(
    "✅ Grade 11 TOP Ranking Loaded",
    {
        grade:
            "grade11",

        type:
            "top-ranking",

        term,

        paper
    }
);
