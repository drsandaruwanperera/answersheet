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
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


// =====================================================
// CHECK LOGIN
// =====================================================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// SUPER ADMIN
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
//
// A/L is intentionally on HOLD.
// =====================================================

const PAPER_CONFIG = {

    grade10: {

        title: "Grade 10",

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

        title: "Grade 11",

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
                subtitle: "Previous Examination Papers",
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

    grade10: {},

    grade11: {}

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
        () => {

            const confirmed =
                confirm(
                    "Logout from Admin Panel?"
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


            window.location.replace(
                "admin-login.html"
            );

        }
    );

}


// =====================================================
// MARK CHANGED
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
// CLEAR CHANGED
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
    groupId,
    number
) {

    return (
        category +
        "_" +
        groupId +
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


    item.dataset.group =
        group.id;


    item.dataset.field =
        field;


    item.innerHTML = `

        <div class="paper-item-info">

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


        <label class="paper-switch-control">

            <input
                type="checkbox"
                class="paper-checkbox"
                ${enabled ? "checked" : ""}
            >

            <span class="switch-slider"></span>

        </label>

    `;


    const checkbox =
        item.querySelector(
            ".paper-checkbox"
        );


    if (checkbox) {

        checkbox.addEventListener(
            "change",
            () => {

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

    }


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
    // GROUP HEADER
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


    /*
        IMPORTANT:
        Use the class that matches the new CSS.
    */

    list.className =
        "group-papers";


    list.style.display =
        "none";


    // =================================================
    // MODEL PAPERS
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
        Array.isArray(
            group.years
        )
    ) {

        group.years.forEach(
            (year, index) => {

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


    if (toggle) {

        toggle.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const isOpen =
                    wrapper.classList.contains(
                        "group-expanded"
                    );


                if (isOpen) {

                    wrapper.classList.remove(
                        "group-expanded"
                    );


                    list.style.display =
                        "none";


                    toggle.textContent =
                        "Expand";

                }
                else {

                    wrapper.classList.add(
                        "group-expanded"
                    );


                    list.style.display =
                        "block";


                    toggle.textContent =
                        "Collapse";

                }

            }
        );

    }


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


    let container;


    if (
        category ===
        "grade10"
    ) {

        container =
            document.getElementById(
                "grade10PaperList"
            );

    }


    if (
        category ===
        "grade11"
    ) {

        container =
            document.getElementById(
                "grade11PaperList"
            );

    }


    if (!container) {

        console.warn(
            "Paper container not found:",
            category
        );

        return;

    }


    container.innerHTML =
        "";


    config.groups.forEach(
        group => {

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
// MAIN SECTION EXPAND / COLLAPSE
// =====================================================
//
// THIS WAS MISSING IN YOUR OLD JS.
// =====================================================

function setupSectionToggles() {

    const sectionToggles =
        document.querySelectorAll(
            ".section-toggle"
        );


    sectionToggles.forEach(
        toggle => {

            /*
                Prevent duplicate listeners
                if function is called again.
            */

            if (
                toggle.dataset.bound ===
                "true"
            ) {

                return;

            }


            toggle.dataset.bound =
                "true";


            toggle.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const category =
                        toggle.dataset.sectionToggle;


                    const section =
                        document.querySelector(
                            `.paper-section[data-category="${category}"]`
                        );


                    if (!section) {

                        console.warn(
                            "Section not found:",
                            category
                        );

                        return;

                    }


                    const list =
                        section.querySelector(
                            ".paper-list"
                        );


                    if (!list) {

                        console.warn(
                            "Paper list not found:",
                            category
                        );

                        return;

                    }


                    const isExpanded =
                        section.classList.contains(
                            "expanded"
                        );


                    if (isExpanded) {

                        section.classList.remove(
                            "expanded"
                        );


                        list.style.display =
                            "none";


                        toggle.textContent =
                            "Expand";

                    }
                    else {

                        section.classList.add(
                            "expanded"
                        );


                        list.style.display =
                            "block";


                        toggle.textContent =
                            "Collapse";

                    }

                }
            );

        }
    );

}


// =====================================================
// LOAD FIREBASE SETTINGS
// =====================================================

async function loadSettings() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "paperSettings"
                )
            );


        paperSettings = {

            grade10: {},

            grade11: {}

        };


        snapshot.forEach(
            paperDoc => {

                const id =
                    paperDoc.id
                        .trim()
                        .toLowerCase();


                if (
                    id ===
                    "grade10"
                ) {

                    paperSettings.grade10 =
                        paperDoc.data();

                }


                if (
                    id ===
                    "grade11"
                ) {

                    paperSettings.grade11 =
                        paperDoc.data();

                }

            }
        );


        // =================================================
        // RENDER
        // =================================================

        renderCategory(
            "grade10"
        );


        renderCategory(
            "grade11"
        );


        // =================================================
        // MAIN SECTION BUTTONS
        // =================================================

        setupSectionToggles();


        clearChanged();


        console.log(
            "================================="
        );


        console.log(
            "✅ PAPER SETTINGS LOADED"
        );


        console.log(
            paperSettings
        );


        console.log(
            "================================="
        );

    }
    catch (error) {

        console.error(
            "Paper settings load error:",
            error
        );


        alert(
            "Failed to load paper settings.\n\n" +
            error.message
        );

    }

}


// =====================================================
// SET ALL PAPERS
// =====================================================

function setAllPapers(
    value
) {

    [
        "grade10",
        "grade11"
    ]
    .forEach(
        category => {

            const config =
                PAPER_CONFIG[
                    category
                ];


            config.groups.forEach(
                group => {

                    // ---------------------------------
                    // COUNT PAPERS
                    // ---------------------------------

                    if (
                        group.count
                    ) {

                        for (
                            let i = 1;
                            i <= group.count;
                            i++
                        ) {

                            const field =
                                getFieldName(
                                    category,
                                    group.id,
                                    i
                                );


                            setPaperValue(
                                category,
                                field,
                                value
                            );

                        }

                    }


                    // ---------------------------------
                    // PAST PAPER YEARS
                    // ---------------------------------

                    if (
                        Array.isArray(
                            group.years
                        )
                    ) {

                        group.years.forEach(
                            (year, index) => {

                                const field =
                                    getFieldName(
                                        category,
                                        group.id,
                                        index + 1
                                    );


                                setPaperValue(
                                    category,
                                    field,
                                    value
                                );

                            }
                        );

                    }

                }
            );

        }
    );


    renderCategory(
        "grade10"
    );


    renderCategory(
        "grade11"
    );


    setupSectionToggles();


    markChanged();

}


// =====================================================
// ENABLE ALL
// =====================================================

if (enableAllBtn) {

    enableAllBtn.addEventListener(
        "click",
        () => {

            setAllPapers(
                true
            );

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
                    "Disable all Grade 10 and Grade 11 papers?"
                );


            if (!confirmed) {
                return;
            }


            setAllPapers(
                false
            );

        }
    );

}


// =====================================================
// SAVE SETTINGS
// =====================================================

if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
        "click",
        async () => {

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

                // -----------------------------------------
                // GRADE 10
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
                // GRADE 11
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


                alert(
                    "✅ Paper settings saved successfully."
                );

            }
            catch (error) {

                console.error(
                    "Paper settings save error:",
                    error
                );


                alert(
                    "Failed to save paper settings.\n\n" +
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
// INITIAL LOAD
// =====================================================

loadSettings();


// =====================================================
// UNSAVED CHANGES WARNING
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

        event.returnValue =
            "";

    }
);


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "================================="
);

console.log(
    "📚 PAPER MANAGEMENT SYSTEM"
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
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "Grade 10: Model Papers 01–05"
);

console.log(
    "Grade 11: Top Ranking 01–05"
);

console.log(
    "Grade 11: Past Papers 2016–2025"
);

console.log(
    "A/L: HOLD"
);

console.log(
    "================================="
);
