const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const type = params.get("type");

const container = document.getElementById("imageContainer");

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
document.addEventListener("keydown", function (e) {

    // Ctrl + S
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
    }

    // Ctrl + P
    if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
    }

    // Ctrl + U
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
    }

    // F12
    if (e.key === "F12") {
        e.preventDefault();
    }

});
