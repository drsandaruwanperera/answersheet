import {
    db,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

// ==========================
// Super Admin Protection
// ==========================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    sessionStorage.getItem("adminRole") || "limited";

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}

if (adminRole !== "full") {

    alert(
        "Access denied. Super Admin only."
    );

    window.location.replace(
        "admin.html"
    );

}


// ==========================
// Tables
// ==========================

const tables = {
    1: document.getElementById("term1Table"),
    2: document.getElementById("term2Table"),
    3: document.getElementById("term3Table")
};


// ==========================
// Load Papers
// ==========================

async function loadPapers() {

    for (let term = 1; term <= 3; term++) {

        const table =
            tables[term];

        table.innerHTML = "";

        for (let i = 1; i <= 4; i++) {

            const paper =
                String(i).padStart(2, "0");

            const id =
                `term${term}_paper${paper}`;

            const ref =
                doc(
                    db,
                    "grade10Papers",
                    id
                );

            let snap =
                await getDoc(ref);

            let data;

            if (!snap.exists()) {

                data = {

                    title:
                        `Model Paper ${paper}`,

                    available:
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


            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    Paper ${paper}
                </td>

                <td>

                    <input
                        type="text"
                        id="title-${id}"
                        value="${data.title || ""}"
                    >

                </td>

                <td>

                    <input
                        type="checkbox"
                        id="available-${id}"
                        ${data.available === true
                            ? "checked"
                            : ""}
                    >

                </td>

                <td>

                    <button
                        class="saveBtn"
                        data-id="${id}"
                    >
                        💾 Save
                    </button>

                    <button
                        class="manageBtn"
                        data-term="${term}"
                        data-paper="${paper}"
                    >
                        ⚙️ Manage
                    </button>

                </td>

            `;

            table.appendChild(row);

        }

    }


    attachEvents();

}


// ==========================
// Save + Manage Events
// ==========================

function attachEvents() {

    document
        .querySelectorAll(".saveBtn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                savePaper
            );

        });


    document
        .querySelectorAll(".manageBtn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    const term =
                        btn.dataset.term;

                    const paper =
                        btn.dataset.paper;

                    window.location.href =
                        `grade10-paper-manage.html?term=${term}&paper=${paper}`;

                }
            );

        });

}


// ==========================
// Save Paper
// ==========================

async function savePaper(event) {

    const id =
        event.currentTarget.dataset.id;

    const title =
        document
            .getElementById(
                `title-${id}`
            )
            .value
            .trim();

    const available =
        document
            .getElementById(
                `available-${id}`
            )
            .checked;


    if (!title) {

        alert(
            "Please enter a paper title."
        );

        return;

    }


    try {

        await setDoc(
            doc(
                db,
                "grade10Papers",
                id
            ),
            {
                title,
                available
            },
            {
                merge: true
            }
        );

        alert(
            `${id} saved successfully.`
        );

    }
    catch (error) {

        console.error(
            error
        );

        alert(
            "Failed to save paper."
        );

    }

}


// ==========================
// Start
// ==========================

loadPapers();
