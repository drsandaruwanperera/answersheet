// =====================================================
// GRADE 11 TERM PAGE
// FIREBASE CONTROLLED PAPER VISIBILITY
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
// URL PARAMETER
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

    "1": "1st Term",

    "2": "2nd Term",

    "3": "3rd Term"

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
        "Invalid Grade 11 term."
    );


    window.location.replace(
        "grade11-model-papers.html"
    );


    throw new Error(
        "Invalid Grade 11 term."
    );

}


// =====================================================
// PAGE TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `🏆 Grade 11 - ${termNames[term]}`;

}


// =====================================================
// ANSWER FILE PATH
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
            ${escapeHTML(label)}
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
    // CARD
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

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            class="availability-message"
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:50px 25px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
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

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            class="availability-message"
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:50px 25px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
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
// SHOW ERROR
// =====================================================

function showError(
    error
) {

    console.error(
        "Grade 11 Term Error:",
        error
    );


    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
            "
        >

            <div
                style="
                    font-size:45px;
                    margin-bottom:15px;
                "
            >
                ⚠️
            </div>

            <h2>
                Unable to Load Papers
            </h2>

            <p
                style="
                    color:#64748b;
                    line-height:1.6;
                    max-width:650px;
                    margin:10px auto 20px;
                    word-break:break-word;
                "
            >
                ${escapeHTML(
                    error?.message ||
                    String(error)
                )}
            </p>

            <button
                type="button"
                id="retryPaperBtn"
                style="
                    padding:12px 24px;
                    border:0;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                🔄 Try Again
            </button>

        </div>

    `;


    const retryButton =
        document.getElementById(
            "retryPaperBtn"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            function() {

                window.location.reload();

            }
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// LOAD GRADE 11 SETTINGS
// =====================================================
//
// ADMIN SAVES:
//
// paperSettings / grade11
//
// Example:
//
// grade11_term1_01 = true
// grade11_term1_02 = false
//
// =====================================================

async function loadPaperSettings() {

    if (!paperContainer) {

        console.error(
            "paperContainer not found."
        );

        return;

    }


    // -------------------------------------------------
    // LOADING
    // -------------------------------------------------

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
                "grade11"
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
            "================================"
        );


        console.log(
            "GRADE 11 FIREBASE SETTINGS"
        );


        console.log(
            settings
        );


        // =============================================
        // TERM ENABLED
        // =============================================

        const termSettingId =
            `grade11_term${term}_enabled`;


        let termEnabled =
            true;


        if (
            Object.prototype.hasOwnProperty.call(
                settings,
                termSettingId
            )
        ) {

            termEnabled =
                settings[
                    termSettingId
                ] === true;

        }


        console.log(
            "Term:",
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
        // TOP RANKING 01 - 05
        // =============================================

        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            const paperNumber =
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            // -----------------------------------------
            // IMPORTANT
            // -----------------------------------------
            //
            // This EXACTLY matches Admin:
            //
            // grade11_term1_01
            // grade11_term1_02
            //
            // -----------------------------------------

            const paperId =
                `grade11_term${term}_${paperNumber}`;


            let enabled =
                true;


            // -----------------------------------------
            // CHECK FIREBASE
            // -----------------------------------------

            if (
                Object.prototype.hasOwnProperty.call(
                    settings,
                    paperId
                )
            ) {

                enabled =
                    settings[
                        paperId
                    ] === true;

            }


            console.log(
                "Paper:",
                paperId,
                "Enabled:",
                enabled
            );


            // -----------------------------------------
            // DISABLED
            // -----------------------------------------

            if (!enabled) {

                continue;

            }


            // -----------------------------------------
            // CREATE CARD
            // -----------------------------------------

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
        // NO PAPERS
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
            "--------------------------------"
        );


        console.log(
            "Grade 11:",
            termNames[term]
        );


        console.log(
            "Visible Papers:",
            visibleCount
        );


        console.log(
            "--------------------------------"
        );

    }
    catch (error) {

        showError(
            error
        );

    }

}


// =====================================================
// START
// =====================================================

loadPaperSettings();
