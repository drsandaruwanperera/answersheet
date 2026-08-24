// =====================================================
// FIREBASE
// =====================================================

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
// VALIDATE TERM
// =====================================================

if (
    !["1", "2", "3"].includes(term)
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
// SET TITLE
// =====================================================

if (termTitle) {

    termTitle.textContent =
        "🏆 Grade 11 - " +
        termNames[term];

}


// =====================================================
// FIRESTORE SETTINGS
// =====================================================

async function loadTermSettings() {

    try {

        // ---------------------------------------------
        // SHOW LOADING
        // ---------------------------------------------

        if (paperContainer) {

            paperContainer.innerHTML = `

                <div
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:50px 20px;
                        color:#64748b;
                    "
                >

                    <div
                        style="
                            font-size:40px;
                            margin-bottom:12px;
                        "
                    >
                        ⏳
                    </div>

                    <h2>
                        Loading...
                    </h2>

                    <p>
                        Checking TOP Ranking availability.
                    </p>

                </div>

            `;

        }


        // ---------------------------------------------
        // FIRESTORE DOCUMENT
        // ---------------------------------------------

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
                ? snapshot.data()
                : {};


        console.log(
            "================================"
        );

        console.log(
            "GRADE 11 TOP RANKING SETTINGS"
        );

        console.log(
            "Term:",
            term
        );

        console.log(
            "Term Name:",
            termNames[term]
        );

        console.log(
            "Settings:",
            settings
        );


        // ---------------------------------------------
        // TERM SETTING ID
        // ---------------------------------------------

        const settingId =
            `grade11_term${term}_enabled`;


        // ---------------------------------------------
        // CHECK TERM STATUS
        // ---------------------------------------------
        //
        // true  = Active
        // false = Disabled
        // missing = Active by default
        //
        // ---------------------------------------------

        const termEnabled =
            Object.prototype.hasOwnProperty.call(
                settings,
                settingId
            )
                ? settings[settingId] === true
                : true;


        console.log(
            "Setting ID:",
            settingId
        );

        console.log(
            "Term Enabled:",
            termEnabled
        );


        console.log(
            "================================"
        );


        // =================================================
        // TERM DISABLED
        // =================================================

        if (!termEnabled) {

            showDisabledMessage();

            return;

        }


        // =================================================
        // TERM ACTIVE
        // =================================================

        createTopRankingPapers();

    }

    catch (error) {

        console.error(
            "Failed to load Grade 11 TOP Ranking settings:",
            error
        );


        if (paperContainer) {

            paperContainer.innerHTML = `

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
                        ⚠️
                    </div>


                    <h2>
                        Unable to Load
                    </h2>


                    <p
                        style="
                            color:#64748b;
                            margin-bottom:20px;
                        "
                    >
                        Unable to check TOP Ranking
                        availability.
                    </p>


                    <button
                        type="button"
                        id="retryBtn"
                        style="
                            padding:12px 22px;
                            border:0;
                            border-radius:10px;
                            background:#6d35f2;
                            color:white;
                            cursor:pointer;
                            font-weight:600;
                        "
                    >
                        🔄 Try Again
                    </button>

                </div>

            `;


            const retryBtn =
                document.getElementById(
                    "retryBtn"
                );


            if (retryBtn) {

                retryBtn.addEventListener(
                    "click",
                    () => {

                        loadTermSettings();

                    }
                );

            }

        }

    }

}


// =====================================================
// SHOW DISABLED MESSAGE
// =====================================================

function showDisabledMessage() {

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                background:white;
                border-radius:20px;
                padding:55px 25px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
            "
        >

            <div
                style="
                    font-size:55px;
                    margin-bottom:15px;
                "
            >
                🔒
            </div>


            <h2>
                TOP Ranking Unavailable
            </h2>


            <p
                style="
                    color:#64748b;
                    margin-top:10px;
                    margin-bottom:25px;
                "
            >
                ${termNames[term]} TOP Ranking Papers
                are currently unavailable.
            </p>


            <button
                type="button"
                id="backToTermsBtn"
                style="
                    padding:12px 24px;
                    border:0;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                ← Back to TOP Ranking
            </button>

        </div>

    `;


    const backButton =
        document.getElementById(
            "backToTermsBtn"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                window.location.replace(
                    "grade11-model-papers.html"
                );

            }
        );

    }

}


// =====================================================
// CREATE TOP RANKING PAPERS
// =====================================================

function createTopRankingPapers() {

    if (!paperContainer) {
        return;
    }


    paperContainer.innerHTML =
        "";


    // ---------------------------------------------
    // CREATE 4 PAPERS
    // ---------------------------------------------

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const paperNumber =
            String(i).padStart(
                2,
                "0"
            );


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


        // ---------------------------------------------
        // CLICK
        // ---------------------------------------------

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

    }


    console.log(
        "✅ TOP Ranking papers created:",
        termNames[term]
    );

}


// =====================================================
// START
// =====================================================

loadTermSettings();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "================================"
);

console.log(
    "✅ Grade 11 TOP Ranking JS Loaded"
);

console.log(
    "Term:",
    term
);

console.log(
    "Term Name:",
    termNames[term]
);

console.log(
    "================================"
);
