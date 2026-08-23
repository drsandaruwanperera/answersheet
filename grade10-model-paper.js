import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

    throw new Error(
        "Student not logged in"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const termGrid =
    document.getElementById(
        "termGrid"
    );


const noTermsMessage =
    document.getElementById(
        "noTermsMessage"
    );


// =====================================================
// TERM CARDS
// =====================================================

const termCards = {

    "1":
        document.getElementById(
            "termCard1"
        ),

    "2":
        document.getElementById(
            "termCard2"
        ),

    "3":
        document.getElementById(
            "termCard3"
        )

};


// =====================================================
// PAPER SETTINGS
// =====================================================

let paperSettings = {};


// =====================================================
// PAPER IDs
// =====================================================
//
// Must match paper-settings.js
//
// =====================================================

const termPaperIds = {

    "1": [

        "grade10_term1_model_01",

        "grade10_term1_model_02",

        "grade10_term1_model_03",

        "grade10_term1_model_04",

        "grade10_term1_model_05"

    ],


    "2": [

        "grade10_term2_model_01",

        "grade10_term2_model_02",

        "grade10_term2_model_03",

        "grade10_term2_model_04",

        "grade10_term2_model_05"

    ],


    "3": [

        "grade10_term3_model_01",

        "grade10_term3_model_02",

        "grade10_term3_model_03",

        "grade10_term3_model_04",

        "grade10_term3_model_05"

    ]

};


// =====================================================
// CHECK PAPER ENABLED
// =====================================================

function isPaperEnabled(
    paperId
) {

    // -------------------------------------------------
    // No setting = Active
    // -------------------------------------------------

    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            paperId
        )
    ) {

        return true;

    }


    const setting =
        paperSettings[
            paperId
        ];


    if (
        !setting ||
        typeof setting.enabled ===
        "undefined"
    ) {

        return true;

    }


    return (
        setting.enabled === true
    );

}


// =====================================================
// CHECK TERM ENABLED
// =====================================================
//
// Term is visible when at least ONE paper
// inside that term is Active.
//
// If all 5 papers are Disabled,
// the whole Term card is hidden.
//
// =====================================================

function isTermEnabled(
    term
) {

    const papers =
        termPaperIds[
            term
        ] || [];


    return papers.some(
        paperId =>
            isPaperEnabled(
                paperId
            )
    );

}


// =====================================================
// OPEN TERM
// =====================================================

function openTerm(
    term
) {

    if (
        !isTermEnabled(
            term
        )
    ) {

        return;

    }


    window.location.href =
        `grade10-term.html?term=${encodeURIComponent(
            term
        )}`;

}


// =====================================================
// SETUP CARD
// =====================================================

function setupCard(
    term
) {

    const card =
        termCards[
            term
        ];


    if (!card) {
        return;
    }


    // Remove old handlers

    card.onclick =
        null;


    card.onkeydown =
        null;


    // -------------------------------------------------
    // Check availability
    // -------------------------------------------------

    const enabled =
        isTermEnabled(
            term
        );


    // -------------------------------------------------
    // DISABLED
    // -------------------------------------------------

    if (!enabled) {

        card.style.display =
            "none";

        card.setAttribute(
            "aria-hidden",
            "true"
        );

        return;

    }


    // -------------------------------------------------
    // ACTIVE
    // -------------------------------------------------

    card.style.display =
        "";


    card.removeAttribute(
        "aria-hidden"
    );


    card.onclick =
        () => {

            openTerm(
                term
            );

        };


    card.onkeydown =
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openTerm(
                    term
                );

            }

        };

}


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

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


        // =============================================
        // NO SETTINGS DOCUMENT
        // =============================================

        if (
            !snapshot.exists()
        ) {

            console.warn(
                "paperSettings/settings does not exist."
            );


            paperSettings = {};

        }

        else {

            paperSettings =
                snapshot.data() || {};

        }


        console.log(
            "Paper settings loaded:",
            paperSettings
        );


        renderTerms();

    }

    catch (error) {

        console.error(
            "Failed to load paper settings:",
            error
        );


        // ------------------------------------------------
        // If settings cannot be loaded,
        // keep papers visible instead of hiding them.
        // ------------------------------------------------

        paperSettings = {};


        renderTerms();

    }

}


// =====================================================
// RENDER TERMS
// =====================================================

function renderTerms() {

    let visibleTerms =
        0;


    [
        "1",
        "2",
        "3"
    ]
    .forEach(
        term => {

            setupCard(
                term
            );


            if (
                isTermEnabled(
                    term
                )
            ) {

                visibleTerms++;

            }

        }
    );


    // =================================================
    // NO TERMS
    // =================================================

    if (
        visibleTerms === 0
    ) {

        if (termGrid) {

            termGrid.style.display =
                "none";

        }


        if (noTermsMessage) {

            noTermsMessage.style.display =
                "block";

        }

    }

    else {

        if (termGrid) {

            termGrid.style.display =
                "";

        }


        if (noTermsMessage) {

            noTermsMessage.style.display =
                "none";

        }

    }


    console.log(
        "Grade 10 Terms:",
        {

            term1:
                isTermEnabled("1"),

            term2:
                isTermEnabled("2"),

            term3:
                isTermEnabled("3")

        }
    );

}


// =====================================================
// START
// =====================================================

loadSettings();


console.log(
    "======================================"
);

console.log(
    "✅ Grade 10 Model Papers Loaded"
);

console.log(
    "======================================"
);
