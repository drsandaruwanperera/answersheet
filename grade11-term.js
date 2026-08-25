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
// LOGIN
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
// CURRENT TERM
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
// TITLE
// =====================================================

const titles = {

    term1:
        "🏆 Grade 11 - 1st Term TOP Ranking",

    term2:
        "🏆 Grade 11 - 2nd Term TOP Ranking",

    term3:
        "🏆 Grade 11 - 3rd Term TOP Ranking"

};


if (termTitle) {

    termTitle.textContent =
        titles[
            currentTerm
        ];

}


// =====================================================
// PAPERS
// =====================================================

const papers = [

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
// OPEN VIEWER
// =====================================================

function openAnswer(
    number,
    part
) {

    const url =
        "answer-viewer.html" +
        "?grade=11" +
        "&term=" +
        encodeURIComponent(
            currentTerm
        ) +
        "&paper=" +
        number +
        "&part=" +
        part;


    window.location.href =
        url;

}


// =====================================================
// CREATE CARD
// =====================================================

function createCard(
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


        <p>
            Select Answer Part
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


    const buttonA =
        card.querySelector(
            '[data-part="A"]'
        );


    const buttonB =
        card.querySelector(
            '[data-part="B"]'
        );


    if (buttonA) {

        buttonA.addEventListener(
            "click",
            function () {

                openAnswer(
                    paper.number,
                    "A"
                );

            }
        );

    }


    if (buttonB) {

        buttonB.addEventListener(
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
                    font-size:45px;
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
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

    try {

        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:50px;
                    color:#64748b;
                "
            >

                Loading papers...

            </div>

        `;


        const reference =
            doc(
                db,
                "paperSettings",
                "grade11"
            );


        const snapshot =
            await getDoc(
                reference
            );


        if (
            !snapshot.exists()
        ) {

            showNoPapers();

            return;

        }


        const settings =
            snapshot.data();


        paperContainer.innerHTML =
            "";


        let visible =
            0;


        papers.forEach(
            function (paper) {

                const enabled =
                    settings[
                        paper.field
                    ] === true;


                console.log(
                    paper.field,
                    enabled
                );


                if (
                    !enabled
                ) {

                    return;

                }


                paperContainer.appendChild(
                    createCard(
                        paper
                    )
                );


                visible++;

            }
        );


        if (
            visible === 0
        ) {

            showNoPapers();

        }


    }
    catch (error) {

        console.error(
            "Grade 11 loading error:",
            error
        );


        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:50px;
                    color:#dc2626;
                "
            >

                ⚠️ Failed to load papers.

            </div>

        `;

    }

}


// =====================================================
// START
// =====================================================

loadSettings();
