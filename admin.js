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

const deleteDoc =
    firebase.deleteDoc;

const writeBatch =
    firebase.writeBatch;


// =====================================================
// FIREBASE AUTHENTICATION
// =====================================================
//
// IMPORTANT:
// firebase.js must export:
//
// auth
// reauthenticateWithCredential
// EmailAuthProvider
//
// Example:
//
// export {
//     auth,
//     reauthenticateWithCredential,
//     EmailAuthProvider
// };
//
// =====================================================

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


// -----------------------------------------------------
// ADMIN INFO
// -----------------------------------------------------

const adminUsernameElement =
    document.getElementById(
        "adminUsername"
    );


const adminRoleElement =
    document.getElementById(
        "adminRole"
    );


// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// -----------------------------------------------------
// SUMMARY
// -----------------------------------------------------

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


// -----------------------------------------------------
// MANAGEMENT LINKS
// -----------------------------------------------------

const studentManagementLink =
    document.getElementById(
        "studentManagementLink"
    );


const paperManagementLink =
    document.getElementById(
        "paperManagementLink"
    );


const importStudentsLink =
    document.getElementById(
        "importStudentsLink"
    );


const statisticsLink =
    document.getElementById(
        "statisticsLink"
    );


// -----------------------------------------------------
// STUDENT COUNT ELEMENTS
// -----------------------------------------------------

const grade10StudentCount =
    document.getElementById(
        "grade10StudentCount"
    );


const grade11StudentCount =
    document.getElementById(
        "grade11StudentCount"
    );


const alStudentCount =
    document.getElementById(
        "alStudentCount"
    );


const allStudentCount =
    document.getElementById(
        "allStudentCount"
    );


// -----------------------------------------------------
// DELETE BUTTONS
// -----------------------------------------------------

const removeGrade10Btn =
    document.getElementById(
        "removeGrade10Btn"
    );


const removeGrade11Btn =
    document.getElementById(
        "removeGrade11Btn"
    );


const removeALBtn =
    document.getElementById(
        "removeALBtn"
    );


const studentDeleteStatus =
    document.getElementById(
        "studentDeleteStatus"
    );


// -----------------------------------------------------
// DANGER ZONE
// -----------------------------------------------------

const dangerZone =
    document.getElementById(
        "dangerZone"
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
                aria-label="Close"
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
// SUPER ADMIN ACCESS CONTROL
// =====================================================

function setupRoleAccess() {


    // =================================================
    // SIDEBAR
    // =================================================

    const superAdminNavItems =
        document.querySelectorAll(
            ".superadmin-only"
        );


    // =================================================
    // LINKS
    // =================================================

    const superAdminLinks =
        document.querySelectorAll(
            ".superadmin-link"
        );


    // =================================================
    // CARDS
    // =================================================

    const superAdminCards =
        document.querySelectorAll(
            ".superadmin-card"
        );


    // =================================================
    // SUPER ADMIN
    // =================================================

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
// DELETE ACCESS CONTROL
// =====================================================

function setupDeleteAccess() {

    const deleteButtons = [

        removeGrade10Btn,
        removeGrade11Btn,
        removeALBtn

    ];


    deleteButtons.forEach(
        button => {

            if (!button) {
                return;
            }


            if (!isSuperAdmin) {

                button.classList.add(
                    "access-locked"
                );


                button.setAttribute(
                    "title",
                    "Super Administrator only"
                );


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        showAccessDenied();

                    }
                );

            }

        }
    );


    if (
        dangerZone &&
        !isSuperAdmin
    ) {

        dangerZone.style.display =
            "none";

    }

}


setupDeleteAccess();


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
// UPDATE STUDENT COUNTS
// =====================================================

function updateStudentCounts() {

    let grade10Count = 0;

    let grade11Count = 0;

    let alCount = 0;


    allStudents.forEach(
        student => {

            const type =
                getStudentType(
                    student.data
                );


            if (
                type === "grade10"
            ) {

                grade10Count++;

            }
            else if (
                type === "grade11"
            ) {

                grade11Count++;

            }
            else {

                alCount++;

            }

        }
    );


    const total =
        grade10Count +
        grade11Count +
        alCount;


    setText(
        grade10StudentCount,
        grade10Count
    );


    setText(
        grade11StudentCount,
        grade11Count
    );


    setText(
        alStudentCount,
        alCount
    );


    setText(
        allStudentCount,
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
    // STUDENT COUNTS
    // =================================================

    updateStudentCounts();


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


        setText(
            grade10StudentCount,
            "—"
        );


        setText(
            grade11StudentCount,
            "—"
        );


        setText(
            alStudentCount,
            "—"
        );


        setText(
            allStudentCount,
            "—"
        );

    }

}


// =====================================================
// REALTIME FIREBASE LISTENER
// =====================================================

function startRealtimeUpdates() {

    if (
        typeof onSnapshot !==
        "function"
    ) {

        console.warn(
            "onSnapshot is not available."
        );


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
// REFRESH ACTIVE STATUS
// =====================================================

function refreshActiveStatus() {

    if (
        !allStudents.length
    ) {

        return;

    }


    updateDashboard();

}


// =====================================================
// FIREBASE AUTH PASSWORD VERIFICATION
// =====================================================

async function verifySuperAdminPassword() {

    if (!isSuperAdmin) {

        showAccessDenied();

        return false;

    }


    // =================================================
    // CHECK AUTH MODULES
    // =================================================

    if (
        !auth ||
        !reauthenticateWithCredential ||
        !EmailAuthProvider
    ) {

        alert(
            "Firebase Authentication is not configured for Super Admin password verification.\n\n" +
            "Please check firebase.js exports."
        );


        console.error(
            "Missing Firebase Auth exports:",
            {
                auth,
                reauthenticateWithCredential,
                EmailAuthProvider
            }
        );


        return false;

    }


    // =================================================
    // CURRENT FIREBASE USER
    // =================================================

    const currentUser =
        auth.currentUser;


    if (!currentUser) {

        alert(
            "Super Admin authentication session was not found.\n\n" +
            "Please sign in again."
        );


        return false;

    }


    // =================================================
    // PASSWORD
    // =================================================

    const password =
        window.prompt(
            "🔐 Super Administrator Verification\n\n" +
            "Enter your Super Admin password:"
        );


    if (
        password === null
    ) {

        return false;

    }


    if (
        password.trim() === ""
    ) {

        alert(
            "Password cannot be empty."
        );


        return false;

    }


    // =================================================
    // RE-AUTHENTICATE
    // =================================================

    try {

        const credential =
            EmailAuthProvider.credential(
                currentUser.email,
                password
            );


        await reauthenticateWithCredential(
            currentUser,
            credential
        );


        console.log(
            "✅ Super Admin password verified."
        );


        return true;

    }
    catch (error) {

        console.error(
            "Super Admin password verification failed:",
            error
        );


        alert(
            "❌ Incorrect Super Admin password.\n\n" +
            "No students were deleted."
        );


        return false;

    }

}


// =====================================================
// GET STUDENTS BY TYPE
// =====================================================

function getStudentsByType(
    type
) {

    return allStudents.filter(
        student => {

            return (
                getStudentType(
                    student.data
                ) === type
            );

        }
    );

}


// =====================================================
// DELETE STUDENT DOCUMENTS
// =====================================================
//
// Firestore batches support a maximum of 500 operations.
// Therefore this function deletes in batches of 400.
//

async function deleteStudentDocuments(
    students
) {

    if (
        !students ||
        students.length === 0
    ) {

        return;

    }


    const BATCH_SIZE =
        400;


    for (
        let start = 0;
        start < students.length;
        start += BATCH_SIZE
    ) {

        const batch =
            writeBatch(
                db
            );


        const currentBatch =
            students.slice(
                start,
                start + BATCH_SIZE
            );


        currentBatch.forEach(
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


        console.log(
            "Deleted batch:",
            currentBatch.length
        );

    }

}


// =====================================================
// DELETE GRADE
// =====================================================

async function removeAllStudentsOfType(
    type,
    displayName
) {

    // =================================================
    // SUPER ADMIN ONLY
    // =================================================

    if (!isSuperAdmin) {

        showAccessDenied();

        return;

    }


    // =================================================
    // GET TARGET STUDENTS
    // =================================================

    const targetStudents =
        getStudentsByType(
            type
        );


    const count =
        targetStudents.length;


    // =================================================
    // NO STUDENTS
    // =================================================

    if (
        count === 0
    ) {

        alert(
            `There are currently no ${displayName} students to remove.`
        );


        return;

    }


    // =================================================
    // FIRST CONFIRMATION
    // =================================================

    const firstConfirmation =
        confirm(
            `⚠️ REMOVE ALL ${displayName.toUpperCase()} STUDENTS?\n\n` +

            `Students to be removed: ${count}\n\n` +

            `This action will permanently delete these student records.\n\n` +

            `Other grades will NOT be affected.\n\n` +

            `Do you want to continue?`
        );


    if (
        !firstConfirmation
    ) {

        return;

    }


    // =================================================
    // SECOND CONFIRMATION
    // =================================================

    const secondConfirmation =
        confirm(
            `⚠️ FINAL CONFIRMATION\n\n` +

            `You are about to permanently delete ${count} ${displayName} student(s).\n\n` +

            `This action cannot be undone.\n\n` +

            `Press OK only if you are absolutely sure.`
        );


    if (
        !secondConfirmation
    ) {

        return;

    }


    // =================================================
    // PASSWORD
    // =================================================

    const verified =
        await verifySuperAdminPassword();


    if (!verified) {

        return;

    }


    // =================================================
    // DISABLE BUTTONS
    // =================================================

    setDeleteButtonsDisabled(
        true
    );


    setDeleteStatus(
        `Deleting ${count} ${displayName} students...`,
        "loading"
    );


    try {

        // =================================================
        // DELETE
        // =================================================

        await deleteStudentDocuments(
            targetStudents
        );


        // =================================================
        // REMOVE FROM LOCAL ARRAY
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


        // =================================================
        // UPDATE UI
        // =================================================

        updateDashboard();


        setDeleteStatus(
            `✅ Successfully removed ${count} ${displayName} student(s).`,
            "success"
        );


        alert(
            `✅ Successfully removed ${count} ${displayName} student(s).`
        );


        console.log(
            `🗑️ Deleted ${count} ${displayName} students.`
        );

    }
    catch (error) {

        console.error(
            `Failed to delete ${displayName} students:`,
            error
        );


        setDeleteStatus(
            `❌ Failed to remove ${displayName} students.`,
            "error"
        );


        alert(
            `❌ Failed to remove ${displayName} students.\n\n` +
            error.message
        );

    }
    finally {

        setDeleteButtonsDisabled(
            false
        );

    }

}


// =====================================================
// DELETE BUTTON STATE
// =====================================================

function setDeleteButtonsDisabled(
    disabled
) {

    const buttons = [

        removeGrade10Btn,
        removeGrade11Btn,
        removeALBtn

    ];


    buttons.forEach(
        button => {

            if (!button) {
                return;
            }


            button.disabled =
                disabled;


            if (disabled) {

                button.style.opacity =
                    "0.55";

                button.style.pointerEvents =
                    "none";

            }
            else {

                button.style.opacity =
                    "";

                button.style.pointerEvents =
                    "";

            }

        }
    );

}


// =====================================================
// DELETE STATUS
// =====================================================

function setDeleteStatus(
    message,
    type
) {

    if (
        !studentDeleteStatus
    ) {

        return;

    }


    studentDeleteStatus.textContent =
        message;


    studentDeleteStatus.className =
        "student-delete-status";


    if (type) {

        studentDeleteStatus.classList.add(
            type
        );

    }

}


// =====================================================
// DELETE BUTTON EVENTS
// =====================================================


// -----------------------------------------------------
// GRADE 10
// -----------------------------------------------------

if (
    removeGrade10Btn
) {

    removeGrade10Btn.addEventListener(
        "click",
        () => {

            removeAllStudentsOfType(
                "grade10",
                "Grade 10"
            );

        }
    );

}


// -----------------------------------------------------
// GRADE 11
// -----------------------------------------------------

if (
    removeGrade11Btn
) {

    removeGrade11Btn.addEventListener(
        "click",
        () => {

            removeAllStudentsOfType(
                "grade11",
                "Grade 11"
            );

        }
    );

}


// -----------------------------------------------------
// A/L
// -----------------------------------------------------

if (
    removeALBtn
) {

    removeALBtn.addEventListener(
        "click",
        () => {

            removeAllStudentsOfType(
                "al",
                "A/L"
            );

        }
    );

}


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
// REALTIME
// =====================================================

startRealtimeUpdates();


// =====================================================
// ACTIVE STATUS REFRESH
// =====================================================

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
    "Grade 10 / Grade 11 / A/L DELETE:"
);

console.log(
    "Super Admin password required"
);

console.log(
    "======================================"
);
