import { db, doc, getDoc, updateDoc } from "./firebase.js";

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
    link.href = "dashboard-enhancements.css?v=1";
    link.dataset.dashboardEnhancements = "1";
    document.head.appendChild(link);
}

function paperStats(data) {
    let total = 0;
    let viewed = 0;
    for (let i = 1; i <= 50; i++) {
        const key = `paper${String(i).padStart(2, "0")}Viewed`;
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            total++;
            if (data[key] === true) viewed++;
        }
    }
    const progress = total ? Math.round((viewed / total) * 100) : 0;
    return { total, viewed, progress };
}

function addNavItems() {
    const nav = document.querySelector(".sidebar-nav");
    if (!nav || nav.dataset.enhanced === "1") return;
    nav.dataset.enhanced = "1";

    const items = [
        ["🎯", "My Targets", "enhanceTargetNav"],
        ["🏆", "Achievements", "enhanceAchievementNav"],
        ["🔔", "Notifications", "enhanceNotificationNav"]
    ];

    const support = document.getElementById("supportNav");
    items.forEach(([icon, label, id]) => {
        const a = document.createElement("a");
        a.href = "#";
        a.className = "sidebar-link";
        a.id = id;
        a.innerHTML = `<span class="nav-icon">${icon}</span><span>${label}</span>`;
        nav.insertBefore(a, support || null);
    });
}

function buildSections() {
    const content = document.querySelector(".content");
    const material = document.getElementById("materialGrid");
    if (!content || !material || document.getElementById("dashboardEnhancements")) return;

    const wrap = document.createElement("div");
    wrap.id = "dashboardEnhancements";
    wrap.className = "dashboard-enhancements";
    wrap.innerHTML = `
        <div class="enhance-grid">
            <section class="enhance-card" id="performanceSection">
                <div class="enhance-head">
                    <div>
                        <p class="enhance-eyebrow">MY PERFORMANCE</p>
                        <h2>Learning Progress</h2>
                        <p class="enhance-muted">A simple view of your paper completion.</p>
                    </div>
                    <span class="enhance-pill" id="performancePill">0%</span>
                </div>
                <div class="performance-row">
                    <div class="performance-top"><span>Papers completed</span><strong id="performanceViewed">0 / 0</strong></div>
                    <div class="performance-track"><div class="performance-fill" id="performanceFill" style="width:0%"></div></div>
                    <p class="performance-note" id="performanceNote">Start with your first available paper.</p>
                </div>
            </section>

            <section class="enhance-card" id="targetSection">
                <div class="enhance-head">
                    <div>
                        <p class="enhance-eyebrow">MY TARGET</p>
                        <h2>Set Your Goal</h2>
                        <p class="enhance-muted">Choose the completion percentage you want to reach.</p>
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
                        <p class="enhance-muted">Milestones are based on your portal activity.</p>
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
                <a class="quick-action" href="#" id="quickModel"><span class="quick-action-icon">📘</span><span><strong>Model Papers</strong><span>Practice</span></span></a>
                <a class="quick-action" href="#" id="quickPast"><span class="quick-action-icon">📖</span><span><strong>Past Papers</strong><span>Examination</span></span></a>
                <a class="quick-action" href="#" id="quickProgress"><span class="quick-action-icon">📊</span><span><strong>My Progress</strong><span>Track learning</span></span></a>
                <a class="quick-action" href="#" id="quickSupport"><span class="quick-action-icon">🛟</span><span><strong>Support</strong><span>Get assistance</span></span></a>
            </div>
        </section>
    `;

    content.insertBefore(wrap, content.querySelector(".announcement-card") || null);
}

function setupNavigation() {
    const go = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const links = {
        enhanceTargetNav: "targetSection",
        enhanceAchievementNav: "achievementSection",
        enhanceNotificationNav: "notificationSection",
        myProgressNav: "performanceSection",
        announcementsNav: "notificationSection",
        myPapersNav: "materialGrid",
        quickProgress: "performanceSection",
        quickSupport: "supportNav",
        enhanceNotificationNav: "notificationSection"
    };

    Object.entries(links).forEach(([id, target]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("click", (event) => {
            event.preventDefault();
            if (target === "supportNav") {
                document.querySelector(".support-card")?.scrollIntoView({ behavior: "smooth" });
            } else {
                go(target);
            }
        });
    });
}

function setupQuickPaperLinks() {
    const model = document.getElementById("modelPapersCard");
    const past = document.getElementById("pastPapersCard");
    const qModel = document.getElementById("quickModel");
    const qPast = document.getElementById("quickPast");
    if (qModel && model) qModel.addEventListener("click", (e) => { e.preventDefault(); model.click(); });
    if (qPast && past) qPast.addEventListener("click", (e) => { e.preventDefault(); past.click(); });
}

function renderPerformance(stats) {
    const fill = document.getElementById("performanceFill");
    const pill = document.getElementById("performancePill");
    const viewed = document.getElementById("performanceViewed");
    const note = document.getElementById("performanceNote");
    if (fill) fill.style.width = `${stats.progress}%`;
    if (pill) pill.textContent = `${stats.progress}%`;
    if (viewed) viewed.textContent = `${stats.viewed} / ${stats.total}`;
    if (note) note.textContent = stats.total ? (stats.progress >= 80 ? "Excellent consistency. Keep going." : stats.progress >= 50 ? "Good progress. Keep working toward your target." : "Build momentum by completing another paper.") : "No tracked papers yet.";
}

function renderAchievements(stats, target) {
    const list = document.getElementById("achievementList");
    if (!list) return;
    const achievements = [
        ["📘", "First Step", stats.viewed >= 1, "Viewed your first tracked paper"],
        ["🔥", "5 Papers", stats.viewed >= 5, "Completed 5 tracked papers"],
        ["🏆", "10 Papers", stats.viewed >= 10, "Completed 10 tracked papers"],
        ["📈", "50% Progress", stats.progress >= 50, "Reached half of your tracked papers"],
        ["🎯", "Target Reached", stats.progress >= target, `Reached your ${target}% target`]
    ];
    list.innerHTML = achievements.slice(0, 4).map(([icon, title, unlocked, text]) => `
        <div class="achievement" style="opacity:${unlocked ? 1 : .55}">
            <div class="achievement-icon">${icon}</div>
            <div><strong>${esc(title)} ${unlocked ? "✓" : ""}</strong><span>${esc(text)}</span></div>
        </div>
    `).join("");
}

function setupTarget(stats, data) {
    const input = document.getElementById("targetInput");
    const pill = document.getElementById("targetPill");
    const save = document.getElementById("targetSave");
    const msg = document.getElementById("targetMessage");
    const stored = Number(data.targetPercentage ?? data.targetMark ?? data.target ?? 85);
    let target = clamp(Number.isFinite(stored) ? stored : 85, 40, 100);
    if (input) input.value = target;
    if (pill) pill.textContent = `${target}%`;
    renderAchievements(stats, target);

    save?.addEventListener("click", async () => {
        const next = clamp(Number(input?.value || 85), 40, 100);
        save.disabled = true;
        try {
            if (!studentRef) throw new Error("Student session not available.");
            await updateDoc(studentRef, { targetPercentage: next });
            target = next;
            if (pill) pill.textContent = `${next}%`;
            renderAchievements(stats, target);
            if (msg) msg.textContent = "Target saved successfully.";
        } catch (error) {
            console.error(error);
            if (msg) msg.textContent = "Could not save target. Please try again.";
            if (msg) msg.style.color = "#c73555";
        } finally {
            save.disabled = false;
        }
    });
}

async function loadNotifications() {
    const list = document.getElementById("portalNotificationList");
    if (!list) return;
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js");
        const snap = await getDocs(collection(db, "announcements"));
        const grade = (sessionStorage.getItem("studentGrade") || "").toLowerCase().replace(/\s/g, "");
        const now = Date.now();
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(x => {
            if (x.enabled === false || x.active === false) return false;
            if (x.expiresAt?.toMillis && x.expiresAt.toMillis() < now) return false;
            if (!x.grade || String(x.grade).toLowerCase().replace(/\s/g, "") === grade || String(x.grade).toLowerCase() === "all") return true;
            return false;
        }).sort((a,b) => Number(b.createdAt?.toMillis?.() || b.createdAt || 0) - Number(a.createdAt?.toMillis?.() || a.createdAt || 0)).slice(0,4);

        if (!items.length) {
            list.innerHTML = '<div class="portal-empty">No new notifications right now.</div>';
            return;
        }
        list.innerHTML = items.map(x => `<article class="portal-notice"><div class="portal-notice-icon">📢</div><div><strong>${esc(x.title || "Portal Update")}</strong><p>${esc(x.message || x.description || "Important information for students.")}</p>${x.createdAt ? `<time>${esc(formatDate(x.createdAt))}</time>` : ""}</div></article>`).join("");
    } catch (error) {
        console.info("Announcements collection is not available yet.", error);
        list.innerHTML = '<div class="portal-empty">No new notifications right now.</div>';
    }
}

function formatDate(value) {
    try {
        const ms = value?.toMillis ? value.toMillis() : Number(value);
        if (!Number.isFinite(ms)) return "";
        return new Date(ms).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return ""; }
}

async function init() {
    if (sessionStorage.getItem("loggedIn") !== "true" || !studentRef) return;
    injectStyle();
    addNavItems();
    buildSections();
    setupNavigation();
    setupQuickPaperLinks();

    try {
        const snap = await getDoc(studentRef);
        if (!snap.exists()) return;
        const data = snap.data();
        const stats = paperStats(data);
        renderPerformance(stats);
        setupTarget(stats, data);
    } catch (error) {
        console.error("Dashboard enhancements failed:", error);
    }

    loadNotifications();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
