// =====================================================
// GRADE 10 MODEL PAPER VIEWER
// =====================================================


// =====================================================
// GET URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const term =
    params.get("term");


const paper =
    params.get("paper");


// =====================================================
// ELEMENTS
// =====================================================

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


// =====================================================
// DEBUG
// =====================================================

console.log(
    "======================================"
);

console.log(
    "GRADE 10 MODEL PAPER"
);

console.log(
    "Term:",
    term
);

console.log(
    "Paper:",
    paper
);

console.log(
    "MCQ Button:",
    mcqBtn
);

console.log(
    "MCQ Answer Button:",
    mcqAnswerBtn
);

console.log(
    "Question Button:",
    questionBtn
);

console.log(
    "Answer Button:",
    answerBtn
);

console.log(
    "======================================"
);


// =====================================================
// LOGIN
// =====================================================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.replace(
        "index.html"
    );

    throw new Error(
        "Student not logged in"
    );

}


// =====================================================
// VALIDATE TERM
// =====================================================

if (
    !["1", "2", "3"].includes(term)
) {

    alert(
        "Invalid term."
    );

    window.location.replace(
        "grade10-model-papers.html"
    );

    throw new Error(
        "Invalid term"
    );

}


// =====================================================
// VALIDATE PAPER
// =====================================================

const paperNumber =
    Number(paper);


if (
    !Number.isInteger(
        paperNumber
    ) ||
    paperNumber < 1 ||
    paperNumber > 99
) {

    alert(
        "Invalid paper."
    );

    window.location.replace(
        `grade10-term.html?term=${encodeURIComponent(
            term
        )}`
    );

    throw new Error(
        "Invalid paper"
    );

}


// =====================================================
// FORMAT PAPER
// =====================================================

const paperFormatted =
    String(
        paperNumber
    ).padStart(
        2,
        "0"
    );


// =====================================================
// TERM NAMES
// =====================================================

const termNames = {

    "1":
        "1st Term",

    "2":
        "2nd Term",

    "3":
        "3rd Term"

};


const termName =
    termNames[
        term
    ];


// =====================================================
// PAGE TITLE
// =====================================================

if (
    paperTitle
) {

    paperTitle.textContent =
        `📘 Model Paper ${paperFormatted}`;

}


if (
    paperSubtitle
) {

    paperSubtitle.textContent =
        `Grade 10 • ${termName}`;

}


// =====================================================
// PDF BASE PATH
// =====================================================
//
// Expected GitHub structure:
//
// papers/
//   grade10/
//     term1/
//       paper01/
//         mcq.pdf
//         question.pdf
//
//     term2/
//       paper01/
//         mcq.pdf
//         question.pdf
//
//     term3/
//       paper01/
//         mcq.pdf
//         question.pdf
//
// =====================================================

const basePath =
    `./papers/grade10/term${term}/paper${paperFormatted}`;


const mcqPDF =
    `${basePath}/mcq.pdf`;


const questionPDF =
    `${basePath}/question.pdf`;


// =====================================================
// ANSWER PAGE
// =====================================================

const mcqAnswerPage =
    `grade10-answer.html` +
    `?term=${encodeURIComponent(term)}` +
    `&paper=${encodeURIComponent(paperFormatted)}` +
    `&type=mcq`;


const answerSchemePage =
    `grade10-answer.html` +
    `?term=${encodeURIComponent(term)}` +
    `&paper=${encodeURIComponent(paperFormatted)}` +
    `&type=answer`;


// =====================================================
// OPEN PDF FUNCTION
// =====================================================

function openPDF(
    url
) {

    console.log(
        "Opening PDF:",
        url
    );


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


// =====================================================
// MCQ
// =====================================================

if (
    mcqBtn
) {

    mcqBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "MCQ clicked"
            );


            openPDF(
                mcqPDF
            );

        }
    );

}
else {

    console.error(
        "❌ mcqBtn not found"
    );

}


// =====================================================
// MCQ ANSWER
// =====================================================

if (
    mcqAnswerBtn
) {

    mcqAnswerBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "MCQ Answer clicked"
            );


            window.location.href =
                mcqAnswerPage;

        }
    );

}
else {

    console.error(
        "❌ mcqAnswerBtn not found"
    );

}


// =====================================================
// QUESTION PAPER
// =====================================================

if (
    questionBtn
) {

    questionBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "Question Paper clicked"
            );


            openPDF(
                questionPDF
            );

        }
    );

}
else {

    console.error(
        "❌ questionBtn not found"
    );

}


// =====================================================
// ANSWER SCHEME
// =====================================================

if (
    answerBtn
) {

    answerBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "Answer Scheme clicked"
            );


            window.location.href =
                answerSchemePage;

        }
    );

}
else {

    console.error(
        "❌ answerBtn not found"
    );

}


// =====================================================
// FINAL DEBUG
// =====================================================

console.log(
    "MCQ PDF:",
    mcqPDF
);

console.log(
    "Question PDF:",
    questionPDF
);

console.log(
    "MCQ Answer:",
    mcqAnswerPage
);

console.log(
    "Answer Scheme:",
    answerSchemePage
);

console.log(
    "✅ Grade 10 Model Paper JS loaded"
);
