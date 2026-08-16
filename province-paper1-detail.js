import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


// =========================================
// GET PROVINCE
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const province =
    params.get("province");


// =========================================
// PROVINCE DATA
// =========================================

const provinceMap = {

    "central": {
        name: "Central Province",
        paper: "paper01"
    },

    "western": {
        name: "Western Province",
        paper: "paper02"
    },

    "north-western": {
        name: "North Western Province",
        paper: "paper03"
    },

    "southern": {
        name: "Southern Province",
        paper: "paper04"
    },

    "sabaragamuwa": {
        name: "Sabaragamuwa Province",
        paper: "paper05"
    }

};


const data =
    provinceMap[
        province
    ];


// =========================================
// VALIDATE
// =========================================

if (
    !data
) {

    alert(
        "Invalid province."
    );

    window.location.replace(
        "province-paper1.html"
    );

}


// =========================================
// LOGIN
// =========================================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =========================================
// ELEMENTS
// =========================================

const title =
    document.getElementById(
        "provinceTitle"
    );


const container =
    document.getElementById(
        "paperContainer"
    );


// =========================================
// TITLE
// =========================================

if (
    title
) {

    title.textContent =
        data.name;

}


// =========================================
// STUDENT ID
// =========================================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


// =========================================
// TRACK PROVINCE PAPER
// =========================================

async function trackProvincePaper() {

    if (
        !studentId
    ) {

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


        const fieldPath =
            `paperViews.al.province.paper1.${province}`;


        await updateDoc(
            studentRef,
            {
                [fieldPath]:
                    true
            }
        );


        console.log(
            "✅ A/L Province Paper 1 tracked:",
            {
                province,
                fieldPath
            }
        );

    }

    catch (
        error
    ) {

        console.error(
            "Province Paper 1 tracking error:",
            error
        );

    }

}


// =========================================
// SHOW PAPER
// =========================================

if (
    container
) {

    container.innerHTML = `

        <div class="paper-card">

            <h2>
                📁 ${data.name}
            </h2>

            <div class="button-grid">

                <button
                    class="paper-btn"
                    id="provincePaperBtn"
                    type="button"
                >

                    📄 MCQ Paper

                </button>


                <button
                    class="answer-btn"
                    id="provinceAnswerBtn"
                    type="button"
                >

                    📝 MCQ Answer Scheme

                </button>

            </div>

        </div>

    `;


    // =====================================
    // PDF BUTTON
    // =====================================

    const paperBtn =
        document.getElementById(
            "provincePaperBtn"
        );


    if (
        paperBtn
    ) {

        paperBtn.addEventListener(
            "click",
            async () => {

                await trackProvincePaper();


                window.open(
                    `papers/past/${data.paper}/mcq.pdf`,
                    "_blank"
                );

            }
        );

    }


    // =====================================
    // ANSWER BUTTON
    // =====================================

    const answerBtn =
        document.getElementById(
            "provinceAnswerBtn"
        );


    if (
        answerBtn
    ) {

        answerBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    `answer-images.html?` +
                    `paper=${encodeURIComponent(
                        data.paper.replace(
                            "paper",
                            ""
                        )
                    )}` +
                    `&type=mcq`;

            }
        );

    }

}


console.log(
    "✅ Province Paper 1 Loaded",
    {
        province,
        paper:
            data?.paper
    }
);
