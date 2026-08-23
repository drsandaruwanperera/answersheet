import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


// =====================================================
// GET PROVINCE
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const province =
    params.get("province");


// =====================================================
// PROVINCE DATA
// =====================================================

const provinceMap = {

    central: {
        name: "Central Province",
        paper: "paper01"
    },

    western: {
        name: "Western Province",
        paper: "paper02"
    },

    "north-western": {
        name: "North Western Province",
        paper: "paper03"
    },

    southern: {
        name: "Southern Province",
        paper: "paper04"
    },

    sabaragamuwa: {
        name: "Sabaragamuwa Province",
        paper: "paper05"
    }

};


// =====================================================
// GET DATA
// =====================================================

const data =
    provinceMap[province];


// =====================================================
// VALIDATE PROVINCE
// =====================================================

if (!data) {

    alert(
        "Invalid province."
    );

    window.location.replace(
        "province-paper2.html"
    );

}


// =====================================================
// LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const title =
    document.getElementById(
        "provinceTitle"
    );

const container =
    document.getElementById(
        "paperContainer"
    );


// =====================================================
// SET TITLE
// =====================================================

if (title) {

    title.textContent =
        data.name;

}


// =====================================================
// STUDENT ID
// =====================================================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


// =====================================================
// TRACK PAPER 2
// =====================================================

async function trackProvincePaper2() {

    if (!studentId) {

        console.warn(
            "Student ID not found."
        );

        return;

    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        await updateDoc(
            studentRef,
            {

                [`paperViews.al.province.paper2.${province}`]:
                    true

            }
        );


        console.log(
            "✅ Province Paper 2 tracked:",
            province
        );

    }

    catch (error) {

        console.error(
            "Province Paper 2 tracking error:",
            error
        );

    }

}


// =====================================================
// RENDER PAPER
// =====================================================

if (container) {

    container.innerHTML = `

        <div class="paper-card">

            <h2>
                📁 ${data.name}
            </h2>


            <p>
                Province Wise 2nd Paper
            </p>


            <div class="button-grid">


                <!-- QUESTION PAPER -->

                <button
                    class="paper-btn"
                    id="provincePaperBtn"
                    type="button"
                >

                    📄 Question Paper

                </button>


                <!-- ANSWER SCHEME -->

                <button
                    class="answer-btn"
                    id="provinceAnswerBtn"
                    type="button"
                >

                    📝 Answer Scheme

                </button>


            </div>

        </div>

    `;


    // =================================================
    // QUESTION PAPER BUTTON
    // =================================================

    const paperBtn =
        document.getElementById(
            "provincePaperBtn"
        );


    if (paperBtn) {

        paperBtn.addEventListener(
            "click",
            async () => {

                await trackProvincePaper2();


                const pdfPath =
                    `papers/past/${data.paper}/question.pdf`;


                console.log(
                    "Opening Paper 2:",
                    pdfPath
                );


                window.open(
                    pdfPath,
                    "_blank"
                );

            }
        );

    }


    // =================================================
    // ANSWER SCHEME BUTTON
    // =================================================

    const answerBtn =
        document.getElementById(
            "provinceAnswerBtn"
        );


    if (answerBtn) {

        answerBtn.addEventListener(
            "click",
            () => {

                const paperNumber =
                    data.paper.replace(
                        "paper",
                        ""
                    );


                const url =
                    `answer-images.html?` +
                    `paper=${encodeURIComponent(
                        paperNumber
                    )}` +
                    `&type=question`;


                console.log(
                    "Opening Answer Scheme:",
                    url
                );


                window.location.href =
                    url;

            }
        );

    }

}


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Province Paper 2 Detail Loaded",
    {
        province,
        provinceName:
            data?.name,
        paper:
            data?.paper
    }
);
