const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const type = params.get("type");

const container = document.getElementById("imageContainer");

// Maximum pages to check
for (let i = 1; i <= 30; i++) {

    const page = String(i).padStart(2, "0");

    const img = document.createElement("img");

    img.src = `answers/paper${paper}/${type}/page${page}.jpg`;

    img.className = "answer-image";

    img.onload = () => {
        container.appendChild(img);
    };

}
const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");
const type = params.get("type");

const container = document.getElementById("imageContainer");

// Maximum pages to check
for (let i = 1; i <= 30; i++) {

    const page = String(i).padStart(2, "0");

    const img = document.createElement("img");

    img.src = `answers/paper${paper}/${type}/page${page}.jpg`;

    img.className = "answer-image";

    img.onload = () => {
        container.appendChild(img);
    };

}
