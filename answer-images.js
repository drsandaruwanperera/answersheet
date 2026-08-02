const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const type = params.get("type");
const studentId = params.get("id");

const container = document.getElementById("imageContainer");

// Load Images
for (let i = 1; i <= 30; i++) {

    const page = String(i).padStart(2, "0");

    const card = document.createElement("div");
    card.className = "answer-page";

    const title = document.createElement("div");
    title.className = "page-title";
    title.textContent = "Page " + page;

    const img = document.createElement("img");
    img.src = `answers/paper${paper}/${type}/page${page}.jpg`;
    img.className = "answer-image";

    img.onload = () => {
        card.appendChild(title);
        card.appendChild(img);
        container.appendChild(card);
    };

}

// Disable Right Click
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Disable Drag
document.addEventListener("dragstart", (e) => {
    e.preventDefault();
});

// Disable Keyboard Shortcuts
document.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    // Ctrl + S
    if (e.ctrlKey && key === "s") {
        e.preventDefault();
    }

    // Ctrl + P
    if (e.ctrlKey && key === "p") {
        e.preventDefault();
    }

    // Ctrl + U
    if (e.ctrlKey && key === "u") {
        e.preventDefault();
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && key === "i") {
        e.preventDefault();
    }

    // Ctrl + Shift + J
    if (e.ctrlKey && e.shiftKey && key === "j") {
        e.preventDefault();
    }

    // Ctrl + Shift + C
    if (e.ctrlKey && e.shiftKey && key === "c") {
        e.preventDefault();
    }

    // F12
    if (e.key === "F12") {
        e.preventDefault();
    }

});
