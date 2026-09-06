import { db, doc, getDoc } from "../firebase.js";

const loggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
const role = (sessionStorage.getItem("adminRole") || "limited").trim().toLowerCase().replace(/[\s_-]+/g, "");
const isSuperAdmin = role === "superadmin" || role === "full";

if (!loggedIn) {
    window.location.replace("../admin-login.html");
} else if (!isSuperAdmin) {
    window.location.replace("../admin.html");
}

console.log("Main Website Management loaded");
