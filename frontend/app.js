const API_BASE   = "";
const API_URL    = `${API_BASE}/api/kindness`;

const form       = document.getElementById("kindness-form");
const nameInput  = document.getElementById("name-input");
const storyInput = document.getElementById("story-input");
const submitBtn  = document.getElementById("submit-btn");
const btnText    = document.getElementById("btn-text");
const btnSpinner = document.getElementById("btn-spinner");
const feedback   = document.getElementById("form-feedback");
const container  = document.getElementById("entries-container");
const badge      = document.getElementById("entry-count-badge");
const refreshBtn = document.getElementById("refresh-btn");
const charCount  = document.getElementById("char-count");

storyInput.addEventListener("input", () => {
  charCount.textContent = storyInput.value.length;
});

async function loadEntries() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch.");
    const entries = await res.json();
    renderEntries(entries);
  } catch {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <p>Couldn't load entries — is the backend running?</p>
      </div>`;
    badge.textContent = "Error";
  }
}

function renderEntries(entries) {
  updateBadgeText(entries.length);
  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🌸</div>
        <p>No kind acts yet — be the first to share one!</p>
      </div>`;
    return;
  }
  container.innerHTML = entries.map(buildCard).join("");
  attachListeners();
}

function buildCard(e) {
  const initial  = e.name.trim().charAt(0).toUpperCase();
  const timeLabel = formatTime(e.created_at);
  const safeName  = escHtml(e.name);
  const safeStory = escHtml(e.story);
  return `
    <div class="entry-card" id="card-${e.id}">
      <div class="entry-top">
        <div class="avatar">${initial}</div>
        <div class="entry-meta">
          <div class="entry-name">${safeName}</div>
          <div class="entry-time">${timeLabel}</div>
        </div>
        <button class="delete-btn" data-id="${e.id}" title="Remove" aria-label="Remove entry by ${safeName}">✕</button>
      </div>
      <p class="entry-story">${safeStory}</p>
      <div class="heart-row">
        <button class="heart-btn" data-id="${e.id}" aria-label="Give a heart to ${safeName}">
          <span class="heart-icon">❤️</span>
          <span class="heart-count">${e.hearts}</span>
        </button>
      </div>
    </div>`;
}

function attachListeners() {
  document.querySelectorAll(".heart-btn").forEach(btn => {
    btn.addEventListener("click", () => giveHeart(btn.dataset.id, btn));
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteEntry(btn.dataset.id));
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name  = nameInput.value.trim();
  const story = storyInput.value.trim();
  if (!name || !story) {
    showFeedback("Please fill in both your name and your story 💛", "error");
    return;
  }
  setLoading(true);
  hideFeedback();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, story }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to post.");
    }
    const entry = await res.json();
    prependCard(entry);
    form.reset();
    charCount.textContent = "0";
    showFeedback("🌟 Your kind act has been shared — thank you!", "success");
    incrementBadge();
  } catch (err) {
    showFeedback(err.message || "Something went wrong. Try again.", "error");
  } finally {
    setLoading(false);
  }
});

// ── Prepend a single new card without full reload ──
function prependCard(entry) {
  // Remove empty state if present
  const empty = container.querySelector(".empty-state");
  if (empty) empty.remove();

  const div = document.createElement("div");
  div.innerHTML = buildCard(entry);
  const card = div.firstElementChild;
  container.prepend(card);

  // Attach listeners to this new card
  card.querySelector(".heart-btn").addEventListener("click", function() {
    giveHeart(this.dataset.id, this);
  });
  card.querySelector(".delete-btn").addEventListener("click", function() {
    deleteEntry(this.dataset.id);
  });
}

async function giveHeart(id, btn) {
  btn.disabled = true;

  // Trigger pop animation
  const icon = btn.querySelector(".heart-icon");
  icon.classList.remove("beating");
  void icon.offsetWidth; // reflow to restart animation
  icon.classList.add("beating");

  try {
    const res = await fetch(`${API_URL}/${id}/heart`, { method: "POST" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    btn.querySelector(".heart-count").textContent = data.hearts;
  } catch {
    // silently fail — re-enable
  } finally {
    btn.disabled = false;
  }
}

async function deleteEntry(id) {
  if (!confirm("Remove this kind act?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    const card = document.getElementById(`card-${id}`);
    if (card) {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity    = "0";
      card.style.transform  = "scale(0.95)";
      setTimeout(() => {
        card.remove();
        decrementBadge();
        if (container.children.length === 0) {
          container.innerHTML = `
            <div class="empty-state">
              <div class="icon">🌸</div>
              <p>No kind acts yet — be the first to share one!</p>
            </div>`;
        }
      }, 300);
    }
  } catch {
    alert("Failed to delete. Please try again.");
  }
}

refreshBtn.addEventListener("click", () => {
  container.innerHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>`;
  loadEntries();
});

function setLoading(on) {
  submitBtn.disabled = on;
  btnText.classList.toggle("hidden", on);
  btnSpinner.classList.toggle("hidden", !on);
}

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = `feedback ${type}`;
  feedback.classList.remove("hidden");
  if (type === "success") setTimeout(hideFeedback, 4500);
}
function hideFeedback() {
  feedback.classList.add("hidden");
  feedback.textContent = "";
}

function getBadgeCount() {
  const m = badge.textContent.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}
function updateBadgeText(n) {
  badge.textContent = n === 1 ? "1 kind act 🌸" : `${n} kind acts 🌸`;
}
function incrementBadge() { updateBadgeText(getBadgeCount() + 1); }
function decrementBadge()  { updateBadgeText(Math.max(0, getBadgeCount() - 1)); }

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
  if (isNaN(d)) return "";
  const diff = Date.now() - d.getTime();
  const min  = Math.floor(diff / 60000);
  const hr   = Math.floor(min  / 60);
  const day  = Math.floor(hr   / 24);
  if (min < 1)   return "just now";
  if (min < 60)  return `${min}m ago`;
  if (hr  < 24)  return `${hr}h ago`;
  if (day === 1) return "yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function escHtml(str) {
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");
}

// ── Init ─────────────────────────────────────
loadEntries();
