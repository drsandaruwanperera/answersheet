// =====================================================
// GRADE 11 TERM PAPER PAGE
// Firebase controlled paper visibility
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
    document.getElementById(
        "paperContainer"
    );

const termTitle =
    document.getElementById(
        "termTitle"
    );


// =====================================================
// DETECT CURRENT TERM
// =====================================================
//
// This page is used for:
//
// grade11-term1.html
// grade11-term2.html
// grade11-term3.html
//

function getCurrentTerm() {

    const filename =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (
        filename.includes(
            "grade11-term1"
        )
    ) {

        return "term1";

    }


    if (
        filename.includes(
            "grade11-term2"
        )
    ) {

        return "term2";

    }


    if (
        filename.includes(
            "grade11-term3"
        )
    ) {

        return "term3";

    }


    // Default

    return "term1";

}


const currentTerm =
    getCurrentTerm();


// =====================================================
// TERM TITLES
// =====================================================

const TERM_TITLES = {

    term1:
        "📚 Grade 11 - 1st Term TOP Ranking",

    term2:
        "📚 Grade 11 - 2nd Term TOP Ranking",

    term3:
        "📚 Grade 11 - 3rd Term TOP Ranking"

};


// =====================================================
// SET PAGE TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        TERM_TITLES[
            currentTerm
        ] || "📚 Grade 11 TOP Ranking";

}


// =====================================================
// PAPER CONFIGURATION
// =====================================================

const PAPER_CONFIG = [

    {
        number: 1,

        field:
            "grade11_" +
            currentTerm +
            "_01",

        title:
            "TOP Ranking - 01"

    },


    {
        number: 2,

        field:
            "grade11_" +
            currentTerm +
            "_02",

        title:
            "TOP Ranking - 02"

    },


    {
        number: 3,

        field:
            "grade11_" +
            currentTerm +
            "_03",

        title:
            "TOP Ranking - 03"

    },


    {
        number: 4,

        field:
            "grade11_" +
            currentTerm +
            "_04",

        title:
            "TOP Ranking - 04"

    },


    {
        number: 5,

        field:
            "grade11_" +
            currentTerm +
            "_05",

        title:
            "TOP Ranking - 05"

    }

];


// =====================================================
// GET PAPER URL
// =====================================================
//
// IMPORTANT:
// Change ONLY this function if your actual answer
// page filenames are different.
//
// Current structure:
//
// grade11-term1-paper01.html
// grade11-term1-paper02.html
// ...
//
// grade11-term2-paper01.html
// ...
//
// grade11-term3-paper01.html
// ...
//

function getPaperURL(number) {

    return (
        "grade11-" +
        currentTerm +
        "-paper" +
        String(number).padStart(
            2,
            "0"
        ) +
        ".html"
    );

}


// =====================================================
// CREATE PAPER CARD
// =====================================================

function createPaperCard(
    paper
) {

    const card =
        document.createElement(
            "div"
        );


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
            function(event) {

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
            '[data-part="b"]'
        );


    if (partB) {

        partB.addEventListener(
            "click",
            function(event) {

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
// OPEN PAPER
// =====================================================
//
// If your existing project already has different
// filenames for the answer pages, ONLY modify this
// function.
//

function openPaper(
    number,
    part
) {

    const paperURL =
        getPaperURL(
            number
        );


    // -------------------------------------------------
    // PART A / B
    // -------------------------------------------------
    //
    // If your paper page handles the Part A / Part B
    // selection itself, this sends the part as a query.
    //

    window.location.href =
        paperURL +
        "?part=" +
        part;

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


    // -------------------------------------------------
    // LOADING
    // -------------------------------------------------

    paperContainer.innerHTML = `

        <div
            class="loading-message"
            style="
                grid-column:1/-1;
                text-align:center;
                padding:50px 20px;
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
        // DOCUMENT DOES NOT EXIST
        // =================================================

        if (
            !snapshot.exists()
        ) {

            console.warn(
                "⚠️ Grade 11 paperSettings document not found."
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
            "📚 GRADE 11 PAPER SETTINGS"
        );


        console.log(
            "Current Term:",
            currentTerm
        );


        console.log(
            settings
        );


        console.log(
            "===================================="
        );


        // =================================================
        // CLEAR CONTAINER
        // =================================================

        paperContainer.innerHTML =
            "";


        let visibleCount =
            0;


        // =================================================
        // CREATE ENABLED PAPERS ONLY
        // =================================================

        PAPER_CONFIG.forEach(
            function(paper) {

                const enabled =
                    settings[
                        paper.field
                    ] === true;


                console.log(
                    paper.field,
                    enabled
                        ? "ENABLED"
                        : "DISABLED"
                );


                // -----------------------------------------
                // IMPORTANT
                // -----------------------------------------
                //
                // FALSE = DO NOT CREATE CARD
                //

                if (
                    !enabled
                ) {

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
        // NO ENABLED PAPERS
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
            "❌ Failed to load Grade 11 paper settings:",
            error
        );


        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:50px 20px;
                    color:#dc2626;
                "
            >

                <strong>
                    Failed to load paper availability.
                </strong>

                <p>
                    Please try again later.
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
                text-align:center;
                padding:60px 20px;
                color:#64748b;
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


            <strong
                style="
                    display:block;
                    color:#0f172a;
                    font-size:17px;
                    margin-bottom:7px;
                "
            >
                No Papers Available
            </strong>


            <span>
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
