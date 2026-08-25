// =====================================================
// GRADE 11 TERM PAPER PAGE
// Firebase controlled visibility
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
// DETECT TERM
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
        TERM_TITLES[currentTerm];

}


// =====================================================
// PAPER CONFIGURATION
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
// EXACT PDF PATH
// =====================================================

function getAnswerPDF(
    number,
    part
) {

    const paperNumber =
        String(number).padStart(2, "0");

    const partLetter =
        String(part).toLowerCase();

    return (
        `answers/grade11/${currentTerm}/` +
        `top-ranking-${paperNumber}-part-${partLetter}.pdf`
    );

}


// =====================================================
// CREATE PAPER CARD
// =====================================================

function createPaperCard(paper) {

    const card =
        document.createElement("div");

    card.className =
        "paper-card";

    card.innerHTML = `

        <div class="paper-icon">
            🏆
        </div>

        <h2>
            ${paper.title}
        </h2>

        <p>
            Answers
        </p>

        <div class="paper-actions">

            <button
                type="button"
                class="answer-btn"
                data-part="a"
            >
                📖 Part A Answer
            </button>

            <button
                type="button"
                class="answer-btn"
                data-part="b"
            >
                📖 Part B Answer
            </button>

        </div>

    `;


    // =================================================
    // PART A
    // =================================================

    const partA =
        card.querySelector(
            '[data-part="a"]'
        );

    if (partA) {

        partA.addEventListener(
            "click",
            function () {

                openAnswerViewer(
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
            '[data-part="b"]'
        );

    if (partB) {

        partB.addEventListener(
            "click",
            function () {

                openAnswerViewer(
                    paper.number,
                    "B"
                );

            }
        );

    }


    return card;

}


// =====================================================
// OPEN ANSWER VIEWER
// =====================================================

function openAnswerViewer(
    number,
    part
) {

    const pdfPath =
        getAnswerPDF(
            number,
            part
        );


    const viewerURL =
        "answer-viewer.html" +
        "?pdf=" +
        encodeURIComponent(pdfPath);


    window.location.href =
        viewerURL;

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


    paperContainer.innerHTML = `

        <div class="loading-message">

            Loading available papers...

        </div>

    `;


    try {

        // ---------------------------------------------
        // Firebase
        // ---------------------------------------------

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


        if (!snapshot.exists()) {

            showNoPapers();

            return;

        }


        const settings =
            snapshot.data();


        console.log(
            "Grade 11 settings:",
            settings
        );


        // ---------------------------------------------
        // Clear
        // ---------------------------------------------

        paperContainer.innerHTML =
            "";


        let visibleCount =
            0;


        // ---------------------------------------------
        // Only ENABLED papers
        // ---------------------------------------------

        PAPER_CONFIG.forEach(
            function (paper) {

                const enabled =
                    settings[paper.field] === true;


                console.log(
                    paper.field,
                    enabled
                        ? "ENABLED"
                        : "DISABLED"
                );


                if (!enabled) {

                    return;

                }


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


        // ---------------------------------------------
        // No papers
        // ---------------------------------------------

        if (
            visibleCount === 0
        ) {

            showNoPapers();

        }


        console.log(
            "Visible papers:",
            visibleCount
        );

    }
    catch (error) {

        console.error(
            "❌ Failed to load settings:",
            error
        );


        paperContainer.innerHTML = `

            <div class="error-message">

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
// NO PAPERS
// =====================================================

function showNoPapers() {

    paperContainer.innerHTML = `

        <div
            class="no-papers"
            style="
                grid-column:1/-1;
                text-align:center;
                padding:60px 20px;
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

            <h3>
                No Papers Available
            </h3>

            <p>
                There are currently no TOP Ranking
                papers available for this term.
            </p>

        </div>

    `;

}


// =====================================================
// START
// =====================================================

loadPaperSettings();


console.log(
    "===================================="
);

console.log(
    "🏆 GRADE 11 TERM PAGE"
);

console.log(
    "Current Term:",
    currentTerm
);

console.log(
    "Firebase Visibility: ACTIVE"
);

console.log(
    "===================================="
);
