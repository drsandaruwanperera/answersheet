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
// PAPER CATALOG
// =====================================================

const PAPER_CATALOG = {

    // =================================================
    // GRADE 10
    // =================================================

    grade10: [

        {
            group: "1st Term",

            papers: Array.from(
                {
                    length: 5
                },
                (_, i) => ({

                    id:
                        `grade10_term1_model_${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    title:
                        `1st Term - Model Paper ${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    description:
                        "MCQ Paper • Question Paper • Answers"

                })
            )
        },


        {
            group: "2nd Term",

            papers: Array.from(
                {
                    length: 5
                },
                (_, i) => ({

                    id:
                        `grade10_term2_model_${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    title:
                        `2nd Term - Model Paper ${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    description:
                        "MCQ Paper • Question Paper • Answers"

                })
            )
        },


        {
            group: "3rd Term",

            papers: Array.from(
                {
                    length: 5
                },
                (_, i) => ({

                    id:
                        `grade10_term3_model_${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    title:
                        `3rd Term - Model Paper ${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    description:
                        "MCQ Paper • Question Paper • Answers"

                })
            )
        }

    ],


    // =================================================
    // GRADE 11
    // =================================================
    //
    // IMPORTANT:
    // Grade 11 is controlled by TERM.
    //
    // 1st Term
    // 2nd Term
    // 3rd Term
    // Past Papers
    //
    // No individual paper switches here.
    // =================================================

    grade11: [],


    // =================================================
    // A/L
    // =================================================

    al: [

        {
            group:
                "Model Papers",

            papers: Array.from(
                {
                    length: 15
                },
                (_, i) => ({

                    id:
                        `al_model_${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    title:
                        `Model Paper ${String(
                            i + 1
                        ).padStart(
                            2,
                            "0"
                        )}`,

                    description:
                        "Paper • Answers • Marking Scheme"

                })
            )
        },


        {
            group:
                "Province Papers",

            papers: [

                [
                    "western",
                    "Western Province"
                ],

                [
                    "central",
                    "Central Province"
                ],

                [
                    "southern",
                    "Southern Province"
                ],

                [
                    "northern",
                    "Northern Province"
                ],

                [
                    "north_western",
                    "North Western Province"
                ],

                [
                    "eastern",
                    "Eastern Province"
                ],

                [
                    "uva",
                    "Uva Province"
                ],

                [
                    "sabaragamuwa",
                    "Sabaragamuwa Province"
                ],

                [
                    "all_island",
                    "All Island Papers"
                ]

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
// SETTINGS
// =====================================================

let paperSettings = {};

let hasUnsavedChanges =
    false;


// =====================================================
// HELPERS
// =====================================================

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


function escapeHTML(
    value
) {

    return String(value)

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

function getGrade10TermSettingId(
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
        getGrade10TermSettingId(
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
    groupName
) {

    if (
        groupName === "1st Term"
    ) {

        return "1";

    }

    if (
        groupName === "2nd Term"
    ) {

        return "2";

    }

    if (
        groupName === "3rd Term"
    ) {

        return "3";

    }

    return null;

}


// =====================================================
// GRADE 11 TERM SETTINGS
// =====================================================

function getGrade11TermSettingId(
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
        getGrade11TermSettingId(
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

        const snap =
            await getDoc(
                ref
            );

        paperSettings =
            snap.exists()
                ? snap.data() || {}
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

    renderCategory(
        "grade10",
        grade10List
    );

    renderGrade11(
        grade11List
    );

    renderCategory(
        "al",
        alList
    );

    setupSectionButtons();

}


// =====================================================
// RENDER GRADE 10 / A-L
// =====================================================

function renderCategory(
    category,
    container
) {

    if (!container) {

        console.error(
            "Paper container not found:",
            category
        );

        return;

    }

    container.innerHTML =
        "";

    const groups =
        PAPER_CATALOG[
            category
        ] || [];

    groups.forEach(
        group => {

            const groupHeader =
                document.createElement(
                    "div"
                );

            groupHeader.className =
                "paper-group-header";

            const termNumber =
                category === "grade10"
                    ? getGrade10TermNumber(
                        group.group
                    )
                    : null;


            // -----------------------------------------
            // GRADE 10 TERM HEADER
            // -----------------------------------------

            if (
                category === "grade10" &&
                termNumber
            ) {

                const termEnabled =
                    isGrade10TermEnabled(
                        termNumber
                    );

                groupHeader.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                group.group
                            )}
                        </strong>

                        <span
                            style="
                                margin-left:10px;
                                font-size:13px;
                                font-weight:600;
                                color:${
                                    termEnabled
                                        ? "#16a34a"
                                        : "#dc2626"
                                };
                            "
                        >

                            ${
                                termEnabled
                                    ? "Active"
                                    : "Disabled"
                            }

                        </span>

                    </div>


                    <button
                        type="button"
                        class="term-toggle-btn"
                        data-term-number="${termNumber}"
                    >

                        ${
                            termEnabled
                                ? "Disable Term"
                                : "Enable Term"
                        }

                    </button>

                `;

            }

            else {

                groupHeader.innerHTML = `

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

            }


            container.appendChild(
                groupHeader
            );


            // -----------------------------------------
            // PAPERS
            // -----------------------------------------

            group.papers.forEach(
                paper => {

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

                    item.dataset.paperId =
                        paper.id;

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

                    container.appendChild(
                        item
                    );

                }
            );

        }
    );


    // -----------------------------------------
    // PAPER TOGGLES
    // -----------------------------------------

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

                        updateStatusUI(
                            toggle,
                            toggle.checked
                        );

                        markUnsaved();

                    }
                );

            }
        );


    // -----------------------------------------
    // GRADE 10 TERM TOGGLES
    // -----------------------------------------

    container
        .querySelectorAll(
            ".term-toggle-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const term =
                            button.dataset.termNumber;

                        const id =
                            getGrade10TermSettingId(
                                term
                            );

                        paperSettings[id] =
                            !isGrade10TermEnabled(
                                term
                            );

                        markUnsaved();

                        renderAll();

                    }
                );

            }
        );

}


// =====================================================
// RENDER GRADE 11
// =====================================================
//
// IMPORTANT:
// Only these are shown:
//
// 1st Term
// 2nd Term
// 3rd Term
// Past Papers
//
// No Term Test Paper 01/02/03/04.
// No individual Grade 11 paper switches.
// =====================================================

function renderGrade11(
    container
) {

    if (!container) {

        console.error(
            "Grade 11 container not found."
        );

        return;

    }


    container.innerHTML =
        "";


    // =================================================
    // TOP RANKING
    // =================================================

    const topHeading =
        document.createElement(
            "div"
        );

    topHeading.className =
        "paper-group-header";

    topHeading.innerHTML = `

        <div>

            <strong>
                🏆 TOP Ranking
            </strong>

            <span
                style="
                    margin-left:10px;
                    font-size:13px;
                    font-weight:600;
                    color:#6d35f2;
                "
            >
                Student Access
            </span>

        </div>

    `;

    container.appendChild(
        topHeading
    );


    // =================================================
    // TERMS
    // =================================================

    const terms = [

        [
            "1",
            "1st Term"
        ],

        [
            "2",
            "2nd Term"
        ],

        [
            "3",
            "3rd Term"
        ]

    ];


    terms.forEach(
        ([term, title]) => {

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
                        🏆 ${title}
                    </strong>

                    <span
                        style="
                            margin-left:10px;
                            font-size:13px;
                            font-weight:600;
                            color:${
                                enabled
                                    ? "#16a34a"
                                    : "#dc2626"
                            };
                        "
                    >

                        ${
                            enabled
                                ? "Active"
                                : "Disabled"
                        }

                    </span>

                </div>


                <button
                    type="button"
                    class="grade11-term-toggle"
                    data-term="${term}"
                >

                    ${
                        enabled
                            ? "Disable Term"
                            : "Enable Term"
                    }

                </button>

            `;


            container.appendChild(
                header
            );

        }
    );


    // =================================================
    // PAST PAPERS
    // =================================================

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

            <span
                style="
                    margin-left:10px;
                    font-size:13px;
                    font-weight:600;
                    color:${
                        pastEnabled
                            ? "#16a34a"
                            : "#dc2626"
                    };
                "
            >

                ${
                    pastEnabled
                        ? "Active"
                        : "Disabled"
                }

            </span>

        </div>


        <button
            type="button"
            class="grade11-past-toggle"
        >

            ${
                pastEnabled
                    ? "Disable Past Papers"
                    : "Enable Past Papers"
            }

        </button>

    `;


    container.appendChild(
        pastHeader
    );


    // =================================================
    // TERM EVENTS
    // =================================================

    container
        .querySelectorAll(
            ".grade11-term-toggle"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const term =
                            button.dataset.term;

                        const id =
                            getGrade11TermSettingId(
                                term
                            );

                        paperSettings[id] =
                            !isGrade11TermEnabled(
                                term
                            );

                        markUnsaved();

                        renderAll();

                    }
                );

            }
        );


    // =================================================
    // PAST PAPER EVENT
    // =================================================

    const pastButton =
        container.querySelector(
            ".grade11-past-toggle"
        );


    if (pastButton) {

        pastButton.addEventListener(
            "click",
            () => {

                paperSettings.grade11_past_enabled =
                    !isGrade11PastEnabled();

                markUnsaved();

                renderAll();

            }
        );

    }

}


// =====================================================
// UPDATE PAPER STATUS
// =====================================================

function updateStatusUI(
    toggle,
    enabled
) {

    const item =
        toggle.closest(
            ".paper-item"
        );

    if (!item) {
        return;
    }


    const status =
        item.querySelector(
            "[data-status]"
        );

    if (!status) {
        return;
    }


    status.textContent =
        enabled
            ? "Active"
            : "Disabled";


    status.classList.toggle(
        "active",
        enabled
    );

    status.classList.toggle(
        "disabled",
        !enabled
    );

}


// =====================================================
// SECTION BUTTONS
// =====================================================

function setupSectionButtons() {

    document
        .querySelectorAll(
            "[data-section-toggle]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        const category =
                            button.dataset.sectionToggle;

                        const section =
                            document.querySelector(
                                `.paper-section[data-category="${category}"]`
                            );

                        if (!section) {
                            return;
                        }


                        const expanded =
                            section.classList.toggle(
                                "expanded"
                            );


                        button.textContent =
                            expanded
                                ? "Collapse"
                                : "Expand";

                    };

            }
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


            // Grade 10 + A/L

            Object.keys(
                PAPER_CATALOG
            )
            .forEach(
                category => {

                    if (
                        category ===
                        "grade11"
                    ) {

                        return;

                    }


                    PAPER_CATALOG[
                        category
                    ]
                    .forEach(
                        group => {

                            group.papers
                                .forEach(
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

                }
            );


            // Grade 10 terms

            paperSettings[
                "grade10_term1_enabled"
            ] = true;

            paperSettings[
                "grade10_term2_enabled"
            ] = true;

            paperSettings[
                "grade10_term3_enabled"
            ] = true;


            // Grade 11 terms

            paperSettings[
                "grade11_term1_enabled"
            ] = true;

            paperSettings[
                "grade11_term2_enabled"
            ] = true;

            paperSettings[
                "grade11_term3_enabled"
            ] = true;


            // Grade 11 past

            paperSettings[
                "grade11_past_enabled"
            ] = true;


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


            // Grade 10 + A/L

            Object.keys(
                PAPER_CATALOG
            )
            .forEach(
                category => {

                    if (
                        category ===
                        "grade11"
                    ) {

                        return;

                    }


                    PAPER_CATALOG[
                        category
                    ]
                    .forEach(
                        group => {

                            group.papers
                                .forEach(
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

                }
            );


            // Grade 10 terms

            paperSettings[
                "grade10_term1_enabled"
            ] = false;

            paperSettings[
                "grade10_term2_enabled"
            ] = false;

            paperSettings[
                "grade10_term3_enabled"
            ] = false;


            // Grade 11 terms

            paperSettings[
                "grade11_term1_enabled"
            ] = false;

            paperSettings[
                "grade11_term2_enabled"
            ] = false;

            paperSettings[
                "grade11_term3_enabled"
            ] = false;


            // Grade 11 past

            paperSettings[
                "grade11_past_enabled"
            ] = false;


            renderAll();

            markUnsaved();

        }
    );

}


// =====================================================
// SAVE SETTINGS
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
            "Failed to save paper settings.\n\n" +
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


// =====================================================
// SAVE BUTTON
// =====================================================

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
// PREVENT ACCIDENTAL LEAVE
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
    "======================================"
);

console.log(
    "✅ PAPER SETTINGS JS LOADED"
);

console.log(
    "Grade 11: 1st / 2nd / 3rd Term controls"
);

console.log(
    "Grade 11: Past Papers control"
);

console.log(
    "Super Admin:",
    adminUsername
        ? adminUsername.textContent
        : "unknown"
);

console.log(
    "Role:",
    adminRole
);

console.log(
    "======================================"
);
