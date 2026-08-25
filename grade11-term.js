// =====================================================
// GRADE 11 TERM PAPER PAGE
// Firebase Controlled Paper Visibility
// Professional Paper Cards
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


    return "term1";

}


const currentTerm =
    getCurrentTerm();


// =====================================================
// TERM TITLES
// =====================================================

const TERM_TITLES = {

    term1:
        "🏆 Grade 11 - 1st Term TOP Ranking",

    term2:
        "🏆 Grade 11 - 2nd Term TOP Ranking",

    term3:
        "🏆 Grade 11 - 3rd Term TOP Ranking"

};


// =====================================================
// SET TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        TERM_TITLES[
            currentTerm
        ] ||
        "🏆 Grade 11 TOP Ranking";

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
// PAPER PAGE URL
// =====================================================
//
// Example:
//
// grade11-term3-paper01.html
// grade11-term3-paper02.html
//
// If your actual filenames are different,
// change only this function.
// =====================================================

function getPaperURL(number) {

    return (
        `grade11-${currentTerm}-paper` +
        String(number).padStart(2, "0") +
        ".html"
    );

}


// =====================================================
// CREATE PROFESSIONAL PAPER CARD
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

        <!-- PAPER ICON -->

        <div class="paper-card-icon">
            🏆
        </div>


        <!-- PAPER TITLE -->

        <h2>
            ${paper.title}
        </h2>


        <p class="paper-card-subtitle">
            Answers
        </p>


        <!-- ANSWER SECTION -->

        <div class="answer-section">

            <span class="answer-label">
                Select Answer Part
            </span>


            <div class="answer-buttons">


                <!-- PART A -->

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


                <!-- PART B -->

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

        </div>

    `;


    // =================================================
    // PART A BUTTON
    // =================================================

    const partA =
        card.querySelector(
            '[data-part="A"]'
        );


    if (partA) {

        partA.addEventListener(
            "click",
            function (event) {

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
    // PART B BUTTON
    // =================================================

    const partB =
        card.querySelector(
            '[data-part="B"]'
        );


    if (partB) {

        partB.addEventListener(
            "click",
            function (event) {

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
// OPEN PAPER
// =====================================================

function openPaper(
    number,
    part
) {

    const paperURL =
        getPaperURL(
            number
        );


    window.location.href =
        paperURL +
        "?part=" +
        encodeURIComponent(
            part
        );

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
            class="no-papers"
            style="
                grid-column:1/-1;
                text-align:center;
                padding:70px 20px;
            "
        >

            <div
                style="
                    width:70px;
                    height:70px;
                    margin:0 auto 18px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border-radius:18px;
                    background:#f1f5f9;
                    font-size:30px;
                "
            >
                🔒
            </div>


            <h3
                style="
                    margin:0;
                    color:#0f172a;
                    font-size:18px;
                    font-weight:800;
                "
            >
                No Papers Available
            </h3>


            <p
                style="
                    margin:8px 0 0;
                    color:#64748b;
                    font-size:12px;
                "
            >
                There are currently no TOP Ranking
                papers available for this term.
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
                padding:60px 20px;
                color:#64748b;
                font-size:13px;
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

            console.warn(
                "⚠️ paperSettings/grade11 not found."
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
        // CLEAR OLD CARDS
        // =================================================

        paperContainer.innerHTML =
            "";


        let visibleCount =
            0;


        // =================================================
        // CREATE ENABLED PAPERS ONLY
        // =================================================

        PAPER_CONFIG.forEach(
            function (paper) {

                const enabled =
                    settings[
                        paper.field
                    ] === true;


                console.log(
                    paper.field +
                    ": " +
                    (
                        enabled
                            ? "ENABLED"
                            : "DISABLED"
                    )
                );


                // =========================================
                // DISABLED = DO NOT SHOW
                // =========================================

                if (
                    !enabled
                ) {

                    return;

                }


                // =========================================
                // CREATE CARD
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
                    padding:60px 20px;
                "
            >

                <div
                    style="
                        font-size:40px;
                        margin-bottom:15px;
                    "
                >
                    ⚠️
                </div>


                <strong
                    style="
                        display:block;
                        color:#dc2626;
                        font-size:16px;
                    "
                >
                    Failed to load paper availability.
                </strong>


                <p
                    style="
                        color:#64748b;
                        font-size:12px;
                    "
                >
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

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
