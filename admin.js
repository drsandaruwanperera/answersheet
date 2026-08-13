import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// ==========================
// Protect Admin Dashboard
// ==========================

if (
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {
    window.location.href = "admin-login.html";
}


// ==========================
// Elements
// ==========================

const totalStudents =
    document.getElementById("totalStudents");

const totalViewed =
    document.getElementById("totalViewed");

const activeStudents =
    document.getElementById("activeStudents");


// Chart values

const chartTotalStudents =
    document.getElementById(
        "chartTotalStudents"
    );

const chartTotalStudentsValue =
    document.getElementById(
        "chartTotalStudentsValue"
    );


const chartPaperViews =
    document.getElementById(
        "chartPaperViews"
    );

const chartPaperViewsValue =
    document.getElementById(
        "chartPaperViewsValue"
    );


const chartGrade10 =
    document.getElementById(
        "chartGrade10"
    );

const chartGrade10Value =
    document.getElementById(
        "chartGrade10Value"
    );


const chartGrade11 =
    document.getElementById(
        "chartGrade11"
    );

const chartGrade11Value =
    document.getElementById(
        "chartGrade11Value"
    );


const chartAL =
    document.getElementById(
        "chartAL"
    );

const chartALValue =
    document.getElementById(
        "chartALValue"
    );


const chartActive =
    document.getElementById(
        "chartActive"
    );

const chartActiveValue =
    document.getElementById(
        "chartActiveValue"
    );


// Logout

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================
// Settings
// ==========================

// A student is considered active
// if their lastActiveAt is within
// the last 60 seconds.

const ACTIVE_LIMIT =
    60 * 1000;


// ==========================
// Student Type
// ==========================

function getStudentType(data) {

    if (
        data?.studentType ===
        "grade10"
    ) {
        return "grade10";
    }

    if (
        data?.studentType ===
        "grade11"
    ) {
        return "grade11";
    }

    return "al";
}


// ==========================
// Active Student
// ==========================

function isStudentActive(data) {

    const lastActive =
        Number(
            data?.lastActiveAt || 0
        );

    if (!lastActive) {
        return false;
    }

    return (
        Date.now() - lastActive
        <= ACTIVE_LIMIT
    );
}


// ==========================
// Update Bar
// ==========================

function updateBar(
    bar,
    valueElement,
    value,
    maxValue
) {

    if (!bar || !valueElement) {
        return;
    }

    const percentage =
        Math.min(
            (value / maxValue) * 100,
            100
        );

    bar.style.width =
        percentage + "%";

    valueElement.textContent =
        value;
}


// ==========================
// Load Dashboard
// ==========================

async function loadDashboard() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "students"
                )
            );


        // ==========================
        // Counters
        // ==========================

        let students = 0;

        let viewed = 0;

        let grade10Count = 0;

        let grade11Count = 0;

        let alCount = 0;

        let activeCount = 0;


        // ==========================
        // Read Students
        // ==========================

        snapshot.forEach(
            docSnap => {

                students++;


                const data =
                    docSnap.data();


                // ==========================
                // Student Type
                // ==========================

                const type =
                    getStudentType(
                        data
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


                // ==========================
                // Active
                // ==========================

                if (
                    isStudentActive(
                        data
                    )
                ) {

                    activeCount++;

                }


                // ==========================
                // Paper Views
                // ==========================

                for (
                    let i = 1;
                    i <= 10;
                    i++
                ) {

                    const field =
                        "paper" +
                        String(i).padStart(
                            2,
                            "0"
                        ) +
                        "Viewed";


                    if (
                        data[field] === true
                    ) {

                        viewed++;

                    }

                }

            }
        );


        // ==========================
        // Summary Cards
        // ==========================

        if (totalStudents) {

            totalStudents.textContent =
                students;

        }


        if (totalViewed) {

            totalViewed.textContent =
                viewed;

        }


        if (activeStudents) {

            activeStudents.textContent =
                activeCount;

        }


        // ==========================
        // Chart Scale
        // ==========================

        const maxValue =
            Math.max(
                students,
                viewed,
                grade10Count,
                grade11Count,
                alCount,
                activeCount,
                1
            );


        // ==========================
        // Update Chart
        // ==========================

        updateBar(
            chartTotalStudents,
            chartTotalStudentsValue,
            students,
            maxValue
        );


        updateBar(
            chartPaperViews,
            chartPaperViewsValue,
            viewed,
            maxValue
        );


        updateBar(
            chartGrade10,
            chartGrade10Value,
            grade10Count,
            maxValue
        );


        updateBar(
            chartGrade11,
            chartGrade11Value,
            grade11Count,
            maxValue
        );


        updateBar(
            chartAL,
            chartALValue,
            alCount,
            maxValue
        );


        updateBar(
            chartActive,
            chartActiveValue,
            activeCount,
            maxValue
        );


        console.log(
            "Dashboard updated:",
            {
                students,
                viewed,
                grade10Count,
                grade11Count,
                alCount,
                activeCount
            }
        );

    }

    catch (error) {

        console.error(
            "Dashboard load error:",
            error
        );

    }

}


// ==========================
// Logout
// ==========================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            sessionStorage.removeItem(
                "adminLoggedIn"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


// ==========================
// Initial Load
// ==========================

loadDashboard();


// ==========================
// Live Refresh
// ==========================

// Refresh every 30 seconds

setInterval(
    loadDashboard,
    30000
);


console.log(
    "✅ Admin Dashboard Loaded"
);
