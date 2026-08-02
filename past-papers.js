const container = document.getElementById("paperContainer");

for (let i = 1; i <= 5; i++) {

    const card = document.createElement("div");
    card.className = "paper-card";

    card.innerHTML = `

        <h2>📁 ${i}${i==1?"st":i==2?"nd":i==3?"rd":"th"} Paper</h2>

        ${
            i === 1
            ?
            `
            <div class="notice-box">

                <h3>📢 Special Notice</h3>

                <img
                    src="images/special-notice.jpg"
                    class="notice-image"
                    alt="Special Notice">

            </div>
            `
            :
            ""
        }

        <div class="button-grid">

    <button class="paper-btn"
        onclick="window.open('papers/past/paper${String(i).padStart(2,'0')}/mcq.pdf','_blank')">
        📄 Part 1 - MCQ Paper
    </button>

    <button class="paper-btn"
        onclick="window.open('papers/past/paper${String(i).padStart(2,'0')}/question.pdf','_blank')">
        📄 Part 2 - Question Paper
    </button>

    <button class="answer-btn"
        onclick="location.href='answer-images.html?paper=${String(i).padStart(2,'0')}&type=mcq&id=' + encodeURIComponent(studentId)
        📝 Part 1 - Answer Scheme
    </button>

    <button class="answer-btn"
        onclick="location.href='answer-images.html?paper=${String(i).padStart(2,'0')}&type=mcq&id=' + encodeURIComponent(studentId)
        📝 Part 2 - Answer Scheme
    </button>

</div>
    `;

    container.appendChild(card);

}
