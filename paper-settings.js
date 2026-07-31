import {
    db,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

const table = document.getElementById("paperTable");

async function loadPapers() {

    table.innerHTML = "";

    for (let i = 1; i <= 10; i++) {

        const id = "paper" + String(i).padStart(2, "0");

        const ref = doc(db, "papers", id);

        const snap = await getDoc(ref);

        let data;

        if (!snap.exists()) {

            data = {

                title: "Model Paper " + String(i).padStart(2, "0"),
                pages: 10,
                defaultAvailable: i === 1

            };

            await setDoc(ref, data);

        } else {

            data = snap.data();

        }

        const tr = document.createElement("tr");

        tr.innerHTML = `

        <td>${id}</td>

        <td>

            <input
                type="text"
                id="title-${id}"
                value="${data.title}">

        </td>

        <td>

            <input
                type="number"
                min="1"
                id="pages-${id}"
                value="${data.pages}">

        </td>

        <td>

            <input
                type="checkbox"
                id="default-${id}"
                ${data.defaultAvailable ? "checked" : ""}>

        </td>

        <td>

            <button
                class="saveBtn"
                data-id="${id}">

                Save

            </button>

        </td>

        `;

        table.appendChild(tr);

    }
        }

    // ==========================
    // Save Buttons
    // ==========================

    document.querySelectorAll(".saveBtn").forEach(btn => {

        btn.addEventListener("click", async () => {

            const id = btn.dataset.id;

            const title = document
                .getElementById(`title-${id}`)
                .value
                .trim();

            const pages = parseInt(
                document.getElementById(`pages-${id}`).value
            );

            const defaultAvailable =
                document.getElementById(`default-${id}`).checked;

            if (!title) {

                alert("Please enter a title.");
                return;

            }

            if (isNaN(pages) || pages < 1) {

                alert("Pages must be greater than 0.");
                return;

            }

            await setDoc(
                doc(db, "papers", id),
                {
                    title: title,
                    pages: pages,
                    defaultAvailable: defaultAvailable
                },
                { merge: true }
            );

            alert(id + " updated successfully.");

        });

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

                alert("Please enter paper title.");
                return;

            }

            if (isNaN(pages) || pages < 1) {

                alert("Invalid page count.");
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

                alert("Failed to save paper.");

            }

        });

    });

}

loadPapers();
