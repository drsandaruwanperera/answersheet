const params = new URLSearchParams(window.location.search);

const province = params.get("province");

const provinces = [
    "Central Province",
    "Western Province",
    "North Western Province",
    "Southern Province",
    "Sabaragamuwa Province"
];

document.getElementById("provinceTitle").textContent =
    provinces[province - 1];

const container = document.getElementById("paperContainer");

container.innerHTML = `

    <div class="paper-card">

        <h2>${provinces[province - 1]}</h2>

        <div class="button-grid">

            <button class="paper-btn"
                onclick="window.open('papers/province1/province${province}/mcq.pdf','_blank')">

                📄 MCQ Paper

            </button>

            <button class="answer-btn"
                onclick="location.href='answer-images.html?paper=province1-${province}&type=mcq'">

                📝 MCQ Answer Scheme

            </button>

        </div>

    </div>

`;
