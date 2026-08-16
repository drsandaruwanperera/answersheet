// =========================================
// GET YEAR
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const year =
    params.get("year");


const yearNumber =
    Number(year);


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


// =========================================
// VALIDATE YEAR
// =========================================

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


// =========================================
// LOGIN CHECK
// =========================================

else if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =========================================
// SET PAGE
// =========================================

else {

    if (
        paperTitle
    ) {

        paperTitle.textContent =
            "📚 Grade 11 Past Paper - " +
            year;

    }


    if (
        paperSubtitle
    ) {

        paperSubtitle.textContent =
            "Select Part A or Part B";

    }


    // =====================================
    // PDF BASE PATH
    // =====================================

    const basePath =
        `papers/grade11/past/${year}/`;


    // =====================================
    // TRACK PAPER VIEW
    // =====================================
    //
    // Saves:
    //
    // paperViews
    //   grade11
    //     past
    //       2024: true
    //
    // =====================================

    async function trackPastPaper() {

        const studentId =
            sessionStorage.getItem(
                "studentId"
            );


        if (
            !studentId
        ) {

            console.warn(
                "Student ID not found."
            );

            return;

        }


        try {

            // Import Firebase functions

            const {
                db,
                doc,
                updateDoc
            } =
                await import(
                    "./firebase.js"
                );


            const studentRef =
                doc(
                    db,
                    "students",
                    studentId
                );


            const fieldPath =
                `paperViews.grade11.past.${year}`;


            await updateDoc(
                studentRef,
                {
                    [fieldPath]:
                        true
                }
            );


            console.log(
                "✅ Grade 11 Past Paper tracked:",
                {
                    year,
                    fieldPath
                }
            );

        }

        catch (
            error
        ) {

            console.error(
                "Past Paper tracking error:",
                error
            );

        }

    }


    // =====================================
    // PART A PDF
    // =====================================

    if (
        partABtn
    ) {

        partABtn.addEventListener(
            "click",
            () => {

                trackPastPaper();


                window.open(
                    `${basePath}part-a.pdf`,
                    "_blank"
                );

            }
        );

    }


    // =====================================
    // PART A ANSWER
    // =====================================

    if (
        partAAnswerBtn
    ) {

        partAAnswerBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    `grade11-past-answer.html?` +
                    `year=${encodeURIComponent(year)}` +
                    `&part=a`;

            }
        );

    }


    // =====================================
    // PART B PDF
    // =====================================

    if (
        partBBtn
    ) {

        partBBtn.addEventListener(
            "click",
            () => {

                trackPastPaper();


                window.open(
                    `${basePath}part-b.pdf`,
                    "_blank"
                );

            }
        );

    }


    // =====================================
    // PART B ANSWER
    // =====================================

    if (
        partBAnswerBtn
    ) {

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


// =========================================
// CONSOLE
// =========================================

console.log(
    "✅ Grade 11 Past Paper Loaded",
    {
        grade:
            "grade11",

        type:
            "past",

        year
    }
);
