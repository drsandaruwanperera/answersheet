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
        "grade10-model-papers.html";

}


// ==========================
// Term Name
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

termTitle.textContent =
    "📚 Grade 10 - " +
    termNames[term];


// ==========================
// Create Model Papers
// ==========================

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


    card.innerHTML = `

        <div class="paper-icon">
            📘
        </div>

        <h2>
            Model Paper - ${paperNumber}
        </h2>

        <p>
            Part A & Part B
        </p>

    `;


    card.addEventListener(
        "click",
        () => {

            window.location.href =
                "grade10-model-paper.html" +
                "?term=" +
                encodeURIComponent(term) +
                "&paper=" +
                encodeURIComponent(paperNumber);

        }
    );


    paperContainer.appendChild(
        card
    );

}
