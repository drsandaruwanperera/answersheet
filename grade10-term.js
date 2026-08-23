// =====================================================
// GRADE 10 TERM PAGE
// =====================================================


// =====================================================
// URL PARAMETER
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
// VALIDATE
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
// TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `📚 Grade 10 - ${termNames[term]}`;

}


// =====================================================
// PAPER DATA
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
// CREATE CARD
// =====================================================

function createPaperCard(paper) {

    const card =
        document.createElement("div");


    card.className =
        "paper-card";


    const settingId =
        `grade10_term${term}_model_${paper.number}`;


    card.dataset.settingId =
        settingId;


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
// RENDER PAPERS
// =====================================================

function renderPapers() {

    if (!paperContainer) {

        console.error(
            "❌ paperContainer NOT FOUND"
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
        "✅ 5 Grade 10 papers rendered"
    );

}


// =====================================================
// FIREBASE SETTINGS
// =====================================================

async function loadFirebaseSettings() {

    try {

        console.log(
            "Loading Firebase..."
        );


        const firebase =
            await import(
                "./firebase.js"
            );


        const db =
            firebase.db;

        const doc =
            firebase.doc;

        const getDoc =
            firebase.getDoc;


        if (
            !db ||
            !doc ||
            !getDoc
        ) {

            throw new Error(
                "firebase.js exports are missing."
            );

        }


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
                "No paper settings document."
            );

            return {};

        }


        return (
            snapshot.data() || {}
        );

    }

    catch (error) {

        console.error(
            "Firebase settings error:",
            error
        );


        /*
         * IMPORTANT
         *
         * Firebase error එකක් තිබුණත්
         * papers hide කරන්නේ නැහැ.
         */

        return null;

    }

}


// =====================================================
// GET ENABLED VALUE
// =====================================================

function getEnabled(
    settings,
    id
) {

    /*
     * Firebase fail වුණොත්
     * paper active.
     */

    if (
        settings === null
    ) {

        return true;

    }


    /*
     * Setting එක නැත්නම්
     * paper active.
     */

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
// CHECK TERM
// =====================================================

function isTermEnabled(
    settings
) {

    if (
        settings === null
    ) {

        return true;

    }


    const termId =
        `grade10_term${term}_enabled`;


    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            termId
        )
    ) {

        return true;

    }


    const value =
        settings[termId];


    if (
        typeof value === "boolean"
    ) {

        return value;

    }


    if (
        typeof value === "object" &&
        value !== null
    ) {

        return (
            value.enabled !== false
        );

    }


    return true;

}


// =====================================================
// APPLY SETTINGS
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

        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    background:white;
                    padding:50px 25px;
                    border-radius:20px;
                    text-align:center;
                    box-shadow:0 10px 30px rgba(0,0,0,.08);
                "
            >

                <div
                    style="
                        font-size:50px;
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
                        margin-top:15px;
                        border:0;
                        padding:12px 24px;
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

        return;

    }


    // =================================================
    // INDIVIDUAL PAPERS
    // =================================================

    let visibleCount =
        0;


    PAPERS.forEach(
        paper => {

            const id =
                `grade10_term${term}_model_${paper.number}`;


            const enabled =
                getEnabled(
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
                    `[data-setting-id="${id}"]`
                );


            if (!card) {
                return;
            }


            if (!enabled) {

                card.remove();

            }
            else {

                visibleCount++;

            }

        }
    );


    // =================================================
    // NO ACTIVE PAPERS
    // =================================================

    if (
        visibleCount === 0
    ) {

        paperContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    background:white;
                    padding:50px 25px;
                    border-radius:20px;
                    text-align:center;
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
                    No model papers are currently
                    available.
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
        "================================"
    );

    console.log(
        "GRADE 10 TERM PAGE"
    );

    console.log(
        "TERM:",
        term
    );

    console.log(
        "================================"
    );


    // -------------------------------------------------
    // FIRST: SHOW PAPERS
    // -------------------------------------------------

    renderPapers();


    // -------------------------------------------------
    // SECOND: LOAD FIREBASE
    // -------------------------------------------------

    const settings =
        await loadFirebaseSettings();


    // -------------------------------------------------
    // THIRD: APPLY ADMIN SETTINGS
    // -------------------------------------------------

    applySettings(
        settings
    );


    console.log(
        "✅ Grade 10 Term page ready"
    );

}


// =====================================================
// RUN
// =====================================================

init();
