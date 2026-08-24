// =========================================
// FIREBASE
// =========================================

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


// =========================================
// ELEMENTS
// =========================================

const termTitle =
    document.getElementById(
        "termTitle"
    );

const paperContainer =
    document.getElementById(
        "paperContainer"
    );


// =========================================
// VALIDATE TERM
// =========================================

if (
    !["1", "2", "3"].includes(term)
) {

    alert(
        "Invalid term."
    );

    window.location.replace(
        "grade11-model-papers.html"
    );

    throw new Error(
        "Invalid term"
    );

}


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
// LOAD PAPER SETTINGS
// =========================================

async function loadPaperSettings() {

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


        let settings = {};


        if (
            snapshot.exists()
        ) {

            settings =
                snapshot.data() || {};

        }


        // =====================================
        // CHECK CURRENT TERM
        // =====================================

        const termSetting =
            `grade11_term${term}_enabled`;


        const termEnabled =
            Object.prototype.hasOwnProperty.call(
                settings,
                termSetting
            )
                ? settings[
                    termSetting
                ] === true
                : true;


        // =====================================
        // TERM DISABLED
        // =====================================

        if (!termEnabled) {

            alert(
                `${termNames[term]} is currently unavailable.`
            );


            window.location.replace(
                "grade11-model-papers.html"
            );


            return;

        }


        // =====================================
        // SHOW TERM
        // =====================================

        if (termTitle) {

            termTitle.textContent =
                "🏆 Grade 11 TOP Ranking - " +
                termNames[term];

        }


        // =====================================
        // CREATE PAPERS
        // =====================================

        createPapers();

    }

    catch (error) {

        console.error(
            "Failed to load paper settings:",
            error
        );


        // =====================================
        // FAIL SAFE
        // =====================================

        // If Firebase fails, allow the page
        // to work normally.

        if (termTitle) {

            termTitle.textContent =
                "🏆 Grade 11 TOP Ranking - " +
                termNames[term];

        }


        createPapers();

    }

}


// =========================================
// CREATE TOP RANKING PAPERS
// =========================================

function createPapers() {

    if (!paperContainer) {

        console.error(
            "paperContainer not found."
        );

        return;

    }


    paperContainer.innerHTML =
        "";


    // =====================================
    // CREATE 4 PAPERS
    // =====================================

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const paperNumber =
            String(i).padStart(
                2,
                "0"
            );


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
                TOP Ranking - ${paperNumber}
            </h2>


            <p>
                Grade 11 • ${termNames[term]}
            </p>

        `;


        card.addEventListener(
            "click",
            () => {

                window.location.href =
                    "grade11-model-paper.html" +
                    "?term=" +
                    encodeURIComponent(
                        term
                    ) +
                    "&paper=" +
                    encodeURIComponent(
                        paperNumber
                    );

            }
        );


        paperContainer.appendChild(
            card
        );

    }

}


// =========================================
// START
// =========================================

loadPaperSettings();


console.log(
    "✅ Grade 11 TOP Ranking Term Loaded",
    {
        term,
        termName:
            termNames[term]
    }
);
