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
// STATE
// =====================================================

let paperSettings = {

    grade10: {},

    grade11: {},

    al: {}

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
// GET CATEGORY FROM PAPER FIELD
// =====================================================

function getCategoryFromField(
    field
) {

    if (
        field.startsWith(
            "grade10_"
        )
    ) {

        return "grade10";

    }


    if (
        field.startsWith(
            "grade11_"
        )
    ) {

        return "grade11";

    }


    if (
        field.startsWith(
            "al_"
        )
    ) {

        return "al";

    }


    return null;

}


// =====================================================
// GET PAPER VALUE
// =====================================================

function getPaperValue(
    field
) {

    const category =
        getCategoryFromField(
            field
        );


    if (!category) {

        return false;

    }


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
    field,
    value
) {

    const category =
        getCategoryFromField(
            field
        );


    if (!category) {

        return;

    }


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
// UPDATE ALL CHECKBOXES FROM STATE
// =====================================================

function updateCheckboxes() {

    const checkboxes =
        document.querySelectorAll(
            ".paper-checkbox"
        );


    checkboxes.forEach(
        checkbox => {

            const field =
                checkbox.dataset.paper;


            if (!field) {

                return;

            }


            checkbox.checked =
                getPaperValue(
                    field
                );

        }
    );

}


// =====================================================
// UPDATE ALL CHECKBOX EVENTS
// =====================================================

function setupCheckboxes() {

    const checkboxes =
        document.querySelectorAll(
            ".paper-checkbox"
        );


    checkboxes.forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                () => {

                    const field =
                        checkbox.dataset.paper;


                    if (!field) {

                        return;

                    }


                    setPaperValue(
                        field,
                        checkbox.checked
                    );


                    markChanged();

                }
            );

        }
    );

}


// =====================================================
// ENABLE ALL PAPERS
// =====================================================

function setAllPapers(
    enabled
) {

    const checkboxes =
        document.querySelectorAll(
            ".paper-checkbox"
        );


    checkboxes.forEach(
        checkbox => {

            const field =
                checkbox.dataset.paper;


            if (!field) {

                return;

            }


            setPaperValue(
                field,
                enabled
            );


            checkbox.checked =
                enabled;

        }
    );


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
                    "Disable all Grade 10, Grade 11 and A/L papers?"
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
// LOAD FIREBASE SETTINGS
// =====================================================

async function loadSettings() {

    try {

        console.log(
            "Loading paper settings..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "paperSettings"
                )
            );


        paperSettings = {

            grade10: {},

            grade11: {},

            al: {}

        };


        snapshot.forEach(
            paperDoc => {

                const id =
                    paperDoc.id
                        .toLowerCase()
                        .trim();


                const data =
                    paperDoc.data();


                if (
                    id === "grade10"
                ) {

                    paperSettings.grade10 =
                        data || {};

                }


                if (
                    id === "grade11"
                ) {

                    paperSettings.grade11 =
                        data || {};

                }


                if (
                    id === "al"
                ) {

                    paperSettings.al =
                        data || {};

                }

            }
        );


        console.log(
            "Loaded settings:",
            paperSettings
        );


        updateCheckboxes();


        clearChanged();

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
                // GRADE 10
                // -------------------------------------

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade10"
                    ),
                    paperSettings.grade10
                );


                // -------------------------------------
                // GRADE 11
                // -------------------------------------

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "grade11"
                    ),
                    paperSettings.grade11
                );


                // -------------------------------------
                // A/L
                // -------------------------------------

                await setDoc(
                    doc(
                        db,
                        "paperSettings",
                        "al"
                    ),
                    paperSettings.al
                );


                clearChanged();


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
// MAIN SECTION EXPAND / COLLAPSE
// =====================================================

function setupSectionToggle() {

    const buttons =
        document.querySelectorAll(
            ".section-toggle"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();


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


                    const isHidden =
                        window.getComputedStyle(
                            list
                        ).display === "none";


                    if (isHidden) {

                        list.style.display =
                            "block";

                        section.classList.add(
                            "expanded"
                        );

                        button.textContent =
                            "Collapse";

                    }
                    else {

                        list.style.display =
                            "none";

                        section.classList.remove(
                            "expanded"
                        );

                        button.textContent =
                            "Expand";

                    }

                }
            );

        }
    );

}


// =====================================================
// GROUP EXPAND / COLLAPSE
// =====================================================

function setupGroupToggle() {

    const buttons =
        document.querySelectorAll(
            ".group-toggle"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();


                    const groupId =
                        button.dataset.group;


                    if (!groupId) {

                        return;

                    }


                    const group =
                        document.getElementById(
                            groupId
                        );


                    if (!group) {

                        return;

                    }


                    const isHidden =
                        window.getComputedStyle(
                            group
                        ).display === "none";


                    if (isHidden) {

                        group.style.display =
                            "block";

                        button.textContent =
                            "Hide Papers";

                    }
                    else {

                        group.style.display =
                            "none";

                        button.textContent =
                            "Show Papers";

                    }

                }
            );

        }
    );

}


// =====================================================
// INITIALISE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupSectionToggle();

        setupGroupToggle();

        setupCheckboxes();

        loadSettings();

    }
);


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
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "================================="
);
