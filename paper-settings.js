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


const isSuperAdmin =
    adminRole === "full" ||
    adminRole === "superadmin";


if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

    throw new Error(
        "Admin not logged in"
    );

}


if (!isSuperAdmin) {

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
            termNumber: "1",

            papers: [

                {
                    id: "grade10_term1_model_01",
                    title: "1st Term - Model Paper 01",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term1_model_02",
                    title: "1st Term - Model Paper 02",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term1_model_03",
                    title: "1st Term - Model Paper 03",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term1_model_04",
                    title: "1st Term - Model Paper 04",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term1_model_05",
                    title: "1st Term - Model Paper 05",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                }

            ]
        },


        {
            group: "2nd Term",
            termNumber: "2",

            papers: [

                {
                    id: "grade10_term2_model_01",
                    title: "2nd Term - Model Paper 01",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term2_model_02",
                    title: "2nd Term - Model Paper 02",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term2_model_03",
                    title: "2nd Term - Model Paper 03",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term2_model_04",
                    title: "2nd Term - Model Paper 04",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term2_model_05",
                    title: "2nd Term - Model Paper 05",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                }

            ]
        },


        {
            group: "3rd Term",
            termNumber: "3",

            papers: [

                {
                    id: "grade10_term3_model_01",
                    title: "3rd Term - Model Paper 01",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term3_model_02",
                    title: "3rd Term - Model Paper 02",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term3_model_03",
                    title: "3rd Term - Model Paper 03",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term3_model_04",
                    title: "3rd Term - Model Paper 04",
                    description:
                        "MCQ Paper • Question Paper • Answers"
                },

                {
                    id: "grade10_term3_model_05",
                    title: "3rd Term - Model Paper 05",
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

        // =============================================
        // 1ST TERM TOP RANKING
        // =============================================

        {
            group: "1st Term - TOP Ranking",
            termNumber: "1",
            type: "topRanking",

            papers: [

                {
                    id: "grade11_term1_top_01",
                    title: "1st Term - TOP Ranking 01",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term1_top_02",
                    title: "1st Term - TOP Ranking 02",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term1_top_03",
                    title: "1st Term - TOP Ranking 03",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term1_top_04",
                    title: "1st Term - TOP Ranking 04",
                    description:
                        "Part A & Part B"
                }

            ]
        },


        // =============================================
        // 2ND TERM TOP RANKING
        // =============================================

        {
            group: "2nd Term - TOP Ranking",
            termNumber: "2",
            type: "topRanking",

            papers: [

                {
                    id: "grade11_term2_top_01",
                    title: "2nd Term - TOP Ranking 01",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term2_top_02",
                    title: "2nd Term - TOP Ranking 02",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term2_top_03",
                    title: "2nd Term - TOP Ranking 03",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term2_top_04",
                    title: "2nd Term - TOP Ranking 04",
                    description:
                        "Part A & Part B"
                }

            ]
        },


        // =============================================
        // 3RD TERM TOP RANKING
        // =============================================

        {
            group: "3rd Term - TOP Ranking",
            termNumber: "3",
            type: "topRanking",

            papers: [

                {
                    id: "grade11_term3_top_01",
                    title: "3rd Term - TOP Ranking 01",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term3_top_02",
                    title: "3rd Term - TOP Ranking 02",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term3_top_03",
                    title: "3rd Term - TOP Ranking 03",
                    description:
                        "Part A & Part B"
                },

                {
                    id: "grade11_term3_top_04",
                    title: "3rd Term - TOP Ranking 04",
                    description:
                        "Part A & Part B"
                }

            ]
        },


        // =============================================
        // TERM TEST PAPERS
        // =============================================

        {
            group: "Term Test Papers",
            type: "termTest",

            papers: [

                {
                    id: "grade11_termtest_01",
                    title: "Term Test Paper 01",
                    description:
                        "Question Paper • Answer Scheme"
                },

                {
                    id: "grade11_termtest_02",
                    title: "Term Test Paper 02",
                    description:
                        "Question Paper • Answer Scheme"
                },

                {
                    id: "grade11_termtest_03",
                    title: "Term Test Paper 03",
                    description:
                        "Question Paper • Answer Scheme"
                },

                {
                    id: "grade11_termtest_04",
                    title: "Term Test Paper 04",
                    description:
                        "Question Paper • Answer Scheme"
                }

            ]
        },


        // =============================================
        // PAST PAPERS
        // =============================================

        {
            group: "Past Papers (2016 – 2025)",
            type: "past",

            papers: [

                {
                    id: "grade11_past_2016",
                    title: "2016 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2017",
                    title: "2017 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2018",
                    title: "2018 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2019",
                    title: "2019 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2020",
                    title: "2020 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2021",
                    title: "2021 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2022",
                    title: "2022 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2023",
                    title: "2023 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2024",
                    title: "2024 Past Paper",
                    description:
                        "Past Examination Paper"
                },

                {
                    id: "grade11_past_2025",
                    title: "2025 Past Paper",
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
            group: "Model Papers",
            type: "model",

            papers: [

                {
                    id: "al_model_01",
                    title: "Model Paper 01",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_02",
                    title: "Model Paper 02",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_03",
                    title: "Model Paper 03",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_04",
                    title: "Model Paper 04",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_05",
                    title: "Model Paper 05",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_06",
                    title: "Model Paper 06",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_07",
                    title: "Model Paper 07",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_08",
                    title: "Model Paper 08",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_09",
                    title: "Model Paper 09",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_10",
                    title: "Model Paper 10",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_11",
                    title: "Model Paper 11",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_12",
                    title: "Model Paper 12",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_13",
                    title: "Model Paper 13",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_14",
                    title: "Model Paper 14",
                    description:
                        "Paper • Answers • Marking Scheme"
                },

                {
                    id: "al_model_15",
                    title: "Model Paper 15",
                    description:
                        "Paper • Answers • Marking Scheme"
                }

            ]
        },


        {
            group: "Province Papers",
            type: "province",

            papers: [

                {
                    id: "al_province_western",
                    title: "Western Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_central",
                    title: "Central Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_southern",
                    title: "Southern Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_northern",
                    title: "Northern Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_north_western",
                    title: "North Western Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_eastern",
                    title: "Eastern Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_uva",
                    title: "Uva Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_sabaragamuwa",
                    title: "Sabaragamuwa Province",
                    description:
                        "Province Paper • Answer Scheme"
                },

                {
                    id: "al_province_all_island",
                    title: "All Island Papers",
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


    // New papers are active by default

    return true;

}


// =====================================================
// TERM SETTING ID
// =====================================================

function getGrade10TermSettingId(
    termNumber
) {

    return (
        `grade10_term${termNumber}_enabled`
    );

}


function getGrade11TermSettingId(
    termNumber
) {

    return (
        `grade11_term${termNumber}_enabled`
    );

}


// =====================================================
// PAST PAPERS SETTING ID
// =====================================================

function getGrade11PastSettingId() {

    return "grade11_past_enabled";

}


// =====================================================
// TERM STATUS
// =====================================================

function isGrade10TermEnabled(
    termNumber
) {

    const id =
        getGrade10TermSettingId(
            termNumber
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


function isGrade11TermEnabled(
    termNumber
) {

    const id =
        getGrade11TermSettingId(
            termNumber
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
// PAST PAPER STATUS
// =====================================================

function isGrade11PastEnabled() {

    const id =
        getGrade11PastSettingId();


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
// LOAD FIRESTORE SETTINGS
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


        console.log(
            "Loaded paper settings:",
            paperSettings
        );


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


    renderCategory(
        "grade11",
        grade11List
    );


    renderCategory(
        "al",
        alList
    );


    setupSectionButtons();

}


// =====================================================
// RENDER CATEGORY
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

            // =========================================
            // GROUP HEADER
            // =========================================

            const groupHeader =
                document.createElement(
                    "div"
                );


            groupHeader.className =
                "paper-group-header";


            // =========================================
            // GRADE 10 TERM
            // =========================================

            if (
                category === "grade10" &&
                group.termNumber
            ) {

                const termEnabled =
                    isGrade10TermEnabled(
                        group.termNumber
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
                        data-term-category="grade10"
                        data-term-number="${group.termNumber}"
                    >

                        ${
                            termEnabled
                                ? "Disable Term"
                                : "Enable Term"
                        }

                    </button>

                `;

            }


            // =========================================
            // GRADE 11 TOP RANKING TERM
            // =========================================

            else if (
                category === "grade11" &&
                group.type === "topRanking" &&
                group.termNumber
            ) {

                const termEnabled =
                    isGrade11TermEnabled(
                        group.termNumber
                    );


                groupHeader.innerHTML = `

                    <div>

                        <strong>
                            🏆 ${escapeHTML(
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
                        data-term-category="grade11"
                        data-term-number="${group.termNumber}"
                    >

                        ${
                            termEnabled
                                ? "Disable Term"
                                : "Enable Term"
                        }

                    </button>

                `;

            }


            // =========================================
            // GRADE 11 PAST PAPERS
            // =========================================

            else if (
                category === "grade11" &&
                group.type === "past"
            ) {

                const enabled =
                    isGrade11PastEnabled();


                groupHeader.innerHTML = `

                    <div>

                        <strong>
                            📖 ${escapeHTML(
                                group.group
                            )}
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
                        class="past-toggle-btn"
                    >

                        ${
                            enabled
                                ? "Disable Past Papers"
                                : "Enable Past Papers"
                        }

                    </button>

                `;

            }


            // =========================================
            // OTHER GROUPS
            // =========================================

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


            // =========================================
            // PAPER ITEMS
            // =========================================

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


    attachTermToggleEvents(
        container
    );


    attachPastToggleEvents(
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
// TERM TOGGLE EVENTS
// =====================================================

function attachTermToggleEvents(
    container
) {

    const buttons =
        container.querySelectorAll(
            ".term-toggle-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const category =
                        button.dataset.termCategory;


                    const termNumber =
                        button.dataset.termNumber;


                    let settingId;


                    if (
                        category ===
                        "grade10"
                    ) {

                        settingId =
                            getGrade10TermSettingId(
                                termNumber
                            );

                    }

                    else {

                        settingId =
                            getGrade11TermSettingId(
                                termNumber
                            );

                    }


                    const current =
                        category ===
                        "grade10"
                            ? isGrade10TermEnabled(
                                termNumber
                            )
                            : isGrade11TermEnabled(
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
// PAST PAPERS TOGGLE
// =====================================================

function attachPastToggleEvents(
    container
) {

    const buttons =
        container.querySelectorAll(
            ".past-toggle-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const current =
                        isGrade11PastEnabled();


                    paperSettings[
                        getGrade11PastSettingId()
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
// UPDATE PAPER STATUS UI
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


                    const expanded =
                        section.classList.toggle(
                            "expanded"
                        );


                    button.textContent =
                        expanded
                            ? "Collapse"
                            : "Expand";


                    console.log(
                        category,
                        expanded
                            ? "Expanded"
                            : "Collapsed"
                    );

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
                    "Enable ALL papers and all terms?"
                );


            if (!confirmed) {
                return;
            }


            const now =
                Date.now();


            getAllPapers()
                .forEach(
                    paper => {

                        paperSettings[
                            paper.id
                        ] = {

                            enabled:
                                true,

                            updatedAt:
                                now

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


            // Grade 11 past papers

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
                    "Disable ALL papers and all terms?"
                );


            if (!confirmed) {
                return;
            }


            const now =
                Date.now();


            getAllPapers()
                .forEach(
                    paper => {

                        paperSettings[
                            paper.id
                        ] = {

                            enabled:
                                false,

                            updatedAt:
                                now

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


            // Grade 11 past papers

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
    "Grade 10: 1st / 2nd / 3rd Terms"
);

console.log(
    "Grade 11: 1st / 2nd / 3rd TOP Ranking"
);

console.log(
    "Grade 11: Past Papers"
);

console.log(
    "Grade 11: Term Test Papers"
);

console.log(
    "A/L: Model + Province Papers"
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
