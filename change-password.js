import { db, doc, getDoc, updateDoc } from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

const updateBtn = document.getElementById("updateBtn");

updateBtn.addEventListener("click", async () => {

    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const msg = document.getElementById("msg");

    if (newPassword.length < 8) {
        msg.innerHTML = "Password must be at least 8 characters.";
        return;
    }

    if (newPassword !== confirmPassword) {
        msg.innerHTML = "New passwords do not match.";
        return;
    }

    const ref = doc(db, "students", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        msg.innerHTML = "Student not found.";
        return;
    }

    const data = snap.data();

    if (data.password !== currentPassword) {
        msg.innerHTML = "Current password is incorrect.";
        return;
    }

    if (currentPassword === newPassword) {
        msg.innerHTML = "New password must be different from the current password.";
        return;
    }

    await updateDoc(ref, {
        password: newPassword,
        mustChangePassword: false
    });

    alert("Password updated successfully!");

    window.location.href = "dashboard.html?id=" + studentId;

});
