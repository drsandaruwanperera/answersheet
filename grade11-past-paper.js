// ==========================
// Get Year
// ==========================

const params =
    new URLSearchParams(
        window.location.search
    );

const year =
    params.get("year");

const yearNumber =
    Number(year);


// ==========================
// If No Valid Year
// ==========================

if (
    !year ||
    !Number.isInteger(yearNumber) ||
    yearNumber < 2016 ||
    yearNumber > 2025
) {

    window.location.replace(
        "grade11-past-papers.html"
    );

}
else {

    // ==========================
    // Login Check
    // ==========================

    if (
        sessionStorage.getItem(
            "loggedIn"
        ) !== "true"
    ) {

        window.location.replace(
            "index.html"
        );

    }
    else {

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
        // Title
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
        // Part A
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
        // Part B
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

    }

}
