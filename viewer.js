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
// GET URL PARAMETERS
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const paper =
    params.get("paper");


const studentId =
    params.get("id");


const viewer =
    document.getElementById(
        "viewer"
    );


// =========================================
// BASIC VALIDATION
// =========================================

if (
    !viewer
) {

    console.error(
        "Viewer element not found."
    );

}


// =========================================
// VALID PAPER FORMAT
// =========================================
//
// Expected:
// paper01
// paper02
// ...
// paper10
//

const paperPattern =
    /^paper(0[1-9]|10)$/;


// =========================================
// LOAD PAPER
// =========================================

async function loadPaper() {

    // =====================================
    // CHECK PARAMETERS
    // =====================================

    if (
        !paper ||
        !studentId
    ) {

        alert(
            "Invalid paper request."
        );

        window.location.replace(
            "dashboard.html?id=" +
            encodeURIComponent(
                studentId || ""
            )
        );

        return;

    }


    // =====================================
    // CHECK PAPER NAME
    // =====================================

    if (
        !paperPattern.test(
            paper
        )
    ) {

        alert(
            "Invalid paper."
        );

        window.location.replace(
            "dashboard.html?id=" +
            encodeURIComponent(
                studentId
            )
        );

        return;

    }


    try {

        // =================================
        // STUDENT REFERENCE
        // =================================

        const studentRef =
            doc(
                db,
                "students",
                studentId
            );


        // =================================
        // GET STUDENT
        // =================================

        const studentSnap =
            await getDoc(
                studentRef
            );


        if (
            !studentSnap.exists()
        ) {

            alert(
                "Student not found."
            );

            window.location.replace(
                "index.html"
            );

            return;

        }


        const studentData =
            studentSnap.data();


        // =================================
        // PAPER PERMISSION
        // =================================

        const permissionField =
            paper;


        if (
            studentData[
                permissionField
            ] !== true
        ) {

            alert(
                "You do not have permission to view this paper."
            );

            window.location.replace(
                "dashboard.html?id=" +
                encodeURIComponent(
                    studentId
                )
            );

            return;

        }


        // =================================
        // VIEWED STATUS
        // =================================

        const viewedField =
            paper +
            "Viewed";


        if (
            studentData[
                viewedField
            ] === true
        ) {

            alert(
                "This paper has already been viewed."
            );

            window.location.replace(
                "dashboard.html?id=" +
                encodeURIComponent(
                    studentId
                )
            );

            return;

        }


        // =================================
        // NUMBER OF PAGES
        // =================================

        const pagesField =
            paper +
            "Pages";


        let totalPages =
            Number(
                studentData[
                    pagesField
                ]
            );


        // =================================
        // DEFAULT PAGES
        // =================================

        if (
            !Number.isInteger(
                totalPages
            ) ||
            totalPages <= 0
        ) {

            totalPages = 10;

        }


        console.log(
            "Paper:",
            paper
        );

        console.log(
            "Student:",
            studentId
        );

        console.log(
            "Pages:",
            totalPages
        );


        // =================================
        // MARK AS VIEWED
        // =================================

        await import(
            "./firebase.js"
        )
        .then(
            async ({
                updateDoc
            }) => {

                await updateDoc(
                    studentRef,
                    {
                        [viewedField]:
                            true
                    }
                );

            }
        );


        console.log(
            "✅ Paper marked as viewed:",
            viewedField
        );


        // =================================
        // CLEAR VIEWER
        // =================================

        if (
            viewer
        ) {

            viewer.innerHTML = "";

        }


        // =================================
        // CREATE PAPER PAGES
        // =================================

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            const pageNumber =
                String(i).padStart(
                    2,
                    "0"
                );


            // =================================
            // PAGE CONTAINER
            // =================================

            const page =
                document.createElement(
                    "div"
                );


            page.className =
                "page";


            // =================================
            // IMAGE
            // =================================

            const img =
                document.createElement(
                    "img"
                );


            /*
             * Current paper image structure:
             *
             * papers/
             *    paper01/
             *       paper01_Page_01.jpg
             *       paper01_Page_02.jpg
             *
             */


            img.src =
                `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;


            img.alt =
                `${paper} Page ${i}`;


            img.draggable =
                false;


            // =================================
            // IMAGE ERROR
            // =================================

            img.onerror =
                () => {

                    console.error(
                        "Image not found:",
                        img.src
                    );


                    img.style.display =
                        "none";


                    const errorMessage =
                        document.createElement(
                            "div"
                        );


                    errorMessage.className =
                        "page-error";


                    errorMessage.textContent =
                        `Page ${i} could not be loaded.`;


                    page.appendChild(
                        errorMessage
                    );

                };


            // =================================
            // WATERMARK
            // =================================

            const watermark =
                document.createElement(
                    "div"
                );


            watermark.className =
                "watermark";


            // =================================
            // WATERMARKS
            // =================================

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


            // =================================
            // ADD ELEMENTS
            // =================================

            page.appendChild(
                img
            );


            page.appendChild(
                watermark
            );


            if (
                viewer
            ) {

                viewer.appendChild(
                    page
                );

            }

        }


    }

    catch (
        error
    ) {

        console.error(
            "Paper loading error:",
            error
        );


        alert(
            "Failed to load paper. Please try again."
        );

    }

}


// =========================================
// START
// =========================================

loadPaper();


// =========================================
// DISABLE RIGHT CLICK
// =========================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE DRAGGING
// =========================================

document.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE COPY
// =========================================

document.addEventListener(
    "copy",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE CUT
// =========================================

document.addEventListener(
    "cut",
    event => {

        event.preventDefault();

    }
);


// =========================================
// DISABLE SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey ||
            event.metaKey
        ) {

            const key =
                event.key.toLowerCase();


            if (
                key === "s" ||
                key === "p" ||
                key === "c" ||
                key === "x" ||
                key === "u" ||
                key === "a"
            ) {

                event.preventDefault();

            }

        }


        // F12

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);
