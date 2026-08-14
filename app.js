import { db, doc, getDoc } from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const studentId = document.getElementById("studentId").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        msg.innerHTML = "Student ID not found";
        return;
    }

    const data = snap.data();

    if (data.password !== password) {
        msg.innerHTML = "Wrong Password";
        return;
    }

    // Save login session
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("studentId", studentId);

    if (data.mustChangePassword === true) {

    window.location.href =
        "change-password.html?id=" +
        encodeURIComponent(studentId);

} else {

    const studentNumber = Number(studentId);

    // Grade 11 → 26000 series
    if (
        Number.isInteger(studentNumber) &&
        studentNumber >= 26000 &&
        studentNumber <= 26999
    ) {

        sessionStorage.setItem(
            "studentGrade",
            "grade11"
        );

        window.location.href =
            "dashboard-grade11.html?id=" +
            encodeURIComponent(studentId);

    }

    // Grade 10 → 27000 series
    else if (
        Number.isInteger(studentNumber) &&
        studentNumber >= 27000 &&
        studentNumber <= 27999
    ) {

        sessionStorage.setItem(
            "studentGrade",
            "grade10"
        );

        window.location.href =
            "dashboard-grade10.html?id=" +
            encodeURIComponent(studentId);

    }

    // Other IDs → existing dashboard
    else {

        sessionStorage.setItem(
            "studentGrade",
            "al"
        );

        window.location.href =
            "dashboard.html?id=" +
            encodeURIComponent(studentId);

    }

}

console.log("app.js loaded");
