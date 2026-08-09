import { db, doc, getDoc } from "./firebase.js";

// ==========================
// CHECK LOGIN
// ==========================

if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

// ==========================
// GET URL PARAMETERS
// ==========================

const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const studentId = params.get("id");

const viewer = document.getElementById("viewer");

// ==========================
// LOAD PAPER
// ==========================

async function loadPaper() {

    if (!paper || !studentId) {

        alert("Invalid request.");

        window.location.href =
            "dashboard.html?id=" + (studentId || "");

        return;
    }

    try {

        // Get paper information
        const paperRef = doc(db, "papers", paper);

        const paperSnap = await getDoc(paperRef);

        if (!paperSnap.exists()) {

            alert("Paper not found.");

            window.location.href =
                "dashboard.html?id=" + studentId;

            return;
        }

        const paperData = paperSnap.data();

        const totalPages = Number(paperData.pages) || 0;

        if (totalPages <= 0) {

            alert("No pages found for this paper.");

            return;
        }

        // Clear viewer
        viewer.innerHTML = "";

        // ==========================
        // CREATE ALL PAPER PAGES
        // ==========================

        for (let i = 1; i <= totalPages; i++) {

            const pageNumber =
                String(i).padStart(2, "0");

            // Page container
            const page =
                document.createElement("div");

            page.className = "page";

            // ==========================
            // PAPER IMAGE
            // ==========================

            const img =
                document.createElement("img");

            img.src =
                `papers/${paper}/${paper}_Page_${pageNumber}.jpg`;

            img.alt =
                `Paper ${paper} Page ${i}`;

            img.draggable = false;

            // ==========================
            // WATERMARK CONTAINER
            // ==========================

            const watermark =
                document.createElement("div");

            watermark.className = "watermark";

            // ==========================
            // CREATE 20 WATERMARKS
            // ==========================

            for (let w = 0; w < 20; w++) {

                const mark =
                    document.createElement("span");

                mark.textContent = studentId;

                watermark.appendChild(mark);
            }

            // ==========================
            // ADD TO PAGE
            // ==========================

            page.appendChild(img);

            // Watermark is ABOVE image
            page.appendChild(watermark);

            viewer.appendChild(page);
        }

    } catch (error) {

        console.error(
            "Paper loading error:",
            error
        );

        alert(
            "Failed to load paper. Please try again."
        );
    }
}

// ==========================
// START
// ==========================

loadPaper();

// ==========================
// DISABLE RIGHT CLICK
// ==========================

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    }
);

// ==========================
// DISABLE DRAGGING
// ==========================

document.addEventListener(
    "dragstart",
    function (event) {

        event.preventDefault();

    }
);

// ==========================
// DISABLE COMMON SHORTCUTS
// ==========================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.ctrlKey || event.metaKey) {

            const key =
                event.key.toLowerCase();

            if (
                key === "s" ||
                key === "p" ||
                key === "c" ||
                key === "u" ||
                key === "a"
            ) {

                event.preventDefault();

                alert(
                    "This action is disabled."
                );
            }
        }

    }
);
