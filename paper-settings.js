// =====================================================
// FIREBASE
// =====================================================

import {
    db,
    collection,
    getDocs,
    doc,
    setDoc
} from "./firebase.js";


// =====================================================
// ADMIN PROTECTION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

const adminRole =
    String(
        sessionStorage.getItem("adminRole") || ""
    )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const adminUsername =
    sessionStorage.getItem("adminUsername") || "Admin";


if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


const isSuperAdmin =
    adminRole === "superadmin" ||
    adminRole === "full";


if (!isSuperAdmin) {

    alert(
        "🔒 Access denied. Super Administrator only."
    );

    window.location.replace(
        "admin.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const enableAllBtn =
    document.getElementById(
        "enableAllBtn"
    );

const disableAllBtn =
    document.getElementById(
        "disableAllBtn"
    );

const saveSettingsBtn =
    document.getElementById(
        "saveSettingsBtn"
    );

const changesStatus =
    document.getElementById(
        "changesStatus"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// PAPER CONFIGURATION
// =====================================================

const PAPER_CONFIG = {

    // =================================================
    // GRADE 10
    // =================================================

    grade10: {

        groups: [

            {
                id: "term1",
                title: "1st Term",
                subtitle: "Model Papers",
                type: "model",
                count: 5
            },

            {
                id: "term2",
                title: "2nd Term",
                subtitle: "Model Papers",
                type: "model",
                count: 5
            },

            {
                id: "term3",
                title: "3rd Term",
                subtitle: "Model Papers",
                type: "model",
                count: 5
            }

        ]

    },


    // =================================================
    // GRADE 11
    // =================================================

    grade11: {

        groups: [

            {
                id: "term1",
                title: "1st Term",
                subtitle: "Top Ranking Papers",
                type: "top-ranking",
                count: 5
            },

            {
                id: "term2",
                title: "2nd Term",
                subtitle: "Top Ranking Papers",
                type: "top-ranking",
                count: 5
            },

            {
                id: "term3",
                title: "3rd Term",
                subtitle: "Top Ranking Papers",
                type: "top-ranking",
                count: 5
            },

            {
                id: "past",
                title: "Past Papers",
                subtitle: "2016 - 2025",
                type: "past",

                years: [

                    2016,
                    2017,
                    2018,
                    2019,
                    2020,
                    2021,
                    2022,
                    2023,
                    2024,
                    2025

                ]

            }

        ]

    },


    // =================================================
    // A/L
    // =================================================

    al: {

        groups: [

            {
                id: "model",
                title: "Model Paper",
                subtitle: "A/L Model Papers",
                type: "al-single"
            },

            {
                id: "province",
                title: "Province Paper",
                subtitle: "A/L Province Papers",
                type: "al-single"
            }

        ]

    }

};


// =====================================================
// STATE
// =====================================================

let paperSettings = {

    grade10: {

        modelPapersEnabled: true,
        pastPapersEnabled: true

    },

    grade11: {},

    al: {

        modelPaperEnabled: true,
        provincePaperEnabled: true

    }

};


let hasUnsavedChanges =
    false;


// =====================================================
// ADMIN INFORMATION
// =====================================================

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );

const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


if (adminUsernameElement) {

    adminUsernameElement.textContent =
        adminUsername;

}


if (adminRoleElement) {

    adminRoleElement.textContent =
        "Super Administrator";

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            if (
                !confirm(
                    "Logout from Admin Panel?"
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


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// CHANGE STATUS
// =====================================================

function markChanged() {

    hasUnsavedChanges =
        true;


    if (changesStatus) {

        changesStatus.textContent =
            "Unsaved changes";

        changesStatus.style.color =
            "#dc2626";

    }

}


// =====================================================
// CLEAR CHANGE STATUS
// =====================================================

function clearChanged() {

    hasUnsavedChanges =
        false;


    if (changesStatus) {

        changesStatus.textContent =
            "No unsaved changes";

        changesStatus.style.color =
            "";

    }

}


// =====================================================
// FIELD NAME
// =====================================================

function getFieldName(
    category,
    group,
    number
) {

    return (
        category +
        "_" +
        group +
        "_" +
        String(number).padStart(
            2,
            "0"
        )
    );

}


// =====================================================
// GET PAPER VALUE
// =====================================================

function getPaperValue(
    category,
    field
) {

    return (
        paperSettings?.[
            category
        ]?.[field] === true
    );

}


// =====================================================
// SET PAPER VALUE
// =====================================================

function setPaperValue(
    category,
    field,
    value
) {

    if (
        !paperSettings[
            category
        ]
    ) {

        paperSettings[
            category
        ] = {};

    }


    paperSettings[
        category
    ][field] =
        value;

}


// =====================================================
// CREATE PAPER ITEM
// =====================================================

function createPaperItem(
    category,
    group,
    number,
    label
) {

    const field =
        getFieldName(
            category,
            group.id,
            number
        );


    let enabled;


    // =================================================
    // A/L
    // =================================================

    if (
        category === "al"
    ) {

        if (
            group.id === "model"
        ) {

            enabled =
                paperSettings
                    .al
                    .modelPaperEnabled === true;

        }
        else {

            enabled =
                paperSettings
                    .al
                    .provincePaperEnabled === true;

        }

    }


    // =================================================
    // GRADE 10 / 11
    // =================================================

    else {

        enabled =
            getPaperValue(
                category,
                field
            );

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "paper-item";


    item.dataset.category =
        category;


    item.dataset.field =
        field;


    item.innerHTML = `

        <div class="paper-info">

            <div class="paper-icon">
                📘
            </div>

            <div class="paper-details">

                <strong>
                    ${label}
                </strong>

                <span
                    class="paper-status ${
                        enabled
                            ? "active"
                            : "disabled"
                    }"
                >

                    ${
                        enabled
                            ? "Available to students"
                            : "Currently disabled"
                    }

                </span>

            </div>

        </div>


        <div class="paper-actions">

            <label class="switch">

                <input
                    type="checkbox"
                    class="paper-checkbox"
                    ${enabled ? "checked" : ""}
                >

                <span class="slider"></span>

            </label>

        </div>

    `;


    const checkbox =
        item.querySelector(
            ".paper-checkbox"
        );


    checkbox.addEventListener(
        "change",
        function () {

            // =========================================
            // A/L
            // =========================================

            if (
                category === "al"
            ) {

                if (
                    group.id === "model"
                ) {

                    paperSettings
                        .al
                        .modelPaperEnabled =
                            checkbox.checked;

                }
                else {

                    paperSettings
                        .al
                        .provincePaperEnabled =
                            checkbox.checked;

                }

            }


            // =========================================
            // OTHER
            // =========================================

            else {

                setPaperValue(
                    category,
                    field,
                    checkbox.checked
                );

            }


            const status =
                item.querySelector(
                    ".paper-status"
                );


            if (status) {

                status.textContent =
                    checkbox.checked
                        ? "Available to students"
                        : "Currently disabled";


                status.classList.toggle(
                    "active",
                    checkbox.checked
                );


                status.classList.toggle(
                    "disabled",
                    !checkbox.checked
                );

            }


            markChanged();

        }
    );


    return item;

}


// =====================================================
// CREATE GROUP
// =====================================================

function createGroup(
    category,
    group
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "paper-group";


    // =================================================
    // HEADER
    // =================================================

    const header =
        document.createElement(
            "div"
        );


    header.className =
        "paper-group-header";


    header.innerHTML = `

        <div>

            <span class="paper-group-label">
                ${group.title}
            </span>

            <h3>
                ${group.subtitle}
            </h3>

        </div>


        <button
            type="button"
            class="group-toggle"
        >
            Expand
        </button>

    `;


    wrapper.appendChild(
        header
    );


    // =================================================
    // LIST
    // =================================================

    const list =
        document.createElement(
            "div"
        );


    list.className =
        "paper-group-list";


    list.style.display =
        "none";


    // =================================================
    // A/L SINGLE PAPER
    // =================================================

    if (
        group.type ===
        "al-single"
    ) {

        list.appendChild(

            createPaperItem(
                category,
                group,
                1,
                group.title
            )

        );

    }


    // =================================================
    // MODEL / TOP RANKING
    // =================================================

    if (
        group.count
    ) {

        for (
            let i = 1;
            i <= group.count;
            i++
        ) {

            let label;


            if (
                group.type ===
                "top-ranking"
            ) {

                label =
                    `Top Ranking ${String(i).padStart(2, "0")}`;

            }
            else {

                label =
                    `Model Paper ${String(i).padStart(2, "0")}`;

            }


            list.appendChild(

                createPaperItem(
                    category,
                    group,
                    i,
                    label
                )

            );

        }

    }


    // =================================================
    // PAST PAPERS
    // =================================================

    if (
        group.years
    ) {

        group.years.forEach(
            function (
                year,
                index
            ) {

                list.appendChild(

                    createPaperItem(
                        category,
                        group,
                        index + 1,
                        `Past Paper ${year}`
                    )

                );

            }
        );

    }


    wrapper.appendChild(
        list
    );


    // =================================================
    // GROUP TOGGLE
    // =================================================

    const toggle =
        header.querySelector(
            ".group-toggle"
        );


    toggle.addEventListener(
        "click",
        function () {

            const isHidden =
                list.style.display ===
                "none";


            if (isHidden) {

                list.style.display =
                    "block";

                toggle.textContent =
                    "Collapse";

            }
            else {

                list.style.display =
                    "none";

                toggle.textContent =
                    "Expand";

            }

        }
    );


    return wrapper;

}


// =====================================================
// RENDER CATEGORY
// =====================================================

function renderCategory(
    category
) {

    const config =
        PAPER_CONFIG[
            category
        ];


    if (!config) {

        return;

    }


    let containerId;


    if (
        category ===
        "grade10"
    ) {

        containerId =
            "grade10PaperList";

    }
    else if (
        category ===
        "grade11"
    ) {

        containerId =
            "grade11PaperList";

    }
    else {

        containerId =
            "alPaperList";

    }


    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    config.groups.forEach(
        function (
            group
        ) {

            container.appendChild(

                createGroup(
                    category,
                    group
                )

            );

        }
    );

}


// =====================================================
// GRADE 10 DASHBOARD CONTROLS
// =====================================================

function createGrade10DashboardControls() {

    const container =
        document.getElementById(
            "grade10PaperList"
        );


    if (!container) {

        return;

    }


    const existing =
        document.getElementById(
            "grade10DashboardControls"
        );


    if (existing) {

        existing.remove();

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "grade10DashboardControls";


    controls.innerHTML = `

        <div
            style="
                padding:24px 20px 10px;
                background:#ffffff;
                border-top:1px solid #e2e8f0;
            "
        >

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong
                    style="
                        display:block;
                        color:#0f172a;
                        font-size:14px;
                        font-weight:800;
                    "
                >
                    Grade 10 Dashboard Controls
                </strong>

                <span
                    style="
                        display:block;
                        margin-top:5px;
                        color:#64748b;
                        font-size:11px;
                    "
                >
                    Control which main buttons students see.
                </span>

            </div>


            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:14px 0;
                    border-bottom:1px solid #eef2f7;
                "
            >

                <div>

                    <strong>
                        Model Papers
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:4px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Show or hide Model Papers.
                    </span>

                </div>


                <label class="switch">

                    <input
                        type="checkbox"
                        id="grade10ModelDashboardToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>


            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:14px 0;
                "
            >

                <div>

                    <strong>
                        Past Papers
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:4px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Show or hide Past Papers.
                    </span>

                </div>


                <label class="switch">

                    <input
                        type="checkbox"
                        id="grade10PastDashboardToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>

        </div>

    `;


    container.appendChild(
        controls
    );


    const modelToggle =
        document.getElementById(
            "grade10ModelDashboardToggle"
        );


    const pastToggle =
        document.getElementById(
            "grade10PastDashboardToggle"
        );


    modelToggle.checked =
        paperSettings
            .grade10
            .modelPapersEnabled === true;


    pastToggle.checked =
        paperSettings
            .grade10
            .pastPapersEnabled === true;


    modelToggle.addEventListener(
        "change",
        function () {

            paperSettings
                .grade10
                .modelPapersEnabled =
                    modelToggle.checked;

            markChanged();

        }
    );


    pastToggle.addEventListener(
        "change",
        function () {

            paperSettings
                .grade10
                .pastPapersEnabled =
                    pastToggle.checked;

            markChanged();

        }
    );

}


// =====================================================
// A/L DASHBOARD CONTROLS
// =====================================================

function createALDashboardControls() {

    const container =
        document.getElementById(
            "alPaperList"
        );


    if (!container) {

        return;

    }


    let controls =
        document.getElementById(
            "alDashboardControls"
        );


    if (controls) {

        controls.remove();

    }


    controls =
        document.createElement(
            "div"
        );


    controls.id =
        "alDashboardControls";


    controls.innerHTML = `

        <div
            style="
                padding:24px 20px 10px;
                background:#ffffff;
                border-top:1px solid #e2e8f0;
            "
        >

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong
                    style="
                        display:block;
                        color:#0f172a;
                        font-size:14px;
                        font-weight:800;
                    "
                >
                    A/L Dashboard Controls
                </strong>

                <span
                    style="
                        display:block;
                        margin-top:5px;
                        color:#64748b;
                        font-size:11px;
                    "
                >
                    Control which A/L paper buttons students see.
                </span>

            </div>


            <!-- MODEL PAPER -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:14px 0;
                    border-bottom:1px solid #eef2f7;
                "
            >

                <div>

                    <strong>
                        Model Paper
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:4px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Show or hide Model Paper for A/L students.
                    </span>

                </div>


                <label class="switch">

                    <input
                        type="checkbox"
                        id="alModelPaperDashboardToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>


            <!-- PROVINCE PAPER -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:14px 0;
                "
            >

                <div>

                    <strong>
                        Province Paper
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:4px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Show or hide Province Paper for A/L students.
                    </span>

                </div>


                <label class="switch">

                    <input
                        type="checkbox"
                        id="alProvincePaperDashboardToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>

        </div>

    `;


    container.appendChild(
        controls
    );


    const modelToggle =
        document.getElementById(
            "alModelPaperDashboardToggle"
        );


    const provinceToggle =
        document.getElementById(
            "alProvincePaperDashboardToggle"
        );


    modelToggle.checked =
        paperSettings
            .al
            .modelPaperEnabled === true;


    provinceToggle.checked =
        paperSettings
            .al
            .provincePaperEnabled === true;


    modelToggle.addEventListener(
        "change",
        function () {

            paperSettings
                .al
                .modelPaperEnabled =
                    modelToggle.checked;


            syncALPaperStatus(
                "model",
                modelToggle.checked
            );


            markChanged();

        }
    );


    provinceToggle.addEventListener(
        "change",
        function () {

            paperSettings
                .al
                .provincePaperEnabled =
                    provinceToggle.checked;


            syncALPaperStatus(
                "province",
                provinceToggle.checked
            );


            markChanged();

        }
    );

}


// =====================================================
// SYNC A/L STATUS
// =====================================================

function syncALPaperStatus(
    type,
    enabled
) {

    const toggleId =
        type === "model"
            ? "alModelPaperToggle"
            : "alProvincePaperToggle";


    const statusId =
        type === "model"
            ? "alModelPaperStatus"
            : "alProvincePaperStatus";


    const toggle =
        document.getElementById(
            toggleId
        );


    const status =
        document.getElementById(
            statusId
        );


    if (toggle) {

        toggle.checked =
            enabled;

    }


    if (status) {

        status.textContent =
            enabled
                ? "Available to students"
                : "Currently disabled";


        status.classList.toggle(
            "active",
            enabled
        );


        status.classList.toggle(
            "disabled",
            !enabled
        );

    }

}


// =====================================================
// LOAD FIREBASE SETTINGS
// =====================================================

async function loadSettings() {

    try {

        console.log(
            "📚 Loading paper settings..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "paperSettings"
                )
            );


        paperSettings = {

            grade10: {

                modelPapersEnabled: true,
                pastPapersEnabled: true

            },

            grade11: {},

            al: {

                modelPaperEnabled: true,
                provincePaperEnabled: true

            }

        };


        snapshot.forEach(
            function (
                paperDoc
            ) {

                const id =
                    paperDoc.id
                        .toLowerCase();


                // =====================================
                // GRADE 10
                // =====================================

                if (
                    id === "grade10"
                ) {

                    const data =
                        paperDoc.data();


                    paperSettings.grade10 =
                        {

                            ...data,

                            modelPapersEnabled:
                                data.modelPapersEnabled !== false,

                            pastPapersEnabled:
                                data.pastPapersEnabled !== false

                        };

                }


                // =====================================
                // GRADE 11
                // =====================================

                if (
                    id === "grade11"
                ) {

                    paperSettings.grade11 =
                        paperDoc.data();

                }


                // =====================================
                // A/L
                // =====================================

                if (
                    id === "al"
                ) {

                    const data =
                        paperDoc.data();


                    paperSettings.al = {

                        ...data,

                        modelPaperEnabled:
                            data.modelPaperEnabled !== false,

                        provincePaperEnabled:
                            data.provincePaperEnabled !== false

                    };

                }

            }
        );


        console.log(
            "✅ Firebase settings:",
            paperSettings
        );


        // =============================================
        // RENDER
        // =============================================

        renderCategory(
            "grade10"
        );


        renderCategory(
            "grade11"
        );


        renderCategory(
            "al"
        );


        // =============================================
        // CONTROLS
        // =============================================

        createGrade10DashboardControls();


        createALDashboardControls();


        clearChanged();


        console.log(
            "✅ Paper management loaded successfully."
        );

    }
    catch (
        error
    ) {

        console.error(
            "❌ Paper settings load error:",
            error
        );


        alert(
            "Failed to load paper settings.\n\n" +
            error.message
        );

    }

}


// =====================================================
// GET ALL PAPER FIELDS
// =====================================================

function getAllPaperFields() {

    const fields = [];


    Object.keys(
        PAPER_CONFIG
    ).forEach(
        function (
            category
        ) {

            PAPER_CONFIG[
                category
            ].groups.forEach(
                function (
                    group
                ) {

                    // =================================
                    // A/L
                    // =================================

                    if (
                        category === "al"
                    ) {

                        return;

                    }


                    // =================================
                    // COUNT
                    // =================================

                    if (
                        group.count
                    ) {

                        for (
                            let i = 1;
                            i <= group.count;
                            i++
                        ) {

                            fields.push({

                                category:
                                    category,

                                field:
                                    getFieldName(
                                        category,
                                        group.id,
                                        i
                                    )

                            });

                        }

                    }


                    // =================================
                    // YEARS
                    // =================================

                    if (
                        group.years
                    ) {

                        group.years.forEach(
                            function (
                                year,
                                index
                            ) {

                                fields.push({

                                    category:
                                        category,

                                    field:
                                        getFieldName(
                                            category,
                                            group.id,
                                            index + 1
                                        )

                                });

                            }
                        );

                    }

                }
            );

        }
    );


    return fields;

}


// =====================================================
// ENABLE ALL
// =====================================================

if (enableAllBtn) {

    enableAllBtn.addEventListener(
        "click",
        function () {

            // =========================================
            // Grade 10 / Grade 11
            // =========================================

            getAllPaperFields().forEach(
                function (
                    item
                ) {

                    setPaperValue(
                        item.category,
                        item.field,
                        true
                    );

                }
            );


            // =========================================
            // Grade 10 dashboard
            // =========================================

            paperSettings
                .grade10
                .modelPapersEnabled =
                    true;


            paperSettings
                .grade10
                .pastPapersEnabled =
                    true;


            // =========================================
            // A/L
            // =========================================

            paperSettings
                .al
                .modelPaperEnabled =
                    true;


            paperSettings
                .al
                .provincePaperEnabled =
                    true;


            // =========================================
            // RENDER
            // =========================================

            renderCategory(
                "grade10"
            );


            renderCategory(
                "grade11"
            );


            renderCategory(
                "al"
            );


            createGrade10DashboardControls();


            createALDashboardControls();


            markChanged();

        }
    );

}


// =====================================================
// DISABLE ALL
// =====================================================

if (disableAllBtn) {

    disableAllBtn.addEventListener(
        "click",
        function () {

            if (
                !confirm(
                    "Disable all Grade 10, Grade 11 and A/L papers?"
                )
            ) {

                return;

            }


            // =========================================
            // Grade 10 / Grade 11
            // =========================================

            getAllPaperFields().forEach(
                function (
                    item
                ) {

                    setPaperValue(
                        item.category,
                        item.field,
                        false
                    );

                }
            );


            // =========================================
            // Grade 10 dashboard
            // =========================================

            paperSettings
                .grade10
                .modelPapersEnabled =
                    false;


            paperSettings
                .grade10
                .pastPapersEnabled =
                    false;


            // =========================================
            // A/L
            // =========================================

            paperSettings
                .al
                .modelPaperEnabled =
                    false;


            paperSettings
                .al
                .provincePaperEnabled =
                    false;


            // =========================================
            // RENDER
            // =========================================

            renderCategory(
                "grade10"
            );


            renderCategory(
                "grade11"
            );


            renderCategory(
                "al"
            );


            createGrade10DashboardControls();


            createALDashboardControls();


            markChanged();

        }
    );

}


// =====================================================
// SAVE SETTINGS
// =====================================================

if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
        "click",
        async function () {

            if (
                !hasUnsavedChanges
            ) {

                alert(
                    "There are no changes to save."
                );

                return;

            }


            saveSettingsBtn.disabled =
                true;


            saveSettingsBtn.textContent =
                "Saving...";


            try {

                // =====================================
                // GRADE 10
                // =====================================

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade10"
                    ),
                    paperSettings.grade10
                );


                // =====================================
                // GRADE 11
                // =====================================

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade11"
                    ),
                    paperSettings.grade11
                );


                // =====================================
                // A/L
                // =====================================

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "al"
                    ),
                    paperSettings.al
                );


                clearChanged();


                console.log(
                    "✅ Grade 10 settings saved:",
                    paperSettings.grade10
                );


                console.log(
                    "✅ Grade 11 settings saved:",
                    paperSettings.grade11
                );


                console.log(
                    "✅ A/L settings saved:",
                    paperSettings.al
                );


                alert(
                    "✅ Paper settings saved successfully."
                );

            }
            catch (
                error
            ) {

                console.error(
                    "❌ Save error:",
                    error
                );


                alert(
                    "Failed to save settings.\n\n" +
                    error.message
                );

            }
            finally {

                saveSettingsBtn.disabled =
                    false;


                saveSettingsBtn.textContent =
                    "💾 Save Changes";

            }

        }
    );

}


// =====================================================
// UNSAVED CHANGES WARNING
// =====================================================

window.addEventListener(
    "beforeunload",
    function (
        event
    ) {

        if (
            !hasUnsavedChanges
        ) {

            return;

        }


        event.preventDefault();

        event.returnValue =
            "";

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

loadSettings();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "===================================="
);

console.log(
    "📚 PAPER MANAGEMENT"
);

console.log(
    "Admin:",
    adminUsername
);

console.log(
    "Role:",
    adminRole
);

console.log(
    "Grade 10 Dashboard Controls: ACTIVE"
);

console.log(
    "Grade 11: ACTIVE"
);

console.log(
    "A/L: MODEL + PROVINCE ACTIVE"
);

console.log(
    "===================================="
);
