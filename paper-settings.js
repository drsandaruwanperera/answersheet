import {
    db,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc
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
// SETTINGS
// =====================================================

const TOTAL_PAPERS = 13;


// =====================================================
// LOCAL STATE
// =====================================================

let hasUnsavedChanges = false;

let paperSettings = {

    grade10: {},

    grade11: {},

    al: {}

};


// =====================================================
// CATEGORY CONFIG
// =====================================================

const categories = {

    grade10: {

        listId:
            "grade10PaperList",

        title:
            "Grade 10",

        papers:
            13

    },

    grade11: {

        listId:
            "grade11PaperList",

        title:
            "Grade 11",

        papers:
            13

    },

    al: {

        listId:
            "alPaperList",

        title:
            "A/L",

        papers:
            13

    }

};


// =====================================================
// ADMIN DISPLAY
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
// STATUS
// =====================================================

function setChangesStatus(
    changed
) {

    hasUnsavedChanges =
        changed;


    if (!changesStatus) {
        return;
    }


    if (changed) {

        changesStatus.textContent =
            "Unsaved changes";

        changesStatus.style.color =
            "#dc2626";

    }
    else {

        changesStatus.textContent =
            "No unsaved changes";

        changesStatus.style.color =
            "";

    }

}


// =====================================================
// MARK CHANGED
// =====================================================

function markChanged() {

    setChangesStatus(
        true
    );

}


// =====================================================
// PAPER FIELD
// =====================================================

function getPaperField(
    number
) {

    return (
        "paper" +
        String(number)
            .padStart(2, "0")
    );

}


// =====================================================
// CREATE PAPER LIST
// =====================================================

function renderCategory(
    category
) {

    const config =
        categories[category];


    if (!config) {
        return;
    }


    const container =
        document.getElementById(
            config.listId
        );


    if (!container) {
        return;
    }


    let html = "";


    for (
        let i = 1;
        i <= config.papers;
        i++
    ) {

        const field =
            getPaperField(i);


        const currentValue =
            paperSettings[
                category
            ]?.[field] === true;


        html += `

            <div
                class="paper-item"
                data-category="${category}"
                data-paper="${field}"
            >

                <div class="paper-item-info">

                    <div class="paper-icon">
                        📘
                    </div>

                    <div>

                        <strong>
                            ${config.title}
                            Paper ${String(i).padStart(2, "0")}
                        </strong>

                        <span>
                            ${currentValue
                                ? "Available to students"
                                : "Currently disabled"}
                        </span>

                    </div>

                </div>


                <label class="paper-switch">

                    <input
                        type="checkbox"
                        class="paper-checkbox"
                        data-category="${category}"
                        data-paper="${field}"
                        ${currentValue ? "checked" : ""}
                    >

                    <span class="switch-slider"></span>

                </label>

            </div>

        `;

    }


    container.innerHTML =
        html;


    // -------------------------------------------------
    // CHECKBOX EVENTS
    // -------------------------------------------------

    container
        .querySelectorAll(
            ".paper-checkbox"
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    () => {

                        const cat =
                            checkbox.dataset.category;

                        const field =
                            checkbox.dataset.paper;


                        if (
                            !paperSettings[cat]
                        ) {

                            paperSettings[cat] =
                                {};

                        }


                        paperSettings[
                            cat
                        ][field] =
                            checkbox.checked;


                        updatePaperStatus(
                            checkbox
                        );


                        markChanged();

                    }
                );

            }
        );

}


// =====================================================
// UPDATE PAPER STATUS TEXT
// =====================================================

function updatePaperStatus(
    checkbox
) {

    const item =
        checkbox.closest(
            ".paper-item"
        );


    if (!item) {
        return;
    }


    const status =
        item.querySelector(
            ".paper-item-info span"
        );


    if (!status) {
        return;
    }


    if (checkbox.checked) {

        status.textContent =
            "Available to students";

    }
    else {

        status.textContent =
            "Currently disabled";

    }

}


// =====================================================
// EXPAND / COLLAPSE
// =====================================================

function setupExpandButtons() {

    const buttons =
        document.querySelectorAll(
            ".section-toggle"
        );


    buttons.forEach(
        button => {

            const category =
                button.dataset.sectionToggle;


            const section =
                button.closest(
                    ".paper-section"
                );


            if (!section) {
                return;
            }


            const list =
                section.querySelector(
                    ".paper-list"
                );


            if (!list) {
                return;
            }


            // -----------------------------------------
            // INITIAL STATE
            // -----------------------------------------

            list.style.display =
                "none";

            list.style.overflow =
                "hidden";

            list.style.transition =
                "all 0.25s ease";


            button.textContent =
                "Expand";


            button.dataset.expanded =
                "false";


            // -----------------------------------------
            // CLICK
            // -----------------------------------------

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const expanded =
                        button.dataset.expanded ===
                        "true";


                    if (expanded) {

                        // -----------------------------
                        // COLLAPSE
                        // -----------------------------

                        list.style.display =
                            "none";

                        button.textContent =
                            "Expand";

                        button.dataset.expanded =
                            "false";

                        section.classList.remove(
                            "expanded"
                        );

                    }
                    else {

                        // -----------------------------
                        // EXPAND
                        // -----------------------------

                        list.style.display =
                            "block";

                        button.textContent =
                            "Collapse";

                        button.dataset.expanded =
                            "true";

                        section.classList.add(
                            "expanded"
                        );

                    }

                }
            );

        }
    );

}


// =====================================================
// FIREBASE LOAD
// =====================================================

async function loadSettings() {

    try {

        console.log(
            "Loading paper settings..."
        );


        /*
         * Expected Firestore structure:
         *
         * paperSettings
         *     grade10
         *     grade11
         *     al
         *
         */


        const settingsCollection =
            collection(
                db,
                "paperSettings"
            );


        const snapshot =
            await getDocs(
                settingsCollection
            );


        // ---------------------------------------------
        // DEFAULT
        // ---------------------------------------------

        paperSettings = {

            grade10: {},

            grade11: {},

            al: {}

        };


        // ---------------------------------------------
        // READ DOCUMENTS
        // ---------------------------------------------

        snapshot.forEach(
            item => {

                const id =
                    item.id
                        .toLowerCase();


                const data =
                    item.data();


                if (
                    id === "grade10"
                ) {

                    paperSettings.grade10 =
                        data;

                }


                else if (
                    id === "grade11"
                ) {

                    paperSettings.grade11 =
                        data;

                }


                else if (
                    id === "al"
                ) {

                    paperSettings.al =
                        data;

                }

            }
        );


        console.log(
            "Paper settings:",
            paperSettings
        );


        // ---------------------------------------------
        // DEFAULT VALUES
        // ---------------------------------------------

        ["grade10", "grade11", "al"]
            .forEach(
                category => {

                    if (
                        !paperSettings[
                            category
                        ]
                    ) {

                        paperSettings[
                            category
                        ] = {};

                    }


                    for (
                        let i = 1;
                        i <= TOTAL_PAPERS;
                        i++
                    ) {

                        const field =
                            getPaperField(i);


                        if (
                            typeof paperSettings[
                                category
                            ][field] !==
                            "boolean"
                        ) {

                            paperSettings[
                                category
                            ][field] =
                                false;

                        }

                    }

                }
            );


        // ---------------------------------------------
        // RENDER
        // ---------------------------------------------

        renderCategory(
            "grade10"
        );

        renderCategory(
            "grade11"
        );

        renderCategory(
            "al"
        );


        setChangesStatus(
            false
        );


        console.log(
            "✅ Paper settings loaded"
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
                "grade11",
                "al"
            ]
            .forEach(
                category => {

                    for (
                        let i = 1;
                        i <= TOTAL_PAPERS;
                        i++
                    ) {

                        const field =
                            getPaperField(i);


                        paperSettings[
                            category
                        ][field] =
                            true;

                    }

                }
            );


            // -----------------------------------------
            // UPDATE CHECKBOXES
            // -----------------------------------------

            document
                .querySelectorAll(
                    ".paper-checkbox"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            true;

                        updatePaperStatus(
                            checkbox
                        );

                    }
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

            const confirmed =
                confirm(
                    "Disable ALL papers for all student categories?"
                );


            if (!confirmed) {
                return;
            }


            [
                "grade10",
                "grade11",
                "al"
            ]
            .forEach(
                category => {

                    for (
                        let i = 1;
                        i <= TOTAL_PAPERS;
                        i++
                    ) {

                        const field =
                            getPaperField(i);


                        paperSettings[
                            category
                        ][field] =
                            false;

                    }

                }
            );


            document
                .querySelectorAll(
                    ".paper-checkbox"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            false;

                        updatePaperStatus(
                            checkbox
                        );

                    }
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

                // -------------------------------------
                // SAVE EACH CATEGORY
                // -------------------------------------

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


                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "al"
                    ),
                    paperSettings.al
                );


                setChangesStatus(
                    false
                );


                alert(
                    "✅ Paper settings saved successfully."
                );


                console.log(
                    "Paper settings saved:",
                    paperSettings
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
// INITIALIZE
// =====================================================

setupExpandButtons();

loadSettings();


// =====================================================
// UNSAVED CHANGES WARNING
// =====================================================

window.addEventListener(
    "beforeunload",
    event => {

        if (!hasUnsavedChanges) {
            return;
        }


        event.preventDefault();

        event.returnValue = "";

    }
);


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
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "===================================="
);
