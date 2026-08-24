// ============================================================
// A/L MODEL PAPERS
// ============================================================

import {
    db,
    doc,
    getDoc
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
// FIRESTORE REFERENCES
// ============================================================

const studentRef = studentId
    ? doc(db, "students", studentId)
    : null;

const settingsRef =
    doc(
        db,
        "paperSettings",
        "settings"
    );


// ============================================================
// PAPER ID HELPER
// ============================================================

function getPaperId(number) {

    return (
        "paper" +
        String(number).padStart(2, "0")
    );

}


function getSettingId(number) {

    return (
        "al_model_" +
        String(number).padStart(2, "0")
    );

}


// ============================================================
// GET BUTTON
// ============================================================

function getButton(number) {

    return document.getElementById(
        getPaperId(number)
    );

}


// ============================================================
// VIEWED CHECK
// ============================================================

function isViewed(
    studentData,
    paperId
) {

    return (
        studentData?.paperViews?.al?.model?.[paperId] === true
    );

}


// ============================================================
// SETTINGS CHECK
// ============================================================

function isEnabled(
    settings,
    number
) {

    const settingId =
        getSettingId(number);


    /*
     * Paper settings.js:
     *
     * al_model_01
     * al_model_02
     * ...
     *
     * New papers are enabled by default.
     */

    if (
        !Object.prototype.hasOwnProperty.call(
            settings,
            settingId
        )
    ) {

        return true;

    }


    return (
        settings[settingId]?.enabled === true
    );

}


// ============================================================
// UPDATE CARD
// ============================================================

function updateCard(
    number,
    status
) {

    const button =
        getButton(number);


    if (!button) {
        return;
    }


    button.classList.remove(
        "available",
        "viewed",
        "disabled"
    );


    const statusElement =
        button.querySelector(
            ".paper-status"
        );


    // ========================================================
    // AVAILABLE
    // ========================================================

    if (
        status === "available"
    ) {

        button.classList.add(
            "available"
        );

        button.disabled = false;

        if (statusElement) {

            statusElement.textContent =
                "🟢 Available";

        }

        return;
    }


    // ========================================================
    // VIEWED
    // ========================================================

    if (
        status === "viewed"
    ) {

        button.classList.add(
            "viewed"
        );

        button.disabled = true;

        if (statusElement) {

            statusElement.textContent =
                "🔵 Viewed";

        }

        return;
    }


    // ========================================================
    // DISABLED
    // ========================================================

    button.classList.add(
        "disabled"
    );

    button.disabled = true;

    if (statusElement) {

        statusElement.textContent =
            "🔒 Disabled";

    }

}


// ============================================================
// LOAD PAGE
// ============================================================

async function loadModelPapers() {

    console.log(
        "======================================"
    );

    console.log(
        "A/L MODEL PAPERS"
    );

    console.log(
        "Student:",
        studentId
    );

    console.log(
        "======================================"
    );


    let studentData = {};
    let settings = {};


    // ========================================================
    // GET STUDENT
    // ========================================================

    if (studentRef) {

        try {

            const snapshot =
                await getDoc(
                    studentRef
                );


            if (
                snapshot.exists()
            ) {

                studentData =
                    snapshot.data();

            }

        }

        catch (error) {

            console.error(
                "Student load error:",
                error
            );

        }

    }


    // ========================================================
    // GET PAPER SETTINGS
    // ========================================================

    try {

        const settingsSnapshot =
            await getDoc(
                settingsRef
            );


        if (
            settingsSnapshot.exists()
        ) {

            settings =
                settingsSnapshot.data() || {};

        }

    }

    catch (error) {

        console.error(
            "Paper settings load error:",
            error
        );

    }


    // ========================================================
    // UPDATE 01 - 10
    // ========================================================

    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const paperId =
            getPaperId(i);


        const enabled =
            isEnabled(
                settings,
                i
            );


        const viewed =
            isViewed(
                studentData,
                paperId
            );


        // Disabled by admin

        if (!enabled) {

            updateCard(
                i,
                "disabled"
            );

            continue;

        }


        // Already viewed

        if (viewed) {

            updateCard(
                i,
                "viewed"
            );

            continue;

        }


        // Available

        updateCard(
            i,
            "available"
        );

    }


    console.log(
        "✅ A/L Model Paper statuses loaded."
    );

}


// ============================================================
// OPEN PAPER
// ============================================================

async function openPaper(
    number
) {

    const paperId =
        getPaperId(number);


    console.log(
        "Opening:",
        paperId
    );


    // ========================================================
    // GET CURRENT STUDENT DATA
    // ========================================================

    let studentData = {};


    if (studentRef) {

        try {

            const snapshot =
                await getDoc(
                    studentRef
                );


            if (
                snapshot.exists()
            ) {

                studentData =
                    snapshot.data();

            }

        }

        catch (error) {

            console.error(
                "Student verification error:",
                error
            );


            alert(
                "Unable to verify your account. Please try again."
            );


            return;

        }

    }


    // ========================================================
    // CHECK VIEWED
    // ========================================================

    if (
        isViewed(
            studentData,
            paperId
        )
    ) {

        alert(
            `Model Paper ${String(number).padStart(2, "0")} has already been viewed.`
        );


        return;

    }


    // ========================================================
    // CHECK ADMIN SETTING
    // ========================================================

    let settings = {};


    try {

        const settingsSnapshot =
            await getDoc(
                settingsRef
            );


        if (
            settingsSnapshot.exists()
        ) {

            settings =
                settingsSnapshot.data() || {};

        }

    }

    catch (error) {

        console.error(
            "Settings verification error:",
            error
        );


        alert(
            "Unable to verify paper availability."
        );


        return;

    }


    const enabled =
        isEnabled(
            settings,
            number
        );


    if (!enabled) {

        alert(
            "This paper is currently unavailable."
        );


        return;

    }


    // ========================================================
    // OPEN VIEWER
    // ========================================================

    const url =
        "viewer.html" +
        "?paper=" +
        encodeURIComponent(
            paperId
        ) +
        "&id=" +
        encodeURIComponent(
            studentId || ""
        ) +
        "&type=al-model";


    console.log(
        "Viewer URL:",
        url
    );


    window.location.href =
        url;

}


// ============================================================
// GLOBAL FUNCTION
// ============================================================
//
// Kept for your existing HTML:
// onclick="openPaper(1)"
//

window.openPaper =
    openPaper;


// ============================================================
// INITIAL LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadModelPapers();

    }
);


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "🟢 A/L Model Papers JS loaded."
);
