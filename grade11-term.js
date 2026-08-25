function openPaper(
    number,
    part
) {

    const pdfFile =
        "answers/grade11/" +
        currentTerm +
        "/top-ranking-" +
        String(number).padStart(2, "0") +
        "-part-" +
        part.toLowerCase() +
        ".pdf";


    const title =
        "Grade 11 - " +
        (
            currentTerm === "term1"
                ? "1st Term"
                : currentTerm === "term2"
                    ? "2nd Term"
                    : "3rd Term"
        ) +
        " TOP Ranking - " +
        String(number).padStart(2, "0") +
        " Part " +
        part;


    const url =
        "grade11-answer.html" +
        "?file=" +
        encodeURIComponent(
            pdfFile
        ) +
        "&title=" +
        encodeURIComponent(
            title
        );


    console.log(
        "Opening:",
        url
    );


    window.location.href =
        url;

}
