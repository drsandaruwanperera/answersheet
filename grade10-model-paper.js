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
        description: "Grade 10 Model Papers"
    },
    {
        number: "2",
        title: "2nd Term",
        description: "Grade 10 Model Papers"
    },
    {
        number: "3",
        title: "3rd Term",
        description: "Grade 10 Model Papers"
    }
];


// =====================================================
// ERROR DISPLAY
// =====================================================

function showError(error) {

    console.error(
        "Grade 10 Model Papers Error:",
        error
    );

    if (!termGrid) {
        return;
    }

    const message =
        error?.message ||
        String(error) ||
        "Unknown error";


    termGrid.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                background:#fff;
                border-radius:20px;
                padding:35px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
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

            <h2
                style="
                    margin:0 0 12px;
                    color:#111827;
                "
            >
                Unable to Load Model Papers
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
// GET FIRESTORE SETTINGS
// =====================================================

async function getPaperSettings() {

    console.log(
        "Reading Firestore paper settings..."
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


    const data =
        snapshot.data() || {};


    console.log(
        "Paper settings loaded:",
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

    const settingId =
        `grade10_term${termNumber}_enabled`;


    console.log(
        "Checking:",
        settingId,
        settings[settingId]
    );


    // If no term setting exists,
    // show the term by default.

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
// CREATE CARD
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
            📚
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
                `grade10-term.html?term=${encodeURIComponent(
                    term.number
                )}`;

        }
    );


    return card;

}


// =====================================================
// SHOW NO PAPERS
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
                No Model Papers Available
            </h2>

            <p
                style="
                    margin:0;
                    color:#64748b;
                "
            >
                Model papers are currently unavailable.
            </p>

        </div>

    `;

}


// =====================================================
// LOAD
// =====================================================

async function loadTerms() {

    try {

        console.log(
            "================================"
        );

        console.log(
            "GRADE 10 MODEL PAPERS START"
        );

        console.log(
            "================================"
        );


        if (!termGrid) {

            throw new Error(
                "termGrid element not found in HTML."
            );

        }


        // =========================================
        // SHOW LOADING
        // =========================================

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


        // =========================================
        // FIRESTORE
        // =========================================

        const settings =
            await getPaperSettings();


        // =========================================
        // CLEAR
        // =========================================

        termGrid.innerHTML =
            "";


        let visibleCount =
            0;


        // =========================================
        // TERMS
        // =========================================

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


            visibleCount++;

        }


        // =========================================
        // NONE
        // =========================================

        if (
            visibleCount === 0
        ) {

            showNoTerms();

        }


        console.log(
            "Visible terms:",
            visibleCount
        );


        console.log(
            "GRADE 10 MODEL PAPERS COMPLETE"
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
