// =====================================================
// GRADE 11 TOP RANKING - TERM PAGE
// =====================================================
//
// This page shows ONLY:
//      TOP Ranking 01
//      TOP Ranking 02
//      TOP Ranking 03
//      TOP Ranking 04
//
// Each paper has:
//      Part A Answer
//      Part B Answer
//
// No question paper is displayed here.
// =====================================================


// =====================================================
// FIREBASE
// =====================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// GET TERM
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const term =
    params.get("term");


// =====================================================
// ELEMENTS
// =====================================================

const termTitle =
    document.getElementById(
        "termTitle"
    );


const paperContainer =
    document.getElementById(
        "paperContainer"
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


// =====================================================
// VALIDATE TERM
// =====================================================

if (
    !["1", "2", "3"].includes(
        term
    )
) {

    alert(
        "Invalid term."
    );


    window.location.replace(
        "grade11-model-papers.html"
    );


    throw new Error(
        "Invalid Grade 11 term."
    );

}


// =====================================================
// SET PAGE TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `🏆 Grade 11 - ${termNames[term]}`;

}


// =====================================================
// ANSWER FILE PATH
// =====================================================
//
// Change these paths later if your actual
// answer files are stored somewhere else.
//
// Example:
//
// answers/grade11/term3/
//     top-ranking-01-part-a.pdf
//     top-ranking-01-part-b.pdf
//
// =====================================================

function getAnswerFile(
    paperNumber,
    part
) {

    return (
        "answers/grade11/term" +
        term +
        "/top-ranking-" +
        paperNumber +
        "-part-" +
        part +
        ".pdf"
    );

}


// =====================================================
// OPEN ANSWER
// =====================================================
//
// Opens answer inside your system.
//
// No direct download link is created here.
// =====================================================

function openAnswer(
    file,
    title
) {

    const fileParam =
        encodeURIComponent(
            file
        );


    const titleParam =
        encodeURIComponent(
            title
        );


    window.location.href =
        "grade11-answer.html" +
        "?file=" +
        fileParam +
        "&title=" +
        titleParam;

}


// =====================================================
// CREATE ANSWER BUTTON
// =====================================================

function createAnswerButton(
    label,
    file,
    title
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "answer-button";


    button.innerHTML = `

        <span class="answer-button-icon">
            📖
        </span>

        <span class="answer-button-text">
            ${label}
        </span>

    `;


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            openAnswer(
                file,
                title
            );

        }
    );


    return button;

}


// =====================================================
// CREATE TOP RANKING CARD
// =====================================================

function createRankingCard(
    paperNumber
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "paper-card";


    // ---------------------------------------------
    // FILES
    // ---------------------------------------------

    const partAFile =
        getAnswerFile(
            paperNumber,
            "a"
        );


    const partBFile =
        getAnswerFile(
            paperNumber,
            "b"
        );


    // ---------------------------------------------
    // CARD HTML
    // ---------------------------------------------

    card.innerHTML = `

        <div class="paper-icon">
            🏆
        </div>

        <h2>
            TOP Ranking - ${paperNumber}
        </h2>

        <p>
            Answers
        </p>

        <div class="answer-buttons"></div>

    `;


    // ---------------------------------------------
    // BUTTON CONTAINER
    // ---------------------------------------------

    const buttonContainer =
        card.querySelector(
            ".answer-buttons"
        );


    // ---------------------------------------------
    // PART A
    // ---------------------------------------------

    const partAButton =
        createAnswerButton(
            "Part A Answer",
            partAFile,
            `TOP Ranking - ${paperNumber} - Part A Answer`
        );


    buttonContainer.appendChild(
        partAButton
    );


    // ---------------------------------------------
    // PART B
    // ---------------------------------------------

    const partBButton =
        createAnswerButton(
            "Part B Answer",
            partBFile,
            `TOP Ranking - ${paperNumber} - Part B Answer`
        );


    buttonContainer.appendChild(
        partBButton
    );


    return card;

}


// =====================================================
// SHOW TERM DISABLED
// =====================================================

function showTermDisabled() {

    paperContainer.innerHTML = `

        <div
            class="availability-message"
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:50px 25px;
                text-align:center;
                box-shadow:
                    0 10px 30px
                    rgba(0,0,0,.08);
            "
        >

            <div
                style="
                    font-size:50px;
                    margin-bottom:15px;
                "
            >
                🔒
            </div>

            <h2>
                ${termNames[term]} Unavailable
            </h2>

            <p
                style="
                    color:#64748b;
                "
            >
                This TOP Ranking term is
                currently unavailable.
            </p>

        </div>

    `;

}


// =====================================================
// SHOW NO PAPERS
// =====================================================

function showNoPapers() {

    paperContainer.innerHTML = `

        <div
            class="availability-message"
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:50px 25px;
                text-align:center;
                box-shadow:
                    0 10px 30px
                    rgba(0,0,0,.08);
            "
        >

            <div
                style="
                    font-size:50px;
                    margin-bottom:15px;
                "
            >
                🔒
            </div>

            <h2>
                No TOP Ranking Papers Available
            </h2>

            <p
                style="
                    color:#64748b;
                "
            >
                Papers for this term are
                currently unavailable.
            </p>

        </div>

    `;

}


// =====================================================
// LOAD FIREBASE SETTINGS
// =====================================================

async function loadPaperSettings() {

    if (!paperContainer) {

        console.error(
            "paperContainer not found."
        );

        return;

    }


    // =================================================
    // LOADING
    // =================================================

    paperContainer.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
                color:#64748b;
            "
        >
            Loading...
        </div>

    `;


    try {

        // =============================================
        // FIRESTORE DOCUMENT
        // =============================================

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


        const settings =
            snapshot.exists()
                ? snapshot.data() || {}
                : {};


        console.log(
            "Grade 11 settings:",
            settings
        );


        // =============================================
        // TERM SETTING
        // =============================================

        const termSettingId =
            `grade11_term${term}_enabled`;


        /*
         * true  = enabled
         * false = disabled
         *
         * Missing = enabled
         */

        const termEnabled =
            Object.prototype.hasOwnProperty.call(
                settings,
                termSettingId
            )
                ? settings[
                    termSettingId
                ] === true
                : true;


        console.log(
            "Term setting:",
            termSettingId,
            termEnabled
        );


        // =============================================
        // TERM DISABLED
        // =============================================

        if (!termEnabled) {

            showTermDisabled();

            return;

        }


        // =============================================
        // CLEAR
        // =============================================

        paperContainer.innerHTML =
            "";


        let visibleCount =
            0;


        // =============================================
        // CREATE TOP RANKING 01-04
        // =============================================

        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            const paperNumber =
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            // =========================================
            // PAPER SETTING ID
            // =========================================

            const paperId =
                `grade11_term${term}_model_${paperNumber}`;


            /*
             * Expected Firestore format:
             *
             * grade11_term3_model_01
             *     enabled: true
             *
             * grade11_term3_model_02
             *     enabled: false
             *
             *
             * Also supports direct boolean:
             *
             * grade11_term3_model_01: true
             *
             */

            let enabled =
                true;


            if (
                Object.prototype.hasOwnProperty.call(
                    settings,
                    paperId
                )
            ) {

                const value =
                    settings[
                        paperId
                    ];


                if (
                    typeof value ===
                    "object" &&
                    value !== null
                ) {

                    enabled =
                        value.enabled === true;

                }

                else {

                    enabled =
                        value === true;

                }

            }


            console.log(
                "Paper:",
                paperId,
                "Enabled:",
                enabled
            );


            // =========================================
            // DISABLED → DON'T SHOW
            // =========================================

            if (!enabled) {

                continue;

            }


            // =========================================
            // CREATE CARD
            // =========================================

            const card =
                createRankingCard(
                    paperNumber
                );


            paperContainer.appendChild(
                card
            );


            visibleCount++;

        }


        // =============================================
        // NO ACTIVE PAPERS
        // =============================================

        if (
            visibleCount === 0
        ) {

            showNoPapers();

        }


        // =============================================
        // CONSOLE
        // =============================================

        console.log(
            "================================"
        );

        console.log(
            "✅ Grade 11 TOP Ranking Loaded"
        );

        console.log(
            "Term:",
            term
        );

        console.log(
            "Term Name:",
            termNames[term]
        );

        console.log(
            "Visible Papers:",
            visibleCount
        );

        console.log(
            "Mode:",
            "ANSWER ONLY"
        );

        console.log(
            "================================"
        );

    }

    catch (error) {

        console.error(
            "Grade 11 paper settings error:",
            error
        );


        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                "
            >

                <h2>
                    ⚠️ Unable to Load
                </h2>

                <p>
                    ${error.message}
                </p>

                <button
                    type="button"
                    onclick="location.reload()"
                    style="
                        padding:12px 20px;
                        border:0;
                        border-radius:10px;
                        background:#6d35f2;
                        color:white;
                        cursor:pointer;
                    "
                >
                    🔄 Try Again
                </button>

            </div>

        `;

    }

}


// =====================================================
// START
// =====================================================

loadPaperSettings();
