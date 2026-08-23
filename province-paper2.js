const container =
    document.getElementById("paperContainer");


// =====================================================
// PROVINCES
// =====================================================

const provinces = [

    {
        name: "Central Province",
        link:
            "province-paper2-detail.html?province=central"
    },

    {
        name: "Western Province",
        link:
            "province-paper2-detail.html?province=western"
    },

    {
        name: "North Western Province",
        link:
            "province-paper2-detail.html?province=north-western"
    },

    {
        name: "Southern Province",
        link:
            "province-paper2-detail.html?province=southern"
    },

    {
        name: "Sabaragamuwa Province",
        link:
            "province-paper2-detail.html?province=sabaragamuwa"
    }

];


// =====================================================
// CHECK CONTAINER
// =====================================================

if (!container) {

    console.error(
        "❌ paperContainer not found."
    );

}


// =====================================================
// RENDER PROVINCES
// =====================================================

else {

    provinces.forEach(
        item => {

            const card =
                document.createElement("div");


            card.className =
                "paper-card";


            card.style.cursor =
                "pointer";


            // -----------------------------------------
            // CLICK
            // -----------------------------------------

            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        item.link;

                }
            );


            // -----------------------------------------
            // CARD CONTENT
            // -----------------------------------------

            card.innerHTML = `

                <h2>
                    📁 ${item.name}
                </h2>

                <p>
                    Question Paper & Answer Scheme
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "✅ Province Paper 2 Loaded"
);
