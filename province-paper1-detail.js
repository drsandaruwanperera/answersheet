import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =========================================
// LOGIN CHECK
// =========================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =========================================
// GET STUDENT ID
// =========================================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


// =========================================
// GET STUDENT TYPE
// =========================================

const sessionType =
    String(
        sessionStorage.getItem(
            "studentType"
        ) || ""
    )
    .toLowerCase()
    .trim();


// =========================================
// ONLY A/L STUDENTS ALLOWED
// =========================================

if (
    sessionType !== "al" &&
    sessionType !== "a/l" &&
    sessionType !== "a level" &&
    sessionType !== "advanced" &&
    sessionType !== "advanced level"
) {

    alert(
        "Province Papers are available only for A/L students."
    );

    window.location.replace(
        "dashboard.html"
    );

}


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

        name:
            "Central Province",

        paper:
            "paper01"

    },

    "western": {

        name:
            "Western Province",

        paper:
            "paper02"

    },

    "north-western": {

        name:
            "North Western Province",

        paper:
            "paper03"

    },

    "southern": {

        name:
            "Southern Province",

        paper:
            "paper04"

    },

    "sabaragamuwa": {

        name:
            "Sabaragamuwa Province",

        paper:
            "paper05"

    }

};


// =========================================
// FIND PROVINCE
// =========================================

const data =
    provinceMap[
        province
    ];


// =========================================
// VALIDATE PROVINCE
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
    title &&
    data
) {

    title.textContent =
        data.name;

}


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
    container &&
    data
) {

    container.innerHTML = `

        <div class="paper-card">

            <h2>
                📁 ${data.name}
            </h2>


            <p>
                A/L Province Wise 1st Paper
            </p>


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
    // MCQ PAPER BUTTON
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
    // ANSWER SCHEME BUTTON
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


// =========================================
// CONSOLE
// =========================================

console.log(
    "✅ Province Paper 1 Loaded",
    {

        province,

        paper:
            data?.paper,

        studentId,

        studentType:
            sessionType

    }
);
