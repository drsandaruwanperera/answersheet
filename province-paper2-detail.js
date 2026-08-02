const params = new URLSearchParams(window.location.search);

const province = params.get("province");

const provinceMap = {
    "central": {
        name: "Central Province",
        paper: "paper01"
    },
    "western": {
        name: "Western Province",
        paper: "paper02"
    },
    "north-western": {
        name: "North Western Province",
        paper: "paper03"
    },
    "southern": {
        name: "Southern Province",
        paper: "paper04"
    },
    "sabaragamuwa": {
        name: "Sabaragamuwa Province",
        paper: "paper05"
    }
};

const data = provinceMap[province];

document.getElementById("provinceTitle").textContent = data.name;

const container = document.getElementById("paperContainer");

container.innerHTML = `

<div class="paper-card">

    <h2>📁 ${data.name}</h2>

    <div class="button-grid">

        <button class="paper-btn"
            onclick="window.open('papers/past/${data.paper}/question.pdf','_blank')">

            📄 Question Paper

        </button>

        <button class="answer-btn"
            onclick="location.href='answer-images.html?paper=${data.paper.replace('paper','')}&type=question'">

            📝 Answer Scheme

        </button>

    </div>

</div>

`;
