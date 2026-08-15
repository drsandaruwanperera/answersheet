// ==========================
// Elements
// ==========================

const yearContainer =
    document.getElementById(
        "yearContainer"
    );


// ==========================
// Create Years
// ==========================

const years = [
    2025,
    2024,
    2023,
    2022,
    2021,
    2020,
    2019,
    2018,
    2017,
    2016
];


// ==========================
// Create Year Cards
// ==========================

years.forEach(
    year => {

        const card =
            document.createElement(
                "div"
            );

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
                    encodeURIComponent(
                        year
                    );

            }
        );


        yearContainer.appendChild(
            card
        );

    }
);
