const container = document.getElementById("paperContainer");

const provinces = [
    {
        name: "Central Province",
        link: "province-paper1-detail.html?province=central"
    },
    {
        name: "Western Province",
        link: "province-paper1-detail.html?province=western"
    },
    {
        name: "North Western Province",
        link: "province-paper1-detail.html?province=north-western"
    },
    {
        name: "Southern Province",
        link: "province-paper1-detail.html?province=southern"
    },
    {
        name: "Sabaragamuwa Province",
        link: "province-paper1-detail.html?province=sabaragamuwa"
    }
];

provinces.forEach(item => {

    const card = document.createElement("div");
    card.className = "paper-card";
    card.style.cursor = "pointer";

    card.onclick = () => {
        location.href = item.link;
    };

    card.innerHTML = `
        <h2>📁 ${item.name}</h2>
        <p>MCQ Paper & MCQ Answer Scheme</p>
    `;

    container.appendChild(card);

});
