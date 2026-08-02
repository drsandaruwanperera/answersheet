const params = new URLSearchParams(window.location.search);

const province = params.get("province");

const provinceNames = {
    "central": "Central Province",
    "western": "Western Province",
    "north-western": "North Western Province",
    "southern": "Southern Province",
    "sabaragamuwa": "Sabaragamuwa Province"
};

document.getElementById("provinceTitle").textContent =
    provinceNames[province];

const container = document.getElementById("paperContainer");

container.innerHTML = `

<div class="paper-card">

    <h2>📁 ${provinceNames[province]}</h2>

    <div class="button-grid">

        <button class="paper-btn"
            onclick="window.open('papers/past/province1/${province}/mcq.pdf','_blank')">

            📄 MCQ Paper

        </button>

        <button class="answer-btn"
            onclick="location.href='answer-images.html?paper=${province}&group=province1&type=mcq'">

            📝 MCQ Answer Scheme

        </button>

    </div>

</div>

`;
