import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const term =
    params.get("term");


const paper =
    params.get("paper");


const type =
    params.get("type");


// =====================================================
// ELEMENTS
// =====================================================

const answerTitle =
    document.getElementById(
        "answerTitle"
    );


const answerContainer =
    document.getElementById(
        "answerContainer"
    );


// =====================================================
// LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem(
        "loggedIn"
    ) !== "true"
) {

    window.location.replace(
        "index.html"
    );

    throw new Error(
        "Student not logged in."
    );

}


// =====================================================
// STUDENT ID
// =====================================================

const studentId =
    sessionStorage.getItem(
        "studentId"
    ) || "";


// =====================================================
// VALIDATE TERM
// =====================================================

if (
    ![
        "1",
        "2",
        "3"
    ].includes(
        term
    )
) {

    alert(
        "Invalid term."
    );


    window.location.replace(
        "grade10-model-papers.html"
    );


    throw new Error(
        "Invalid term."
    );

}


// =====================================================
// VALIDATE PAPER
// =====================================================

const paperNumber =
    Number(
        paper
    );


if (
    !Number.isInteger(
        paperNumber
    ) ||
    paperNumber < 1 ||
    paperNumber > 99
) {

    alert(
        "Invalid paper."
    );


    window.location.replace(
        `grade10-term.html?term=${encodeURIComponent(
            term
        )}`
    );


    throw new Error(
        "Invalid paper."
    );

}


// =====================================================
// PAPER FORMAT
// =====================================================

const paperFolder =
    `paper${String(
        paperNumber
    ).padStart(
        2,
        "0"
    )}`;


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


const termName =
    termNames[
        term
    ];


// =====================================================
// ANSWER TYPE
// =====================================================

let answerFolder = "";

let pageTitle = "";


if (
    type === "mcq"
) {

    answerFolder =
        "mcq-answer";

    pageTitle =
        "📝 MCQ Answer";

}

else if (
    type === "answer"
) {

    answerFolder =
        "answer";

    pageTitle =
        "📝 Answer Scheme";

}

else {

    alert(
        "Invalid answer type."
    );


    window.location.replace(
        `grade10-term.html?term=${encodeURIComponent(
            term
        )}`
    );


    throw new Error(
        "Invalid answer type."
    );

}


// =====================================================
// SET TITLE
// =====================================================

if (
    answerTitle
) {

    answerTitle.textContent =
        `${pageTitle} - ${termName} - Paper ${String(
            paperNumber
        ).padStart(
            2,
            "0"
        )}`;

}


// =====================================================
// FIRESTORE SETTINGS
// =====================================================

async function getPaperSettings() {

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

        return {};

    }


    return (
        snapshot.data() || {}
    );

}


// =====================================================
// CHECK TERM
// =====================================================

function isTermEnabled(
    settings
) {

    const termSettingId =
        `grade10_term${term}_enabled`;


    // No setting = active

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            termSettingId
        )
    ) {

        return true;

    }


    return (
        settings[
            termSettingId
        ] === true
    );

}


// =====================================================
// CHECK PAPER
// =====================================================

function isPaperEnabled(
    settings
) {

    const paperSettingId =
        `grade10_term${term}_model_${paperFolder.replace(
            "paper",
            ""
        )}`;


    // No setting = active

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            paperSettingId
        )
    ) {

        return true;

    }


    return (
        settings[
            paperSettingId
        ]?.enabled === true
    );

}


// =====================================================
// SHOW NOT AVAILABLE
// =====================================================

function showNotAvailable(
    title,
    message
) {

    if (
        !answerContainer
    ) {

        return;

    }


    answerContainer.innerHTML = `

        <div
            class="no-answer"
            style="
                background:#fff;
                padding:45px 25px;
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
                ${escapeHTML(title)}
            </h2>


            <p
                style="
                    color:#64748b;
                    line-height:1.6;
                "
            >
                ${escapeHTML(message)}
            </p>


            <button
                type="button"
                id="backBtn"
                style="
                    margin-top:20px;
                    padding:12px 24px;
                    border:0;
                    border-radius:10px;
                    background:#6d35f2;
                    color:white;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                ← Back
            </button>

        </div>

    `;


    const backBtn =
        document.getElementById(
            "backBtn"
        );


    if (
        backBtn
    ) {

        backBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    `grade10-term.html?term=${encodeURIComponent(
                        term
                    )}`;

            }
        );

    }

}


// =====================================================
// IMAGE FOLDER
// =====================================================

const imageFolder =
    `papers/grade10/term${term}/${paperFolder}/${answerFolder}/`;


// =====================================================
// LOAD ANSWER IMAGES
// =====================================================

let pageNumber =
    1;


let loadedPages =
    0;


// =====================================================
// LOAD NEXT PAGE
// =====================================================

function loadNextPage() {

    const number =
        String(
            pageNumber
        ).padStart(
            2,
            "0"
        );


    const imagePath =
        `${imageFolder}Page_${number}.jpg`;


    console.log(
        "Trying image:",
        imagePath
    );


    const img =
        document.createElement(
            "img"
        );


    img.src =
        imagePath;


    img.alt =
        `${termName} Model Paper ${paperFolder} ${pageTitle} Page ${pageNumber}`;


    img.draggable =
        false;


    // =================================================
    // IMAGE SUCCESS
    // =================================================

    img.onload =
        function () {

            const page =
                document.createElement(
                    "div"
                );


            page.className =
                "answer-page";


            // =========================================
            // WATERMARK
            // =========================================

            const watermark =
                document.createElement(
                    "div"
                );


            watermark.className =
                "watermark";


            for (
                let w = 0;
                w < 20;
                w++
            ) {

                const mark =
                    document.createElement(
                        "span"
                    );


                mark.textContent =
                    studentId;


                watermark.appendChild(
                    mark
                );

            }


            // =========================================
            // IMAGE
            // =========================================

            page.appendChild(
                img
            );


            page.appendChild(
                watermark
            );


            answerContainer.appendChild(
                page
            );


            loadedPages++;


            pageNumber++;


            loadNextPage();

        };


    // =================================================
    // IMAGE NOT FOUND
    // =================================================

    img.onerror =
        function () {

            console.log(
                "Image not found:",
                imagePath
            );


            img.remove();


            // =========================================
            // NO PAGES AT ALL
            // =========================================

            if (
                loadedPages === 0
            ) {

                showNotAvailable(
                    "Answer Not Available",
                    `No answer images were found for ${termName}, ${paperFolder}.`
                );

            }

        };

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
// INITIALIZE
// =====================================================

async function init() {

    try {

        if (
            !answerContainer
        ) {

            throw new Error(
                "answerContainer not found."
            );

        }


        answerContainer.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                "
            >
                Loading answer...
            </div>

        `;


        // =============================================
        // GET SETTINGS
        // =============================================

        const settings =
            await getPaperSettings();


        // =============================================
        // CHECK WHOLE TERM
        // =============================================

        if (
            !isTermEnabled(
                settings
            )
        ) {

            showNotAvailable(
                `${termName} Disabled`,
                "This term has been disabled by the administrator."
            );

            return;

        }


        // =============================================
        // CHECK PAPER
        // =============================================

        if (
            !isPaperEnabled(
                settings
            )
        ) {

            showNotAvailable(
                "Paper Disabled",
                "This paper has been disabled by the administrator."
            );

            return;

        }


        // =============================================
        // CLEAR LOADING
        // =============================================

        answerContainer.innerHTML =
            "";


        // =============================================
        // LOAD IMAGES
        // =============================================

        loadNextPage();


        console.log(
            "======================================"
        );


        console.log(
            "✅ Grade 10 Answer Viewer Loaded"
        );


        console.log(
            "Term:",
            term
        );


        console.log(
            "Paper:",
            paperFolder
        );


        console.log(
            "Type:",
            type
        );


        console.log(
            "Folder:",
            imageFolder
        );


        console.log(
            "======================================"
        );

    }

    catch (error) {

        console.error(
            "Answer viewer error:",
            error
        );


        showNotAvailable(
            "Unable to Load Answer",
            error.message ||
            String(error)
        );

    }

}


// =====================================================
// PROTECTION
// =====================================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


document.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


document.addEventListener(
    "copy",
    event => {

        event.preventDefault();

    }
);


document.addEventListener(
    "cut",
    event => {

        event.preventDefault();

    }
);


document.addEventListener(
    "selectstart",
    event => {

        event.preventDefault();

    }
);


document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            event.ctrlKey ||
            event.metaKey
        ) {

            if (
                [
                    "s",
                    "p",
                    "c",
                    "x",
                    "u",
                    "a"
                ].includes(
                    key
                )
            ) {

                event.preventDefault();

            }

        }


        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);


// =====================================================
// START
// =====================================================

init();
