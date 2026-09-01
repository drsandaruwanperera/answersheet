import {
    db,
    doc,
    getDoc,
    updateDoc
} from "./firebase.js";

const params = new URLSearchParams(
    window.location.search
);

const studentId =
    params.get("id") ||
    sessionStorage.getItem("studentId");

const updateBtn =
    document.getElementById("updateBtn");

const msg =
    document.getElementById("msg");


// =============================================
// CHECK STUDENT ID
// =============================================

if (!studentId) {

    if (msg) {
        msg.innerHTML =
            "Student session not found. Please login again.";
    }

    if (updateBtn) {
        updateBtn.disabled = true;
    }

}


// =============================================
// UPDATE PASSWORD
// =============================================

if (updateBtn) {

    updateBtn.addEventListener(
        "click",
        async () => {

            try {

                const currentPassword =
                    document
                        .getElementById("currentPassword")
                        .value
                        .trim();

                const newPassword =
                    document
                        .getElementById("newPassword")
                        .value
                        .trim();

                const confirmPassword =
                    document
                        .getElementById("confirmPassword")
                        .value
                        .trim();


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

                if (!studentId) {
                    msg.innerHTML =
                        "Student session not found. Please login again.";
                    return;
                }


                if (!currentPassword) {
                    msg.innerHTML =
                        "Please enter your current password.";
                    return;
                }


                if (newPassword.length < 8) {
                    msg.innerHTML =
                        "Password must be at least 8 characters.";
                    return;
                }


                if (newPassword !== confirmPassword) {
                    msg.innerHTML =
                        "New passwords do not match.";
                    return;
                }


                if (currentPassword === newPassword) {
                    msg.innerHTML =
                        "New password must be different from the current password.";
                    return;
                }


                // -----------------------------------------
                // DISABLE BUTTON
                // -----------------------------------------

                updateBtn.disabled = true;
                updateBtn.textContent = "Updating...";


                // -----------------------------------------
                // FIRESTORE STUDENT
                // -----------------------------------------

                const ref =
                    doc(
                        db,
                        "students",
                        studentId
                    );

                const snap =
                    await getDoc(ref);


                if (!snap.exists()) {

                    msg.innerHTML =
                        "Student account was not found.";

                    return;
                }


                const data =
                    snap.data();


                // -----------------------------------------
                // CHECK CURRENT PASSWORD
                // -----------------------------------------

                const storedPassword =
                    String(
                        data?.password ?? ""
                    );


                if (
                    storedPassword !==
                    currentPassword
                ) {

                    msg.innerHTML =
                        "Current password is incorrect.";

                    return;
                }


                // -----------------------------------------
                // UPDATE FIRESTORE
                // -----------------------------------------

                await updateDoc(
                    ref,
                    {
                        password:
                            newPassword,

                        mustChangePassword:
                            false
                    }
                );


                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                alert(
                    "Password updated successfully!"
                );


                // Keep session
                sessionStorage.setItem(
                    "studentId",
                    studentId
                );

                sessionStorage.setItem(
                    "loggedIn",
                    "true"
                );


                // Dashboard
                window.location.replace(
                    "dashboard.html"
                );

            }

            catch (error) {

                console.error(
                    "Password update error:",
                    error
                );

                msg.innerHTML =
                    "Password update failed: " +
                    error.message;

            }

            finally {

                updateBtn.disabled = false;
                updateBtn.textContent =
                    "Update Password";

            }

        }
    );

}