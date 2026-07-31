import {
    db,
    collection,
    getDocs,
    doc,
    updateDoc
} from "./firebase.js";

const table = document.getElementById("paperTable");

console.log("db =", db);
console.log("collection =", collection);

    // paper01, paper02 ... paper10 ලෙස sort කිරීම
    papers.sort((a, b) => a.id.localeCompare(b.id));

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

            if (!title) {
                alert("Title cannot be empty.");
                return;
            }

            if (isNaN(pages) || pages < 1) {
                alert("Pages must be at least 1.");
                return;
            }

            try {

                await updateDoc(doc(db, "papers", id), {
                    title,
                    pages
                });

                alert(`${id} updated successfully.`);

            } catch (err) {

                console.error(err);
                alert("Update failed.");

            }

        });

    });

}

loadPapers();
