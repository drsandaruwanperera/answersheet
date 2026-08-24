// =========================================
// FIREBASE
// =========================================

import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =========================================
// ELEMENT
// =========================================

const termGrid =
    document.getElementById("termGrid");


// =========================================
// TERMS
// =========================================

const TERMS = [

    {
        number: "1",
        title: "1st Term",
        description: "Grade 11 TOP Ranking Papers"
    },

    {
        number: "2",
        title: "2nd Term",
        description: "Grade 11 TOP Ranking Papers"
    },

    {
        number: "3",
        title: "3rd Term",
        description: "Grade 11 TOP Ranking Papers"
    }

];


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================
// GET FIRESTORE SETTINGS
// =========================================

async function getPaperSettings() {

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
        "🔥 Grade 11 settings:",
        settings
    );


    return settings;

}


// =========================================
// CHECK TERM
// =========================================

function isTermEnabled(
    settings,
    termNumber
) {

    const settingId =
        `grade11_term${termNumber}_enabled`;


    // If setting does not exist,
    // active by default.

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


// =========================================
// CREATE TERM CARD
// =========================================

function createTermCard(term) {

    const card =
        document.createElement("div");


    card.className =
        "term-card";


    card.style.cursor =
        "pointer";


    card.innerHTML = `

        <div class="term-icon">
            🏆
        </div>

        <h2>
            ${escapeHTML(term.title)}
        </h2>

        <p>
            ${escapeHTML(term.description)}
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


// =========================================
// SHOW EMPTY
// =========================================

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
                TOP Ranking Papers Unavailable
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


// =========================================
// SHOW ERROR
// =========================================

function showError(error) {

    console.error(
        "Grade 11 TOP Ranking Error:",
        error
    );


    termGrid.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:40px;
                text-align:center;
            "
        >

            <div style="font-size:45px;">
                ⚠️
            </div>

            <h2>
                Unable to Load TOP Ranking Papers
            </h2>

            <p style="color:#64748b;">
                ${escapeHTML(
                    error?.message ||
                    "Unknown error"
                )}
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


// =========================================
// LOAD TERMS
// =========================================

async function loadTerms() {

    try {

        if (!termGrid) {

            throw new Error(
                "termGrid element not found."
            );

        }


        // =====================================
        // LOADING
        // =====================================

        termGrid.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                "
            >
                Loading...
            </div>

        `;


        // =====================================
        // FIRESTORE
        // =====================================

        const settings =
            await getPaperSettings();


        // =====================================
        // CLEAR
        // =====================================

        termGrid.innerHTML =
            "";


        let visibleCount =
            0;


        // =====================================
        // TERMS
        // =====================================

        TERMS.forEach(
            term => {

                const enabled =
                    isTermEnabled(
                        settings,
                        term.number
                    );


                console.log(
                    `${term.title}:`,
                    enabled
                        ? "ACTIVE"
                        : "DISABLED"
                );


                if (!enabled) {

                    return;

                }


                const card =
                    createTermCard(
                        term
                    );


                termGrid.appendChild(
                    card
                );


                visibleCount++;

            }
        );


        // =====================================
        // NONE
        // =====================================

        if (
            visibleCount === 0
        ) {

            showNoTerms();

        }


        console.log(
            "✅ Visible Grade 11 TOP Ranking Terms:",
            visibleCount
        );

    }

    catch (error) {

        showError(
            error
        );

    }

}


// =========================================
// START
// =========================================

loadTerms();


console.log(
    "🏆 Grade 11 TOP Ranking Papers Loaded"
);
