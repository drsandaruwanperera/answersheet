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
// VALIDATE
// =====================================================

if (
    !["1", "2", "3"].includes(
        term
    )
) {

    alert(
        "Invalid term."
    );

    window.location.replace(
        "grade11-model-papers.html"
    );

    throw new Error(
        "Invalid Grade 11 term."
    );

}


// =====================================================
// TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        `🏆 Grade 11 - ${termNames[term]}`;

}


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadPaperSettings() {

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div style="
            grid-column:1/-1;
            text-align:center;
            padding:40px;
            color:#64748b;
        ">
            Loading...
        </div>

    `;


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


        const settings =
            snapshot.exists()
                ? snapshot.data() || {}
                : {};


        // =================================================
        // CHECK TERM
        // =================================================

        const termSettingId =
            `grade11_term${term}_enabled`;


        const termEnabled =
            Object.prototype.hasOwnProperty.call(
                settings,
                termSettingId
            )
                ? settings[
                    termSettingId
                ] === true
                : true;


        // =================================================
        // TERM DISABLED
        // =================================================

        if (!termEnabled) {

            paperContainer.innerHTML = `

                <div style="
                    grid-column:1/-1;
                    background:white;
                    border-radius:20px;
                    padding:50px 25px;
                    text-align:center;
                    box-shadow:0 10px 30px rgba(0,0,0,.08);
                ">

                    <div style="
                        font-size:50px;
                        margin-bottom:15px;
                    ">
                        🔒
                    </div>

                    <h2>
                        ${termNames[term]} Unavailable
                    </h2>

                    <p style="
                        color:#64748b;
                    ">
                        This TOP Ranking term is currently unavailable.
                    </p>

                </div>

            `;

            return;

        }


        // =================================================
        // CREATE ACTIVE PAPERS ONLY
        // =================================================

        paperContainer.innerHTML = "";


        let visibleCount =
            0;


        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            const paperNumber =
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            const paperId =
                `grade11_term${term}_model_${paperNumber}`;


            // -------------------------------------------------
            // IMPORTANT:
            // Admin setting false = HIDE PAPER
            // Missing setting = SHOW PAPER
            // -------------------------------------------------

            const enabled =
                Object.prototype.hasOwnProperty.call(
                    settings,
                    paperId
                )
                    ? settings[
                        paperId
                    ]?.enabled === true
                    : true;


            if (!enabled) {

                console.log(
                    "Hidden paper:",
                    paperId
                );

                continue;

            }


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
                    🏆
                </div>

                <h2>
                    TOP Ranking - ${paperNumber}
                </h2>

                <p>
                    Part A & Part B
                </p>

            `;


            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "grade11-model-paper.html" +
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


            paperContainer.appendChild(
                card
            );


            visibleCount++;

        }


        // =================================================
        // NO PAPERS
        // =================================================

        if (
            visibleCount === 0
        ) {

            paperContainer.innerHTML = `

                <div style="
                    grid-column:1/-1;
                    background:white;
                    border-radius:20px;
                    padding:50px 25px;
                    text-align:center;
                    box-shadow:0 10px 30px rgba(0,0,0,.08);
                ">

                    <div style="
                        font-size:50px;
                        margin-bottom:15px;
                    ">
                        🔒
                    </div>

                    <h2>
                        No TOP Ranking Papers Available
                    </h2>

                    <p style="
                        color:#64748b;
                    ">
                        Papers for this term are currently unavailable.
                    </p>

                </div>

            `;

        }


        console.log(
            "================================"
        );

        console.log(
            "✅ Grade 11 TOP Ranking Loaded"
        );

        console.log(
            "Term:",
            term
        );

        console.log(
            "Visible Papers:",
            visibleCount
        );

        console.log(
            "================================"
        );

    }

    catch (error) {

        console.error(
            "Grade 11 paper settings error:",
            error
        );


        paperContainer.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
            ">

                <h2>
                    ⚠️ Unable to Load
                </h2>

                <p>
                    ${error.message}
                </p>

                <button
                    type="button"
                    onclick="location.reload()"
                    style="
                        padding:12px 20px;
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


// =====================================================
// START
// =====================================================

loadPaperSettings();
