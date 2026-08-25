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
// PAPER CONFIG
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

    grade10: {},

    grade11: {}

};


let hasUnsavedChanges =
    false;


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
// CLEAR STATUS
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
// GET VALUE
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
// SET VALUE
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
// CREATE PAPER
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


    // HEADER

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


    // LIST

    const list =
        document.createElement(
            "div"
        );


    list.className =
        "paper-group-list";


    // MODEL / TOP RANKING

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


    // PAST PAPERS

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
// LOAD FIREBASE
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
            function (paperDoc) {

                const id =
                    paperDoc.id
                        .toLowerCase();


                if (
                    id === "grade10"
                ) {

                    paperSettings.grade10 =
                        paperDoc.data();

                }


                if (
                    id === "grade11"
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
            "✅ Paper settings loaded"
        );


        console.log(
            paperSettings
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
// ALL PAPER FIELDS
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
        function () {

            if (
                !confirm(
                    "Disable all Grade 10 and Grade 11 papers?"
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
// SAVE
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
// UNSAVED CHANGES
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
// INITIALIZE
// =====================================================

loadSettings();


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
    "A/L: HOLD"
);

console.log(
    "===================================="
);
