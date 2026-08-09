import { db, doc, getDoc } from "./firebase.js";

// ==========================
// Check Login
// ==========================

if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

// ==========================
// Get Parameters
// ==========================

const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const studentId = params.get("id");

const viewer = document.getElementById("viewer");

// ==========================
// Load Paper
// ==========================

async function loadPaper() {

    if (!paper || !studentId) {

        alert("Invalid request.");

        window.location.href =
            "dashboard.html?id=" + studentId;

        return;
    }

    try {

        // Get Paper Information
        const paperRef = doc(db, "papers", paper);

        const paperSnap = await getDoc(paperRef);

        if (!paperSnap.exists()) {

            alert("Paper not found.");

            window.location.href =
                "dashboard.html?id=" + studentId;

            return;
        }

        const paperData = paperSnap.data();

        const totalPages = paperData.pages;

        // Clear viewer
        viewer.innerHTML = "";

        // ==========================
        // Create Pages
        // ==========================

        for (let i = 1; i <= totalPages; i++) {

            const no = String(i).padStart(2, "0");

            const page = document.createElement("div");

            page.className = "page";

            // ==========================
            // Paper Image
            // ==========================

            const img = document.createElement("img");

            img.src =
                `papers/${paper}/${paper}_Page_${no}.jpg`;

            img.alt =
                `Paper ${paper} Page ${i}`;

            // ==========================
            // Watermark
            // ==========================

            const watermark =
                document.createElement("div");

            watermark.className = "watermark";

            // Create 16 watermark positions
            for (let w = 0; w < 16; w++) {

                const mark =
                    document.createElement("span");

                mark.textContent = studentId;

                watermark.appendChild(mark);
            }

            // Image first
            page.appendChild(img);

            // Watermark on top
            page.appendChild(watermark);

            // Add page
            viewer.appendChild(page);
        }

    } catch (error) {

        console.error(
            "Paper loading error:",
            error
        );

        alert("Failed to load paper.");
    }
}

// ==========================
// Start
// ==========================

loadPaper();

// ==========================
// Disable Right Click
// ==========================

document.addEventListener(
    "contextmenu",
    event => event.preventDefault()
);

// ==========================
// Disable Image Drag
// ==========================

document.addEventListener(
    "dragstart",
    event => event.preventDefault()
);

// ==========================
// Disable Keyboard Shortcuts
// ==========================

document.addEventListener(
    "keydown",
    event => {

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
