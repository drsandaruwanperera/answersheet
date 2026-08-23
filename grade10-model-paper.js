import {
    db,
    doc,
    getDoc
} from "./firebase.js";


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

    throw new Error(
        "Invalid Grade 10 model paper."
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
// FIRESTORE SETTING ID
// =========================================
//
// Example:
//
// term=1, paper=01
//
// grade10_term1_model_01
//
// term=2, paper=03
//
// grade10_term2_model_03
//
// =========================================

const settingId =
    `grade10_term${term}_model_${paper}`;


// =========================================
// CHECK PAPER ACCESS
// =========================================

async function checkPaperAccess() {

    try {

        const settingsRef =
            doc(
                db,
                "paperSettings",
                "settings"
            );


        const snapshot =
            await getDoc(
                settingsRef
            );


        // =====================================
        // SETTINGS DOCUMENT DOES NOT EXIST
        // =====================================

        if (
            !snapshot.exists()
        ) {

            console.warn(
                "Paper settings document not found."
            );


            // Default = enabled
            return true;

        }


        const settings =
            snapshot.data() || {};


        // =====================================
        // GET THIS PAPER SETTING
        // =====================================

        const paperSetting =
            settings[
                settingId
            ];


        // =====================================
        // NO SETTING FOUND
        // =====================================
        //
        // New papers are active by default.
        //
        // =====================================

        if (
            !paperSetting ||
            typeof paperSetting.enabled ===
            "undefined"
        ) {

            console.log(
                "No specific setting found. " +
                "Paper is enabled by default:",
                settingId
            );


            return true;

        }


        // =====================================
        // CHECK ENABLED
        // =====================================

        return (
            paperSetting.enabled === true
        );

    }

    catch (error) {

        console.error(
            "Paper access check error:",
            error
        );


        // =====================================
        // IMPORTANT
        // =====================================
        //
        // If settings cannot be loaded,
        // do NOT automatically block the
        // student.
        //
        // =====================================

        return true;

    }

}


// =========================================
// DISABLE PAGE
// =========================================

function showDisabledPage() {

    document.body.innerHTML = `

        <div
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:30px;
                box-sizing:border-box;
                background:#f4f6fb;
                font-family:Arial, Helvetica, sans-serif;
            "
        >

            <div
                style="
                    width:min(500px, 100%);
                    background:white;
                    border-radius:20px;
                    padding:40px;
                    text-align:center;
                    box-shadow:0 15px 40px rgba(0,0,0,.10);
                "
            >

                <div
                    style="
                        width:75px;
                        height:75px;
                        margin:0 auto 20px;
                        border-radius:50%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#fff0f0;
                        font-size:35px;
                    "
                >
                    🔒
                </div>


                <h1
                    style="
                        margin:0 0 12px;
                        color:#111827;
                        font-size:26px;
                    "
                >
                    Paper Not Available
                </h1>


                <p
                    style="
                        margin:0 auto 25px;
                        color:#64748b;
                        line-height:1.7;
                        max-width:400px;
                    "
                >
                    This paper has currently been
                    disabled by the administrator.
                    Please try again later.
                </p>


                <button
                    id="backToGrade10"
                    type="button"
                    style="
                        border:0;
                        padding:12px 24px;
                        border-radius:10px;
                        background:#6d35f2;
                        color:white;
                        font-size:15px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    ← Back to Model Papers
                </button>

            </div>

        </div>

    `;


    const backBtn =
        document.getElementById(
            "backToGrade10"
        );


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                window.location.replace(
                    "grade10-model-papers.html"
                );

            }
        );

    }

}


// =========================================
// DISABLE PAPER BUTTONS
// =========================================

function disableButtons() {

    [
        mcqBtn,
        mcqAnswerBtn,
        questionBtn,
        answerBtn
    ]
    .forEach(
        button => {

            if (!button) {
                return;
            }


            button.disabled =
                true;


            button.style.opacity =
                "0.5";


            button.style.pointerEvents =
                "none";

        }
    );

}


// =========================================
// SET PAGE CONTENT
// =========================================

function setupPage() {

    // =====================================
    // PAGE TITLE
    // =====================================

    if (
        paperTitle
    ) {

        paperTitle.textContent =
            "📘 Model Paper - " +
            paper;

    }


    // =====================================
    // SUBTITLE
    // =====================================

    if (
        paperSubtitle
    ) {

        paperSubtitle.textContent =
            "Grade 10 • " +
            termName;

    }


    // =====================================
    // PDF BASE PATH
    // =====================================

    const basePath =
        `./papers/grade10/term${term}/paper${paper}`;


    // =====================================
    // MCQ PDF
    // =====================================

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


    // =====================================
    // MCQ ANSWER
    // =====================================

    if (
        mcqAnswerBtn
    ) {

        mcqAnswerBtn.addEventListener(
            "click",
            () => {

                const url =
                    `grade10-answer.html?` +
                    `term=${encodeURIComponent(
                        term
                    )}` +
                    `&paper=${encodeURIComponent(
                        paper
                    )}` +
                    `&type=mcq`;


                window.location.assign(
                    url
                );

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

                const pdf =
                    `${basePath}/question.pdf`;


                window.open(
                    pdf,
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

                const url =
                    `grade10-answer.html?` +
                    `term=${encodeURIComponent(
                        term
                    )}` +
                    `&paper=${encodeURIComponent(
                        paper
                    )}` +
                    `&type=answer`;


                window.location.assign(
                    url
                );

            }
        );

    }


    // =====================================
    // CONSOLE
    // =====================================

    console.log(
        "✅ Grade 10 Model Paper Loaded",
        {
            grade:
                "grade10",

            type:
                "model",

            term,

            termName,

            paper,

            settingId,

            basePath
        }
    );

}


// =========================================
// START
// =========================================

async function init() {

    console.log(
        "Checking paper access..."
    );


    console.log(
        "Setting ID:",
        settingId
    );


    const allowed =
        await checkPaperAccess();


    console.log(
        "Paper allowed:",
        allowed
    );


    // =====================================
    // DISABLED
    // =====================================

    if (
        !allowed
    ) {

        console.warn(
            "🚫 Paper disabled:",
            settingId
        );


        disableButtons();


        showDisabledPage();


        return;

    }


    // =====================================
    // ACTIVE
    // =====================================

    setupPage();

}


// =========================================
// RUN
// =========================================

init();
