// =====================================================
// GRADE 11 TERM PAPER PAGE
// Firebase Controlled Visibility
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
                data-part="A"
            >
                📖 Part A Answer
            </button>

            <button
                type="button"
                class="answer-btn"
                data-part="B"
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
// OPEN ANSWER
// =====================================================

function openPaper(
    number,
    part
) {

    const pdfFile =
        "answers/grade11/" +
        currentTerm +
        "/top-ranking-" +
        String(number).padStart(2, "0") +
        "-part-" +
        part.toLowerCase() +
        ".pdf";


    const termName =
        currentTerm === "term1"
            ? "1st Term"
            : currentTerm === "term2"
                ? "2nd Term"
                : "3rd Term";


    const title =
        "Grade 11 - " +
        termName +
        " TOP Ranking - " +
        String(number).padStart(2, "0") +
        " Part " +
        part;


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
            style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:#64748b;
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
        // CHECK DOCUMENT
        // =================================================

        if (!snapshot.exists()) {

            console.error(
                "❌ paperSettings/grade11 not found."
            );

            showNoPapers();

            return;

        }


        const settings =
            snapshot.data();


        console.log(
            "===================================="
        );

        console.log(
            "GRADE 11 PAPER SETTINGS"
        );

        console.log(
            "Current term:",
            currentTerm
        );

        console.log(
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
        // CREATE ONLY ENABLED PAPERS
        // =================================================

        PAPER_CONFIG.forEach(
            function(paper) {

                const enabled =
                    settings[paper.field] === true;


                console.log(
                    paper.field,
                    "=>",
                    enabled
                );


                // -----------------------------------------
                // DISABLED = DO NOT SHOW
                // -----------------------------------------

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


        // =================================================
        // NO PAPERS
        // =================================================

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
            "❌ Firebase error:",
            error
        );


        showError(
            error.message
        );

    }

}


// =====================================================
// NO PAPERS
// =====================================================

function showNoPapers() {

    paperContainer.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                text-align:center;
                padding:60px 20px;
            "
        >

            <div
                style="
                    font-size:48px;
                    margin-bottom:15px;
                "
            >
                🔒
            </div>

            <h2>
                No Papers Available
            </h2>

            <p
                style="
                    color:#64748b;
                "
            >
                There are currently no TOP Ranking
                papers available for this term.
            </p>

        </div>

    `;

}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    paperContainer.innerHTML = `

        <div
            style="
                grid-column:1/-1;
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

            <h2>
                Unable to Load Papers
            </h2>

            <p>
                ${message}
            </p>

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
    "Firebase visibility: ACTIVE"
);

console.log(
    "===================================="
);
