import {
    db,
    doc,
    getDoc
} from "./firebase.js";


// =========================================
// CHECK LOGIN
// =========================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.replace(
        "index.html"
    );

}


// =========================================
// GET STUDENT ID
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const studentId =
    params.get("id") ||
    sessionStorage.getItem("studentId");


if (
    studentId
) {

    sessionStorage.setItem(
        "studentId",
        studentId
    );

}


// =========================================
// LOAD MODEL PAPERS
// =========================================

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


        // =====================================
        // PAPERS 01 - 10
        // =====================================

        for (
            let i = 1;
            i <= 10;
            i++
        ) {

            const number =
                String(i).padStart(
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

                continue;

            }


            // =================================
            // NO PERMISSION
            // =================================

            if (
                data[
                    permissionField
                ] !== true
            ) {

                btn.style.display =
                    "none";

                continue;

            }


            // =================================
            // SHOW PAPER
            // =================================

            btn.style.display =
                "block";


            // =================================
            // ALREADY VIEWED
            // =================================

            if (
                data[
                    viewedField
                ] === true
            ) {

                btn.className =
                    "viewed";


                btn.innerHTML = `
                    📘 Model Paper ${number}
                    <small>🔒 Viewed</small>
                `;


                btn.onclick =
                    null;


                continue;

            }


            // =================================
            // AVAILABLE
            // =================================

            btn.className =
                "available";


            btn.innerHTML = `
                📘 Model Paper ${number}
                <small>🟢 Available</small>
            `;


            btn.onclick =
                () => {

                    openPaper(
                        i
                    );

                };

        }

    }

    catch (
        error
    ) {

        console.error(
            "Model Papers Error:",
            error
        );


        alert(
            "Failed to load Model Papers."
        );

    }

}


// =========================================
// OPEN PAPER
// =========================================
//
// IMPORTANT:
// Do NOT mark Viewed here.
//
// viewer.js will mark it as viewed.
//

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


    window.location.replace(
        "viewer.html?paper=" +
        encodeURIComponent(
            paper
        ) +
        "&id=" +
        encodeURIComponent(
            studentId
        )
    );

}


// =========================================
// MAKE AVAILABLE
// =========================================

window.openPaper =
    openPaper;


// =========================================
// START
// =========================================

loadModelPapers();
