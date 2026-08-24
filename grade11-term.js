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
// VALIDATE TERM
// =====================================================

if (
    !["1", "2", "3"].includes(term)
) {

    alert(
        "Invalid term."
    );

    window.location.href =
        "grade11-model-papers.html";

    throw new Error(
        "Invalid Grade 11 term."
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

if (termTitle) {

    termTitle.textContent =
        "🏆 Grade 11 - " +
        termNames[term];

}


// =====================================================
// LOAD PAPERS
// =====================================================

async function loadPapers() {

    try {

        // =================================================
        // LOADING
        // =================================================

        if (paperContainer) {

            paperContainer.innerHTML = `

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

        }


        // =================================================
        // FIRESTORE SETTINGS
        // =================================================

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
            "GRADE 11 PAPER SETTINGS"
        );

        console.log(
            settings
        );

        console.log(
            "================================"
        );


        // =================================================
        // CHECK TERM ENABLE / DISABLE
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


        console.log(
            "Term:",
            term
        );

        console.log(
            "Term setting:",
            termSettingId
        );

        console.log(
            "Term enabled:",
            termEnabled
        );


        // =================================================
        // TERM DISABLED
        // =================================================

        if (!termEnabled) {

            showUnavailable(
                "This term is currently unavailable."
            );

            return;

        }


        // =================================================
        // CLEAR CONTAINER
        // =================================================

        paperContainer.innerHTML = "";


        let count = 0;


        // =================================================
        // TOP RANKING PAPERS
        // 01 - 04
        // =================================================

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


            // ---------------------------------------------
            // Firestore field
            //
            // Example:
            //
            // grade11_term3_top_01_enabled
            // grade11_term3_top_02_enabled
            // grade11_term3_top_03_enabled
            // grade11_term3_top_04_enabled
            // ---------------------------------------------

            const paperSettingId =
                `grade11_term${term}_top_${paperNumber}_enabled`;


            // =================================================
            // CHECK PAPER STATUS
            // =================================================

            const enabled =
                Object.prototype.hasOwnProperty.call(
                    settings,
                    paperSettingId
                )
                    ? settings[
                        paperSettingId
                    ] === true
                    : true;


            console.log(
                "Paper:",
                paperNumber,
                "| Setting:",
                paperSettingId,
                "| Enabled:",
                enabled
            );


            // =================================================
            // DISABLED PAPER
            // =================================================

            if (!enabled) {

                continue;

            }


            // =================================================
            // CREATE CARD
            // =================================================

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


            // =================================================
            // CARD CLICK
            // =================================================

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


            // =================================================
            // ADD CARD
            // =================================================

            paperContainer.appendChild(
                card
            );


            count++;

        }


        // =================================================
        // NO PAPERS
        // =================================================

        if (count === 0) {

            showUnavailable(
                "There are currently no TOP Ranking papers available for this term."
            );

        }


        console.log(
            "Available papers:",
            count
        );

    }

    catch (error) {

        console.error(
            "Grade 11 papers load error:",
            error
        );


        showUnavailable(
            "Unable to load papers. Please try again."
        );

    }

}


// =====================================================
// UNAVAILABLE MESSAGE
// =====================================================

function showUnavailable(
    message
) {

    if (!paperContainer) {

        return;

    }


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
                🔒
            </div>


            <h2>
                TOP Ranking Papers Unavailable
            </h2>


            <p
                style="
                    color:#64748b;
                "
            >
                ${message}
            </p>

        </div>

    `;

}


// =====================================================
// START
// =====================================================

loadPapers();


// =====================================================
// CONSOLE
// =====================================================

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
    "Term Name:",
    termNames[term]
);

console.log(
    "================================"
);
