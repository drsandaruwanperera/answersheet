// ==========================
// Get Term
// ==========================

const params =
    new URLSearchParams(
        window.location.search
    );

const term =
    params.get("term");


// ==========================
// Elements
// ==========================

const termTitle =
    document.getElementById(
        "termTitle"
    );

const paperContainer =
    document.getElementById(
        "paperContainer"
    );


// ==========================
// Validate Term
// ==========================

if (
    !["1", "2", "3"].includes(term)
) {

    alert(
        "Invalid term."
    );

    window.location.href =
        "grade11-model-papers.html";

    throw new Error(
        "Invalid Grade 11 term."
    );

}


// ==========================
// Term Names
// ==========================

const termNames = {

    "1":
        "1st Term",

    "2":
        "2nd Term",

    "3":
        "3rd Term"

};


// ==========================
// Set Title
// ==========================

if (termTitle) {

    termTitle.textContent =
        "🏆 Grade 11 - " +
        termNames[term];

}


// ==========================
// Create TOP Ranking Papers
// ==========================

if (paperContainer) {

    paperContainer.innerHTML = "";


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const paperNumber =
            String(i).padStart(
                2,
                "0"
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "paper-card";


        card.style.cursor =
            "pointer";


        card.innerHTML = `

            <div class="paper-icon">
                🏆
            </div>

            <h2>
                TOP Ranking - ${paperNumber}
            </h2>

            <p>
                Part A & Part B
            </p>

        `;


        card.addEventListener(
            "click",
            () => {

                window.location.href =
                    "grade11-model-paper.html" +
                    "?term=" +
                    encodeURIComponent(
                        term
                    ) +
                    "&paper=" +
                    encodeURIComponent(
                        paperNumber
                    );

            }
        );


        paperContainer.appendChild(
            card
        );

    }

}


// ==========================
// Console
// ==========================

console.log(
    "================================"
);

console.log(
    "✅ Grade 11 TOP Ranking Loaded"
);

console.log(
    "Term:",
    term
);

console.log(
    "Term Name:",
    termNames[term]
);

console.log(
    "================================"
);
