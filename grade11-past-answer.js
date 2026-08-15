// ==========================
// Get URL Parameters
// ==========================

const params =
    new URLSearchParams(
        window.location.search
    );

const year =
    params.get("year");

const part =
    params.get("part");


// ==========================
// Elements
// ==========================

const answerTitle =
    document.getElementById(
        "answerTitle"
    );

const answerContainer =
    document.getElementById(
        "answerContainer"
    );


// ==========================
// Check Student Login
// ==========================

if (
    sessionStorage.getItem("loggedIn") !== "true"
) {

    window.location.href =
        "index.html";

}


// ==========================
// Student ID
// ==========================

const studentId =
    sessionStorage.getItem(
        "studentId"
    );


// ==========================
// Validate
// ==========================

const yearNumber =
    Number(year);

if (
    !Number.isInteger(yearNumber) ||
    yearNumber < 2016 ||
    yearNumber > 2025 ||
    !["a", "b"].includes(part)
) {

    alert(
        "Invalid Past Paper Answer."
    );

    window.location.href =
        "grade11-past-papers.html";

}


// ==========================
// Title
// ==========================

answerTitle.textContent =
    `📝 ${year} - Part ${part.toUpperCase()} Answer`;


// ==========================
// Image Folder
// ==========================

const imageFolder =
    `papers/grade11/past/${year}/part-${part}-answer/`;


// ==========================
// Number Of Pages
// ==========================
//
// Change this later according
// to the actual number of images.
//

const totalPages = 10;


// ==========================
// Load Answer Images
// ==========================

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


    const page =
        document.createElement(
            "div"
        );

    page.className =
        "answer-page";


    const img =
        document.createElement(
            "img"
        );

    img.src =
        `${imageFolder}Page_${pageNumber}.jpg`;

    img.alt =
        `Grade 11 ${year} Part ${part.toUpperCase()} Answer Page ${i}`;

    img.draggable =
        false;


    // ==========================
    // Watermark
    // ==========================

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
            studentId || "";

        watermark.appendChild(
            mark
        );

    }


    page.appendChild(
        img
    );

    page.appendChild(
        watermark
    );

    answerContainer.appendChild(
        page
    );

}


// ==========================
// Disable Right Click
// ==========================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Dragging
// ==========================

document.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Copy
// ==========================

document.addEventListener(
    "copy",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Cut
// ==========================

document.addEventListener(
    "cut",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Selection
// ==========================

document.addEventListener(
    "selectstart",
    event => {

        event.preventDefault();

    }
);


// ==========================
// Disable Common Shortcuts
// ==========================

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


        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }

    }
);
