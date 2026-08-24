import {
    db,
    doc,
    updateDoc
} from "./firebase.js";


// ============================================================
// LOGIN CHECK
// ============================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


// ============================================================
// STUDENT ID
// ============================================================

const studentId =
    sessionStorage.getItem("studentId");


// ============================================================
// STUDENT TYPE
// ============================================================

const sessionType =
    String(
        sessionStorage.getItem("studentType") || ""
    )
    .toLowerCase()
    .trim();


// ============================================================
// A/L STUDENT CHECK
// ============================================================

const allowedTypes = [
    "al",
    "a/l",
    "a level",
    "advanced",
    "advanced level"
];

if (!allowedTypes.includes(sessionType)) {

    alert(
        "Province Papers are available only for A/L students."
    );

    window.location.replace(
        "dashboard.html"
    );
}


// ============================================================
// GET PROVINCE FROM URL
// ============================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const province =
    String(
        params.get("province") || ""
    )
    .toLowerCase()
    .trim();


// ============================================================
// PROVINCE DATA
// ============================================================

const provinceMap = {

    "central": {
        name: "Central Province",
        paper: "paper01"
    },

    "western": {
        name: "Western Province",
        paper: "paper02"
    },

    "north-western": {
        name: "North Western Province",
        paper: "paper03"
    },

    "southern": {
        name: "Southern Province",
        paper: "paper04"
    },

    "sabaragamuwa": {
        name: "Sabaragamuwa Province",
        paper: "paper05"
    }

};


// ============================================================
// FIND PROVINCE
// ============================================================

const data =
    provinceMap[province];


// ============================================================
// INVALID PROVINCE
// ============================================================

if (!data) {

    alert("Invalid province.");

    window.location.replace(
        "province-paper1.html"
    );
}


// ============================================================
// ELEMENTS
// ============================================================

const title =
    document.getElementById(
        "provinceTitle"
    );

const container =
    document.getElementById(
        "paperContainer"
    );


// ============================================================
// SET TITLE
// ============================================================

if (title && data) {

    title.textContent =
        data.name;

}


// ============================================================
// TRACK PAPER VIEW
// ============================================================

async function trackProvincePaper() {

    if (!studentId) {

        console.warn(
            "Student ID not found."
        );

        return;
    }


    try {

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        const fieldPath =
            `paperViews.al.province.paper1.${province}`;


        await updateDoc(
            studentRef,
            {
                [fieldPath]: true
            }
        );


        console.log(
            "Province Paper 1 tracked:",
            fieldPath
        );

    } catch (error) {

        console.error(
            "Province Paper tracking error:",
            error
        );

    }

}


// ============================================================
// SHOW PAPER CARD
// ============================================================

if (
    container &&
    data
) {

    container.innerHTML = `

        <div class="paper-card">

            <h2>
                📁 ${data.name}
            </h2>

            <p>
                A/L Province Wise 1st Paper
            </p>

            <div class="button-grid">

                <button
                    class="paper-btn"
                    id="provincePaperBtn"
                    type="button"
                >
                    📄 MCQ Paper
                </button>

                <button
                    class="answer-btn"
                    id="provinceAnswerBtn"
                    type="button"
                >
                    📝 MCQ Answer Scheme
                </button>

            </div>

        </div>

    `;


    // ========================================================
    // MCQ PAPER BUTTON
    // ========================================================

    const paperBtn =
        document.getElementById(
            "provincePaperBtn"
        );


    if (paperBtn) {

        paperBtn.addEventListener(
            "click",
            async () => {

                await trackProvincePaper();


                // --------------------------------------------
                // EXACT GITHUB PAGES PATH
                // --------------------------------------------

                const paperUrl =
                    `papers/past/${data.paper}/mcq.pdf`;


                console.log(
                    "Opening Province Paper:",
                    paperUrl
                );


                window.open(
                    paperUrl,
                    "_blank"
                );

            }
        );

    }


    // ========================================================
    // ANSWER SCHEME BUTTON
    // ========================================================

    const answerBtn =
        document.getElementById(
            "provinceAnswerBtn"
        );


    if (answerBtn) {

        answerBtn.addEventListener(
            "click",
            () => {

                const paperNumber =
                    data.paper.replace(
                        "paper",
                        ""
                    );


                const answerUrl =
                    `answer-images.html?` +
                    `paper=${encodeURIComponent(
                        paperNumber
                    )}` +
                    `&type=mcq`;


                console.log(
                    "Opening Answer Scheme:",
                    answerUrl
                );


                window.location.href =
                    answerUrl;

            }
        );

    }

}


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "Province Paper 1 initialized:",
    {
        province: province,
        provinceName: data?.name,
        paper: data?.paper,
        paperPath:
            data
                ? `papers/past/${data.paper}/mcq.pdf`
                : null,
        studentId: studentId,
        studentType: sessionType
    }
);
