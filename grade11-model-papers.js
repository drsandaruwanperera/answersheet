// =====================================================
// FIREBASE
// =====================================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const termContainer =
    document.getElementById(
        "termContainer"
    );


// =====================================================
// TERM DATA
// =====================================================

const TERMS = [

    {
        number:
            "1",

        name:
            "1st Term"

    },

    {
        number:
            "2",

        name:
            "2nd Term"

    },

    {
        number:
            "3",

        name:
            "3rd Term"

    }

];


// =====================================================
// FIRESTORE SETTINGS
// =====================================================

async function getSettings() {

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


        if (
            !snapshot.exists()
        ) {

            return {};

        }


        return (
            snapshot.data() || {}
        );

    }

    catch (error) {

        console.error(
            "Failed to load paper settings:",
            error
        );


        return {};

    }

}


// =====================================================
// TERM STATUS
// =====================================================

function isTermEnabled(
    settings,
    termNumber
) {

    const settingId =
        `grade11_term${termNumber}_enabled`;


    // New setting not created yet
    // = active by default.

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            settingId
        )
    ) {

        return true;

    }


    return (
        settings[
            settingId
        ] === true
    );

}


// =====================================================
// CREATE TERM CARD
// =====================================================

function createTermCard(
    term,
    enabled
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "term-card";


    // =================================================
    // DISABLED STYLE
    // =================================================

    if (
        !enabled
    ) {

        card.classList.add(
            "disabled"
        );

    }


    card.innerHTML = `

        <div class="term-icon">
            🏆
        </div>


        <h2>
            ${term.name}
        </h2>


        <p>
            Grade 11 TOP Ranking
        </p>


        ${
            !enabled
                ? `
                    <div
                        style="
                            margin-top:12px;
                            color:#dc2626;
                            font-weight:600;
                            font-size:13px;
                        "
                    >
                        🔒 Currently Disabled
                    </div>
                `
                : ""
        }

    `;


    // =================================================
    // CLICK
    // =================================================

    if (
        enabled
    ) {

        card.addEventListener(
            "click",
            () => {

                window.location.href =
                    "grade11-term.html" +
                    "?term=" +
                    encodeURIComponent(
                        term.number
                    );

            }
        );

    }

    else {

        card.addEventListener(
            "click",
            () => {

                alert(
                    `${term.name} TOP Ranking papers are currently disabled.`
                );

            }
        );

    }


    return card;

}


// =====================================================
// RENDER
// =====================================================

async function renderTerms() {

    if (
        !termContainer
    ) {

        console.error(
            "termContainer not found."
        );

        return;

    }


    termContainer.innerHTML =
        "";


    const settings =
        await getSettings();


    console.log(
        "Grade 11 settings:",
        settings
    );


    TERMS.forEach(
        term => {

            const enabled =
                isTermEnabled(
                    settings,
                    term.number
                );


            const card =
                createTermCard(
                    term,
                    enabled
                );


            termContainer.appendChild(
                card
            );

        }
    );

}


// =====================================================
// START
// =====================================================

renderTerms();


console.log(
    "✅ Grade 11 TOP Ranking Terms Loaded"
);
