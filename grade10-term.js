// =====================================================
// GRADE 10 TERM PAGE
// =====================================================


// =====================================================
// GET URL
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
// TERM NAMES
// =====================================================

const termNames = {

    "1": "1st Term",

    "2": "2nd Term",

    "3": "3rd Term"

};


// =====================================================
// VALIDATE TERM
// =====================================================

if (
    !["1", "2", "3"].includes(term)
) {

    alert(
        "Invalid term."
    );

    window.location.replace(
        "grade10-model-papers.html"
    );

    throw new Error(
        "Invalid term: " + term
    );

}


// =====================================================
// SET TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `📚 Grade 10 - ${termNames[term]}`;

}


// =====================================================
// PAPER LIST
// =====================================================

const PAPERS = [

    {
        number: "01",
        title: "Model Paper - 01"
    },

    {
        number: "02",
        title: "Model Paper - 02"
    },

    {
        number: "03",
        title: "Model Paper - 03"
    },

    {
        number: "04",
        title: "Model Paper - 04"
    },

    {
        number: "05",
        title: "Model Paper - 05"
    }

];


// =====================================================
// CREATE PAPER CARD
// =====================================================

function createPaperCard(
    paper
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "paper-card";


    card.dataset.paperId =
        `grade10_term${term}_model_${paper.number}`;


    card.innerHTML = `

        <div class="paper-icon">
            📘
        </div>

        <h2>
            ${paper.title}
        </h2>

        <p>
            Part A & Part B
        </p>

    `;


    card.addEventListener(
        "click",
        function () {

            window.location.href =
                `grade10-model-paper.html` +
                `?term=${encodeURIComponent(term)}` +
                `&paper=${encodeURIComponent(
                    paper.number
                )}`;

        }
    );


    return card;

}


// =====================================================
// RENDER PAPERS IMMEDIATELY
// =====================================================

function renderPapers() {

    if (!paperContainer) {

        console.error(
            "❌ paperContainer not found."
        );

        return;

    }


    paperContainer.innerHTML =
        "";


    PAPERS.forEach(
        paper => {

            const card =
                createPaperCard(
                    paper
                );


            paperContainer.appendChild(
                card
            );

        }
    );


    console.log(
        "✅ 5 papers rendered immediately."
    );

}


// =====================================================
// SHOW TERM DISABLED
// =====================================================

function showTermDisabled() {

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            style="
                width:100%;
                box-sizing:border-box;
                background:#fff;
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


            <h2>
                ${termNames[term]} Unavailable
            </h2>


            <p
                style="
                    color:#64748b;
                    margin-bottom:25px;
                "
            >
                This term has been disabled
                by the administrator.
            </p>


            <button
                type="button"
                onclick="
                    window.location.href='grade10-model-papers.html'
                "
                style="
                    border:0;
                    padding:12px 24px;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    font-weight:600;
                    cursor:pointer;
                "
            >
                ← Back
            </button>

        </div>

    `;

}


// =====================================================
// GET FIRESTORE SETTINGS
// =====================================================

async function loadSettings() {

    try {

        /*
         * IMPORTANT:
         *
         * Firebase is dynamically imported.
         *
         * Therefore, if Firebase has an error,
         * the papers already rendered above
         * will NOT disappear.
         */

        const firebase =
            await import(
                "./firebase.js"
            );


        const {
            db,
            doc,
            getDoc
        } = firebase;


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

            console.log(
                "No paper settings found."
            );

            return {};

        }


        const settings =
            snapshot.data() || {};


        console.log(
            "✅ Paper settings:",
            settings
        );


        return settings;

    }

    catch (error) {

        console.error(
            "⚠️ Could not load paper settings:",
            error
        );


        /*
         * IMPORTANT:
         *
         * If Firestore fails,
         * DO NOT HIDE THE PAPERS.
         *
         * Papers remain visible.
         */

        return null;

    }

}


// =====================================================
// GET ENABLED VALUE
// =====================================================

function isEnabled(
    settings,
    id
) {

    // Firebase failed
    // Keep paper visible.

    if (
        settings === null
    ) {

        return true;

    }


    // No setting exists
    // Default = enabled.

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


    // Boolean

    if (
        typeof value === "boolean"
    ) {

        return value;

    }


    // Object

    if (
        typeof value === "object" &&
        value !== null
    ) {

        if (
            typeof value.enabled ===
            "boolean"
        ) {

            return value.enabled;

        }

    }


    return true;

}


// =====================================================
// CHECK TERM ENABLED
// =====================================================

function isTermEnabled(
    settings
) {

    // Firebase failed
    // Keep visible.

    if (
        settings === null
    ) {

        return true;

    }


    const id =
        `grade10_term${term}_enabled`;


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


    if (
        typeof value === "boolean"
    ) {

        return value;

    }


    if (
        typeof value === "object" &&
        value !== null
    ) {

        if (
            typeof value.enabled ===
            "boolean"
        ) {

            return value.enabled;

        }

    }


    return true;

}


// =====================================================
// APPLY FIRESTORE SETTINGS
// =====================================================

function applySettings(
    settings
) {

    if (!paperContainer) {
        return;
    }


    // =================================================
    // TERM DISABLED
    // =================================================

    if (
        !isTermEnabled(
            settings
        )
    ) {

        console.log(
            "🚫 Term disabled:",
            term
        );


        showTermDisabled();

        return;

    }


    // =================================================
    // CHECK INDIVIDUAL PAPERS
    // =================================================

    let visible =
        0;


    PAPERS.forEach(
        paper => {

            const id =
                `grade10_term${term}_model_${paper.number}`;


            const enabled =
                isEnabled(
                    settings,
                    id
                );


            console.log(
                id,
                enabled
                    ? "ACTIVE"
                    : "DISABLED"
            );


            const card =
                paperContainer.querySelector(
                    `[data-paper-id="${id}"]`
                );


            if (!card) {
                return;
            }


            if (!enabled) {

                card.remove();

            }
            else {

                visible++;

            }

        }
    );


    // =================================================
    // NO PAPERS
    // =================================================

    if (
        visible === 0
    ) {

        paperContainer.innerHTML = `

            <div
                style="
                    width:100%;
                    box-sizing:border-box;
                    background:#fff;
                    border-radius:20px;
                    padding:50px 25px;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:50px;
                    "
                >
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
                    No model papers are currently
                    available for ${termNames[term]}.
                </p>

            </div>

        `;

    }

}


// =====================================================
// START
// =====================================================

async function init() {

    console.log(
        "===================================="
    );

    console.log(
        "GRADE 10 TERM PAGE"
    );

    console.log(
        "Term:",
        term
    );

    console.log(
        "===================================="
    );


    // =================================================
    // VERY IMPORTANT
    // =================================================
    //
    // Render papers BEFORE Firebase.
    //
    // So they can never be stuck on Loading.
    //

    renderPapers();


    // =================================================
    // THEN CHECK ADMIN SETTINGS
    // =================================================

    const settings =
        await loadSettings();


    // =================================================
    // APPLY ADMIN SETTINGS
    // =================================================

    applySettings(
        settings
    );


    console.log(
        "✅ Grade 10 Term finished."
    );

}


// =====================================================
// RUN
// =====================================================

init();
