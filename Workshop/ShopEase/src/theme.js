/**
 * theme.js - Persistent light/dark theme selection
 * ShopEase E-Commerce Training Project
 */

const THEME_STORAGE_KEY = "shopease_theme";

function normalizeTheme(theme) {
  return theme === "dark" ? "dark" : "light";
}

function initTheme(doc, storage) {
  const themeDocument = doc || document;
  const themeStorage = storage || localStorage;
  let currentTheme = normalizeTheme(themeStorage.getItem(THEME_STORAGE_KEY));

  themeDocument.documentElement.dataset.theme = currentTheme;

  function bindThemeToggle() {
    const toggle = themeDocument.getElementById("theme-toggle");
    if (!toggle) return;

    function updateToggle() {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      toggle.textContent =
        currentTheme === "dark" ? "☀ Light mode" : "🌙 Dark mode";
      toggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
      toggle.setAttribute("aria-pressed", String(currentTheme === "dark"));
    }

    updateToggle();
    toggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      themeDocument.documentElement.dataset.theme = currentTheme;
      themeStorage.setItem(THEME_STORAGE_KEY, currentTheme);
      updateToggle();
    });
  }

  if (themeDocument.readyState === "loading") {
    themeDocument.addEventListener("DOMContentLoaded", bindThemeToggle, {
      once: true,
    });
  } else {
    bindThemeToggle();
  }
}

if (typeof document !== "undefined") {
  initTheme(document, localStorage);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { initTheme, normalizeTheme };
}
