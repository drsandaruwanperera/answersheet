// =====================================================
// GRADE 11 TOP RANKING PAPERS
// =====================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ELEMENT
// =====================================================

const termGrid =
    document.getElementById(
        "termGrid"
    );


// =====================================================
// TERM DATA
// =====================================================

const TERMS = [

    {
        number: "1",

        title:
            "1st Term",

        description:
            "Grade 11 TOP Ranking Papers"
    },

    {
        number: "2",

        title:
            "2nd Term",

        description:
            "Grade 11 TOP Ranking Papers"
    },

    {
        number: "3",

        title:
            "3rd Term",

        description:
            "Grade 11 TOP Ranking Papers"
    }

];


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(error) {

    console.error(
        "Grade 11 TOP Ranking Error:",
        error
    );


    if (!termGrid) {
        return;
    }


    const message =
        error?.message ||
        "Unable to load TOP Ranking Papers.";


    termGrid.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                background:#fff;
                border-radius:20px;
                padding:40px 25px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
            "
        >

            <div
                style="
                    font-size:50px;
                    margin-bottom:15px;
                "
            >
                ⚠️
            </div>


            <h2
                style="
                    margin:0 0 12px;
                    color:#111827;
                "
            >
                Unable to Load TOP Ranking Papers
            </h2>


            <p
                style="
                    color:#64748b;
                    margin:0 auto 20px;
                    max-width:650px;
                "
            >
                ${escapeHTML(message)}
            </p>


            <button
                type="button"
                onclick="location.reload()"
                style="
                    border:0;
                    padding:12px 22px;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    font-weight:600;
                    cursor:pointer;
                "
            >
                🔄 Try Again
            </button>

        </div>

    `;

}


// =====================================================
// LOAD FIRESTORE SETTINGS
// =====================================================

async function getPaperSettings() {

    console.log(
        "Reading Grade 11 settings..."
    );


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


    if (!snapshot.exists()) {

        console.log(
            "paperSettings/settings does not exist."
        );


        return {};

    }


    const settings =
        snapshot.data() || {};


    console.log(
        "Grade 11 settings:",
        settings
    );


    return settings;

}


// =====================================================
// CHECK TERM STATUS
// =====================================================

function isTermEnabled(
    settings,
    termNumber
) {

    const settingId =
        `grade11_term${termNumber}_enabled`;


    console.log(
        "Checking Grade 11 term:",
        settingId,
        settings[settingId]
    );


    // =================================================
    // IMPORTANT
    // =================================================
    // If Admin has never created the setting,
    // the term is ACTIVE by default.
    // =================================================

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            settingId
        )
    ) {

        return true;

    }


    return (
        settings[settingId] === true
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


    card.style.cursor =
        "pointer";


    card.innerHTML = `

        <div class="term-icon">
            🏆
        </div>


        <h2>
            ${escapeHTML(
                term.title
            )}
        </h2>


        <p>
            ${escapeHTML(
                term.description
            )}
        </p>

    `;


    card.addEventListener(
        "click",
        () => {

            window.location.href =
                `grade11-term.html?term=${encodeURIComponent(
                    term.number
                )}`;

        }
    );


    return card;

}


// =====================================================
// SHOW NO TERMS
// =====================================================

function showNoTerms() {

    termGrid.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:50px 25px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
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


            <h2
                style="
                    margin:0 0 10px;
                    color:#111827;
                "
            >
                No TOP Ranking Papers Available
            </h2>


            <p
                style="
                    margin:0;
                    color:#64748b;
                "
            >
                TOP Ranking Papers are currently unavailable.
            </p>

        </div>

    `;

}


// =====================================================
// LOAD TERMS
// =====================================================

async function loadTerms() {

    try {

        console.log(
            "================================"
        );

        console.log(
            "GRADE 11 TOP RANKING START"
        );

        console.log(
            "================================"
        );


        // =================================================
        // CHECK ELEMENT
        // =================================================

        if (!termGrid) {

            throw new Error(
                "termGrid element not found in HTML."
            );

        }


        // =================================================
        // LOADING
        // =================================================

        termGrid.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                "
            >

                <div
                    style="
                        font-size:35px;
                        margin-bottom:10px;
                    "
                >
                    ⏳
                </div>

                Loading TOP Ranking Papers...

            </div>

        `;


        // =================================================
        // GET FIRESTORE SETTINGS
        // =================================================

        const settings =
            await getPaperSettings();


        // =================================================
        // CLEAR
        // =================================================

        termGrid.innerHTML =
            "";


        let visibleCount =
            0;


        // =================================================
        // CREATE ENABLED TERMS ONLY
        // =================================================

        for (
            const term of TERMS
        ) {

            const enabled =
                isTermEnabled(
                    settings,
                    term.number
                );


            console.log(
                term.title,
                enabled
                    ? "ACTIVE"
                    : "DISABLED"
            );


            // =============================================
            // DISABLED → DON'T SHOW
            // =============================================

            if (!enabled) {

                continue;

            }


            // =============================================
            // CREATE CARD
            // =============================================

            const card =
                createTermCard(
                    term
                );


            termGrid.appendChild(
                card
            );


            visibleCount++;

        }


        // =================================================
        // NO TERMS AVAILABLE
        // =================================================

        if (
            visibleCount === 0
        ) {

            showNoTerms();

        }


        console.log(
            "Visible Grade 11 terms:",
            visibleCount
        );


        console.log(
            "GRADE 11 TOP RANKING COMPLETE"
        );

    }

    catch (error) {

        showError(
            error
        );

    }

}


// =====================================================
// START
// =====================================================

loadTerms();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "🏆 Grade 11 TOP Ranking Papers JS Loaded"
);
