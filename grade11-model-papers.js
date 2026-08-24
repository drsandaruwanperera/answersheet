import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const termGrid =
    document.getElementById("termGrid");


// =====================================================
// TERMS
// =====================================================

const TERMS = [
    {
        number: "1",
        title: "1st Term"
    },
    {
        number: "2",
        title: "2nd Term"
    },
    {
        number: "3",
        title: "3rd Term"
    }
];


// =====================================================
// FIRESTORE SETTINGS
// =====================================================

const SETTINGS_REF =
    doc(
        db,
        "paperSettings",
        "settings"
    );


// =====================================================
// GET SETTINGS
// =====================================================

async function getPaperSettings() {

    try {

        const snapshot =
            await getDoc(
                SETTINGS_REF
            );

        if (
            snapshot.exists()
        ) {

            return (
                snapshot.data() || {}
            );

        }

        return {};

    }

    catch (error) {

        console.error(
            "Failed to load paper settings:",
            error
        );

        throw error;

    }

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


    /*
     * IMPORTANT:
     *
     * true  = Active
     * false = Disabled
     *
     * If field does not exist,
     * keep it Active for backward compatibility.
     */

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            field
        )
    ) {

        return true;

    }


    return (
        settings[field] === true
    );

}


// =====================================================
// SHOW LOADING
// =====================================================

function showLoading() {

    if (!termGrid) {
        return;
    }


    termGrid.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:#64748b;
                font-size:16px;
            "
        >

            Loading...

        </div>

    `;

}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(
    error
) {

    if (!termGrid) {
        return;
    }


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
                    font-size:45px;
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
                "
            >
                ${escapeHTML(
                    error?.message ||
                    "Unable to load paper settings."
                )}
            </p>


            <button
                type="button"
                id="retryBtn"
                style="
                    margin-top:15px;
                    padding:12px 20px;
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
            loadTerms
        );

    }

}


// =====================================================
// SHOW EMPTY
// =====================================================

function showAllDisabled() {

    if (!termGrid) {
        return;
    }


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


            <h2>
                TOP Ranking Papers Unavailable
            </h2>


            <p
                style="
                    color:#64748b;
                "
            >
                TOP Ranking Papers are currently unavailable.
            </p>

        </div>

    `;

}


// =====================================================
// CREATE TERM CARD
// =====================================================

function createTermCard(
    term
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "term-card";


    card.dataset.term =
        term.number;


    card.style.cursor =
        "pointer";


    card.innerHTML = `

        <div class="term-icon">
            🏆
        </div>


        <h2>
            ${escapeHTML(
                term.title
            )}
        </h2>


        <p>
            Grade 11 TOP Ranking Papers
        </p>

    `;


    card.addEventListener(
        "click",
        () => {

            /*
             * Always use the same
             * term number that was
             * checked against Firestore.
             */

            window.location.href =
                `grade11-term.html?term=${encodeURIComponent(
                    term.number
                )}`;

        }
    );


    return card;

}


// =====================================================
// RENDER TERMS
// =====================================================

function renderTerms(
    settings
) {

    if (!termGrid) {

        console.error(
            "termGrid not found."
        );

        return;

    }


    termGrid.innerHTML = "";


    let enabledCount =
        0;


    TERMS.forEach(
        term => {

            const enabled =
                isTermEnabled(
                    settings,
                    term.number
                );


            console.log(
                `Grade 11 ${term.title}:`,
                enabled
                    ? "ACTIVE"
                    : "DISABLED"
            );


            /*
             * DISABLED TERM
             * ----------------
             * Do NOT render the card.
             */

            if (!enabled) {

                return;

            }


            const card =
                createTermCard(
                    term
                );


            termGrid.appendChild(
                card
            );


            enabledCount++;

        }
    );


    if (
        enabledCount === 0
    ) {

        showAllDisabled();

    }

}


// =====================================================
// LOAD TERMS
// =====================================================

async function loadTerms() {

    showLoading();


    try {

        const settings =
            await getPaperSettings();


        console.log(
            "GRADE 11 PAPER SETTINGS:",
            settings
        );


        renderTerms(
            settings
        );

    }

    catch (error) {

        console.error(
            "Grade 11 TOP Ranking error:",
            error
        );


        showError(
            error
        );

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

if (
    termGrid
) {

    loadTerms();

}
else {

    console.error(
        "❌ #termGrid was not found."
    );

}


console.log(
    "✅ Grade 11 TOP Ranking JS loaded"
);
