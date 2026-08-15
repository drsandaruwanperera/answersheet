const yearContainer =
    document.getElementById(
        "yearContainer"
    );


for (
    let year = 2025;
    year >= 2016;
    year--
) {

    const card =
        document.createElement("div");

    card.className =
        "year-card";


    card.innerHTML = `

        <div class="year-icon">
            📖
        </div>

        <h2>
            ${year}
        </h2>

        <p>
            Grade 11 Past Paper
        </p>

    `;


    card.addEventListener(
        "click",
        () => {

            window.location.href =
                "grade11-past-paper.html?year=" +
                year;

        }
    );


    yearContainer.appendChild(card);

}
