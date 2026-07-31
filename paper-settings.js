import {
    db,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

const table = document.getElementById("paperTable");

async function loadPapers() {

    table.innerHTML = "";

    const papers = [];

for (let i = 1; i <= 10; i++) {

    const id = "paper" + String(i).padStart(2, "0");

    const paperRef = doc(db, "papers", id);
    const paperSnap = await getDoc(paperRef);

    if (paperSnap.exists()) {

        papers.push({
            id: id,
            ...paperSnap.data()
        });

    } else {

        await setDoc(paperRef, {
            title: "Model Paper " + String(i).padStart(2, "0"),
            pages: 10,
            defaultAvailable: i === 1
        });

        papers.push({
            id: id,
            title: "Model Paper " + String(i).padStart(2, "0"),
            pages: 10,
            defaultAvailable: i === 1
        });

    }

}

papers.forEach(paper => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${paper.id}</td>

            <td>
                <input
                    type="text"
                    id="title-${paper.id}"
                    value="${paper.title || ""}">
            </td>

            <td>
                <input
                    type="number"
                    min="1"
                    id="pages-${paper.id}"
                    value="${paper.pages || 1}">
            </td>

            <td>
                <label>
                    <input
                        type="checkbox"
                        id="default-${paper.id}"
                        ${paper.defaultAvailable ? "checked" : ""}>
                    Default
                </label>
            </td>

            <td>

                <button
                    class="saveBtn"
                    data-id="${paper.id}">

                    Save

                </button>

            </td>

        `;

        table.appendChild(tr);

    });
    document.querySelectorAll(".saveBtn").forEach(btn => {

        btn.addEventListener("click", async () => {

            const id = btn.dataset.id;

            const title =
                document.getElementById(`title-${id}`).value.trim();

            const pages =
                parseInt(document.getElementById(`pages-${id}`).value);

            const defaultAvailable =
                document.getElementById(`default-${id}`).checked;

            if (!title) {

                alert("Title cannot be empty.");
                return;

            }

            if (isNaN(pages) || pages < 1) {

                alert("Pages must be at least 1.");
                return;

            }

            try {

                await setDoc(
                    doc(db, "papers", id),
                    {
                        title: title,
                        pages: pages,
                        defaultAvailable: defaultAvailable
                    },
                    { merge: true }
                );

                alert(id + " saved successfully.");

            } catch (err) {

                console.error(err);

                alert("Save failed.");

            }

        });

    });

}
// ==========================
// Create Missing Papers
// ==========================

async function createMissingPapers() {

    for (let i = 1; i <= 10; i++) {

        const id = "paper" + String(i).padStart(2, "0");

        await setDoc(
            doc(db, "papers", id),
            {
                title: "Model Paper " + String(i).padStart(2, "0"),
                pages: 10,
                defaultAvailable: i === 1
            },
            { merge: true }
        );

    }

}

// ==========================
// Initialize
// ==========================

(async () => {

    await createMissingPapers();

    await loadPapers();

})();
