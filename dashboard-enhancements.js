import { db, doc, getDoc, updateDoc, collection, getDocs } from "./firebase.js";

const studentId = sessionStorage.getItem("studentId");
const studentRef = studentId ? doc(db, "students", studentId) : null;

function esc(value) {
    return String(value ?? "").replace(/[&<>\"]/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
    }[m]));
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function injectStyle() {
    if (document.querySelector('link[data-dashboard-enhancements="1"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "dashboard-enhancements.css?v=2";
    link.dataset.dashboardEnhancements = "1";
    document.head.appendChild(link);
}

function injectSidebarStyle() {
    if (document.getElementById("studentSidebarFixStyle")) return;

    const style = document.createElement("style");
    style.id = "studentSidebarFixStyle";
    style.textContent = `
        .sidebar { overflow-y:auto; overflow-x:hidden; }
        .sidebar-nav { flex-shrink:0; }
        .sidebar-spacer { flex:1 1 auto; min-height:12px; }
        .student-account { order:4; flex-shrink:0; }
        #logoutBtn.sidebar-logout {
            order:5;
            flex-shrink:0;
            margin-top:10px;
            margin-bottom:8px;
            min-height:44px;
            background:linear-gradient(135deg,#ef4444,#dc2626) !important;
            border:1px solid rgba(255,255,255,.12) !important;
            color:#fff !important;
            box-shadow:0 8px 18px rgba(239,68,68,.22);
            font-weight:700;
        }
        #logoutBtn.sidebar-logout:hover {
            background:linear-gradient(135deg,#dc2626,#b91c1c) !important;
            transform:translateY(-1px);
        }
    `;
    document.head.appendChild(style);
}

function cleanSidebarAndPlaceLogout() {
    const sidebar = document.querySelector(".sidebar");
    const logout = document.getElementById("logoutBtn");
    const account = document.querySelector(".student-account");
    const spacer = document.querySelector(".sidebar-spacer");

    if (sidebar && account && logout) {
        if (spacer) sidebar.insertBefore(spacer, account);
        sidebar.insertBefore(account, logout);
        sidebar.appendChild(logout);
    }

    if (logout && !logout.dataset.studentLogoutBound) {
        logout.dataset.studentLogoutBound = "1";
        logout.addEventListener("click", () => {
            [
                "loggedIn",
                "studentId",
                "studentType",
                "studentGrade",
                "studentName",
                "studentNIC"
            ].forEach((key) => sessionStorage.removeItem(key));
            window.location.replace("index.html");
        });
    }
}

function buildSections() {
    const content = document.querySelector(".content");
    if (!content || document.getElementById("dashboardEnhancements")) return;

    const wrap = document.createElement("div");
    wrap.id = "dashboardEnhancements";
    wrap.className = "dashboard-enhancements";
    wrap.innerHTML = `
        <div class="enhance-grid single-column">
            <section class="enhance-card target-card" id="targetSection">
                <div class="enhance-head">
                    <div>
                        <p class="enhance-eyebrow">MY TARGET</p>
                        <h2>Set Your Goal</h2>
                        <p class="enhance-muted">Choose the paper-completion target you want to reach.</p>
                    </div>
                    <span class="enhance-pill" id="targetPill">85%</span>
                </div>
                <div class="target-box">
                    <input id="targetInput" type="number" min="40" max="100" step="1" value="85" aria-label="Target percentage">
                    <span>% target</span>
                    <button class="target-save" id="targetSave" type="button">Save Target</button>
                </div>
                <div class="target-message" id="targetMessage"></div>
            </section>
        </div>

        <div class="enhance-grid">
            <section class="enhance-card" id="achievementSection">
                <div class="enhance-head">
                    <div>
                        <p class="enhance-eyebrow">ACHIEVEMENTS</p>
                        <h2>Keep Building Your Streak</h2>
                        <p class="enhance-muted">Milestones update from your real paper activity.</p>
                    </div>
                </div>
                <div class="achievement-list" id="achievementList"></div>
            </section>

            <section class="enhance-card" id="notificationSection">
                <div class="enhance-head">
                    <div>
                        <p class="enhance-eyebrow">NOTIFICATIONS</p>
                        <h2>Latest Updates</h2>
                        <p class="enhance-muted">Important notices from the portal.</p>
                    </div>
                </div>
                <div class="notification-list" id="portalNotificationList">
                    <div class="portal-empty">Loading updates…</div>
                </div>
            </section>
        </div>

        <section class="enhance-card" id="quickActionsSection">
            <div class="enhance-section-title">
                <p class="enhance-eyebrow">QUICK ACCESS</p>
                <h2>Continue Learning</h2>
            </div>
            <div class="quick-grid">
                <a class="quick-action" href="#" id="quickModel">
                    <span class="quick-action-icon">📘</span>
                    <span class="quick-action-copy"><strong>Model Papers</strong><small>Practice</small></span>
                </a>
                <a class="quick-action" href="#" id="quickPast">
                    <span class="quick-action-icon">📖</span>
                    <span class="quick-action-copy"><strong>Past Papers</strong><small>Examination</small></span>
                </a>
                <a class="quick-action" href="#" id="quickProgress">
                    <span class="quick-action-icon">📊</span>
                    <span class="quick-action-copy"><strong>My Progress</strong><small>Track learning</small></span>
                </a>
                <a class="quick-action" href="#" id="quickSupport">
                    <span class="quick-action-icon">🛟</span>
                    <span class="quick-action-copy"><strong>Support</strong><small>Get assistance</small></span>
                </a>
            </div>
        </section>
    `;

    const announcement = content.querySelector(".announcement-card");
    if (announcement) content.insertBefore(wrap, announcement);
    else content.appendChild(wrap);
}

function setupNavigation() {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    const links = {
        myProgressNav: "summaryProgress",
        announcementsNav: "notificationSection",
        quickProgress: "summaryProgress",
        quickSupport: "supportNav",
        enhanceTargetNav: "targetSection",
        enhanceAchievementNav: "achievementSection",
        enhanceNotificationNav: "notificationSection"
    };

    Object.entries(links).forEach(([id, target]) => {
        const el = document.getElementById(id);
        if (!el || el.dataset.enhanceBound === "1") return;
        el.dataset.enhanceBound = "1";
        el.addEventListener("click", (event) => {
            event.preventDefault();
            if (target === "supportNav") document.querySelector(".support-card")?.scrollIntoView({ behavior:"smooth" });
            else scrollTo(target);
        });
    });
}

function setupQuickLinks() {
    const pairs = [
        ["quickModel", "modelPapersCard"],
        ["quickPast", "pastPapersCard"],
        ["quickProgress", "summaryProgress"]
    ];
    pairs.forEach(([from, to]) => {
        const source = document.getElementById(from);
        const target = document.getElementById(to);
        if (!source || !target || source.dataset.bound === "1") return;
        source.dataset.bound = "1";
        source.addEventListener("click", (e) => {
            e.preventDefault();
            if (to === "summaryProgress") target.closest(".summary-card")?.scrollIntoView({ behavior:"smooth", block:"center" });
            else target.click();
        });
    });

    const support = document.getElementById("quickSupport");
    if (support && !support.dataset.bound) {
        support.dataset.bound = "1";
        support.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(".support-card")?.scrollIntoView({ behavior:"smooth" });
        });
    }
}

function animateNumber(element, target, suffix = "", duration = 900) {
    if (!element) return;
    const end = Number(target) || 0;
    const start = 0;
    const started = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
        const progress = Math.min(1, (now - started) / duration);
        const value = Math.round(start + (end - start) * ease(progress));
        element.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function animateProgressFill(fill, target, duration = 1100) {
    if (!fill) return;
    const end = clamp(Number(target) || 0, 0, 100);
    fill.style.width = "0%";
    requestAnimationFrame(() => {
        fill.style.width = `${end}%`;
        fill.style.transition = `width ${duration}ms cubic-bezier(.22,1,.36,1)`;
    });
}

function animateRealDashboardData() {
    const totalEl = document.getElementById("totalPapers");
    const viewedEl = document.getElementById("viewedPapers");
    const summaryProgress = document.getElementById("summaryProgress");
    const progressValue = document.getElementById("progressValue");
    const progressFill = document.getElementById("progressFill");

    const readNumber = (el) => {
        if (!el) return 0;
        const match = String(el.textContent || "").match(/\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : 0;
    };

    const total = readNumber(totalEl);
    const viewed = readNumber(viewedEl);
    const progress = clamp(readNumber(summaryProgress) || readNumber(progressValue), 0, 100);

    if (totalEl) animateNumber(totalEl, total, "", 950);
    if (viewedEl) animateNumber(viewedEl, viewed, "", 850);
    if (summaryProgress) animateNumber(summaryProgress, progress, "%", 1000);
    if (progressValue) animateNumber(progressValue, progress, "%", 1000);
    animateProgressFill(progressFill, progress);

    document.querySelectorAll(".summary-card").forEach((card, index) => {
        card.style.setProperty("--card-delay", `${index * 90}ms`);
        card.classList.add("data-animated");
    });
}

function getTrackedStats(data) {
    let total = 0;
    let viewed = 0;
    for (let i = 1; i <= 50; i++) {
        const key = `paper${String(i).padStart(2, "0")}Viewed`;
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            total++;
            if (data[key] === true) viewed++;
        }
    }
    return {
        total,
        viewed,
        progress: total ? Math.round((viewed / total) * 100) : 0
    };
}

function renderAchievements(stats, target) {
    const list = document.getElementById("achievementList");
    if (!list) return;
    const items = [
        ["📘", "First Step", stats.viewed >= 1, "Viewed your first tracked paper"],
        ["🔥", "5 Papers", stats.viewed >= 5, "Reached 5 tracked papers"],
        ["🏆", "10 Papers", stats.viewed >= 10, "Reached 10 tracked papers"],
        ["📈", "50% Progress", stats.progress >= 50, "Reached 50% completion"],
        ["🎯", "Target Reached", stats.progress >= target, `Reached your ${target}% target`]
    ];
    list.innerHTML = items.slice(0, 4).map(([icon, title, unlocked, text]) => `
        <div class="achievement" style="opacity:${unlocked ? 1 : .55}">
            <div class="achievement-icon">${icon}</div>
            <div><strong>${esc(title)}${unlocked ? " ✓" : ""}</strong><span>${esc(text)}</span></div>
        </div>
    `).join("");
}

function setupTarget(data, stats) {
    const input = document.getElementById("targetInput");
    const pill = document.getElementById("targetPill");
    const save = document.getElementById("targetSave");
    const msg = document.getElementById("targetMessage");

    let target = clamp(Number(data.targetPercentage ?? data.targetMark ?? data.target ?? 85), 40, 100);
    if (!Number.isFinite(target)) target = 85;
    if (input) input.value = target;
    if (pill) pill.textContent = `${target}%`;
    renderAchievements(stats, target);

    save?.addEventListener("click", async () => {
        const next = clamp(Number(input?.value || 85), 40, 100);
        save.disabled = true;
        try {
            if (!studentRef) throw new Error("Student session unavailable.");
            await updateDoc(studentRef, { targetPercentage: next });
            target = next;
            if (pill) pill.textContent = `${next}%`;
            renderAchievements(stats, target);
            if (msg) msg.textContent = "Target saved successfully.";
        } catch (error) {
            console.error(error);
            if (msg) {
                msg.textContent = "Could not save target. Please try again.";
                msg.style.color = "#c73555";
            }
        } finally {
            save.disabled = false;
        }
    });
}

function timestampValue(value) {
    if (!value) return 0;
    if (typeof value.toMillis === "function") return value.toMillis();
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function formatDate(value) {
    const ms = timestampValue(value);
    return ms ? new Date(ms).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "";
}

async function loadNotifications() {
    const list = document.getElementById("portalNotificationList");
    if (!list) return;
    try {
        const snap = await getDocs(collection(db, "announcements"));
        const grade = (sessionStorage.getItem("studentGrade") || "").toLowerCase().replace(/\s/g, "");
        const now = Date.now();
        const items = snap.docs
            .map((d) => ({ id:d.id, ...d.data() }))
            .filter((x) => {
                if (x.enabled === false || x.active === false) return false;
                if (x.expiresAt && timestampValue(x.expiresAt) < now) return false;
                if (!x.grade) return true;
                const g = String(x.grade).toLowerCase().replace(/\s/g, "");
                return g === "all" || g === grade;
            })
            .sort((a,b) => timestampValue(b.createdAt) - timestampValue(a.createdAt))
            .slice(0, 4);

        if (!items.length) {
            list.innerHTML = '<div class="portal-empty">No new notifications right now.</div>';
            return;
        }

        list.innerHTML = items.map((x) => `
            <article class="portal-notice">
                <div class="portal-notice-icon">📢</div>
                <div>
                    <strong>${esc(x.title || "Portal Update")}</strong>
                    <p>${esc(x.message || x.description || "Important information for students.")}</p>
                    ${x.createdAt ? `<time>${esc(formatDate(x.createdAt))}</time>` : ""}
                </div>
            </article>
        `).join("");
    } catch (error) {
        console.info("Announcements collection is not available yet.", error);
        list.innerHTML = '<div class="portal-empty">No new notifications right now.</div>';
    }
}

async function init() {
    injectStyle();
    injectSidebarStyle();
    cleanSidebarAndPlaceLogout();
    buildSections();
    setupNavigation();
    setupQuickLinks();

    // dashboard.js is loaded before this module, so these values are the real live dashboard values.
    animateRealDashboardData();

    if (!studentRef) {
        loadNotifications();
        return;
    }

    try {
        const snap = await getDoc(studentRef);
        const data = snap.exists() ? snap.data() : {};
        const stats = getTrackedStats(data);
        setupTarget(data, stats);
    } catch (error) {
        console.error("Could not load student enhancement data:", error);
    }

    loadNotifications();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
} else {
    init();
}
