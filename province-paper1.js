const container = document.getElementById("paperContainer");

const provinces = [
    "Central Province",
    "Western Province",
    "North Western Province",
    "Southern Province",
    "Sabaragamuwa Province"
];

provinces.forEach((province, index) => {

    const card = document.createElement("div");
    card.className = "paper-card";

    card.innerHTML = `

        <h2>📁 ${province}</h2>

        <div class="button-grid">

            <button class="paper-btn"
                onclick="location.href='province-paper1-detail.html?province=${index + 1}'">

                Open

            </button>

        </div>

    `;

    container.appendChild(card);

});
