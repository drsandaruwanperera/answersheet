const container = document.getElementById("paperContainer");

const cards = [
    {
        title: "Province Wise 1st Paper",
        description: "MCQ Papers & Answer Schemes",
        link: "province-paper1.html"
    },
    {
        title: "Province Wise 2nd Paper",
        description: "Question Papers & Answer Schemes",
        link: "province-paper2.html"
    }
];

cards.forEach(cardData => {

    const card = document.createElement("div");
    card.className = "paper-card";
    card.style.cursor = "pointer";

    card.onclick = () => {
        location.href = cardData.link;
    };

    card.innerHTML = `
        <h2>📁 ${cardData.title}</h2>
        <p>${cardData.description}</p>
    `;

    container.appendChild(card);

});
