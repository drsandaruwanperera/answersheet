import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =====================================================
// LOGIN CHECK
// =====================================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =====================================================
// STUDENT ID
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const studentId =
    params.get("id") ||
    sessionStorage.getItem(
        "studentId"
    );


if (
    studentId
) {

    sessionStorage.setItem(
        "studentId",
        studentId
    );

}


// =====================================================
// LOAD MODEL PAPERS
// =====================================================

async function loadModelPapers() {

    if (
        !studentId
    ) {

        alert(
            "Student ID not found. Please login again."
        );

        window.location.replace(
            "index.html"
        );

        return;

    }


    try {

        // =================================================
        // GET STUDENT
        // =================================================

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        const snap =
            await getDoc(
                studentRef
            );


        if (
            !snap.exists()
        ) {

            alert(
                "Student account not found."
            );

            window.location.replace(
                "index.html"
            );

            return;

        }


        const data =
            snap.data();


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
            "Student data:",
            data
        );

        console.log(
            "======================================"
        );


        // =================================================
        // PAPERS 01 - 10
        // =================================================

        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const number =
                String(
                    i
                ).padStart(
                    2,
                    "0"
                );


            const permissionField =
                "paper" +
                number;


            const viewedField =
                permissionField +
                "Viewed";


            const btn =
                document.getElementById(
                    permissionField
                );


            if (
                !btn
            ) {

                console.warn(
                    "Button not found:",
                    permissionField
                );

                continue;

            }


            // =================================================
            // IMPORTANT
            // =================================================
            //
            // Missing paper permission = AVAILABLE
            //
            // false = HIDDEN
            // true = AVAILABLE
            //
            // This prevents old A/L student records
            // from hiding every paper.
            // =================================================

            const enabled =
                Object.prototype.hasOwnProperty.call(
                    data,
                    permissionField
                )
                    ? data[
                        permissionField
                    ] === true
                    : true;


            // =================================================
            // HIDDEN
            // =================================================

            if (
                !enabled
            ) {

                btn.style.display =
                    "none";

                continue;

            }


            // =================================================
            // SHOW
            // =================================================

            btn.style.display =
                "flex";


            btn.disabled =
                false;


            btn.className =
                "available";


            // =================================================
            // VIEWED STATUS
            // =================================================

            const viewed =
                data[
                    viewedField
                ] === true;


            if (
                viewed
            ) {

                btn.innerHTML = `
                    📘 Model Paper ${number}
                    <small>🔵 Viewed</small>
                `;

            }

            else {

                btn.innerHTML = `
                    📘 Model Paper ${number}
                    <small>🟢 Available</small>
                `;

            }


            // =================================================
            // CLICK
            // =================================================

            btn.onclick =
                () => {

                    openPaper(
                        i
                    );

                };


            console.log(
                `Paper ${number}:`,
                {
                    enabled,
                    viewed
                }
            );

        }


        console.log(
            "✅ A/L Model Papers loaded"
        );

    }

    catch (
        error
    ) {

        console.error(
            "A/L Model Papers Error:",
            error
        );


        alert(
            "Failed to load Model Papers."
        );

    }

}


// =====================================================
// OPEN PAPER
// =====================================================

function openPaper(
    paperNumber
) {

    if (
        !studentId
    ) {

        alert(
            "Student ID not found. Please login again."
        );

        window.location.replace(
            "index.html"
        );

        return;

    }


    const number =
        String(
            paperNumber
        ).padStart(
            2,
            "0"
        );


    const paper =
        "paper" +
        number;


    console.log(
        "Opening A/L Model Paper:",
        paper
    );


    // =================================================
    // VIEWER
    // =================================================

    const url =
        "viewer.html?" +
        "paper=" +
        encodeURIComponent(
            paper
        ) +
        "&id=" +
        encodeURIComponent(
            studentId
        ) +
        "&type=al-model";


    window.location.href =
        url;

}


// =====================================================
// GLOBAL FUNCTION
// =====================================================

window.openPaper =
    openPaper;


// =====================================================
// START
// =====================================================

loadModelPapers();
