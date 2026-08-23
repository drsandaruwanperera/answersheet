import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// GET TERM
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

    alert(
        "Invalid term."
    );

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
// SET TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `📚 Grade 10 - ${termNames[term]}`;

}


// =====================================================
// PAPER DATA
// =====================================================

const papers = [

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
// SHOW PAPER
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
                `&paper=${encodeURIComponent(paper.number)}`;

        }
    );


    return card;

}


// =====================================================
// RENDER ALL PAPERS
// =====================================================

function renderAllPapers() {

    if (!paperContainer) {

        console.error(
            "❌ paperContainer not found."
        );

        return;

    }


    paperContainer.innerHTML =
        "";


    papers.forEach(
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
        "✅ Papers rendered:",
        papers.length
    );

}


// =====================================================
// GET SETTINGS
// =====================================================

async function getSettings() {

    try {

        console.log(
            "Reading Firestore settings..."
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
                "No paperSettings/settings document."
            );

            return {};

        }


        const data =
            snapshot.data() || {};


        console.log(
            "✅ Settings loaded:",
            data
        );


        return data;

    }

    catch (error) {

        console.error(
            "❌ Firestore settings error:",
            error
        );


        // Important:
        // Don't make page blank if Firestore
        // has a temporary problem.

        return null;

    }

}


// =====================================================
// CHECK ENABLED VALUE
// =====================================================

function getEnabledValue(
    settings,
    id
) {

    // No settings available
    if (
        settings === null
    ) {

        return true;

    }


    // No setting for this paper
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


    // =============================================
    // Object format
    // =============================================

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


        return true;

    }


    // =============================================
    // Boolean format
    // =============================================

    if (
        typeof value === "boolean"
    ) {

        return value;

    }


    return true;

}


// =====================================================
// CHECK TERM
// =====================================================

function isTermEnabled(
    settings
) {

    // Firestore failed
    if (
        settings === null
    ) {

        return true;

    }


    const termId =
        `grade10_term${term}_enabled`;


    // No term setting = enabled
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

        return value.enabled !== false;

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


    // =============================================
    // TERM DISABLED
    // =============================================

    if (
        !isTermEnabled(
            settings
        )
    ) {

        paperContainer.innerHTML = `

            <div
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:50px 25px;
                    background:#fff;
                    border-radius:20px;
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
                    "
                >
                    This term has been disabled
                    by the administrator.
                </p>

            </div>

        `;

        return;

    }


    // =============================================
    // CHECK EACH PAPER
    // =============================================

    let visibleCount =
        0;


    papers.forEach(
        paper => {

            const id =
                `grade10_term${term}_model_${paper.number}`;


            const enabled =
                getEnabledValue(
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

                visibleCount++;

            }

        }
    );


    // =============================================
    // NO ACTIVE PAPERS
    // =============================================

    if (
        visibleCount === 0
    ) {

        paperContainer.innerHTML = `

            <div
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:50px 25px;
                    background:#fff;
                    border-radius:20px;
                    text-align:center;
                "
            >

                <div style="font-size:50px;">
                    🔒
                </div>

                <h2>
                    No Papers Available
                </h2>

                <p
                    style="
                        color:#64748b;
                    "
                >
                    There are currently no active
                    papers for ${termNames[term]}.
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
        "======================================"
    );

    console.log(
        "GRADE 10 TERM PAGE"
    );

    console.log(
        "Term:",
        term
    );

    console.log(
        "======================================"
    );


    // =============================================
    // IMPORTANT
    // =============================================
    // Render immediately.
    // Don't wait for Firebase.
    // =============================================

    renderAllPapers();


    // =============================================
    // Then get Firebase settings
    // =============================================

    const settings =
        await getSettings();


    // =============================================
    // Apply active/disabled settings
    // =============================================

    applySettings(
        settings
    );


    console.log(
        "✅ Grade 10 Term page complete."
    );

}


init();
