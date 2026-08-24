// =====================================================
// FIREBASE
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
    document.getElementById("termGrid");


// =====================================================
// TERM DATA
// =====================================================

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


// =====================================================
// CHECK ELEMENT
// =====================================================

if (!termGrid) {

    console.error(
        "❌ termGrid not found."
    );

    throw new Error(
        "termGrid element not found."
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// FIRESTORE SETTINGS
// =====================================================

async function getSettings() {

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
            "⚠️ Settings document not found."
        );

        return {};

    }


    const data =
        snapshot.data() || {};


    console.log(
        "🔥 Firestore Settings:",
        data
    );


    return data;

}


// =====================================================
// CHECK TERM STATUS
// =====================================================

function isTermEnabled(
    settings,
    termNumber
) {

    const field =
        `grade11_term${termNumber}_enabled`;


    console.log(
        `Checking ${field}:`,
        settings[field]
    );


    // If field doesn't exist,
    // enable by default.

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            field
        )
    ) {

        return true;

    }


    return settings[field] === true;

}


// =====================================================
// CREATE TERM CARD
// =====================================================

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


// =====================================================
// SHOW NO TERMS
// =====================================================

function showNoTerms() {

    termGrid.innerHTML = `

        <div
            style="
                width:100%;
                background:#ffffff;
                border-radius:20px;
                padding:50px 25px;
                text-align:center;
                box-sizing:border-box;
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


// =====================================================
// SHOW ERROR
// =====================================================

function showError(error) {

    console.error(
        "❌ Grade 11 TOP Ranking Error:",
        error
    );


    termGrid.innerHTML = `

        <div
            style="
                width:100%;
                background:#ffffff;
                border-radius:20px;
                padding:40px;
                text-align:center;
                box-sizing:border-box;
            "
        >

            <div
                style="
                    font-size:45px;
                    margin-bottom:15px;
                "
            >
                ⚠️
            </div>


            <h2>
                Unable to Load TOP Ranking
            </h2>


            <p
                style="
                    color:#64748b;
                    margin-bottom:20px;
                "
            >
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


// =====================================================
// LOAD TERMS
// =====================================================

async function loadTerms() {

    console.log(
        "===================================="
    );

    console.log(
        "🏆 GRADE 11 TOP RANKING START"
    );

    console.log(
        "===================================="
    );


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
            Loading...
        </div>

    `;


    try {

        // =============================================
        // GET SETTINGS
        // =============================================

        const settings =
            await getSettings();


        // =============================================
        // CLEAR GRID
        // =============================================

        termGrid.innerHTML =
            "";


        let visibleTerms =
            0;


        // =============================================
        // CREATE ACTIVE TERMS
        // =============================================

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
                    ? "✅ ACTIVE"
                    : "❌ DISABLED"
            );


            if (!enabled) {

                continue;

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


        // =============================================
        // NO ACTIVE TERMS
        // =============================================

        if (
            visibleTerms === 0
        ) {

            showNoTerms();

        }


        console.log(
            "Visible terms:",
            visibleTerms
        );


        console.log(
            "🏆 TOP RANKING COMPLETE"
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
