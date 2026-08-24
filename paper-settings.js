// =====================================================
// PAPER SETTINGS - FULL VERSION
// =====================================================

import * as firebase from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const db =
    firebase.db;

const doc =
    firebase.doc;

const getDoc =
    firebase.getDoc;

const setDoc =
    firebase.setDoc;

const updateDoc =
    firebase.updateDoc;


// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


const rawRole =
    String(
        sessionStorage.getItem(
            "adminRole"
        ) || ""
    )
    .trim()
    .toLowerCase();


// =====================================================
// NORMALIZE ROLE
// =====================================================

const adminRole =
    rawRole.replace(
        /[\s_-]+/g,
        ""
    );


// =====================================================
// ALLOWED ADMIN ROLES
// =====================================================
//
// Paper Management is available to:
// - superadmin
// - full
// - fulladmin
// - administrator
// - admin
//
// Limited administrators are blocked.
// =====================================================

const hasPaperManagementAccess =
    adminRole === "superadmin" ||
    adminRole === "full" ||
    adminRole === "fulladmin" ||
    adminRole === "administrator" ||
    adminRole === "admin";


// =====================================================
// AUTH CHECK
// =====================================================

if (!adminLoggedIn) {

    console.warn(
        "Paper Settings: Admin is not logged in."
    );

    window.location.replace(
        "admin-login.html"
    );

    throw new Error(
        "ADMIN_LOGIN_REQUIRED"
    );

}


// =====================================================
// ROLE CHECK
// =====================================================

if (!hasPaperManagementAccess) {

    console.warn(
        "Paper Settings: Access denied.",
        {
            role: adminRole
        }
    );

    alert(
        "🔒 Access denied. Super Administrator only."
    );

    window.location.replace(
        "admin.html"
    );

    throw new Error(
        "ADMIN_ACCESS_DENIED"
    );

}


// =====================================================
// DEBUG
// =====================================================

console.log(
    "======================================"
);

console.log(
    "📚 PAPER MANAGEMENT"
);

console.log(
    "Admin Logged In:",
    adminLoggedIn
);

console.log(
    "Raw Role:",
    rawRole
);

console.log(
    "Normalized Role:",
    adminRole
);

console.log(
    "Paper Management Access:",
    hasPaperManagementAccess
);

console.log(
    "======================================"
);


// =====================================================
// CONSTANTS
// =====================================================

const TOTAL_PAPERS =
    13;


// =====================================================
// FIRESTORE SETTINGS REFERENCE
// =====================================================

const settingsRef =
    doc(
        db,
        "paperSettings",
        "settings"
    );


// =====================================================
// PAPER DEFAULT DATA
// =====================================================

const defaultPapers = {

    paper01: {
        title: "Model Paper 01",
        pages: 12,
        enabled: true
    },

    paper02: {
        title: "Model Paper 02",
        pages: 12,
        enabled: true
    },

    paper03: {
        title: "Model Paper 03",
        pages: 11,
        enabled: true
    },

    paper04: {
        title: "Model Paper 04",
        pages: 11,
        enabled: true
    },

    paper05: {
        title: "Model Paper 05",
        pages: 13,
        enabled: true
    },

    paper06: {
        title: "Model Paper 06",
        pages: 19,
        enabled: true
    },

    paper07: {
        title: "Model Paper 07",
        pages: 18,
        enabled: true
    },

    paper08: {
        title: "Model Paper 08",
        pages: 18,
        enabled: true
    },

    paper09: {
        title: "Model Paper 09",
        pages: 15,
        enabled: true
    },

    paper10: {
        title: "Model Paper 10",
        pages: 9,
        enabled: true
    },

    paper11: {
        title: "Model Paper 11",
        pages: 10,
        enabled: true
    },

    paper12: {
        title: "Model Paper 12",
        pages: 10,
        enabled: true
    },

    paper13: {
        title: "Model Paper 13",
        pages: 10,
        enabled: true
    }

};


// =====================================================
// GET PAPER ID
// =====================================================

function getPaperId(
    number
) {

    return (
        "paper" +
        String(
            number
        ).padStart(
            2,
            "0"
        )
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
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
// FIND TABLE BODY
// =====================================================

function getTableBody() {

    const possibleIds = [

        "paperTableBody",

        "settingsTableBody",

        "paperSettingsBody",

        "tableBody",

        "papersTableBody"

    ];


    for (
        const id of possibleIds
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            return element;

        }

    }


    // -------------------------------------------------
    // Try table selectors
    // -------------------------------------------------

    const selectors = [

        "#paperTable tbody",

        "#settingsTable tbody",

        "#paperSettingsTable tbody",

        ".settings-table tbody",

        "table tbody"

    ];


    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            return element;

        }

    }


    return null;

}


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings() {

    console.log(
        "Loading paper settings..."
    );


    try {

        const snapshot =
            await getDoc(
                settingsRef
            );


        let settings = {};


        if (
            snapshot.exists()
        ) {

            settings =
                snapshot.data() || {};

        }


        console.log(
            "Firestore Paper Settings:",
            settings
        );


        renderPaperTable(
            settings
        );


        // ------------------------------------------------
        // Grade 11 term settings
        // ------------------------------------------------

        updateTermControls(
            settings
        );


    }
    catch (error) {

        console.error(
            "Failed to load paper settings:",
            error
        );


        renderPaperTable(
            {}
        );


        updateTermControls(
            {}
        );

    }

}


// =====================================================
// RENDER PAPER TABLE
// =====================================================

function renderPaperTable(
    settings
) {

    const tbody =
        getTableBody();


    if (!tbody) {

        console.warn(
            "Paper settings table body not found. Trying existing rows."
        );


        attachExistingRows(
            settings
        );


        return;

    }


    tbody.innerHTML = "";


    for (
        let i = 1;
        i <= TOTAL_PAPERS;
        i++
    ) {

        const paperId =
            getPaperId(
                i
            );


        const defaultData =
            defaultPapers[
                paperId
            ] || {

                title:
                    `Model Paper ${String(i).padStart(2, "0")}`,

                pages:
                    10,

                enabled:
                    true

            };


        const firestoreData =
            settings[
                paperId
            ] || {};


        const title =
            firestoreData.title ??
            defaultData.title;


        const pages =
            firestoreData.pages ??
            defaultData.pages;


        const enabled =
            firestoreData.enabled ??
            firestoreData.default ??
            defaultData.enabled;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    paperId
                )}
            </td>

            <td>

                <input
                    type="text"
                    class="paper-title-input"
                    data-paper="${paperId}"
                    value="${escapeHTML(
                        title
                    )}"
                >

            </td>

            <td>

                <input
                    type="number"
                    min="1"
                    class="paper-pages-input"
                    data-paper="${paperId}"
                    value="${Number(
                        pages
                    )}"
                >

            </td>

            <td>

                <input
                    type="checkbox"
                    class="paper-enabled-input"
                    data-paper="${paperId}"
                    ${
                        enabled === true
                            ? "checked"
                            : ""
                    }
                >

            </td>

            <td>

                <button
                    type="button"
                    class="paper-save-btn"
                    data-paper="${paperId}"
                >
                    💾 Save
                </button>

            </td>

        `;


        tbody.appendChild(
            row
        );

    }


    attachSaveButtons();

}


// =====================================================
// ATTACH EXISTING TABLE
// =====================================================

function attachExistingRows(
    settings
) {

    const rows =
        document.querySelectorAll(
            "table tbody tr"
        );


    rows.forEach(
        row => {

            const saveButton =
                row.querySelector(
                    "button"
                );


            if (!saveButton) {
                return;
            }


            const firstCell =
                row.querySelector(
                    "td"
                );


            if (!firstCell) {
                return;
            }


            const paperId =
                firstCell.textContent
                    .trim()
                    .toLowerCase();


            if (
                !/^paper\d+$/.test(
                    paperId
                )
            ) {

                return;

            }


            saveButton.dataset.paper =
                paperId;


            saveButton.classList.add(
                "paper-save-btn"
            );

        }
    );


    attachSaveButtons();

}


// =====================================================
// ATTACH SAVE BUTTONS
// =====================================================

function attachSaveButtons() {

    const buttons =
        document.querySelectorAll(
            ".paper-save-btn"
        );


    buttons.forEach(
        button => {

            // Avoid duplicate events
            if (
                button.dataset.listenerAttached ===
                "true"
            ) {

                return;

            }


            button.dataset.listenerAttached =
                "true";


            button.addEventListener(
                "click",
                async () => {

                    const paperId =
                        button.dataset.paper;


                    if (!paperId) {

                        alert(
                            "Paper ID not found."
                        );

                        return;

                    }


                    await savePaper(
                        paperId,
                        button
                    );

                }
            );

        }
    );

}


// =====================================================
// FIND PAPER INPUT
// =====================================================

function findPaperInput(
    paperId,
    type
) {

    const selectors = [

        `.${type}[data-paper="${paperId}"]`,

        `input[data-paper="${paperId}"][class*="${type}"]`

    ];


    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            return element;

        }

    }


    // -------------------------------------------------
    // Existing table row
    // -------------------------------------------------

    const rows =
        document.querySelectorAll(
            "table tbody tr"
        );


    for (
        const row of rows
    ) {

        const firstCell =
            row.querySelector(
                "td"
            );


        if (
            !firstCell
        ) {

            continue;

        }


        const id =
            firstCell.textContent
                .trim()
                .toLowerCase();


        if (
            id !==
            paperId
        ) {

            continue;

        }


        const inputs =
            row.querySelectorAll(
                "input"
            );


        if (
            type ===
            "paper-title-input"
        ) {

            return inputs[0];

        }


        if (
            type ===
            "paper-pages-input"
        ) {

            return inputs[1];

        }


        if (
            type ===
            "paper-enabled-input"
        ) {

            return inputs[2];

        }

    }


    return null;

}


// =====================================================
// SAVE PAPER
// =====================================================

async function savePaper(
    paperId,
    button
) {

    const titleInput =
        findPaperInput(
            paperId,
            "paper-title-input"
        );


    const pagesInput =
        findPaperInput(
            paperId,
            "paper-pages-input"
        );


    const enabledInput =
        findPaperInput(
            paperId,
            "paper-enabled-input"
        );


    const title =
        titleInput
            ? titleInput.value.trim()
            : `Model Paper ${paperId.replace(
                "paper",
                ""
            )}`;


    const pages =
        pagesInput
            ? Number(
                pagesInput.value
            )
            : 10;


    const enabled =
        enabledInput
            ? enabledInput.checked
            : true;


    if (!title) {

        alert(
            "Please enter a paper title."
        );

        return;

    }


    if (
        !Number.isFinite(
            pages
        ) ||
        pages < 1
    ) {

        alert(
            "Please enter a valid number of pages."
        );

        return;

    }


    const oldText =
        button
            ? button.textContent
            : "";


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Saving...";

    }


    try {

        const updateData = {

            [`${paperId}.title`]:
                title,

            [`${paperId}.pages`]:
                pages,

            [`${paperId}.enabled`]:
                enabled,

            [`${paperId}.default`]:
                enabled

        };


        await updateDoc(
            settingsRef,
            updateData
        );


        console.log(
            "Paper saved:",
            {
                paperId,
                title,
                pages,
                enabled
            }
        );


        if (button) {

            button.textContent =
                "✅ Saved";

        }


        setTimeout(
            () => {

                if (button) {

                    button.textContent =
                        oldText ||
                        "💾 Save";

                    button.disabled =
                        false;

                }

            },
            1200
        );


    }
    catch (error) {

        console.error(
            "Save Paper Error:",
            error
        );


        // ------------------------------------------------
        // If settings document does not exist,
        // create it.
        // ------------------------------------------------

        try {

            const createData = {};


            createData[
                paperId
            ] = {

                title:
                    title,

                pages:
                    pages,

                enabled:
                    enabled,

                default:
                    enabled

            };


            await setDoc(
                settingsRef,
                createData,
                {
                    merge:
                        true
                }
            );


            if (button) {

                button.textContent =
                    "✅ Saved";

            }


        }
        catch (
            secondError
        ) {

            console.error(
                "Create Settings Error:",
                secondError
            );


            alert(
                "Failed to save paper settings.\n\n" +
                secondError.message
            );

        }
        finally {

            if (button) {

                setTimeout(
                    () => {

                        button.disabled =
                            false;

                        button.textContent =
                            "💾 Save";

                    },
                    1200
                );

            }

        }

    }

}


// =====================================================
// GRADE 11 TERM SETTINGS
// =====================================================
//
// Supported:
// grade11_term1_enabled
// grade11_term2_enabled
// grade11_term3_enabled
// =====================================================

function updateTermControls(
    settings
) {

    const termMap = {

        grade11_term1_enabled:
            [
                "grade11Term1Enabled",
                "grade11_term1_enabled",
                "term1Enabled"
            ],

        grade11_term2_enabled:
            [
                "grade11Term2Enabled",
                "grade11_term2_enabled",
                "term2Enabled"
            ],

        grade11_term3_enabled:
            [
                "grade11Term3Enabled",
                "grade11_term3_enabled",
                "term3Enabled"
            ]

    };


    Object.keys(
        termMap
    ).forEach(
        settingKey => {

            const ids =
                termMap[
                    settingKey
                ];


            let element =
                null;


            for (
                const id of ids
            ) {

                element =
                    document.getElementById(
                        id
                    );


                if (element) {
                    break;
                }

            }


            if (!element) {
                return;
            }


            const value =
                settings[
                    settingKey
                ];


            // Missing = enabled
            element.checked =
                value !== false;

        }
    );

}


// =====================================================
// SAVE TERM SETTING
// =====================================================

async function saveTermSetting(
    key,
    value
) {

    try {

        await setDoc(
            settingsRef,
            {
                [key]:
                    value
            },
            {
                merge:
                    true
            }
        );


        console.log(
            "Term setting saved:",
            key,
            value
        );


    }
    catch (error) {

        console.error(
            "Term setting error:",
            error
        );


        alert(
            "Failed to save setting.\n\n" +
            error.message
        );

    }

}


// =====================================================
// TERM EVENT LISTENERS
// =====================================================

function setupTermListeners() {

    const termElements = [

        {
            ids: [
                "grade11Term1Enabled",
                "grade11_term1_enabled",
                "term1Enabled"
            ],
            key:
                "grade11_term1_enabled"
        },

        {
            ids: [
                "grade11Term2Enabled",
                "grade11_term2_enabled",
                "term2Enabled"
            ],
            key:
                "grade11_term2_enabled"
        },

        {
            ids: [
                "grade11Term3Enabled",
                "grade11_term3_enabled",
                "term3Enabled"
            ],
            key:
                "grade11_term3_enabled"
        }

    ];


    termElements.forEach(
        item => {

            let element =
                null;


            for (
                const id of item.ids
            ) {

                element =
                    document.getElementById(
                        id
                    );


                if (element) {
                    break;
                }

            }


            if (!element) {
                return;
            }


            if (
                element.dataset.listenerAttached ===
                "true"
            ) {

                return;

            }


            element.dataset.listenerAttached =
                "true";


            element.addEventListener(
                "change",
                async () => {

                    await saveTermSetting(
                        item.key,
                        element.checked
                    );

                }
            );

        }
    );

}


// =====================================================
// SELECT ALL / RESET BUTTONS
// =====================================================

function setupGlobalButtons() {

    const selectAll =
        document.getElementById(
            "selectAll"
        );


    const removeAll =
        document.getElementById(
            "removeAll"
        );


    if (selectAll) {

        selectAll.addEventListener(
            "click",
            async () => {

                await setAllPapers(
                    true
                );

            }
        );

    }


    if (removeAll) {

        removeAll.addEventListener(
            "click",
            async () => {

                await setAllPapers(
                    false
                );

            }
        );

    }

}


// =====================================================
// SET ALL PAPERS
// =====================================================

async function setAllPapers(
    enabled
) {

    const updateData = {};


    for (
        let i = 1;
        i <= TOTAL_PAPERS;
        i++
    ) {

        const paperId =
            getPaperId(
                i
            );


        updateData[
            `${paperId}.enabled`
        ] =
            enabled;


        updateData[
            `${paperId}.default`
        ] =
            enabled;

    }


    try {

        await setDoc(
            settingsRef,
            updateData,
            {
                merge:
                    true
            }
        );


        alert(
            enabled
                ? "All papers enabled."
                : "All papers disabled."
        );


        await loadSettings();

    }
    catch (error) {

        console.error(
            "Set All Papers Error:",
            error
        );


        alert(
            "Failed to update papers.\n\n" +
            error.message
        );

    }

}


// =====================================================
// BACK BUTTON
// =====================================================

function setupBackButton() {

    const buttons =
        document.querySelectorAll(
            "button, a"
        );


    buttons.forEach(
        element => {

            const text =
                element.textContent
                    .trim()
                    .toLowerCase();


            if (
                text.includes(
                    "back to admin"
                ) ||
                text === "← back" ||
                text === "back"
            ) {

                if (
                    element.dataset.paperBackAttached ===
                    "true"
                ) {

                    return;

                }


                element.dataset.paperBackAttached =
                    "true";


                element.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        window.location.href =
                            "admin.html";

                    }
                );

            }

        }
    );

}


// =====================================================
// INITIALIZE
// =====================================================

async function initialize() {

    console.log(
        "📚 Initializing Paper Management..."
    );


    setupTermListeners();

    setupGlobalButtons();

    setupBackButton();


    await loadSettings();


    setupTermListeners();


    console.log(
        "✅ Paper Management Ready"
    );

}


// =====================================================
// START
// =====================================================

initialize();
