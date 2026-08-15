import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";


// =========================================
// CHECK LOGIN
// =========================================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {
    window.location.replace("index.html");
}


// =========================================
// GET STUDENT ID
// =========================================
//
// First try URL:
// model-papers.html?id=26000
//
// If URL has no ID, use login session.
//

const params =
    new URLSearchParams(
        window.location.search
    );


const studentId =
    params.get("id") ||
    sessionStorage.getItem("studentId");


// =========================================
// SAVE ID TO SESSION
// =========================================

if (studentId) {

    sessionStorage.setItem(
        "studentId",
        studentId
    );

}


// =========================================
// LOAD MODEL PAPERS
// =========================================

async function loadModelPapers() {

    if (!studentId) {

        alert(
            "Student ID not found. Please login again."
        );

        sessionStorage.clear();

        window.location.replace(
            "index.html"
        );

        return;
    }


    try {

        // =====================================
        // STUDENT REFERENCE
        // =====================================

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        // =====================================
        // GET STUDENT
        // =====================================

        const snap =
            await getDoc(
                studentRef
            );


        if (!snap.exists()) {

            console.error(
                "Student document not found:",
                studentId
            );

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
            "✅ Model Papers loaded for:",
            studentId
        );


        // =====================================
        // LOAD PAPERS
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
                "paper" + number;


            const viewedField =
                permissionField +
                "Viewed";


            const btn =
                document.getElementById(
                    permissionField
                );


            if (!btn) {
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
            // PERMISSION AVAILABLE
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


                btn.onclick = null;


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


            // =================================
            // CLICK
            // =================================

            btn.onclick =
                () => openPaper(i);

        }

    }
    catch (error) {

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

async function openPaper(
    paperNumber
) {

    if (!studentId) {

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


    const permissionField =
        "paper" + number;


    const viewedField =
        permissionField +
        "Viewed";


    try {

        // =====================================
        // GET STUDENT
        // =====================================

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

            return;
        }


        const data =
            snap.data();


        // =====================================
        // CHECK PERMISSION
        // =====================================

        if (
            data[
                permissionField
            ] !== true
        ) {

            alert(
                "You do not have permission to view this paper."
            );

            return;
        }


        // =====================================
        // CHECK VIEWED
        // =====================================

        if (
            data[
                viewedField
            ] === true
        ) {

            alert(
                "This Model Paper has already been viewed."
            );

            return;
        }


        // =====================================
        // MARK AS VIEWED
        // =====================================

        await updateDoc(
            studentRef,
            {
                [viewedField]:
                    true
            }
        );


        console.log(
            "✅ Marked as viewed:",
            viewedField
        );


        // =====================================
        // OPEN VIEWER
        // =====================================

        window.location.replace(
            "viewer.html?paper=" +
            encodeURIComponent(
                permissionField
            ) +
            "&id=" +
            encodeURIComponent(
                studentId
            )
        );

    }
    catch (error) {

        console.error(
            "Open Paper Error:",
            error
        );


        alert(
            "Unable to open this paper."
        );

    }

}


// =========================================
// MAKE FUNCTION AVAILABLE
// =========================================

window.openPaper =
    openPaper;


// =========================================
// START
// =========================================

loadModelPapers();
