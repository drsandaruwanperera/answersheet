// =====================================================
// SET CARD TEXT
// =====================================================

function updateMaterialText(type) {

    // =================================================
    // GET MODEL CARD LINK
    // =================================================

    const modelPapersLink =
        document.querySelector(
            "#modelPapersCard .material-link"
        );


    // =================================================
    // GRADE 10
    // =================================================

    if (
        type === "grade10"
    ) {

        if (modelPapersTitle) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Grade 10 Model Papers";

        }


        if (modelPapersLink) {

            modelPapersLink.innerHTML =
                `
                    Explore Model Papers
                    <span>→</span>
                `;

        }


        if (pastPapersCard) {

            pastPapersCard.style.display =
                "none";

        }

    }


    // =================================================
    // GRADE 11
    // =================================================

    else if (
        type === "grade11"
    ) {

        if (modelPapersTitle) {

            modelPapersTitle.textContent =
                "TOP Ranking";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Grade 11 TOP Ranking Papers";

        }


        if (modelPapersLink) {

            modelPapersLink.innerHTML =
                `
                    Explore TOP Ranking
                    <span>→</span>
                `;

        }


        if (pastPapersCard) {

            pastPapersCard.style.display =
                "";

        }


        if (pastPapersTitle) {

            pastPapersTitle.textContent =
                "Past Papers";

        }


        if (pastPapersDescription) {

            pastPapersDescription.textContent =
                "Past Papers • 2016 – 2025";

        }

    }


    // =================================================
    // A/L
    // =================================================

    else if (
        type === "al"
    ) {

        if (modelPapersTitle) {

            modelPapersTitle.textContent =
                "Model Papers";

        }


        if (modelPapersDescription) {

            modelPapersDescription.textContent =
                "Advanced Level Model Papers";

        }


        if (modelPapersLink) {

            modelPapersLink.innerHTML =
                `
                    Explore Model Papers
                    <span>→</span>
                `;

        }


        if (pastPapersCard) {

            pastPapersCard.style.display =
                "";

        }


        if (pastPapersTitle) {

            pastPapersTitle.textContent =
                "Province Papers";

        }


        if (pastPapersDescription) {

            pastPapersDescription.textContent =
                "Provincial Examination Papers";

        }

    }

}
