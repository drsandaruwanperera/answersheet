import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// ELEMENT
// =====================================================

const termGrid =
    document.getElementById(
        "termGrid"
    );


// =====================================================
// TERMS
// =====================================================

const terms = [

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
// LOAD TERMS
// =====================================================

async function loadTerms() {

    if (!termGrid) {
        return;
    }

    termGrid.innerHTML = `

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


        termGrid.innerHTML = "";


        let visibleTerms = 0;


        terms.forEach(
            term => {

                const settingId =
                    `grade11_term${term.number}_enabled`;


                const enabled =
                    Object.prototype.hasOwnProperty.call(
                        settings,
                        settingId
                    )
                        ? settings[settingId] === true
                        : true;


                // Disabled term = DON'T SHOW
                if (!enabled) {
                    return;
                }


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "term-card";


                card.style.cursor =
                    "pointer";


                card.innerHTML = `

                    <div class="term-icon">
                        🏆
                    </div>

                    <h2>
                        ${term.title}
                    </h2>

                    <p>
                        Grade 11 TOP Ranking
                    </p>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `grade11-term.html?term=${term.number}`;

                    }
                );


                termGrid.appendChild(
                    card
                );


                visibleTerms++;

            }
        );


        if (
            visibleTerms === 0
        ) {

            termGrid.innerHTML = `

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
                        TOP Ranking Papers Unavailable
                    </h2>

                    <p style="
                        color:#64748b;
                    ">
                        TOP Ranking Papers are currently unavailable.
                    </p>

                </div>

            `;

        }


        console.log(
            "✅ Grade 11 terms loaded",
            {
                visibleTerms
            }
        );

    }

    catch (error) {

        console.error(
            "Grade 11 terms load error:",
            error
        );


        termGrid.innerHTML = `

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

loadTerms();
