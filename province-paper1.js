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

    card.style.cursor = "pointer";

    card.onclick = () => {
        location.href = `province-paper1-detail.html?province=${index + 1}`;
    };

    card.innerHTML = `
        <h2>📁 ${province}</h2>
        <p>MCQ Paper & MCQ Answer Scheme</p>
    `;

    container.appendChild(card);

});
