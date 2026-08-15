// ==========================
// Grade 11 Past Paper
// ==========================


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
// Check Year
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

    throw new Error(
        "Invalid past paper year."
    );

}


// ==========================
// Check Login
// ==========================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.href =
        "index.html";

    throw new Error(
        "Student is not logged in."
    );

}


// ==========================
// Set Page Title
// ==========================

paperTitle.textContent =
    "📚 Grade 11 Past Paper - " +
    year;


// ==========================
// PDF Folder
// ==========================
//
// Folder structure:
//
// papers/
//   grade11/
//     past/
//       2025/
//         part-a.pdf
//         part-b.pdf
//
//       2024/
//         part-a.pdf
//         part-b.pdf
//
//       ...
//
//       2016/
//         part-a.pdf
//         part-b.pdf
//

const basePath =
    `papers/grade11/past/${year}/`;


// ==========================
// Part A PDF
// ==========================

partABtn.addEventListener(
    "click",
    () => {

        const pdfPath =
            `${basePath}part-a.pdf`;

        window.open(
            pdfPath,
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

        const answerUrl =
            "grade11-past-answer.html?" +
            "year=" +
            encodeURIComponent(year) +
            "&part=a";

        window.location.href =
            answerUrl;

    }
);


// ==========================
// Part B PDF
// ==========================

partBBtn.addEventListener(
    "click",
    () => {

        const pdfPath =
            `${basePath}part-b.pdf`;

        window.open(
            pdfPath,
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

        const answerUrl =
            "grade11-past-answer.html?" +
            "year=" +
            encodeURIComponent(year) +
            "&part=b";

        window.location.href =
            answerUrl;

    }
);


// ==========================
// Loaded
// ==========================

console.log(
    "✅ Grade 11 Past Paper Loaded"
);

console.log(
    "Year:",
    year
);

console.log(
    "PDF Folder:",
    basePath
);
