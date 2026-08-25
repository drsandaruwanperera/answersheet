// =====================================================
// ADMIN DASHBOARD
// Student Management + Super Admin Removal
// =====================================================

import * as firebase from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const db =
    firebase.db;

const collection =
    firebase.collection;

const getDocs =
    firebase.getDocs;

const onSnapshot =
    firebase.onSnapshot;

const doc =
    firebase.doc;

const writeBatch =
    firebase.writeBatch;

const auth =
    firebase.auth;

const reauthenticateWithCredential =
    firebase.reauthenticateWithCredential;

const EmailAuthProvider =
    firebase.EmailAuthProvider;


// =====================================================
// SESSION
// =====================================================

const adminLoggedIn =
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


const adminUsername =
    sessionStorage.getItem(
        "adminUsername"
    ) || "Admin";


const storedRole =
    (
        sessionStorage.getItem(
            "adminRole"
        ) || "limited"
    )
    .trim()
    .toLowerCase()
    .replace(
        /[\s_-]+/g,
        ""
    );


// =====================================================
// ROLE
// =====================================================

const isSuperAdmin =
    storedRole === "superadmin" ||
    storedRole === "full";


// =====================================================
// ADMIN PROTECTION
// =====================================================

if (!adminLoggedIn) {

    window.location.replace(
        "admin-login.html"
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const adminUsernameElement =
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
// SUMMARY
// =====================================================

const totalStudentsElement =
    document.getElementById(
        "totalStudents"
    );


const totalViewedElement =
    document.getElementById(
        "totalViewed"
    );


const activeStudentsElement =
    document.getElementById(
        "activeStudents"
    );


// =====================================================
// MANAGEMENT LINKS
// =====================================================

const superAdminNavItems =
    document.querySelectorAll(
        ".superadmin-only"
    );


const superAdminLinks =
    document.querySelectorAll(
        ".superadmin-link"
    );


const superAdminCards =
    document.querySelectorAll(
        ".superadmin-card"
    );


// =====================================================
// SETTINGS
// =====================================================

const ACTIVE_LIMIT =
    90 * 1000;


// =====================================================
// DATA
// =====================================================

let allStudents = [];


// =====================================================
// ADMIN INFORMATION
// =====================================================

function loadAdminInfo() {

    if (adminUsernameElement) {

        adminUsernameElement.textContent =
            adminUsername;

    }


    if (adminRoleElement) {

        adminRoleElement.textContent =
            isSuperAdmin
                ? "Super Administrator"
                : "Administrator";

    }

}


loadAdminInfo();


// =====================================================
// ACCESS DENIED
// =====================================================

function showAccessDenied() {

    const container =
        document.getElementById(
            "accessDeniedMessage"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="access-denied-box">

            <div class="access-denied-icon">
                🔒
            </div>

            <div class="access-denied-content">

                <strong>
                    Access Restricted
                </strong>

                <p>
                    This feature is available only
                    to the Super Administrator.
                </p>

            </div>

            <button
                type="button"
                class="access-denied-close"
            >
                ×
            </button>

        </div>

    `;


    container.classList.add(
        "show"
    );


    const closeButton =
        container.querySelector(
            ".access-denied-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            hideAccessDenied
        );

    }


    clearTimeout(
        window.accessDeniedTimer
    );


    window.accessDeniedTimer =
        setTimeout(
            hideAccessDenied,
            3500
        );

}


// =====================================================
// HIDE ACCESS DENIED
// =====================================================

function hideAccessDenied() {

    const container =
        document.getElementById(
            "accessDeniedMessage"
        );


    if (!container) {
        return;
    }


    container.classList.remove(
        "show"
    );

}


// =====================================================
// ROLE ACCESS
// =====================================================

function setupRoleAccess() {


    if (isSuperAdmin) {

        superAdminNavItems.forEach(
            item => {

                item.classList.remove(
                    "locked-menu"
                );

                item.removeAttribute(
                    "aria-disabled"
                );

                item.removeAttribute(
                    "title"
                );

            }
        );


        superAdminLinks.forEach(
            link => {

                link.classList.remove(
                    "access-locked"
                );

                link.removeAttribute(
                    "aria-disabled"
                );

                link.removeAttribute(
                    "title"
                );

            }
        );


        superAdminCards.forEach(
            card => {

                card.classList.remove(
                    "access-locked"
                );

            }
        );


        return;

    }


    // =================================================
    // LIMITED ADMIN
    // =================================================

    superAdminNavItems.forEach(
        item => {

            item.classList.add(
                "locked-menu"
            );

            item.setAttribute(
                "aria-disabled",
                "true"
            );

            item.setAttribute(
                "title",
                "Super Administrator only"
            );


            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAccessDenied();

                }
            );

        }
    );


    superAdminLinks.forEach(
        link => {

            link.classList.add(
                "access-locked"
            );

            link.setAttribute(
                "aria-disabled",
                "true"
            );

            link.setAttribute(
                "title",
                "Super Administrator only"
            );


            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAccessDenied();

                }
            );

        }
    );


    superAdminCards.forEach(
        card => {

            card.classList.add(
                "access-locked"
            );

        }
    );

}


setupRoleAccess();


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
// STUDENT TYPE
// =====================================================

function getStudentType(data) {

    const studentType =
        String(
            data?.studentType || ""
        )
        .trim()
        .toLowerCase();


    if (
        studentType === "grade10" ||
        studentType === "grade 10"
    ) {

        return "grade10";

    }


    if (
        studentType === "grade11" ||
        studentType === "grade 11"
    ) {

        return "grade11";

    }


    const grade =
        String(
            data?.grade || ""
        )
        .trim()
        .toLowerCase();


    if (
        grade === "10" ||
        grade === "grade10" ||
        grade === "grade 10"
    ) {

        return "grade10";

    }


    if (
        grade === "11" ||
        grade === "grade11" ||
        grade === "grade 11"
    ) {

        return "grade11";

    }


    return "al";

}


// =====================================================
// ACTIVE STUDENT
// =====================================================

function isStudentActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );


    if (!lastActive) {
        return false;
    }


    const difference =
        Date.now() -
        lastActive;


    return (
        difference >= 0 &&
        difference <= ACTIVE_LIMIT
    );

}


// =====================================================
// PAPER VIEW COUNT
// =====================================================

function getViewedCount(data) {

    let count = 0;


    for (
        let i = 1;
        i <= 13;
        i++
    ) {

        const field =
            "paper" +
            String(i)
                .padStart(
                    2,
                    "0"
                ) +
            "Viewed";


        if (
            data?.[field] === true
        ) {

            count++;

        }

    }


    return count;

}


// =====================================================
// SET TEXT
// =====================================================

function setText(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        String(value);

}


// =====================================================
// UPDATE STUDENT CONTROL COUNTS
// =====================================================

function updateStudentControlCounts(
    categories,
    total
) {

    setText(
        document.getElementById(
            "controlGrade10Count"
        ),
        categories.grade10.total
    );


    setText(
        document.getElementById(
            "controlGrade11Count"
        ),
        categories.grade11.total
    );


    setText(
        document.getElementById(
            "controlALCount"
        ),
        categories.al.total
    );


    setText(
        document.getElementById(
            "controlTotalCount"
        ),
        total
    );

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const total =
        allStudents.length;


    let totalViewed = 0;

    let totalOnline = 0;


    const categories = {

        grade10: {
            total: 0,
            online: 0,
            views: 0
        },

        grade11: {
            total: 0,
            online: 0,
            views: 0
        },

        al: {
            total: 0,
            online: 0,
            views: 0
        }

    };


    allStudents.forEach(
        student => {

            const data =
                student.data;


            const type =
                getStudentType(
                    data
                );


            const active =
                isStudentActive(
                    data
                );


            const viewed =
                getViewedCount(
                    data
                );


            totalViewed +=
                viewed;


            if (active) {

                totalOnline++;

            }


            if (
                categories[type]
            ) {

                categories[type].total++;

                categories[type].views +=
                    viewed;


                if (active) {

                    categories[type].online++;

                }

            }

        }
    );


    // =================================================
    // SUMMARY
    // =================================================

    setText(
        totalStudentsElement,
        total
    );


    setText(
        totalViewedElement,
        totalViewed
    );


    setText(
        activeStudentsElement,
        totalOnline
    );


    // =================================================
    // STUDENT CONTROL COUNTS
    // =================================================

    updateStudentControlCounts(
        categories,
        total
    );


    // =================================================
    // ALL
    // =================================================

    setText(
        document.getElementById(
            "reportAllTotal"
        ),
        total
    );


    setText(
        document.getElementById(
            "reportAllOnline"
        ),
        totalOnline
    );


    setText(
        document.getElementById(
            "reportAllOffline"
        ),
        total -
        totalOnline
    );


    setText(
        document.getElementById(
            "reportAllViews"
        ),
        totalViewed
    );


    // =================================================
    // GRADE 10
    // =================================================

    setText(
        document.getElementById(
            "reportGrade10Total"
        ),
        categories.grade10.total
    );


    setText(
        document.getElementById(
            "reportGrade10Online"
        ),
        categories.grade10.online
    );


    setText(
        document.getElementById(
            "reportGrade10Offline"
        ),
        categories.grade10.total -
        categories.grade10.online
    );


    setText(
        document.getElementById(
            "reportGrade10Views"
        ),
        categories.grade10.views
    );


    // =================================================
    // GRADE 11
    // =================================================

    setText(
        document.getElementById(
            "reportGrade11Total"
        ),
        categories.grade11.total
    );


    setText(
        document.getElementById(
            "reportGrade11Online"
        ),
        categories.grade11.online
    );


    setText(
        document.getElementById(
            "reportGrade11Offline"
        ),
        categories.grade11.total -
        categories.grade11.online
    );


    setText(
        document.getElementById(
            "reportGrade11Views"
        ),
        categories.grade11.views
    );


    // =================================================
    // A/L
    // =================================================

    setText(
        document.getElementById(
            "reportALTotal"
        ),
        categories.al.total
    );


    setText(
        document.getElementById(
            "reportALOnline"
        ),
        categories.al.online
    );


    setText(
        document.getElementById(
            "reportALOffline"
        ),
        categories.al.total -
        categories.al.online
    );


    setText(
        document.getElementById(
            "reportALViews"
        ),
        categories.al.views
    );

}


// =====================================================
// LOAD STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        const students = [];


        snapshot.forEach(
            studentDoc => {

                students.push({

                    id:
                        studentDoc.id,

                    data:
                        studentDoc.data()

                });

            }
        );


        allStudents =
            students;


        updateDashboard();

    }
    catch (error) {

        console.error(
            "Dashboard student load error:",
            error
        );


        setText(
            totalStudentsElement,
            "—"
        );


        setText(
            totalViewedElement,
            "—"
        );


        setText(
            activeStudentsElement,
            "—"
        );

    }

}


// =====================================================
// REAL-TIME FIREBASE
// =====================================================

function startRealtimeUpdates() {

    if (
        typeof onSnapshot !==
        "function"
    ) {

        return;

    }


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        onSnapshot(
            studentsRef,

            snapshot => {

                const students = [];


                snapshot.forEach(
                    studentDoc => {

                        students.push({

                            id:
                                studentDoc.id,

                            data:
                                studentDoc.data()

                        });

                    }
                );


                allStudents =
                    students;


                updateDashboard();


                console.log(
                    "🔄 Student dashboard updated:",
                    students.length
                );

            },

            error => {

                console.error(
                    "Realtime dashboard error:",
                    error
                );


                loadStudents();

            }
        );

    }
    catch (error) {

        console.error(
            "Realtime listener setup error:",
            error
        );


        loadStudents();

    }

}


// =====================================================
// PASSWORD MODAL
// =====================================================

function showPasswordModal(
    category,
    count
) {

    return new Promise(
        function(resolve) {

            const existing =
                document.getElementById(
                    "studentDeleteModal"
                );


            if (existing) {
                existing.remove();
            }


            const categoryName =
                category === "grade10"
                    ? "Grade 10"
                    : category === "grade11"
                        ? "Grade 11"
                        : "A/L";


            const modal =
                document.createElement(
                    "div"
                );


            modal.id =
                "studentDeleteModal";


            modal.innerHTML = `

                <div class="delete-modal-overlay">

                    <div class="delete-modal">

                        <div class="delete-modal-icon">
                            🔐
                        </div>


                        <div class="delete-modal-header">

                            <p>
                                SUPER ADMINISTRATOR
                            </p>

                            <h2>
                                Confirm Student Removal
                            </h2>

                            <span>
                                You are about to permanently
                                remove ${count} ${categoryName}
                                student account(s).
                            </span>

                        </div>


                        <div class="delete-modal-warning">

                            ⚠️
                            This action cannot be undone.

                        </div>


                        <label
                            class="delete-password-label"
                            for="deleteAdminPassword"
                        >
                            Super Admin Password
                        </label>


                        <input
                            id="deleteAdminPassword"
                            class="delete-password-input"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Enter your password"
                        >


                        <div
                            id="deletePasswordError"
                            class="delete-password-error"
                        ></div>


                        <div class="delete-modal-actions">

                            <button
                                type="button"
                                id="cancelDeleteBtn"
                                class="delete-cancel-btn"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                id="confirmDeleteBtn"
                                class="delete-confirm-btn"
                            >
                                🔐 Verify & Continue
                            </button>

                        </div>

                    </div>

                </div>

            `;


            document.body.appendChild(
                modal
            );


            const passwordInput =
                document.getElementById(
                    "deleteAdminPassword"
                );


            const errorElement =
                document.getElementById(
                    "deletePasswordError"
                );


            const cancelButton =
                document.getElementById(
                    "cancelDeleteBtn"
                );


            const confirmButton =
                document.getElementById(
                    "confirmDeleteBtn"
                );


            function closeModal(
                result
            ) {

                modal.remove();

                resolve(
                    result
                );

            }


            cancelButton.addEventListener(
                "click",
                function() {

                    closeModal(
                        false
                    );

                }
            );


            modal
                .querySelector(
                    ".delete-modal-overlay"
                )
                .addEventListener(
                    "click",
                    function(event) {

                        if (
                            event.target ===
                            this
                        ) {

                            closeModal(
                                false
                            );

                        }

                    }
                );


            confirmButton.addEventListener(
                "click",
                function() {

                    const password =
                        passwordInput.value
                            .trim();


                    if (!password) {

                        errorElement.textContent =
                            "Please enter the Super Admin password.";

                        passwordInput.focus();

                        return;

                    }


                    closeModal(
                        password
                    );

                }
            );


            passwordInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        confirmButton.click();

                    }


                    if (
                        event.key ===
                        "Escape"
                    ) {

                        closeModal(
                            false
                        );

                    }

                }
            );


            setTimeout(
                function() {

                    passwordInput.focus();

                },
                100
            );

        }
    );

}


// =====================================================
// REAUTHENTICATE SUPER ADMIN
// =====================================================

async function verifySuperAdminPassword(
    password
) {

    if (!isSuperAdmin) {

        throw new Error(
            "Super Administrator access is required."
        );

    }


    // Firebase Authentication user

    const currentUser =
        auth?.currentUser;


    if (!currentUser) {

        throw new Error(
            "No Firebase Authentication session is active. Please sign in to the Super Admin Firebase account first."
        );

    }


    if (
        !currentUser.email
    ) {

        throw new Error(
            "The current Firebase account does not have an email address."
        );

    }


    const credential =
        EmailAuthProvider.credential(
            currentUser.email,
            password
        );


    await reauthenticateWithCredential(
        currentUser,
        credential
    );


    return true;

}


// =====================================================
// DELETE PROGRESS
// =====================================================

function showDeleteProgress(
    categoryName,
    count
) {

    const existing =
        document.getElementById(
            "deleteProgressModal"
        );


    if (existing) {
        existing.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "deleteProgressModal";


    modal.innerHTML = `

        <div class="delete-modal-overlay">

            <div class="delete-modal delete-progress-modal">

                <div class="delete-modal-icon">
                    ⏳
                </div>

                <div class="delete-modal-header">

                    <p>
                        SUPER ADMINISTRATOR
                    </p>

                    <h2>
                        Removing Students
                    </h2>

                    <span>
                        Removing ${count}
                        ${categoryName}
                        student account(s)...
                    </span>

                </div>


                <div class="delete-progress-bar">

                    <div
                        id="deleteProgressFill"
                        class="delete-progress-fill"
                    ></div>

                </div>


                <p
                    id="deleteProgressText"
                    class="delete-progress-text"
                >
                    Preparing...
                </p>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// =====================================================
// UPDATE DELETE PROGRESS
// =====================================================

function updateDeleteProgress(
    current,
    total
) {

    const fill =
        document.getElementById(
            "deleteProgressFill"
        );


    const text =
        document.getElementById(
            "deleteProgressText"
        );


    const percentage =
        total > 0
            ? Math.round(
                (
                    current /
                    total
                ) * 100
            )
            : 100;


    if (fill) {

        fill.style.width =
            percentage + "%";

    }


    if (text) {

        text.textContent =
            `Deleted ${current} of ${total} students (${percentage}%)`;

    }

}


// =====================================================
// HIDE DELETE PROGRESS
// =====================================================

function hideDeleteProgress() {

    const modal =
        document.getElementById(
            "deleteProgressModal"
        );


    if (modal) {

        modal.remove();

    }

}


// =====================================================
// DELETE STUDENTS
// =====================================================

async function deleteStudentsByCategory(
    category
) {

    if (!isSuperAdmin) {

        showAccessDenied();

        return;

    }


    // =================================================
    // GET TARGET STUDENTS
    // =================================================

    const targetStudents =
        allStudents.filter(
            student => {

                return (
                    getStudentType(
                        student.data
                    ) === category
                );

            }
        );


    const count =
        targetStudents.length;


    const categoryName =
        category === "grade10"
            ? "Grade 10"
            : category === "grade11"
                ? "Grade 11"
                : "A/L";


    // =================================================
    // NOTHING TO DELETE
    // =================================================

    if (
        count === 0
    ) {

        alert(
            `There are no ${categoryName} students to remove.`
        );

        return;

    }


    // =================================================
    // PASSWORD MODAL
    // =================================================

    const password =
        await showPasswordModal(
            category,
            count
        );


    if (!password) {

        return;

    }


    // =================================================
    // FIREBASE RE-AUTHENTICATION
    // =================================================

    try {

        await verifySuperAdminPassword(
            password
        );

    }
    catch (error) {

        console.error(
            "Super Admin verification failed:",
            error
        );


        alert(
            "❌ Password verification failed.\n\n" +
            (
                error?.message ||
                "Invalid password."
            )
        );


        return;

    }


    // =================================================
    // SECOND CONFIRMATION
    // =================================================

    const confirmed =
        confirm(
            `FINAL CONFIRMATION\n\n` +

            `You are about to permanently delete ` +
            `${count} ${categoryName} student account(s).\n\n` +

            `This action cannot be undone.\n\n` +

            `Continue?`
        );


    if (!confirmed) {

        return;

    }


    // =================================================
    // SHOW PROGRESS
    // =================================================

    showDeleteProgress(
        categoryName,
        count
    );


    try {

        let deleted =
            0;


        // =================================================
        // FIRESTORE BATCH LIMIT
        // =================================================
        //
        // Firestore allows up to 500 writes per batch.
        // Use 450 for a safe margin.
        //

        const CHUNK_SIZE =
            450;


        for (
            let start = 0;
            start < count;
            start += CHUNK_SIZE
        ) {

            const chunk =
                targetStudents.slice(
                    start,
                    start +
                    CHUNK_SIZE
                );


            const batch =
                writeBatch(
                    db
                );


            chunk.forEach(
                student => {

                    const studentRef =
                        doc(
                            db,
                            "students",
                            student.id
                        );


                    batch.delete(
                        studentRef
                    );

                }
            );


            await batch.commit();


            deleted +=
                chunk.length;


            updateDeleteProgress(
                deleted,
                count
            );

        }


        // =================================================
        // REMOVE FROM LOCAL DATA
        // =================================================

        const deletedIds =
            new Set(
                targetStudents.map(
                    student =>
                        student.id
                )
            );


        allStudents =
            allStudents.filter(
                student =>
                    !deletedIds.has(
                        student.id
                    )
            );


        updateDashboard();


        // =================================================
        // SUCCESS
        // =================================================

        hideDeleteProgress();


        alert(
            `✅ ${categoryName} student accounts removed successfully.\n\n` +
            `Removed: ${deleted}`
        );


        console.log(
            "===================================="
        );

        console.log(
            "STUDENT REMOVAL SUCCESS"
        );

        console.log(
            "Category:",
            categoryName
        );

        console.log(
            "Deleted:",
            deleted
        );

        console.log(
            "===================================="
        );

    }
    catch (error) {

        console.error(
            "Student deletion error:",
            error
        );


        hideDeleteProgress();


        alert(
            "❌ Student removal failed.\n\n" +
            (
                error?.message ||
                "Unknown error."
            )
        );

    }

}


// =====================================================
// REMOVE BUTTONS
// =====================================================

function setupStudentRemovalButtons() {

    const grade10Button =
        document.getElementById(
            "removeGrade10Btn"
        );


    const grade11Button =
        document.getElementById(
            "removeGrade11Btn"
        );


    const alButton =
        document.getElementById(
            "removeALBtn"
        );


    if (
        !grade10Button ||
        !grade11Button ||
        !alButton
    ) {

        console.warn(
            "Student removal buttons not found."
        );

        return;

    }


    // =================================================
    // LIMITED ADMIN
    // =================================================

    if (!isSuperAdmin) {

        [
            grade10Button,
            grade11Button,
            alButton
        ].forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        showAccessDenied();

                    }
                );


                button.setAttribute(
                    "title",
                    "Super Administrator only"
                );

            }
        );


        return;

    }


    // =================================================
    // SUPER ADMIN
    // =================================================

    grade10Button.addEventListener(
        "click",
        function() {

            deleteStudentsByCategory(
                "grade10"
            );

        }
    );


    grade11Button.addEventListener(
        "click",
        function() {

            deleteStudentsByCategory(
                "grade11"
            );

        }
    );


    alButton.addEventListener(
        "click",
        function() {

            deleteStudentsByCategory(
                "al"
            );

        }
    );

}


setupStudentRemovalButtons();


// =====================================================
// REFRESH ACTIVE STATUS
// =====================================================

function refreshActiveStatus() {

    if (
        !allStudents.length
    ) {

        updateDashboard();

        return;

    }


    updateDashboard();

}


setInterval(
    refreshActiveStatus,
    15000
);


// =====================================================
// PAGE VISIBILITY
// =====================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshActiveStatus();

        }

    }
);


// =====================================================
// DIRECT PAGE PROTECTION
// =====================================================

function protectCurrentPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const restrictedPages = [

        "paper-management.html",

        "paper-settings.html",

        "import-students.html",

        "reports.html",

        "statistics.html"

    ];


    if (
        restrictedPages.includes(
            currentPage
        )
    ) {

        if (!isSuperAdmin) {

            window.location.replace(
                "admin.html"
            );

        }

    }

}


protectCurrentPage();


// =====================================================
// INITIAL LOAD
// =====================================================

loadStudents();


// =====================================================
// REAL-TIME
// =====================================================

startRealtimeUpdates();


// =====================================================
// CONSOLE
// =====================================================

console.log(
    "======================================"
);

console.log(
    "✅ ADMIN DASHBOARD LOADED"
);

console.log(
    "Admin:",
    adminUsername
);

console.log(
    "Role:",
    storedRole
);

console.log(
    "Super Admin:",
    isSuperAdmin
);

console.log(
    "Firebase Auth User:",
    auth?.currentUser?.email || "NONE"
);

console.log(
    "======================================"
);
