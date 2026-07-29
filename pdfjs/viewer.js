const params = new URLSearchParams(window.location.search);

const paper = params.get("paper");

document.getElementById("pdfFrame").src =
"papers/paper" + paper + ".pdf#toolbar=0&navpanes=0&scrollbar=0";

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

document.addEventListener("dragstart", (e) => {
    e.preventDefault();
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        const k = e.key.toLowerCase();

        if (k === "s" || k === "p" || k === "c" || k === "u") {
            e.preventDefault();
            alert("This action is disabled.");
        }
    }
});
