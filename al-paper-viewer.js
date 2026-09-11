if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.replace("index.html");
}

const params = new URLSearchParams(window.location.search);
const paperNumber = String(params.get("paper") || "01").padStart(2, "0");
const paperType = params.get("type") === "second" ? "2nd" : "1st";
const folderType = paperType === "2nd" ? "2nd-paper" : "1st-paper";
const basePath = `papers/al-top-ranking/september/paper-${paperNumber}-${folderType}`;
const imageVersion = "750c5998";

const pages = document.getElementById("pages");
const empty = document.getElementById("empty");
const title = document.getElementById("viewerTitle");
const kicker = document.getElementById("viewerKicker");

if (title) {
    title.textContent = `Paper ${paperNumber} • ${paperType} Paper`;
}

if (kicker) {
    kicker.textContent = `SEPTEMBER 2026 • A/L TOP RANKING MODEL • ${paperType.toUpperCase()} PAPER`;
}

function loadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });
}

async function initializeViewer() {
    let pageNumber = 1;
    let loaded = 0;

    while (pageNumber <= 100) {
        const fileName = `page-${String(pageNumber).padStart(2, "0")}.jpg`;
        const src = `${basePath}/${fileName}?v=${imageVersion}`;
        const image = await loadImage(src);

        if (!image) {
            break;
        }

        const card = document.createElement("article");
        card.className = "page-card";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Paper ${paperNumber} ${paperType} Paper — page ${pageNumber}`;
        img.loading = "eager";
        img.decoding = "sync";

        const label = document.createElement("div");
        label.className = "page-number";
        label.textContent = `Page ${pageNumber}`;

        card.appendChild(img);
        card.appendChild(label);
        pages.appendChild(card);

        loaded += 1;
        pageNumber += 1;
    }

    if (!loaded) {
        empty.hidden = false;
    }
}

document.addEventListener("DOMContentLoaded", initializeViewer);
