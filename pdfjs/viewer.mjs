const params = new URLSearchParams(window.location.search);
const paper = params.get("paper");

window.location.href =
    "pdfjs/web/viewer.html?file=" +
    encodeURIComponent("../../papers/paper" + paper + ".pdf");
