// =====================================================
// GRADE 11 TERM PAPER PAGE
// Firebase Controlled Paper Visibility
// Protected Answer Viewer
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
// CHECK STUDENT LOGIN
// =====================================================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


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
// SET PAGE TITLE
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

                📖
                <span>
                    Part A Answer
                </span>

            </button>


            <button
                type="button"
                class="answer-btn"
                data-part="B"
            >

                📖
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
            function () {

                openAnswer(
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
            function () {

                openAnswer(
                    paper.number,
                    "B"
                );

            }
        );

    }


    return card;

}


// =====================================================
// OPEN PROTECTED ANSWER VIEWER
// =====================================================
//
// IMPORTANT:
//
// DO NOT open PDF directly.
//
// We send the student to:
//
// answer-viewer.html
//
// The viewer will render the PDF inside the system.
//

function openAnswer(
    number,
    part
) {

    const viewerURL =
        "answer-viewer.html" +
        "?grade=11" +
        "&term=" +
        encodeURIComponent(
            currentTerm
        ) +
        "&paper=" +
        encodeURIComponent(
            number
        ) +
        "&part=" +
        encodeURIComponent(
            part
        );


    console.log(
        "Opening protected answer:",
        viewerURL
    );


    window.location.href =
        viewerURL;

}


// =====================================================
// LOAD FIREBASE PAPER SETTINGS
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
                text-align:center;
                padding:60px 20px;
                color:#64748b;
                font-size:15px;
            "
        >

            <div
                style="
                    font-size:35px;
                    margin-bottom:12px;
                "
            >
                ⏳
            </div>

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
                "⚠️ Grade 11 paper settings not found."
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
            "🏆 GRADE 11 PAPER SETTINGS"
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
            function (paper) {

                const enabled =
                    settings[
                        paper.field
                    ] === true;


                console.log(
                    paper.field,
                    "=>",
                    enabled
                        ? "ENABLED"
                        : "DISABLED"
                );


                // =========================================
                // DISABLED = DON'T CREATE CARD
                // =========================================

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
                    padding:60px 20px;
                    color:#dc2626;
                "
            >

                <div
                    style="
                        font-size:40px;
                        margin-bottom:12px;
                    "
                >
                    ⚠️
                </div>


                <strong
                    style="
                        display:block;
                        font-size:17px;
                        margin-bottom:8px;
                    "
                >

                    Failed to load paper availability.

                </strong>


                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


// =====================================================
// NO PAPERS
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
                padding:70px 20px;
                color:#64748b;
            "
        >

            <div
                style="
                    width:70px;
                    height:70px;
                    margin:0 auto 18px;
                    border-radius:20px;
                    background:#f1f5f9;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:34px;
                "
            >

                🔒

            </div>


            <strong
                style="
                    display:block;
                    color:#0f172a;
                    font-size:18px;
                    margin-bottom:8px;
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
    "🏆 GRADE 11 TERM PAPER PAGE"
);

console.log(
    "Grade:",
    "11"
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
    "Protected answer viewer:",
    "ACTIVE"
);

console.log(
    "===================================="
);
