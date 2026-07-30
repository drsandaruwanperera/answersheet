import { db, doc, getDoc } from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    msg.textContent = "";

    const ref = doc(db, "admins", "admin");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        msg.textContent = "Admin account not found.";
        return;
    }

    const data = snap.data();

    if (username !== data.username || password !== data.password) {
        msg.textContent = "Invalid username or password.";
        return;
    }

    // Save admin session
    sessionStorage.setItem("adminLoggedIn", "true");

    // Open Admin Dashboard
    window.location.href = "admin.html";

});
