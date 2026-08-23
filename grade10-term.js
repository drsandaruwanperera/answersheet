import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// URL
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const term =
    params.get("term");


// =====================================================
// ELEMENTS
// =====================================================

const termTitle =
    document.getElementById(
        "termTitle"
    );

const paperContainer =
    document.getElementById(
        "paperContainer"
    );


// =====================================================
// VALIDATE
// =====================================================

if (
    !["1", "2", "3"].includes(term)
) {

    alert("Invalid term.");

    window.location.replace(
        "grade10-model-papers.html"
    );

    throw new Error(
        "Invalid term"
    );

}


// =====================================================
// TERM NAMES
// =====================================================

const termNames = {

    "1": "1st Term",
    "2": "2nd Term",
    "3": "3rd Term"

};


// =====================================================
// TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `📚 Grade 10 - ${termNames[term]}`;

}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(error) {

    console.error(
        "Grade 10 Term Error:",
        error
    );

    if (!paperContainer) {
        return;
    }

    paperContainer.innerHTML = `

        <div
            style="
                width:100%;
                padding:40px;
                box-sizing:border-box;
                text-align:center;
                background:white;
                border-radius:20px;
            "
        >

            <h2>
                ⚠️ Unable to Load Papers
            </h2>

            <p
                style="
                    color:#64748b;
                    word-break:break-word;
                "
            >
                ${error.message || error}
            </p>

            <button
                onclick="location.reload()"
                style="
                    padding:12px 22px;
                    border:0;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    cursor:pointer;
                "
            >
                🔄 Try Again
            </button>

        </div>

    `;

}


// =====================================================
// FIRESTORE SETTINGS
// =====================================================

async function getSettings() {

    const ref =
        doc(
            db,
            "paperSettings",
            "settings"
        );

    const snap =
        await getDoc(ref);

    if (!snap.exists()) {

        console.log(
            "No paper settings found."
        );

        return {};

    }

    return snap.data() || {};

}


// =====================================================
// TERM STATUS
// =====================================================

function termIsEnabled(settings) {

    const id =
        `grade10_term${term}_enabled`;

    console.log(
        "TERM SETTING:",
        id,
        settings[id]
    );


    // No setting = active

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            id
        )
    ) {

        return true;

    }


    return settings[id] === true;

}


// =====================================================
// PAPER STATUS
// =====================================================

function paperIsEnabled(
    settings,
    number
) {

    const id =
        `grade10_term${term}_model_${number}`;


    console.log(
        "PAPER SETTING:",
        id,
        settings[id]
    );


    // No setting = active

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            id
        )
    ) {

        return true;

    }


    const value =
        settings[id];


    // Object format

    if (
        typeof value === "object" &&
        value !== null
    ) {

        return value.enabled === true;

    }


    // Boolean format

    return value === true;

}


// =====================================================
// CREATE PAPER
// =====================================================

function createPaper(
    number
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "paper-card";

    card.style.cursor =
        "pointer";


    card.innerHTML = `

        <div class="paper-icon">
            📘
        </div>

        <h2>
            Model Paper - ${number}
        </h2>

        <p>
            Part A & Part B
        </p>

    `;


    card.addEventListener(
        "click",
        () => {

            window.location.href =
                `grade10-model-paper.html?term=${encodeURIComponent(
                    term
                )}&paper=${encodeURIComponent(
                    number
                )}`;

        }
    );


    return card;

}


// =====================================================
// TERM DISABLED
// =====================================================

function showTermDisabled() {

    paperContainer.innerHTML = `

        <div
            style="
                width:100%;
                background:white;
                padding:50px 25px;
                box-sizing:border-box;
                text-align:center;
                border-radius:20px;
            "
        >

            <div style="font-size:50px;">
                🔒
            </div>

            <h2>
                ${termNames[term]} Unavailable
            </h2>

            <p
                style="
                    color:#64748b;
                "
            >
                This term has been disabled
                by the administrator.
            </p>

            <button
                onclick="location.href='grade10-model-papers.html'"
                style="
                    margin-top:20px;
                    padding:12px 24px;
                    border:0;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    cursor:pointer;
                "
            >
                ← Back
            </button>

        </div>

    `;

}


// =====================================================
// NO PAPERS
// =====================================================

function showNoPapers() {

    paperContainer.innerHTML = `

        <div
            style="
                width:100%;
                background:white;
                padding:50px 25px;
                box-sizing:border-box;
                text-align:center;
                border-radius:20px;
            "
        >

            <div style="font-size:50px;">
                📭
            </div>

            <h2>
                No Papers Available
            </h2>

            <p
                style="
                    color:#64748b;
                "
            >
                No active papers are available
                for ${termNames[term]}.
            </p>

        </div>

    `;

}


// =====================================================
// LOAD
// =====================================================

async function loadPapers() {

    try {

        console.log(
            "================================"
        );

        console.log(
            "GRADE 10 TERM LOADING"
        );

        console.log(
            "Term:",
            term
        );

        console.log(
            "================================"
        );


        if (!paperContainer) {

            throw new Error(
                "paperContainer not found in grade10-term.html"
            );

        }


        paperContainer.innerHTML = `

            <div
                style="
                    width:100%;
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                "
            >
                Loading papers...
            </div>

        `;


        // =============================================
        // FIRESTORE
        // =============================================

        const settings =
            await getSettings();


        console.log(
            "ALL SETTINGS:",
            settings
        );


        // =============================================
        // CHECK TERM
        // =============================================

        if (
            !termIsEnabled(
                settings
            )
        ) {

            showTermDisabled();

            return;

        }


        // =============================================
        // CLEAR
        // =============================================

        paperContainer.innerHTML =
            "";


        let count =
            0;


        // =============================================
        // PAPERS 01 - 05
        // =============================================

        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            const number =
                String(i).padStart(
                    2,
                    "0"
                );


            const enabled =
                paperIsEnabled(
                    settings,
                    number
                );


            console.log(
                `Model Paper ${number}:`,
                enabled
                    ? "ACTIVE"
                    : "DISABLED"
            );


            if (!enabled) {
                continue;
            }


            const card =
                createPaper(
                    number
                );


            paperContainer.appendChild(
                card
            );


            count++;

        }


        // =============================================
        // NONE
        // =============================================

        if (
            count === 0
        ) {

            showNoPapers();

        }


        console.log(
            "Visible papers:",
            count
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

loadPapers();


console.log(
    "✅ grade10-term.js loaded"
);
