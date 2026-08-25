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


// =====================================================
// SUPER ADMIN ONLY
// =====================================================

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

    grade11: {}

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

                <span class="paper-status ${
                    enabled
                        ? "active"
                        : "disabled"
                }">

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
    // PAPER LIST
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
    // MODEL / TOP RANKING
    // =================================================

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


    // =================================================
    // PAST PAPERS
    // =================================================

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


    // =================================================
    // GROUP EXPAND / COLLAPSE
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


    // ---------------------------------------------
    // Do not create twice
    // ---------------------------------------------

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


            <!-- MODEL PAPERS -->

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

                    <span
                        style="
                            display:block;
                            color:#6d35f2;
                            font-size:9px;
                            font-weight:850;
                            letter-spacing:.12em;
                        "
                    >
                        STUDENT DASHBOARD
                    </span>

                    <strong
                        style="
                            display:block;
                            margin-top:3px;
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
                    style="
                        flex-shrink:0;
                    "
                >

                    <input
                        type="checkbox"
                        id="grade10ModelDashboardToggle"
                    >

                    <span class="slider"></span>

                </label>

            </div>


            <!-- PAST PAPERS -->

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

                    <span
                        style="
                            display:block;
                            color:#6d35f2;
                            font-size:9px;
                            font-weight:850;
                            letter-spacing:.12em;
                        "
                    >
                        STUDENT DASHBOARD
                    </span>

                    <strong
                        style="
                            display:block;
                            margin-top:3px;
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
                    style="
                        flex-shrink:0;
                    "
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


    // =================================================
    // GET TOGGLES
    // =================================================

    const modelToggle =
        document.getElementById(
            "grade10ModelDashboardToggle"
        );


    const pastToggle =
        document.getElementById(
            "grade10PastDashboardToggle"
        );


    // =================================================
    // SET CURRENT VALUES
    // =================================================

    modelToggle.checked =
        paperSettings.grade10.modelPapersEnabled === true;


    pastToggle.checked =
        paperSettings.grade10.pastPapersEnabled === true;


    // =================================================
    // MODEL TOGGLE
    // =================================================

    modelToggle.addEventListener(
        "change",
        function () {

            paperSettings.grade10.modelPapersEnabled =
                modelToggle.checked;


            markChanged();


            console.log(
                "Grade 10 Model Papers:",
                modelToggle.checked
            );

        }
    );


    // =================================================
    // PAST TOGGLE
    // =================================================

    pastToggle.addEventListener(
        "change",
        function () {

            paperSettings.grade10.pastPapersEnabled =
                pastToggle.checked;


            markChanged();


            console.log(
                "Grade 10 Past Papers:",
                pastToggle.checked
            );

        }
    );

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

            grade11: {}

        };


        snapshot.forEach(
            function (paperDoc) {

                const id =
                    paperDoc.id
                        .toLowerCase();


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


                if (
                    id === "grade11"
                ) {

                    paperSettings.grade11 =
                        paperDoc.data();

                }

            }
        );


        console.log(
            "✅ Firebase settings:",
            paperSettings
        );


        // =================================================
        // RENDER PAPERS
        // =================================================

        renderCategory(
            "grade10"
        );


        renderCategory(
            "grade11"
        );


        // =================================================
        // ADD GRADE 10 DASHBOARD CONTROLS
        // =================================================

        createGrade10DashboardControls();


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


            // Grade 10 dashboard buttons ON

            paperSettings.grade10.modelPapersEnabled =
                true;

            paperSettings.grade10.pastPapersEnabled =
                true;


            renderCategory(
                "grade10"
            );


            renderCategory(
                "grade11"
            );


            createGrade10DashboardControls();


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
                    "Disable all Grade 10 and Grade 11 papers and dashboard buttons?"
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


            // Grade 10 dashboard buttons OFF

            paperSettings.grade10.modelPapersEnabled =
                false;

            paperSettings.grade10.pastPapersEnabled =
                false;


            renderCategory(
                "grade10"
            );


            renderCategory(
                "grade11"
            );


            createGrade10DashboardControls();


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


                clearChanged();


                console.log(
                    "✅ Grade 10 settings saved:",
                    paperSettings.grade10
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
    "Grade 10 Dashboard Controls: ACTIVE"
);

console.log(
    "Grade 11: ACTIVE"
);

console.log(
    "A/L: HOLD"
);

console.log(
    "===================================="
);
