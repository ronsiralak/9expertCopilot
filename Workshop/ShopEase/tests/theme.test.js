const assert = require("node:assert/strict");
const { initTheme, normalizeTheme } = require("../src/theme");

assert.equal(normalizeTheme("dark"), "dark");
assert.equal(normalizeTheme("light"), "light");
assert.equal(normalizeTheme("unexpected"), "light");

const values = new Map([["shopease_theme", "dark"]]);
const listeners = {};
const toggleListeners = {};
const toggle = {
  textContent: "",
  attributes: {},
  addEventListener(event, callback) {
    toggleListeners[event] = callback;
  },
  setAttribute(name, value) {
    this.attributes[name] = value;
  },
};
const doc = {
  readyState: "loading",
  documentElement: { dataset: {} },
  addEventListener(event, callback) {
    listeners[event] = callback;
  },
  getElementById() {
    return toggle;
  },
};
const storage = {
  getItem(key) {
    return values.get(key) || null;
  },
  setItem(key, value) {
    values.set(key, value);
  },
};

initTheme(doc, storage);
assert.equal(doc.documentElement.dataset.theme, "dark");
listeners.DOMContentLoaded();
assert.equal(toggle.textContent, "☀ Light mode");
assert.equal(toggle.attributes["aria-pressed"], "true");

toggleListeners.click();
assert.equal(doc.documentElement.dataset.theme, "light");
assert.equal(values.get("shopease_theme"), "light");
assert.equal(toggle.textContent, "🌙 Dark mode");
assert.equal(toggle.attributes["aria-pressed"], "false");

console.log("Theme tests passed");
