import {
    db,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";


// =====================================================
// SUPER ADMIN PROTECTION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    String(
        sessionStorage.getItem("adminRole") || ""
    )
    .toLowerCase()
    .trim();

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

    throw new Error(
        "Admin not logged in"
    );

}

if (adminRole !== "full") {

    alert(
        "Access denied. Super Admin only."
    );

    window.location.replace(
        "admin.html"
    );

    throw new Error(
        "Super Admin only"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const grade10List =
    document.getElementById(
        "grade10PaperList"
    );

const grade11List =
    document.getElementById(
        "grade11PaperList"
    );

const alList =
    document.getElementById(
        "alPaperList"
    );

const saveBtn =
    document.getElementById(
        "saveSettingsBtn"
    );

const enableAllBtn =
    document.getElementById(
        "enableAllBtn"
    );

const disableAllBtn =
    document.getElementById(
        "disableAllBtn"
    );

const changesStatus =
    document.getElementById(
        "changesStatus"
    );

const adminUsername =
    document.getElementById(
        "adminUsername"
    );

const adminRoleElement =
    document.getElementById(
        "adminRole"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// ADMIN DISPLAY
// =====================================================

if (adminUsername) {

    adminUsername.textContent =
        sessionStorage.getItem(
            "adminUsername"
        ) ||
        sessionStorage.getItem(
            "username"
        ) ||
        "admin";

}

if (adminRoleElement) {

    adminRoleElement.textContent =
        "Super Administrator";

}


// =====================================================
// CATALOG
// =====================================================

const PAPER_CATALOG = {

    // =================================================
    // GRADE 10
    // =================================================

    grade10: [

        {
            group: "1st Term",

            papers: Array.from(
                { length: 5 },
                (_, i) => {

                    const number =
                        String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    return {

                        id:
                            `grade10_term1_model_${number}`,

                        title:
                            `1st Term - Model Paper ${number}`,

                        description:
                            "MCQ Paper • Question Paper • Answers"

                    };

                }
            )

        },

        {
            group: "2nd Term",

            papers: Array.from(
                { length: 5 },
                (_, i) => {

                    const number =
                        String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    return {

                        id:
                            `grade10_term2_model_${number}`,

                        title:
                            `2nd Term - Model Paper ${number}`,

                        description:
                            "MCQ Paper • Question Paper • Answers"

                    };

                }
            )

        },

        {
            group: "3rd Term",

            papers: Array.from(
                { length: 5 },
                (_, i) => {

                    const number =
                        String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    return {

                        id:
                            `grade10_term3_model_${number}`,

                        title:
                            `3rd Term - Model Paper ${number}`,

                        description:
                            "MCQ Paper • Question Paper • Answers"

                    };

                }
            )

        }

    ],


    // =================================================
    // GRADE 11
    // =================================================

    grade11: [

        {
            group:
                "1st Term",

            term:
                "1",

            papers:
                createGrade11Papers(
                    "1"
                )

        },

        {
            group:
                "2nd Term",

            term:
                "2",

            papers:
                createGrade11Papers(
                    "2"
                )

        },

        {
            group:
                "3rd Term",

            term:
                "3",

            papers:
                createGrade11Papers(
                    "3"
                )

        }

    ],


    // =================================================
    // A/L
    // =================================================

    al: [

        {
            group:
                "Model Papers",

            papers:
                Array.from(
                    { length: 15 },
                    (_, i) => {

                        const number =
                            String(
                                i + 1
                            ).padStart(
                                2,
                                "0"
                            );

                        return {

                            id:
                                `al_model_${number}`,

                            title:
                                `Model Paper ${number}`,

                            description:
                                "Paper • Answers • Marking Scheme"

                        };

                    }
                )

        },

        {

            group:
                "Province Papers",

            papers: [

                ["western", "Western Province"],
                ["central", "Central Province"],
                ["southern", "Southern Province"],
                ["northern", "Northern Province"],
                ["north_western", "North Western Province"],
                ["eastern", "Eastern Province"],
                ["uva", "Uva Province"],
                ["sabaragamuwa", "Sabaragamuwa Province"],
                ["all_island", "All Island Papers"]

            ].map(
                ([key, title]) => ({

                    id:
                        `al_province_${key}`,

                    title,

                    description:
                        key === "all_island"
                            ? "Province / Island-wide Papers"
                            : "Province Paper • Answer Scheme"

                })
            )

        }

    ]

};


// =====================================================
// GRADE 11 PAPER CREATOR
// =====================================================

function createGrade11Papers(
    term
) {

    return Array.from(
        { length: 4 },
        (_, i) => {

            const number =
                String(
                    i + 1
                ).padStart(
                    2,
                    "0"
                );

            return {

                id:
                    `grade11_term${term}_model_${number}`,

                title:
                    `TOP Ranking - ${number}`,

                description:
                    "Part A • Part B"

            };

        }
    );

}


// =====================================================
// SETTINGS
// =====================================================

let paperSettings = {};

let hasUnsavedChanges =
    false;


// =====================================================
// HELPERS
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}


function setChangesStatus(
    text
) {

    if (changesStatus) {

        changesStatus.textContent =
            text;

    }

}


function markUnsaved() {

    hasUnsavedChanges =
        true;

    setChangesStatus(
        "You have unsaved changes"
    );

}


// =====================================================
// PAPER STATUS
// =====================================================

function isPaperEnabled(
    id
) {

    if (
        Object.prototype.hasOwnProperty.call(
            paperSettings,
            id
        )
    ) {

        return (
            paperSettings[id]?.enabled === true
        );

    }

    return true;

}


// =====================================================
// GRADE 10 TERM
// =====================================================

function getGrade10TermId(
    term
) {

    return (
        `grade10_term${term}_enabled`
    );

}


function isGrade10TermEnabled(
    term
) {

    const id =
        getGrade10TermId(
            term
        );

    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            id
        )
    ) {

        return true;

    }

    return (
        paperSettings[id] === true
    );

}


function getGrade10TermNumber(
    group
) {

    if (
        group === "1st Term"
    ) {

        return "1";

    }

    if (
        group === "2nd Term"
    ) {

        return "2";

    }

    if (
        group === "3rd Term"
    ) {

        return "3";

    }

    return null;

}


// =====================================================
// GRADE 11 TERM
// =====================================================

function getGrade11TermId(
    term
) {

    return (
        `grade11_term${term}_enabled`
    );

}


function isGrade11TermEnabled(
    term
) {

    const id =
        getGrade11TermId(
            term
        );

    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            id
        )
    ) {

        return true;

    }

    return (
        paperSettings[id] === true
    );

}


// =====================================================
// GRADE 11 PAST PAPERS
// =====================================================

function isGrade11PastEnabled() {

    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            "grade11_past_enabled"
        )
    ) {

        return true;

    }

    return (
        paperSettings.grade11_past_enabled === true
    );

}


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

    try {

        const ref =
            doc(
                db,
                "paperSettings",
                "settings"
            );

        const snapshot =
            await getDoc(
                ref
            );

        paperSettings =
            snapshot.exists()
                ? snapshot.data() || {}
                : {};

        renderAll();

        setChangesStatus(
            "All settings loaded"
        );

    }

    catch (error) {

        console.error(
            "Paper settings load error:",
            error
        );

        paperSettings = {};

        renderAll();

        setChangesStatus(
            "Default settings loaded"
        );

    }

}


// =====================================================
// RENDER ALL
// =====================================================

function renderAll() {

    renderGrade10();

    renderGrade11();

    renderAL();

}


// =====================================================
// GENERIC PAPER ROW
// =====================================================

function createPaperRow(
    paper
) {

    const enabled =
        isPaperEnabled(
            paper.id
        );

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "paper-item";

    item.innerHTML = `

        <div class="paper-info">

            <div class="paper-icon">
                📄
            </div>

            <div class="paper-details">

                <strong>
                    ${escapeHTML(
                        paper.title
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        paper.description
                    )}
                </span>

            </div>

        </div>

        <div class="paper-action">

            <span
                class="paper-status ${
                    enabled
                        ? "active"
                        : "disabled"
                }"
                data-status
            >
                ${
                    enabled
                        ? "Active"
                        : "Disabled"
                }
            </span>

            <label
                class="paper-switch-control"
            >

                <input
                    type="checkbox"
                    class="paper-toggle"
                    data-paper-id="${paper.id}"
                    ${
                        enabled
                            ? "checked"
                            : ""
                    }
                >

                <span
                    class="switch-slider"
                ></span>

            </label>

        </div>

    `;

    return item;

}


// =====================================================
// ATTACH PAPER TOGGLE
// =====================================================

function attachPaperToggles(
    container
) {

    container
        .querySelectorAll(
            ".paper-toggle"
        )
        .forEach(
            toggle => {

                toggle.addEventListener(
                    "change",
                    () => {

                        const id =
                            toggle.dataset.paperId;

                        paperSettings[id] = {

                            enabled:
                                toggle.checked,

                            updatedAt:
                                Date.now()

                        };

                        const item =
                            toggle.closest(
                                ".paper-item"
                            );

                        const status =
                            item?.querySelector(
                                "[data-status]"
                            );

                        if (status) {

                            status.textContent =
                                toggle.checked
                                    ? "Active"
                                    : "Disabled";

                            status.classList.toggle(
                                "active",
                                toggle.checked
                            );

                            status.classList.toggle(
                                "disabled",
                                !toggle.checked
                            );

                        }

                        markUnsaved();

                    }
                );

            }
        );

}


// =====================================================
// GRADE 10
// =====================================================

function renderGrade10() {

    if (!grade10List) {
        return;
    }

    grade10List.innerHTML = "";

    PAPER_CATALOG.grade10.forEach(
        group => {

            const term =
                getGrade10TermNumber(
                    group.group
                );

            const enabled =
                isGrade10TermEnabled(
                    term
                );

            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "paper-group-header";

            header.innerHTML = `

                <div>

                    <strong>
                        ${group.group}
                    </strong>

                    <span style="
                        margin-left:10px;
                        color:${
                            enabled
                                ? "#16a34a"
                                : "#dc2626"
                        };
                        font-weight:600;
                    ">
                        ${
                            enabled
                                ? "Active"
                                : "Disabled"
                        }
                    </span>

                </div>

                <button
                    type="button"
                    class="grade10-term-btn"
                    data-term="${term}"
                >
                    ${
                        enabled
                            ? "Disable Term"
                            : "Enable Term"
                    }
                </button>

            `;

            grade10List.appendChild(
                header
            );

            group.papers.forEach(
                paper => {

                    grade10List.appendChild(
                        createPaperRow(
                            paper
                        )
                    );

                }
            );

        }
    );

    grade10List
        .querySelectorAll(
            ".grade10-term-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const term =
                            button.dataset.term;

                        paperSettings[
                            getGrade10TermId(
                                term
                            )
                        ] =
                            !isGrade10TermEnabled(
                                term
                            );

                        markUnsaved();

                        renderAll();

                    }
                );

            }
        );

    attachPaperToggles(
        grade10List
    );

}


// =====================================================
// GRADE 11
// =====================================================

function renderGrade11() {

    if (!grade11List) {
        return;
    }

    grade11List.innerHTML = "";


    // -------------------------------------------------
    // HEADER
    // -------------------------------------------------

    const mainHeader =
        document.createElement(
            "div"
        );

    mainHeader.className =
        "paper-group-header";

    mainHeader.innerHTML = `

        <div>

            <strong>
                🏆 TOP Ranking
            </strong>

            <span style="
                margin-left:10px;
                color:#6d35f2;
                font-weight:600;
            ">
                Student Access
            </span>

        </div>

    `;

    grade11List.appendChild(
        mainHeader
    );


    // -------------------------------------------------
    // TERMS
    // -------------------------------------------------

    PAPER_CATALOG.grade11.forEach(
        group => {

            const term =
                group.term;

            const enabled =
                isGrade11TermEnabled(
                    term
                );

            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "paper-group-header";

            header.innerHTML = `

                <div>

                    <strong>
                        🏆 ${group.group}
                    </strong>

                    <span style="
                        margin-left:10px;
                        color:${
                            enabled
                                ? "#16a34a"
                                : "#dc2626"
                        };
                        font-weight:600;
                    ">
                        ${
                            enabled
                                ? "Active"
                                : "Disabled"
                        }
                    </span>

                </div>

                <button
                    type="button"
                    class="grade11-term-btn"
                    data-term="${term}"
                >
                    ${
                        enabled
                            ? "Disable Term"
                            : "Enable Term"
                    }
                </button>

            `;

            grade11List.appendChild(
                header
            );


            group.papers.forEach(
                paper => {

                    grade11List.appendChild(
                        createPaperRow(
                            paper
                        )
                    );

                }
            );

        }
    );


    // -------------------------------------------------
    // PAST PAPERS
    // -------------------------------------------------

    const pastEnabled =
        isGrade11PastEnabled();

    const pastHeader =
        document.createElement(
            "div"
        );

    pastHeader.className =
        "paper-group-header";

    pastHeader.innerHTML = `

        <div>

            <strong>
                📖 Past Papers (2016 – 2025)
            </strong>

            <span style="
                margin-left:10px;
                color:${
                    pastEnabled
                        ? "#16a34a"
                        : "#dc2626"
                };
                font-weight:600;
            ">
                ${
                    pastEnabled
                        ? "Active"
                        : "Disabled"
                }
            </span>

        </div>

        <button
            type="button"
            class="grade11-past-btn"
        >
            ${
                pastEnabled
                    ? "Disable Past Papers"
                    : "Enable Past Papers"
            }
        </button>

    `;

    grade11List.appendChild(
        pastHeader
    );


    // -------------------------------------------------
    // TERM BUTTONS
    // -------------------------------------------------

    grade11List
        .querySelectorAll(
            ".grade11-term-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const term =
                            button.dataset.term;

                        paperSettings[
                            getGrade11TermId(
                                term
                            )
                        ] =
                            !isGrade11TermEnabled(
                                term
                            );

                        markUnsaved();

                        renderAll();

                    }
                );

            }
        );


    // -------------------------------------------------
    // PAST BUTTON
    // -------------------------------------------------

    const pastButton =
        grade11List.querySelector(
            ".grade11-past-btn"
        );

    if (pastButton) {

        pastButton.addEventListener(
            "click",
            () => {

                paperSettings[
                    "grade11_past_enabled"
                ] =
                    !isGrade11PastEnabled();

                markUnsaved();

                renderAll();

            }
        );

    }


    attachPaperToggles(
        grade11List
    );

}


// =====================================================
// A/L
// =====================================================

function renderAL() {

    if (!alList) {
        return;
    }

    alList.innerHTML = "";

    PAPER_CATALOG.al.forEach(
        group => {

            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "paper-group-header";

            header.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            group.group
                        )}
                    </strong>

                </div>

                <span>
                    ${group.papers.length} papers
                </span>

            `;

            alList.appendChild(
                header
            );

            group.papers.forEach(
                paper => {

                    alList.appendChild(
                        createPaperRow(
                            paper
                        )
                    );

                }
            );

        }
    );

    attachPaperToggles(
        alList
    );

}


// =====================================================
// ENABLE ALL
// =====================================================

if (enableAllBtn) {

    enableAllBtn.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Enable ALL papers for students?"
                )
            ) {
                return;
            }

            [
                ...PAPER_CATALOG.grade10,
                ...PAPER_CATALOG.grade11,
                ...PAPER_CATALOG.al
            ]
            .forEach(
                group => {

                    group.papers.forEach(
                        paper => {

                            paperSettings[
                                paper.id
                            ] = {

                                enabled:
                                    true,

                                updatedAt:
                                    Date.now()

                            };

                        }
                    );

                }
            );


            paperSettings.grade10_term1_enabled =
                true;

            paperSettings.grade10_term2_enabled =
                true;

            paperSettings.grade10_term3_enabled =
                true;


            paperSettings.grade11_term1_enabled =
                true;

            paperSettings.grade11_term2_enabled =
                true;

            paperSettings.grade11_term3_enabled =
                true;

            paperSettings.grade11_past_enabled =
                true;


            renderAll();

            markUnsaved();

        }
    );

}


// =====================================================
// DISABLE ALL
// =====================================================

if (disableAllBtn) {

    disableAllBtn.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Disable ALL papers for students?"
                )
            ) {
                return;
            }

            [
                ...PAPER_CATALOG.grade10,
                ...PAPER_CATALOG.grade11,
                ...PAPER_CATALOG.al
            ]
            .forEach(
                group => {

                    group.papers.forEach(
                        paper => {

                            paperSettings[
                                paper.id
                            ] = {

                                enabled:
                                    false,

                                updatedAt:
                                    Date.now()

                            };

                        }
                    );

                }
            );


            paperSettings.grade10_term1_enabled =
                false;

            paperSettings.grade10_term2_enabled =
                false;

            paperSettings.grade10_term3_enabled =
                false;


            paperSettings.grade11_term1_enabled =
                false;

            paperSettings.grade11_term2_enabled =
                false;

            paperSettings.grade11_term3_enabled =
                false;

            paperSettings.grade11_past_enabled =
                false;


            renderAll();

            markUnsaved();

        }
    );

}


// =====================================================
// SAVE
// =====================================================

async function saveSettings() {

    if (!hasUnsavedChanges) {

        alert(
            "There are no changes to save."
        );

        return;

    }

    if (saveBtn) {

        saveBtn.disabled =
            true;

        saveBtn.textContent =
            "Saving...";

    }


    try {

        const ref =
            doc(
                db,
                "paperSettings",
                "settings"
            );

        await setDoc(
            ref,
            {

                ...paperSettings,

                lastUpdatedAt:
                    Date.now(),

                updatedBy:
                    sessionStorage.getItem(
                        "adminUsername"
                    ) ||
                    sessionStorage.getItem(
                        "username"
                    ) ||
                    "superadmin"

            },
            {
                merge:
                    true
            }
        );


        hasUnsavedChanges =
            false;

        setChangesStatus(
            "Changes saved successfully"
        );

        alert(
            "Paper settings saved successfully."
        );

    }

    catch (error) {

        console.error(
            "Save settings error:",
            error
        );

        alert(
            "Failed to save settings.\n\n" +
            error.message
        );

        setChangesStatus(
            "Save failed"
        );

    }

    finally {

        if (saveBtn) {

            saveBtn.disabled =
                false;

            saveBtn.textContent =
                "💾 Save Changes";

        }

    }

}


if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        saveSettings
    );

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Are you sure you want to sign out?"
                )
            ) {
                return;
            }

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            sessionStorage.removeItem(
                "adminRole"
            );

            sessionStorage.removeItem(
                "adminUsername"
            );

            sessionStorage.removeItem(
                "username"
            );

            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// PREVENT LEAVE
// =====================================================

window.addEventListener(
    "beforeunload",
    event => {

        if (
            !hasUnsavedChanges
        ) {

            return;

        }

        event.preventDefault();

        event.returnValue = "";

    }
);


// =====================================================
// START
// =====================================================

loadSettings();


console.log(
    "================================"
);

console.log(
    "✅ Paper Settings Loaded"
);

console.log(
    "Grade 11 Term + Individual Paper Controls Active"
);

console.log(
    "================================"
);
