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
// VALIDATE TERM
// =====================================================

if (
    !["1", "2", "3"].includes(
        term
    )
) {

    alert(
        "Invalid term."
    );


    window.location.href =
        "grade10-model-papers.html";


    throw new Error(
        "Invalid Grade 10 term."
    );

}


// =====================================================
// TERM NAMES
// =====================================================

const termNames = {

    "1":
        "1st Term",

    "2":
        "2nd Term",

    "3":
        "3rd Term"

};


// =====================================================
// SET TITLE
// =====================================================

if (
    termTitle
) {

    termTitle.textContent =
        "📚 Grade 10 - " +
        termNames[term];

}


// =====================================================
// CHECK WHOLE TERM
// =====================================================

function isTermEnabled(
    settings
) {

    const settingId =
        `grade10_term${term}_enabled`;


    // No term setting = Active

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
// CHECK INDIVIDUAL PAPER
// =====================================================

function isPaperEnabled(
    settings,
    paperNumber
) {

    const paperId =
        `grade10_term${term}_model_${paperNumber}`;


    // No individual setting = Active

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            paperId
        )
    ) {

        return true;

    }


    return (
        settings[
            paperId
        ]?.enabled === true
    );

}


// =====================================================
// CREATE PAPER CARD
// =====================================================

function createPaperCard(
    paperNumber
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
            Model Paper - ${paperNumber}
        </h2>


        <p>
            Part A & Part B
        </p>

    `;


    card.addEventListener(
        "click",
        () => {

            window.location.href =
                "grade10-model-paper.html" +
                "?term=" +
                encodeURIComponent(
                    term
                ) +
                "&paper=" +
                encodeURIComponent(
                    paperNumber
                );

        }
    );


    return card;

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
                background:#ffffff;
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
                ${termNames[term]} Unavailable
            </h2>


            <p
                style="
                    margin:0;
                    color:#64748b;
                    line-height:1.6;
                "
            >
                This term has currently been
                disabled by the administrator.
            </p>


            <button
                type="button"
                id="backModelPapersBtn"
                style="
                    margin-top:25px;
                    border:0;
                    padding:12px 24px;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    font-weight:600;
                    cursor:pointer;
                "
            >
                ← Back to Model Papers
            </button>

        </div>

    `;


    const backBtn =
        document.getElementById(
            "backModelPapersBtn"
        );


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "grade10-model-papers.html";

            }
        );

    }

}


// =====================================================
// SHOW NO PAPERS
// =====================================================

function showNoPapers() {

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            style="
                width:100%;
                box-sizing:border-box;
                background:#ffffff;
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
                No Papers Available
            </h2>


            <p
                style="
                    margin:0;
                    color:#64748b;
                "
            >
                There are currently no active
                papers for this term.
            </p>

        </div>

    `;

}


// =====================================================
// LOAD PAPERS
// =====================================================

async function loadPapers() {

    try {

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
            "Term name:",
            termNames[term]
        );

        console.log(
            "======================================"
        );


        if (!paperContainer) {

            throw new Error(
                "paperContainer not found in grade10-term.html"
            );

        }


        // =================================================
        // LOADING
        // =================================================

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


        // =================================================
        // FIRESTORE
        // =================================================

        console.log(
            "Reading paper settings..."
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


        let settings = {};


        if (
            snapshot.exists()
        ) {

            settings =
                snapshot.data() || {};


            console.log(
                "Settings:",
                settings
            );

        }

        else {

            console.warn(
                "paperSettings/settings does not exist."
            );

        }


        // =================================================
        // CHECK WHOLE TERM
        // =================================================

        const termEnabled =
            isTermEnabled(
                settings
            );


        console.log(
            "Term enabled:",
            termEnabled
        );


        // =================================================
        // TERM DISABLED
        // =================================================

        if (
            !termEnabled
        ) {

            console.warn(
                "Term disabled by admin:",
                term
            );


            showTermDisabled();

            return;

        }


        // =================================================
        // CLEAR
        // =================================================

        paperContainer.innerHTML =
            "";


        let visiblePapers =
            0;


        // =================================================
        // LOAD 5 PAPERS
        // =================================================
        //
        // Admin catalog has:
        //
        // 01
        // 02
        // 03
        // 04
        // 05
        //
        // =================================================

        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            const paperNumber =
                String(i).padStart(
                    2,
                    "0"
                );


            const enabled =
                isPaperEnabled(
                    settings,
                    paperNumber
                );


            console.log(
                `Paper ${paperNumber}:`,
                enabled
                    ? "ACTIVE"
                    : "DISABLED"
            );


            // =============================================
            // HIDE DISABLED PAPER
            // =============================================

            if (!enabled) {

                continue;

            }


            // =============================================
            // SHOW ACTIVE PAPER
            // =============================================

            const card =
                createPaperCard(
                    paperNumber
                );


            paperContainer.appendChild(
                card
            );


            visiblePapers++;

        }


        // =================================================
        // NO ACTIVE PAPERS
        // =================================================

        if (
            visiblePapers === 0
        ) {

            showNoPapers();

        }


        console.log(
            "Visible papers:",
            visiblePapers
        );


        console.log(
            "Grade 10 term loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Grade 10 term loading error:",
            error
        );


        if (
            paperContainer
        ) {

            paperContainer.innerHTML = `

                <div
                    style="
                        width:100%;
                        box-sizing:border-box;
                        background:#ffffff;
                        border-radius:20px;
                        padding:40px 25px;
                        text-align:center;
                    "
                >

                    <div
                        style="
                            font-size:45px;
                        "
                    >
                        ⚠️
                    </div>


                    <h2>
                        Unable to Load Papers
                    </h2>


                    <p
                        style="
                            color:#64748b;
                            word-break:break-word;
                        "
                    >
                        ${
                            escapeHTML(
                                error.message ||
                                String(error)
                            )
                        }
                    </p>


                    <button
                        type="button"
                        onclick="location.reload()"
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
                        🔄 Try Again
                    </button>

                </div>

            `;

        }

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value
    )

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
// START
// =====================================================

loadPapers();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Grade 10 Term JS Loaded"
);
