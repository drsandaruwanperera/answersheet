// =====================================================
// GRADE 11 TOP RANKING - TERM SELECTION
// =====================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// FIREBASE SETTINGS
// =====================================================

const SETTINGS_DOCUMENT =
    "grade11";


// =====================================================
// TERM CONFIGURATION
// =====================================================

const TERM_CONFIG = [

    {
        id: "term1",

        title:
            "1st Term",

        subtitle:
            "Grade 11 TOP Ranking Papers",

        url:
            "grade11-term1.html",

        fields: [

            "grade11_term1_01",
            "grade11_term1_02",
            "grade11_term1_03",
            "grade11_term1_04",
            "grade11_term1_05"

        ]

    },


    {
        id: "term2",

        title:
            "2nd Term",

        subtitle:
            "Grade 11 TOP Ranking Papers",

        url:
            "grade11-term2.html",

        fields: [

            "grade11_term2_01",
            "grade11_term2_02",
            "grade11_term2_03",
            "grade11_term2_04",
            "grade11_term2_05"

        ]

    },


    {
        id: "term3",

        title:
            "3rd Term",

        subtitle:
            "Grade 11 TOP Ranking Papers",

        url:
            "grade11-term3.html",

        fields: [

            "grade11_term3_01",
            "grade11_term3_02",
            "grade11_term3_03",
            "grade11_term3_04",
            "grade11_term3_05"

        ]

    }

];


// =====================================================
// ELEMENT
// =====================================================

const termGrid =
    document.getElementById(
        "termGrid"
    );


// =====================================================
// CHECK ANY ENABLED
// =====================================================

function hasEnabledPaper(
    settings,
    fields
) {

    return fields.some(
        function(field) {

            return (
                settings[field] === true
            );

        }
    );

}


// =====================================================
// CREATE TERM CARD
// =====================================================

function createTermCard(
    term
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "term-card";


    card.setAttribute(
        "role",
        "button"
    );


    card.setAttribute(
        "tabindex",
        "0"
    );


    card.innerHTML = `

        <div class="term-icon">
            🏆
        </div>

        <h2>
            ${term.title}
        </h2>

        <p>
            ${term.subtitle}
        </p>

    `;


    // -------------------------------------------------
    // CLICK
    // -------------------------------------------------

    card.addEventListener(
        "click",
        function() {

            window.location.href =
                term.url;

        }
    );


    // -------------------------------------------------
    // KEYBOARD
    // -------------------------------------------------

    card.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                window.location.href =
                    term.url;

            }

        }
    );


    return card;

}


// =====================================================
// LOAD FIREBASE SETTINGS
// =====================================================

async function loadTermVisibility() {

    if (
        !termGrid
    ) {

        console.error(
            "❌ termGrid not found."
        );

        return;

    }


    // -------------------------------------------------
    // Loading message
    // -------------------------------------------------

    termGrid.innerHTML = `

        <div
            style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                color: #64748b;
            "
        >
            Loading TOP Ranking Papers...
        </div>

    `;


    try {

        // -------------------------------------------------
        // GET GRADE 11 SETTINGS
        // -------------------------------------------------

        const settingsRef =
            doc(
                db,
                "paperSettings",
                SETTINGS_DOCUMENT
            );


        const snapshot =
            await getDoc(
                settingsRef
            );


        // -------------------------------------------------
        // NO DOCUMENT
        // -------------------------------------------------

        if (
            !snapshot.exists()
        ) {

            console.warn(
                "⚠️ Grade 11 paper settings not found."
            );


            termGrid.innerHTML = `

                <div
                    style="
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: 40px;
                        color: #64748b;
                    "
                >
                    No TOP Ranking papers are currently available.
                </div>

            `;


            return;

        }


        const settings =
            snapshot.data();


        console.log(
            "📚 Grade 11 Settings:",
            settings
        );


        // -------------------------------------------------
        // CLEAR GRID
        // -------------------------------------------------

        termGrid.innerHTML =
            "";


        let visibleTerms =
            0;


        // -------------------------------------------------
        // CREATE ONLY ENABLED TERMS
        // -------------------------------------------------

        TERM_CONFIG.forEach(
            function(term) {

                const enabled =
                    hasEnabledPaper(
                        settings,
                        term.fields
                    );


                console.log(
                    term.title,
                    enabled
                        ? "VISIBLE"
                        : "HIDDEN"
                );


                if (
                    !enabled
                ) {

                    return;

                }


                const card =
                    createTermCard(
                        term
                    );


                termGrid.appendChild(
                    card
                );


                visibleTerms++;

            }
        );


        // -------------------------------------------------
        // NOTHING AVAILABLE
        // -------------------------------------------------

        if (
            visibleTerms === 0
        ) {

            termGrid.innerHTML = `

                <div
                    style="
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: 50px 20px;
                        color: #64748b;
                    "
                >

                    <div
                        style="
                            font-size: 42px;
                            margin-bottom: 12px;
                        "
                    >
                        🔒
                    </div>

                    <strong
                        style="
                            display: block;
                            color: #0f172a;
                            font-size: 16px;
                            margin-bottom: 6px;
                        "
                    >
                        No TOP Ranking Papers Available
                    </strong>

                    <span>
                        Please check again later.
                    </span>

                </div>

            `;

        }


    }
    catch (error) {

        console.error(
            "❌ Failed to load Grade 11 paper settings:",
            error
        );


        termGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    color: #dc2626;
                "
            >

                Failed to load paper availability.

            </div>

        `;

    }

}


// =====================================================
// INITIALIZE
// =====================================================

loadTermVisibility();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "===================================="
);

console.log(
    "🏆 GRADE 11 TOP RANKING"
);

console.log(
    "Dynamic term visibility active."
);

console.log(
    "===================================="
);
