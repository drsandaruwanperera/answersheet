import {
    db,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

// =========================================
// SUPER ADMIN PROTECTION
// =========================================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    sessionStorage.getItem("adminRole") || "limited";

if (!adminLoggedIn) {
    window.location.replace("admin-login.html");
    throw new Error("Admin not logged in");
}

if (adminRole !== "full") {

    alert("Access denied. Super Admin only.");

    window.location.replace("admin.html");

    throw new Error("Super Admin only");
}


// =========================================
// TABLE
// =========================================

const table =
    document.getElementById("paperTable");


// =========================================
// LOAD PAPERS
// =========================================

async function loadPapers() {

    if (!table) {
        console.error("paperTable not found.");
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:30px;">
                Loading papers...
            </td>
        </tr>
    `;

    try {

        table.innerHTML = "";

        for (let i = 1; i <= 10; i++) {

            const number =
                String(i).padStart(2, "0");

            const id =
                "paper" + number;

            const ref =
                doc(db, "papers", id);

            let snap =
                await getDoc(ref);

            let data;

            // =====================================
            // CREATE DEFAULT PAPER
            // =====================================

            if (!snap.exists()) {

                data = {

                    title:
                        "Model Paper " + number,

                    pages:
                        10,

                    defaultAvailable:
                        i === 1

                };

                await setDoc(
                    ref,
                    data
                );

            } else {

                data =
                    snap.data();

            }


            const pages =
                Number(data.pages) > 0
                    ? Number(data.pages)
                    : 10;


            // =====================================
            // ROW
            // =====================================

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${id}
                </td>

                <td>

                    <input
                        type="text"
                        id="title-${id}"
                        value="${escapeHTML(
                            data.title ||
                            ("Model Paper " + number)
                        )}"
                    >

                </td>

                <td>

                    <input
                        type="number"
                        min="1"
                        id="pages-${id}"
                        value="${pages}"
                    >

                </td>

                <td>

                    <input
                        type="checkbox"
                        id="default-${id}"
                        ${
                            data.defaultAvailable
                                ? "checked"
                                : ""
                        }
                    >

                </td>

                <td>

                    <button
                        type="button"
                        class="saveBtn"
                        data-id="${id}"
                    >
                        💾 Save
                    </button>

                </td>

            `;


            table.appendChild(row);

        }


        // =====================================
        // SAVE EVENTS
        // =====================================

        document
            .querySelectorAll(".saveBtn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => savePaper(
                        button.dataset.id,
                        button
                    )
                );

            });

    }

    catch (error) {

        console.error(
            "Load papers error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                        color:red;
                    "
                >
                    Failed to load papers.
                </td>
            </tr>
        `;

    }

}


// =========================================
// SAVE PAPER
// =========================================

async function savePaper(
    id,
    button
) {

    const titleInput =
        document.getElementById(
            `title-${id}`
        );

    const pagesInput =
        document.getElementById(
            `pages-${id}`
        );

    const defaultInput =
        document.getElementById(
            `default-${id}`
        );


    if (
        !titleInput ||
        !pagesInput ||
        !defaultInput
    ) {

        alert(
            "Paper fields not found."
        );

        return;

    }


    const title =
        titleInput.value.trim();


    const pages =
        Number(
            pagesInput.value
        );


    const defaultAvailable =
        defaultInput.checked;


    // =====================================
    // VALIDATION
    // =====================================

    if (!title) {

        alert(
            "Please enter a paper title."
        );

        return;

    }


    if (
        !Number.isInteger(pages) ||
        pages < 1
    ) {

        alert(
            "Pages must be at least 1."
        );

        return;

    }


    try {

        button.disabled = true;

        button.textContent =
            "Saving...";


        // =================================
        // SAVE TO PAPERS COLLECTION
        // =================================

        await setDoc(
            doc(
                db,
                "papers",
                id
            ),
            {

                title:
                    title,

                pages:
                    pages,

                defaultAvailable:
                    defaultAvailable

            },
            {
                merge: true
            }
        );


        console.log(
            "Paper saved:",
            {
                id,
                title,
                pages,
                defaultAvailable
            }
        );


        alert(
            `${id} saved successfully.\nPages: ${pages}`
        );

    }

    catch (error) {

        console.error(
            "Save paper error:",
            error
        );

        alert(
            "Failed to save paper."
        );

    }

    finally {

        button.disabled = false;

        button.textContent =
            "💾 Save";

    }

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================
// START
// =========================================

loadPapers();
