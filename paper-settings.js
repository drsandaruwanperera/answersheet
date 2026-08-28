// =====================================================
// FIREBASE IMPORTS
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

// Support both old and current HTML IDs

const enableAllBtn =
    document.getElementById("enableAll") ||
    document.getElementById("enableAllBtn");


const disableAllBtn =
    document.getElementById("disableAll") ||
    document.getElementById("disableAllBtn");


const saveSettingsBtn =
    document.getElementById("saveSettings") ||
    document.getElementById("saveSettingsBtn");


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

        provincePaperEnabled: true,

        modelPaperDashboardEnabled: true,

        provincePaperDashboardEnabled: true

    }

};


let hasUnsavedChanges = false;


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

    hasUnsavedChanges = true;


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

    hasUnsavedChanges = false;


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
    ][field] = value;

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


    const enabled =
        getPaperValue(
            category,
            field
        );


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

            setPaperValue(
                category,
                field,
                checkbox.checked
            );


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


    // -------------------------------------------------
    // HEADER
    // -------------------------------------------------

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


    // -------------------------------------------------
    // LIST
    // -------------------------------------------------

    const list =
        document.createElement(
            "div"
        );


    list.className =
        "paper-group-list";


    list.style.display =
        "none";


    // -------------------------------------------------
    // MODEL / TOP RANKING
    // -------------------------------------------------

    if (group.count) {

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


    // -------------------------------------------------
    // PAST PAPERS
    // -------------------------------------------------

    if (group.years) {

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


    // -------------------------------------------------
    // EXPAND / COLLAPSE
    // -------------------------------------------------

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


    const container =
        document.getElementById(
            category === "grade10"
                ? "grade10PaperList"
                : "grade11PaperList"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    config.groups.forEach(
        function (group) {

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

                    <strong
                        style="
                            display:block;
                            color:#0f172a;
                            font-size:13px;
                        "
                    >
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
                        Show or hide the Model Papers button on the Grade 10 student dashboard.
                    </span>

                </div>


                <label
                    class="switch"
                    style="flex-shrink:0;"
                >

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

                    <strong
                        style="
                            display:block;
                            color:#0f172a;
                            font-size:13px;
                        "
                    >
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
                        Show or hide the Past Papers button on the Grade 10 student dashboard.
                    </span>

                </div>


                <label
                    class="switch"
                    style="flex-shrink:0;"
                >

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
        paperSettings.grade10.modelPapersEnabled === true;


    pastToggle.checked =
        paperSettings.grade10.pastPapersEnabled === true;


    modelToggle.addEventListener(
        "change",
        function () {

            paperSettings.grade10.modelPapersEnabled =
                modelToggle.checked;

            markChanged();

        }
    );


    pastToggle.addEventListener(
        "change",
        function () {

            paperSettings.grade10.pastPapersEnabled =
                pastToggle.checked;

            markChanged();

        }
    );

}


// =====================================================
// A/L PAPER MANAGEMENT
// =====================================================

function createALManagement() {

    const possibleContainers = [

        document.getElementById(
            "alPaperList"
        ),

        document.getElementById(
            "alManagement"
        ),

        document.getElementById(
            "alPaperManagement"
        ),

        document.querySelector(
            ".al-paper-management"
        )

    ];


    const container =
        possibleContainers.find(
            element => element
        );


    if (!container) {

        console.warn(
            "A/L paper container not found."
        );

        return;

    }


    // -------------------------------------------------
    // CLEAR ONLY GENERATED A/L CONTENT
    // -------------------------------------------------

    let generated =
        container.querySelector(
            "#generatedALControls"
        );


    if (generated) {

        generated.remove();

    }


    generated =
        document.createElement(
            "div"
        );


    generated.id =
        "generatedALControls";


    generated.innerHTML = `

        <div
            style="
                padding:24px 20px;
                background:#ffffff;
                border-top:1px solid #e2e8f0;
            "
        >

            <div
                style="
                    margin-bottom:20px;
                "
            >

                <span
                    style="
                        display:block;
                        color:#6d35f2;
                        font-size:10px;
                        font-weight:850;
                        letter-spacing:.12em;
                    "
                >
                    A/L DASHBOARD CONTROLS
                </span>

                <h3
                    style="
                        margin:5px 0 0;
                        color:#0f172a;
                        font-size:17px;
                    "
                >
                    A/L Paper Controls
                </h3>

                <p
                    style="
                        margin:5px 0 0;
                        color:#64748b;
                        font-size:11px;
                    "
                >
                    Control which A/L paper buttons students can see.
                </p>

            </div>


            <!-- MODEL PAPER -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:16px 0;
                    border-bottom:1px solid #eef2f7;
                "
            >

                <div>

                    <strong
                        style="
                            display:block;
                            color:#0f172a;
                            font-size:14px;
                        "
                    >
                        Model Paper
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:5px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Enable or disable A/L Model Papers.
                    </span>

                </div>


                <label
                    class="switch"
                    style="flex-shrink:0;"
                >

                    <input
                        type="checkbox"
                        id="alModelPaperToggle"
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
                    padding:16px 0;
                    border-bottom:1px solid #eef2f7;
                "
            >

                <div>

                    <strong
                        style="
                            display:block;
                            color:#0f172a;
                            font-size:14px;
                        "
                    >
                        Province Paper
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:5px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Enable or disable A/L Province Papers.
                    </span>

                </div>


                <label
                    class="switch"
                    style="flex-shrink:0;"
                >

                    <input
                        type="checkbox"
                        id="alProvincePaperToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>


            <!-- DASHBOARD MODEL -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:16px 0;
                    border-bottom:1px solid #eef2f7;
                "
            >

                <div>

                    <strong
                        style="
                            display:block;
                            color:#0f172a;
                            font-size:14px;
                        "
                    >
                        Model Paper Button
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:5px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Show or hide Model Paper on the A/L student dashboard.
                    </span>

                </div>


                <label
                    class="switch"
                    style="flex-shrink:0;"
                >

                    <input
                        type="checkbox"
                        id="alModelPaperDashboardToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>


            <!-- DASHBOARD PROVINCE -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:16px 0;
                "
            >

                <div>

                    <strong
                        style="
                            display:block;
                            color:#0f172a;
                            font-size:14px;
                        "
                    >
                        Province Paper Button
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:5px;
                            color:#64748b;
                            font-size:10px;
                        "
                    >
                        Show or hide Province Paper on the A/L student dashboard.
                    </span>

                </div>


                <label
                    class="switch"
                    style="flex-shrink:0;"
                >

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
        generated
    );


    setupALControls();

}


// =====================================================
// SETUP A/L CONTROLS
// =====================================================

function setupALControls() {

    if (!paperSettings.al) {

        paperSettings.al = {

            modelPaperEnabled: true,

            provincePaperEnabled: true,

            modelPaperDashboardEnabled: true,

            provincePaperDashboardEnabled: true

        };

    }


    const modelToggle =
        document.getElementById(
            "alModelPaperToggle"
        );


    const provinceToggle =
        document.getElementById(
            "alProvincePaperToggle"
        );


    const modelDashboardToggle =
        document.getElementById(
            "alModelPaperDashboardToggle"
        );


    const provinceDashboardToggle =
        document.getElementById(
            "alProvincePaperDashboardToggle"
        );


    if (modelToggle) {

        modelToggle.checked =
            paperSettings.al.modelPaperEnabled !== false;


        modelToggle.addEventListener(
            "change",
            function () {

                paperSettings.al.modelPaperEnabled =
                    modelToggle.checked;

                markChanged();

            }
        );

    }


    if (provinceToggle) {

        provinceToggle.checked =
            paperSettings.al.provincePaperEnabled !== false;


        provinceToggle.addEventListener(
            "change",
            function () {

                paperSettings.al.provincePaperEnabled =
                    provinceToggle.checked;

                markChanged();

            }
        );

    }


    if (modelDashboardToggle) {

        modelDashboardToggle.checked =
            paperSettings.al.modelPaperDashboardEnabled !== false;


        modelDashboardToggle.addEventListener(
            "change",
            function () {

                paperSettings.al.modelPaperDashboardEnabled =
                    modelDashboardToggle.checked;

                markChanged();

            }
        );

    }


    if (provinceDashboardToggle) {

        provinceDashboardToggle.checked =
            paperSettings.al.provincePaperDashboardEnabled !== false;


        provinceDashboardToggle.addEventListener(
            "change",
            function () {

                paperSettings.al.provincePaperDashboardEnabled =
                    provinceDashboardToggle.checked;

                markChanged();

            }
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

                provincePaperEnabled: true,

                modelPaperDashboardEnabled: true,

                provincePaperDashboardEnabled: true

            }

        };


        snapshot.forEach(
            function (paperDoc) {

                const id =
                    paperDoc.id
                        .toLowerCase();


                const data =
                    paperDoc.data();


                // -----------------------------------------
                // GRADE 10
                // -----------------------------------------

                if (
                    id === "grade10"
                ) {

                    paperSettings.grade10 = {

                        ...data,

                        modelPapersEnabled:
                            data.modelPapersEnabled !== false,

                        pastPapersEnabled:
                            data.pastPapersEnabled !== false

                    };

                }


                // -----------------------------------------
                // GRADE 11
                // -----------------------------------------

                if (
                    id === "grade11"
                ) {

                    paperSettings.grade11 =
                        data;

                }


                // -----------------------------------------
                // A/L
                // -----------------------------------------

                if (
                    id === "al"
                ) {

                    paperSettings.al = {

                        ...data,

                        modelPaperEnabled:
                            data.modelPaperEnabled !== false,

                        provincePaperEnabled:
                            data.provincePaperEnabled !== false,

                        modelPaperDashboardEnabled:
                            data.modelPaperDashboardEnabled !== false,

                        provincePaperDashboardEnabled:
                            data.provincePaperDashboardEnabled !== false

                    };

                }

            }
        );


        console.log(
            "✅ Firebase settings:",
            paperSettings
        );


        // =================================================
        // RENDER EXISTING GRADE 10
        // =================================================

        renderCategory(
            "grade10"
        );


        // =================================================
        // RENDER EXISTING GRADE 11
        // =================================================

        renderCategory(
            "grade11"
        );


        // =================================================
        // GRADE 10 CONTROLS
        // =================================================

        createGrade10DashboardControls();


        // =================================================
        // A/L CONTROLS
        // =================================================

        createALManagement();


        clearChanged();


        console.log(
            "✅ Paper management loaded successfully."
        );

    }
    catch (error) {

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
        function (category) {

            PAPER_CONFIG[
                category
            ].groups.forEach(
                function (group) {

                    if (group.count) {

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


                    if (group.years) {

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

            getAllPaperFields().forEach(
                function (item) {

                    setPaperValue(
                        item.category,
                        item.field,
                        true
                    );

                }
            );


            // Grade 10

            paperSettings.grade10.modelPapersEnabled =
                true;

            paperSettings.grade10.pastPapersEnabled =
                true;


            // Grade 11 remains existing fields,
            // all generated paper fields already ON.


            // A/L

            paperSettings.al.modelPaperEnabled =
                true;

            paperSettings.al.provincePaperEnabled =
                true;

            paperSettings.al.modelPaperDashboardEnabled =
                true;

            paperSettings.al.provincePaperDashboardEnabled =
                true;


            renderCategory(
                "grade10"
            );


            renderCategory(
                "grade11"
            );


            createGrade10DashboardControls();


            createALManagement();


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
                    "Disable all Grade 10, Grade 11 and A/L papers and dashboard buttons?"
                )
            ) {

                return;

            }


            getAllPaperFields().forEach(
                function (item) {

                    setPaperValue(
                        item.category,
                        item.field,
                        false
                    );

                }
            );


            // Grade 10

            paperSettings.grade10.modelPapersEnabled =
                false;

            paperSettings.grade10.pastPapersEnabled =
                false;


            // A/L

            paperSettings.al.modelPaperEnabled =
                false;

            paperSettings.al.provincePaperEnabled =
                false;

            paperSettings.al.modelPaperDashboardEnabled =
                false;

            paperSettings.al.provincePaperDashboardEnabled =
                false;


            renderCategory(
                "grade10"
            );


            renderCategory(
                "grade11"
            );


            createGrade10DashboardControls();


            createALManagement();


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

            if (!hasUnsavedChanges) {

                alert(
                    "There are no changes to save."
                );

                return;

            }


            saveSettingsBtn.disabled =
                true;


            const originalText =
                saveSettingsBtn.textContent;


            saveSettingsBtn.textContent =
                "Saving...";


            try {

                // -----------------------------------------
                // SAVE GRADE 10
                // -----------------------------------------

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade10"
                    ),
                    paperSettings.grade10
                );


                // -----------------------------------------
                // SAVE GRADE 11
                // -----------------------------------------

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade11"
                    ),
                    paperSettings.grade11
                );


                // -----------------------------------------
                // SAVE A/L
                // -----------------------------------------

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
                    "✅ Grade 10 saved:",
                    paperSettings.grade10
                );


                console.log(
                    "✅ Grade 11 saved:",
                    paperSettings.grade11
                );


                console.log(
                    "✅ A/L saved:",
                    paperSettings.al
                );


                alert(
                    "✅ Paper settings saved successfully."
                );

            }
            catch (error) {

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
                    originalText ||
                    "💾 Save Changes";

            }

        }
    );

}
else {

    console.error(
        "❌ Save button not found. Expected #saveSettings."
    );

}


// =====================================================
// UNSAVED CHANGES WARNING
// =====================================================

window.addEventListener(
    "beforeunload",
    function (event) {

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
    "Grade 10: ACTIVE"
);

console.log(
    "Grade 11: ACTIVE"
);

console.log(
    "A/L: ACTIVE"
);

console.log(
    "A/L Model Paper: ACTIVE"
);

console.log(
    "A/L Province Paper: ACTIVE"
);

console.log(
    "Firebase Save: ACTIVE"
);

console.log(
    "===================================="
);
