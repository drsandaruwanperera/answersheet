import { db, doc, getDoc, updateDoc } from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const studentId = document.getElementById("studentId").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if (studentId === "" || password === "") {
        msg.innerHTML = "Please enter Student ID and Password";
        return;
    }

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

    if (data.used === true) {
        msg.innerHTML = "Password Already Used";
        return;
    }

    await updateDoc(ref, {
        used: true
    });


});
