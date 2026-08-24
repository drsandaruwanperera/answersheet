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
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


const adminRole =
    String(
        sessionStorage.getItem(
            "adminRole"
        ) || ""
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

            papers: [

                {
                    id:
                        "grade10_term1_model_01",

                    title:
                        "1st Term - Model Paper 01",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term1_model_02",

                    title:
                        "1st Term - Model Paper 02",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term1_model_03",

                    title:
                        "1st Term - Model Paper 03",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term1_model_04",

                    title:
                        "1st Term - Model Paper 04",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term1_model_05",

                    title:
                        "1st Term - Model Paper 05",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                }

            ]
        },


        {
            group: "2nd Term",

            papers: [

                {
                    id:
                        "grade10_term2_model_01",

                    title:
                        "2nd Term - Model Paper 01",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term2_model_02",

                    title:
                        "2nd Term - Model Paper 02",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term2_model_03",

                    title:
                        "2nd Term - Model Paper 03",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term2_model_04",

                    title:
                        "2nd Term - Model Paper 04",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term2_model_05",

                    title:
                        "2nd Term - Model Paper 05",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                }

            ]
        },


        {
            group: "3rd Term",

            papers: [

                {
                    id:
                        "grade10_term3_model_01",

                    title:
                        "3rd Term - Model Paper 01",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term3_model_02",

                    title:
                        "3rd Term - Model Paper 02",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term3_model_03",

                    title:
                        "3rd Term - Model Paper 03",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term3_model_04",

                    title:
                        "3rd Term - Model Paper 04",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id:
                        "grade10_term3_model_05",

                    title:
                        "3rd Term - Model Paper 05",

                    description:
                        "MCQ Paper • Question Paper • Answers"
                }

            ]
        }

    ],


    // =================================================
    // GRADE 11
    // =================================================

    grade11: [

        {
            group:
                "Term Test Papers",

            papers: [

                {
                    id:
                        "grade11_termtest_01",

                    title:
                        "Term Test Paper 01",

                    description:
                        "Question Paper • Answer Scheme"
                },

                {
                    id:
                        "grade11_termtest_02",

                    title:
                        "Term Test Paper 02",

                    description:
                        "Question Paper • Answer Scheme"
                },

                {
                    id:
                        "grade11_termtest_03",

                    title:
                        "Term Test Paper 03",

                    description:
                        "Question Paper • Answer Scheme"
                },

                {
                    id:
                        "grade11_termtest_04",

                    title:
                        "Term Test Paper 04",

                    description:
                        "Question Paper • Answer Scheme"
                }

            ]
        },


        {
            group:
                "Past Papers (2016 – 2025)",

            papers: [

                {
                    id:
                        "grade11_past_2016",

                    title:
                        "2016 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2017",

                    title:
                        "2017 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2018",

                    title:
                        "2018 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2019",

                    title:
                        "2019 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2020",

                    title:
                        "2020 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2021",

                    title:
                        "2021 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2022",

                    title:
                        "2022 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2023",

                    title:
                        "2023 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2024",

                    title:
                        "2024 Past Paper",

                    description:
                        "Past Examination Paper"
                },

                {
                    id:
                        "grade11_past_2025",

                    title:
                        "2025 Past Paper",

                    description:
                        "Past Examination Paper"
                }

            ]
        }

    ],


    // =================================================
    // A/L
    // =================================================

    al: [

        {
            group:
                "Model Papers",

            papers: [

                {
                    id:
                        "al_model_01",

                    title:
                        "Model Paper 01",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_02",

                    title:
                        "Model Paper 02",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_03",

                    title:
                        "Model Paper 03",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_04",

                    title:
                        "Model Paper 04",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_05",

                    title:
                        "Model Paper 05",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_06",

                    title:
                        "Model Paper 06",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_07",

                    title:
                        "Model Paper 07",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_08",

                    title:
                        "Model Paper 08",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_09",

                    title:
                        "Model Paper 09",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_10",

                    title:
                        "Model Paper 10",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_11",

                    title:
                        "Model Paper 11",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_12",

                    title:
                        "Model Paper 12",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_13",

                    title:
                        "Model Paper 13",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_14",

                    title:
                        "Model Paper 14",

                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id:
                        "al_model_15",

                    title:
                        "Model Paper 15",

                    description:
                        "Paper • Answers • Marking Scheme"
                }

            ]
        },


        {
            group:
                "Province Papers",

            papers: [

                {
                    id:
                        "al_province_western",

                    title:
                        "Western Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_central",

                    title:
                        "Central Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_southern",

                    title:
                        "Southern Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_northern",

                    title:
                        "Northern Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_north_western",

                    title:
                        "North Western Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_eastern",

                    title:
                        "Eastern Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_uva",

                    title:
                        "Uva Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_sabaragamuwa",

                    title:
                        "Sabaragamuwa Province",

                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id:
                        "al_province_all_island",

                    title:
                        "All Island Papers",

                    description:
                        "Province / Island-wide Papers"
                }

            ]
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
// SETTING HELPERS
// =====================================================

// -----------------------------
// Grade 10 Terms
// -----------------------------

function getGrade10TermSettingId(
    termNumber
) {

    return (
        `grade10_term${termNumber}_enabled`
    );

}


function isGrade10TermEnabled(
    termNumber
) {

    const settingId =
        getGrade10TermSettingId(
            termNumber
        );


    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            settingId
        )
    ) {

        return true;

    }


    return (
        paperSettings[
            settingId
        ] === true
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


// -----------------------------
// Grade 11 TOP Ranking Terms
// -----------------------------

function getGrade11TermSettingId(
    termNumber
) {

    return (
        `grade11_term${termNumber}_enabled`
    );

}


function isGrade11TermEnabled(
    termNumber
) {

    const settingId =
        getGrade11TermSettingId(
            termNumber
        );


    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            settingId
        )
    ) {

        return true;

    }


    return (
        paperSettings[
            settingId
        ] === true
    );

}


// -----------------------------
// Grade 11 Past Papers
// -----------------------------

function isGrade11PastEnabled() {

    const settingId =
        "grade11_past_enabled";


    if (
        !Object.prototype.hasOwnProperty.call(
            paperSettings,
            settingId
        )
    ) {

        return true;

    }


    return (
        paperSettings[
            settingId
        ] === true
    );

}


// =====================================================
// CHECK PAPER STATUS
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
            paperSettings[
                id
            ]?.enabled === true
        );

    }


    return true;

}


// =====================================================
// GET ALL PAPERS
// =====================================================

function getAllPapers() {

    const result = [];


    Object.keys(
        PAPER_CATALOG
    )
    .forEach(
        category => {

            PAPER_CATALOG[
                category
            ]
            .forEach(
                group => {

                    group.papers
                        .forEach(
                            paper => {

                                result.push({

                                    ...paper,

                                    category,

                                    group:
                                        group.group

                                });

                            }
                        );

                }
            );

        }
    );


    return result;

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


        if (
            snap.exists()
        ) {

            paperSettings =
                snap.data() || {};

        }

        else {

            paperSettings = {};

        }


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
// RENDER EVERYTHING
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
// RENDER GRADE 11
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


    container.innerHTML = "";


    // =================================================
    // TOP RANKING HEADER
    // =================================================

    const topHeader =
        document.createElement(
            "div"
        );


    topHeader.className =
        "paper-group-header";


    topHeader.innerHTML = `

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
        topHeader
    );


    // =================================================
    // TOP RANKING TERMS
    // =================================================

    for (
        let term = 1;
        term <= 3;
        term++
    ) {

        const enabled =
            isGrade11TermEnabled(
                String(term)
            );


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "paper-group-header";


        row.innerHTML = `

            <div>

                <strong>
                    🏆 ${term === 1
                        ? "1st Term"
                        : term === 2
                            ? "2nd Term"
                            : "3rd Term"
                    }
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
                class="term-toggle-btn"
                data-grade11-term="${term}"
            >

                ${
                    enabled
                        ? "Disable Term"
                        : "Enable Term"
                }

            </button>

        `;


        container.appendChild(
            row
        );

    }


    // =================================================
    // PAST PAPERS HEADER
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
            class="past-toggle-btn"
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
    // EXISTING GRADE 11 PAPER GROUPS
    // =================================================

    const groups =
        PAPER_CATALOG.grade11 || [];


    groups.forEach(
        group => {

            const groupHeader =
                document.createElement(
                    "div"
                );


            groupHeader.className =
                "paper-group-header";


            const isPastGroup =
                group.group
                    .toLowerCase()
                    .includes(
                        "past papers"
                    );


            // -----------------------------
            // Term Test Header
            // -----------------------------

            if (
                !isPastGroup
            ) {

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


            // -----------------------------
            // Past Papers
            // -----------------------------

            else {

                // Past header already exists above,
                // so don't create another header.

                groupHeader.style.display =
                    "none";

            }


            container.appendChild(
                groupHeader
            );


            // -----------------------------
            // Papers
            // -----------------------------

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


                    // Hide past paper rows
                    // only in admin UI when
                    // past access is disabled.

                    if (
                        isPastGroup &&
                        !pastEnabled
                    ) {

                        item.style.opacity =
                            "0.55";

                    }


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


    // =================================================
    // GRADE 11 EVENTS
    // =================================================

    attachGrade11TermEvents(
        container
    );


    attachGrade11PastEvent(
        container
    );


    attachToggleEvents(
        container
    );

}


// =====================================================
// GRADE 11 TERM EVENTS
// =====================================================

function attachGrade11TermEvents(
    container
) {

    const buttons =
        container.querySelectorAll(
            "[data-grade11-term]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const term =
                        button.dataset.grade11Term;


                    const settingId =
                        getGrade11TermSettingId(
                            term
                        );


                    const current =
                        isGrade11TermEnabled(
                            term
                        );


                    paperSettings[
                        settingId
                    ] =
                        !current;


                    markUnsaved();


                    renderAll();

                }
            );

        }
    );

}


// =====================================================
// GRADE 11 PAST EVENT
// =====================================================

function attachGrade11PastEvent(
    container
) {

    const button =
        container.querySelector(
            ".past-toggle-btn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const settingId =
                "grade11_past_enabled";


            const current =
                isGrade11PastEnabled();


            paperSettings[
                settingId
            ] =
                !current;


            markUnsaved();


            renderAll();

        }
    );

}


// =====================================================
// RENDER OTHER CATEGORIES
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


            const termEnabled =
                termNumber
                    ? isGrade10TermEnabled(
                        termNumber
                    )
                    : true;


            if (
                category === "grade10" &&
                termNumber
            ) {

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


    attachToggleEvents(
        container
    );


    attachGrade10TermEvents(
        container
    );

}


// =====================================================
// PAPER TOGGLE EVENTS
// =====================================================

function attachToggleEvents(
    container
) {

    const toggles =
        container.querySelectorAll(
            ".paper-toggle"
        );


    toggles.forEach(
        toggle => {

            toggle.addEventListener(
                "change",
                () => {

                    const id =
                        toggle.dataset.paperId;


                    const enabled =
                        toggle.checked;


                    paperSettings[
                        id
                    ] = {

                        enabled:
                            enabled,

                        updatedAt:
                            Date.now()

                    };


                    updateStatusUI(
                        toggle,
                        enabled
                    );


                    markUnsaved();

                }
            );

        }
    );

}


// =====================================================
// GRADE 10 TERM EVENTS
// =====================================================

function attachGrade10TermEvents(
    container
) {

    const buttons =
        container.querySelectorAll(
            ".term-toggle-btn[data-term-number]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const termNumber =
                        button.dataset.termNumber;


                    const settingId =
                        getGrade10TermSettingId(
                            termNumber
                        );


                    const current =
                        isGrade10TermEnabled(
                            termNumber
                        );


                    paperSettings[
                        settingId
                    ] =
                        !current;


                    markUnsaved();


                    renderAll();

                }
            );

        }
    );

}


// =====================================================
// UPDATE STATUS UI
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
// EXPAND / COLLAPSE
// =====================================================

function setupSectionButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-section-toggle]"
        );


    console.log(
        "Expand buttons found:",
        buttons.length
    );


    buttons.forEach(
        button => {

            button.onclick =
                null;


            button.onclick =
                function () {

                    const category =
                        button.dataset.sectionToggle;


                    const section =
                        document.querySelector(
                            `.paper-section[data-category="${category}"]`
                        );


                    if (!section) {

                        console.error(
                            "Section not found:",
                            category
                        );

                        return;

                    }


                    const isExpanded =
                        section.classList.toggle(
                            "expanded"
                        );


                    button.textContent =
                        isExpanded
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

            const confirmed =
                confirm(
                    "Enable ALL papers and Grade 10 / Grade 11 access?"
                );


            if (!confirmed) {
                return;
            }


            getAllPapers()
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


            // Grade 11 TOP Ranking terms

            paperSettings[
                "grade11_term1_enabled"
            ] = true;

            paperSettings[
                "grade11_term2_enabled"
            ] = true;

            paperSettings[
                "grade11_term3_enabled"
            ] = true;


            // Grade 11 Past Papers

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

            const confirmed =
                confirm(
                    "Disable ALL papers and Grade 10 / Grade 11 access?"
                );


            if (!confirmed) {
                return;
            }


            getAllPapers()
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


            // Grade 11 TOP Ranking terms

            paperSettings[
                "grade11_term1_enabled"
            ] = false;

            paperSettings[
                "grade11_term2_enabled"
            ] = false;

            paperSettings[
                "grade11_term3_enabled"
            ] = false;


            // Grade 11 Past Papers

            paperSettings[
                "grade11_past_enabled"
            ] = false;


            renderAll();

            markUnsaved();

        }
    );

}


// =====================================================
// MARK UNSAVED
// =====================================================

function markUnsaved() {

    hasUnsavedChanges =
        true;


    setChangesStatus(
        "You have unsaved changes"
    );

}


// =====================================================
// STATUS TEXT
// =====================================================

function setChangesStatus(
    text
) {

    if (changesStatus) {

        changesStatus.textContent =
            text;

    }

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

            const confirmed =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {
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
// ESCAPE HTML
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
    "Grade 11 TOP Ranking controls enabled"
);

console.log(
    "Grade 11 Past Papers control enabled"
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
