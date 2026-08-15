// ========================================
// Grade 11 Past Papers - Year Selection
// ========================================


// ==========================
// Get Container
// ==========================

const yearContainer =
    document.getElementById(
        "yearContainer"
    );


// ==========================
// Check Container
// ==========================

if (!yearContainer) {

    console.error(
        "yearContainer not found."
    );

}


// ==========================
// Years
// ==========================

const years = [
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
    2025
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


        // ==========================
        // Click
        // ==========================

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


        // ==========================
        // Add Card
        // ==========================

        yearContainer.appendChild(
            card
        );

    }
);


// ==========================
// Loaded
// ==========================

console.log(
    "✅ Grade 11 Past Papers Loaded"
);

console.log(
    "Years:",
    years
);
