// ===== Footer Year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Theme Toggle (works + saves preference) =====
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

function syncThemeButton() {
  const isDark = html.classList.contains("dark");
  if (themeIcon) themeIcon.textContent = isDark ? "🌙" : "☀️";
  if (themeLabel) themeLabel.textContent = isDark ? "Dark" : "Light";
}

syncThemeButton();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = html.classList.contains("dark") ? "light" : "dark";

    if (next === "dark") html.classList.add("dark");
    else html.classList.remove("dark");

    localStorage.setItem("theme", next);
    syncThemeButton();
  });
}

// ===== Certificates (loaded from backend) =====
async function loadCertificates() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;

  try {
    const res = await fetch("/api/certificates");
    const data = await res.json();

    if (!data.ok) throw new Error(data.error || "Failed to load certificates");

    grid.innerHTML = data.certificates.map((c) => {
      const niceTitle = c.file.replace(/\.pdf$/i, "").replaceAll("_", " ");

      return `
        <article class="rounded-2xl border border-black/10 bg-white p-6 hover:bg-zinc-50 transition
                        dark:border-white/10 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60">
          <h3 class="font-semibold text-brand-800 dark:text-brand-200">${niceTitle}</h3>
          <p class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">PDF Certificate</p>
          <div class="mt-4 flex gap-4">
            <a class="text-sm font-semibold text-brand-700 hover:text-brand-600 dark:text-brand-200 dark:hover:text-brand-100"
               href="${c.viewUrl}" target="_blank" rel="noreferrer">View</a>
            <a class="text-sm font-semibold text-brand-700 hover:text-brand-600 dark:text-brand-200 dark:hover:text-brand-100"
               href="${c.downloadUrl}">Download</a>
          </div>
        </article>
      `;
    }).join("");
  } catch (err) {
    grid.innerHTML = `
      <p class="text-sm text-zinc-700 dark:text-zinc-300">
        Could not load certificates. Make sure your backend is running and your PDFs are inside:
        <code>public/assets/certificates/</code>
      </p>
    `;
  }
}

loadCertificates();
