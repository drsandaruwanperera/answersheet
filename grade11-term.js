// =====================================================
// GRADE 11 TERM PAPER PAGE
// Firebase Controlled Paper Visibility
// =====================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const paperContainer =
    document.getElementById("paperContainer");

const termTitle =
    document.getElementById("termTitle");


// =====================================================
// DETECT CURRENT TERM
// =====================================================

function getCurrentTerm() {

    const filename =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (filename.includes("grade11-term1")) {
        return "term1";
    }

    if (filename.includes("grade11-term2")) {
        return "term2";
    }

    if (filename.includes("grade11-term3")) {
        return "term3";
    }

    return "term1";
}


const currentTerm =
    getCurrentTerm();


// =====================================================
// TERM TITLE
// =====================================================

const TERM_TITLES = {

    term1:
        "🏆 Grade 11 - 1st Term TOP Ranking",

    term2:
        "🏆 Grade 11 - 2nd Term TOP Ranking",

    term3:
        "🏆 Grade 11 - 3rd Term TOP Ranking"

};


if (termTitle) {

    termTitle.textContent =
        TERM_TITLES[currentTerm] ||
        "🏆 Grade 11 TOP Ranking";

}


// =====================================================
// PAPER CONFIGURATION
// =====================================================
//
// IMPORTANT
//
// These field names MUST match the Admin
// paper-management system.
//
// term3 example:
//
// grade11_term3_01
// grade11_term3_02
// grade11_term3_03
// grade11_term3_04
// grade11_term3_05
//
// =====================================================

const PAPER_CONFIG = [

    {
        number: 1,

        field:
            `grade11_${currentTerm}_01`,

        title:
            "TOP Ranking - 01"

    },

    {
        number: 2,

        field:
            `grade11_${currentTerm}_02`,

        title:
            "TOP Ranking - 02"

    },

    {
        number: 3,

        field:
            `grade11_${currentTerm}_03`,

        title:
            "TOP Ranking - 03"

    },

    {
        number: 4,

        field:
            `grade11_${currentTerm}_04`,

        title:
            "TOP Ranking - 04"

    },

    {
        number: 5,

        field:
            `grade11_${currentTerm}_05`,

        title:
            "TOP Ranking - 05"

    }

];


// =====================================================
// GET PDF FILE
// =====================================================
//
// Your GitHub structure:
//
// answers/
//   grade11/
//      term3/
//         top-ranking-01-part-a.pdf
//         top-ranking-01-part-b.pdf
//         top-ranking-02-part-a.pdf
//         top-ranking-02-part-b.pdf
//
// =====================================================

function getPDFFile(
    number,
    part
) {

    return (
        "answers/grade11/" +
        currentTerm +
        "/top-ranking-" +
        String(number).padStart(2, "0") +
        "-part-" +
        part.toLowerCase() +
        ".pdf"
    );

}


// =====================================================
// GET ANSWER TITLE
// =====================================================

function getAnswerTitle(
    number,
    part
) {

    let termName;

    if (currentTerm === "term1") {

        termName =
            "1st Term";

    }
    else if (currentTerm === "term2") {

        termName =
            "2nd Term";

    }
    else {

        termName =
            "3rd Term";

    }


    return (
        "Grade 11 - " +
        termName +
        " TOP Ranking - " +
        String(number).padStart(2, "0") +
        " Part " +
        part
    );

}


// =====================================================
// OPEN PAPER
// =====================================================

function openPaper(
    number,
    part
) {

    const pdfFile =
        getPDFFile(
            number,
            part
        );


    const title =
        getAnswerTitle(
            number,
            part
        );


    /*
     * IMPORTANT
     *
     * Existing answer viewer:
     *
     * grade11-answer.html
     *
     * It receives:
     *
     * ?file=...
     * &title=...
     */

    const url =
        "grade11-answer.html" +
        "?file=" +
        encodeURIComponent(pdfFile) +
        "&title=" +
        encodeURIComponent(title);


    console.log(
        "Opening answer:",
        url
    );


    window.location.href =
        url;

}


// =====================================================
// CREATE PAPER CARD
// =====================================================

function createPaperCard(
    paper
) {

    const card =
        document.createElement("div");


    card.className =
        "paper-card";


    card.dataset.paper =
        paper.number;


    card.innerHTML = `

        <div class="paper-icon">
            🏆
        </div>


        <h2>
            ${paper.title}
        </h2>


        <p class="answer-label">
            Answers
        </p>


        <div class="paper-actions">

            <button
                type="button"
                class="answer-btn"
                data-part="A"
            >

                <span class="answer-icon">
                    📖
                </span>

                <span>
                    Part A Answer
                </span>

            </button>


            <button
                type="button"
                class="answer-btn"
                data-part="B"
            >

                <span class="answer-icon">
                    📖
                </span>

                <span>
                    Part B Answer
                </span>

            </button>

        </div>

    `;


    // =================================================
    // PART A
    // =================================================

    const partA =
        card.querySelector(
            '[data-part="A"]'
        );


    if (partA) {

        partA.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();


                openPaper(
                    paper.number,
                    "A"
                );

            }
        );

    }


    // =================================================
    // PART B
    // =================================================

    const partB =
        card.querySelector(
            '[data-part="B"]'
        );


    if (partB) {

        partB.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();


                openPaper(
                    paper.number,
                    "B"
                );

            }
        );

    }


    return card;

}


// =====================================================
// LOAD FIREBASE SETTINGS
// =====================================================

async function loadPaperSettings() {

    if (!paperContainer) {

        console.error(
            "❌ paperContainer not found."
        );

        return;

    }


    // =================================================
    // LOADING
    // =================================================

    paperContainer.innerHTML = `

        <div
            class="loading-message"
            style="
                grid-column:1/-1;
                width:100%;
                text-align:center;
                padding:60px 20px;
                color:#64748b;
                font-size:15px;
            "
        >

            Loading available papers...

        </div>

    `;


    try {

        // =================================================
        // FIREBASE DOCUMENT
        // =================================================

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


        // =================================================
        // DOCUMENT NOT FOUND
        // =================================================

        if (
            !snapshot.exists()
        ) {

            console.error(
                "❌ paperSettings/grade11 not found."
            );


            showNoPapers();

            return;

        }


        // =================================================
        // GET SETTINGS
        // =================================================

        const settings =
            snapshot.data();


        console.log(
            "===================================="
        );

        console.log(
            "🏆 GRADE 11 PAPER SETTINGS"
        );

        console.log(
            "Current Term:",
            currentTerm
        );

        console.log(
            "Firebase Settings:",
            settings
        );

        console.log(
            "===================================="
        );


        // =================================================
        // CLEAR
        // =================================================

        paperContainer.innerHTML =
            "";


        let visibleCount =
            0;


        // =================================================
        // CHECK EACH PAPER
        // =================================================

        PAPER_CONFIG.forEach(
            function(paper) {

                /*
                 * PRIMARY FIELD
                 *
                 * Example:
                 *
                 * grade11_term3_01
                 */

                const primaryField =
                    paper.field;


                const primaryValue =
                    settings[
                        primaryField
                    ];


                /*
                 * ALTERNATIVE FIELD
                 *
                 * This is included in case
                 * an older Admin version created:
                 *
                 * grade11_term3_top01
                 */

                const alternativeField =
                    `grade11_${currentTerm}_top${String(
                        paper.number
                    ).padStart(2, "0")}`;


                const alternativeValue =
                    settings[
                        alternativeField
                    ];


                /*
                 * PAPER IS ENABLED ONLY IF
                 * ONE OF THE CORRECT FIELDS
                 * IS TRUE.
                 */

                const enabled =
                    primaryValue === true ||
                    alternativeValue === true;


                console.log(
                    paper.title,
                    "=>",
                    {
                        primaryField:
                            primaryField,

                        primaryValue:
                            primaryValue,

                        alternativeField:
                            alternativeField,

                        alternativeValue:
                            alternativeValue,

                        enabled:
                            enabled
                    }
                );


                // =========================================
                // DISABLED
                // =========================================

                if (!enabled) {

                    return;

                }


                // =========================================
                // ENABLED
                // =========================================

                const card =
                    createPaperCard(
                        paper
                    );


                paperContainer.appendChild(
                    card
                );


                visibleCount++;

            }
        );


        // =================================================
        // NO PAPERS
        // =================================================

        if (
            visibleCount === 0
        ) {

            showNoPapers();

        }


        console.log(
            "===================================="
        );

        console.log(
            "Visible papers:",
            visibleCount
        );

        console.log(
            "===================================="
        );

    }
    catch (error) {

        console.error(
            "❌ Failed to load Grade 11 paper settings:",
            error
        );


        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    width:100%;
                    text-align:center;
                    padding:60px 20px;
                    color:#dc2626;
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


                <strong>
                    Failed to load paper availability.
                </strong>


                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// =====================================================
// NO PAPERS MESSAGE
// =====================================================

function showNoPapers() {

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                width:100%;
                text-align:center;
                padding:70px 20px;
                color:#64748b;
            "
        >

            <div
                style="
                    width:80px;
                    height:80px;
                    margin:0 auto 20px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border-radius:24px;
                    background:#f1f5f9;
                    font-size:40px;
                "
            >
                🔒
            </div>


            <strong
                style="
                    display:block;
                    margin-bottom:8px;
                    color:#0f172a;
                    font-size:18px;
                "
            >
                No Papers Available
            </strong>


            <span
                style="
                    font-size:14px;
                "
            >
                There are currently no TOP Ranking
                papers available for this term.
            </span>

        </div>

    `;

}


// =====================================================
// INITIALIZE
// =====================================================

loadPaperSettings();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "===================================="
);

console.log(
    "🏆 GRADE 11 TERM PAGE"
);

console.log(
    "Term:",
    currentTerm
);

console.log(
    "Firebase visibility:",
    "ACTIVE"
);

console.log(
    "===================================="
);
