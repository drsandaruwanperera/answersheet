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
//
// A/L intentionally excluded for now.
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
// ADMIN INFO
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
// RESET CHANGE STATUS
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
// FIREBASE FIELD NAME
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
        String(number)
            .padStart(2, "0")
    );

}


// =====================================================
// GET / SET PAPER VALUE
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

            <div>

                <strong>
                    ${label}
                </strong>

                <span class="paper-status">
                    ${
                        enabled
                            ? "Available to students"
                            : "Currently disabled"
                    }
                </span>

            </div>

        </div>


        <label class="paper-switch">

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


    // -----------------------------------------------
    // GROUP HEADER
    // -----------------------------------------------

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


    // -----------------------------------------------
    // PAPER LIST
    // -----------------------------------------------

    const list =
        document.createElement(
            "div"
        );


    list.className =
        "paper-group-list";


    list.style.display =
        "none";


    // -----------------------------------------------
    // MODEL / TOP RANKING
    // -----------------------------------------------

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


    // -----------------------------------------------
    // PAST PAPERS
    // -----------------------------------------------

    if (
        group.years
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


    // -----------------------------------------------
    // EXPAND / COLLAPSE
    // -----------------------------------------------

    const toggle =
        header.querySelector(
            ".group-toggle"
        );


    toggle.addEventListener(
        "click",
        () => {

            const isOpen =
                list.style.display ===
                "block";


            if (isOpen) {

                list.style.display =
                    "none";

                toggle.textContent =
                    "Expand";

            }
            else {

                list.style.display =
                    "block";

                toggle.textContent =
                    "Collapse";

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


        renderCategory(
            "grade10"
        );


        renderCategory(
            "grade11"
        );


        clearChanged();


        console.log(
            "✅ Paper settings loaded",
            paperSettings
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
// ENABLE ALL
// =====================================================

if (enableAllBtn) {

    enableAllBtn.addEventListener(
        "click",
        () => {

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
                                        true
                                    );

                                }

                            }


                            if (
                                group.years
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
                                            true
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
        () => {

            if (
                !confirm(
                    "Disable all Grade 10 and Grade 11 papers?"
                )
            ) {

                return;

            }


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
                                        false
                                    );

                                }

                            }


                            if (
                                group.years
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
                                            false
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
        async () => {

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

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade10"
                    ),
                    paperSettings.grade10
                );


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
                    "Save error:",
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
    "📚 PAPER MANAGEMENT LOADED"
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
    "A/L: HOLD"
);

console.log(
    "================================="
);
