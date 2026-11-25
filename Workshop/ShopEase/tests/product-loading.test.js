const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const products = JSON.parse(fs.readFileSync(path.join(root, "products.json"), "utf8"));

function createPage(ids, fetchCatalog, search = "") {
  const elements = Object.fromEntries(ids.map((id) => [id, {
    innerHTML: "",
    textContent: "",
    value: "",
    hidden: true,
    disabled: false,
    open: false,
    listeners: {},
    addEventListener(event, callback) { this.listeners[event] = callback; },
    showModal() { this.open = true; },
    close() { this.open = false; },
    focus() { this.focused = true; },
  }]));
  const listeners = [];
  const windowListeners = {};
  const errors = [];
  let saved = [1, 6];
  const context = vm.createContext({
    document: {
      getElementById(id) { return elements[id] || null; },
      addEventListener(event, callback) {
        if (event === "DOMContentLoaded") listeners.push(callback);
      },
      querySelectorAll() { return []; },
    },
    window: {
      location: { search },
      addEventListener(event, callback) { windowListeners[event] = callback; },
    },
    localStorage: { getItem() { return null; } },
    setTimeout,
    clearTimeout,
    URLSearchParams,
    fetch: fetchCatalog,
    console: { error(...args) { errors.push(args); } },
    formatCurrency: (price) => `$${price.toFixed(2)}`,
    escapeHtml: (value) => String(value),
    isInWishlist: (id) => saved.includes(id),
    getWishlist: () => saved,
    removeFromWishlist: (id) => { saved = saved.filter((item) => item !== id); },
    showToast() {},
  });
  function load(file) {
    vm.runInContext(fs.readFileSync(path.join(root, "src", file), "utf8"), context);
  }
  function start() {
    return Promise.all(listeners.map((callback) => callback()));
  }
  return { context, elements, errors, load, start, windowListeners };
}

async function main() {
  let resolveFetch;
  let calls = 0;
  const pending = new Promise((resolve) => { resolveFetch = resolve; });
  const catalogPage = createPage(
    ["product-grid", "product-results-status", "search-input", "category-filter", "sort-filter",
      "quick-view-dialog", "quick-view-name", "quick-view-description",
      "quick-view-price", "quick-view-add"],
    (url) => {
      calls++;
      assert.equal(url, "products.json");
      return pending;
    }
  );
  catalogPage.load("api.js");
  catalogPage.load("products.js");
  const started = Date.now();
  const loading = catalogPage.start();
  catalogPage.elements["search-input"].value = "speaker";
  catalogPage.elements["search-input"].listeners.input();
  assert.equal(catalogPage.elements["product-grid"].innerHTML, "");
  resolveFetch({ ok: true, json: async () => products });
  await loading;
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.ok(Date.now() - started >= 290);
  assert.equal(calls, 1);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /Bluetooth Speaker/);
  assert.equal(catalogPage.elements["product-results-status"].textContent, "1 product found.");
  assert.match(catalogPage.elements["product-grid"].innerHTML, /aria-label="Quick view Bluetooth Speaker"/);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /onclick="openQuickView\(6\)"/);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /Out of Stock/);
  assert.doesNotMatch(catalogPage.elements["product-grid"].innerHTML, /Wireless Earbuds Pro/);

  let wishlistReads = 0;
  const getWishlist = catalogPage.context.getWishlist;
  catalogPage.context.getWishlist = () => {
    wishlistReads++;
    return getWishlist();
  };
  catalogPage.context.renderCount = 0;
  vm.runInContext(`
    const originalRenderProducts = renderProducts;
    renderProducts = (...args) => {
      renderCount++;
      return originalRenderProducts(...args);
    };
  `, catalogPage.context);
  let now = 0;
  let timerId = 0;
  const timers = new Map();
  catalogPage.context.setTimeout = (callback, delay) => {
    const id = ++timerId;
    timers.set(id, { callback, due: now + delay });
    return id;
  };
  catalogPage.context.clearTimeout = (id) => timers.delete(id);
  function advanceTime(ms) {
    now += ms;
    for (const [id, timer] of timers) {
      if (timer.due <= now) {
        timers.delete(id);
        timer.callback();
      }
    }
  }
  catalogPage.elements["search-input"].value = "cle";
  catalogPage.elements["search-input"].listeners.input();
  catalogPage.elements["category-filter"].value = "books";
  catalogPage.elements["category-filter"].listeners.change();
  assert.equal(catalogPage.context.renderCount, 1);
  assert.equal(wishlistReads, 0);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /No products found/);
  assert.equal(catalogPage.elements["product-results-status"].textContent, "0 products found.");
  advanceTime(200);
  catalogPage.elements["search-input"].value = "clean";
  catalogPage.elements["search-input"].listeners.input();
  advanceTime(299);
  assert.equal(catalogPage.context.renderCount, 1);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /No products found/);
  advanceTime(1);
  assert.equal(catalogPage.context.renderCount, 2);
  assert.equal(wishlistReads, 1);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /Clean Code/);
  catalogPage.elements["search-input"].value = "";
  catalogPage.elements["search-input"].listeners.input();
  advanceTime(299);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /Clean Code/);
  assert.doesNotMatch(catalogPage.elements["product-grid"].innerHTML, /JavaScript: The Good Parts/);
  advanceTime(1);
  assert.equal(catalogPage.context.renderCount, 3);
  assert.equal(wishlistReads, 2);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /Clean Code/);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /JavaScript: The Good Parts/);
  assert.doesNotMatch(catalogPage.elements["product-grid"].innerHTML, /Bluetooth Speaker/);

  catalogPage.context.getWishlist = () => {
    wishlistReads++;
    return [8];
  };
  catalogPage.elements["sort-filter"].value = "name";
  catalogPage.elements["sort-filter"].listeners.change();
  assert.equal(wishlistReads, 3);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /data-id="8"[\s\S]*?aria-pressed="true"/);
  assert.match(catalogPage.elements["product-grid"].innerHTML, /data-id="5"[\s\S]*?aria-pressed="false"/);
  catalogPage.context.getWishlist = getWishlist;
  await vm.runInContext("loadProducts()", catalogPage.context);
  assert.equal(calls, 1);

  catalogPage.context.testProducts = products;
  for (const [stock, hasRibbon] of [[0, false], [20, false], [21, true]]) {
    catalogPage.context.testProduct = { ...products[0], stock };
    const card = vm.runInContext("createProductCard(testProduct)", catalogPage.context);
    assert.equal(card.includes('<span class="ribbon">Sale</span>'), hasRibbon);
    assert.match(card, /<\/div>\s*<\/article>\s*$/);
  }
  assert.deepEqual(
    Array.from(vm.runInContext('filterProducts(testProducts, { query: "CODE", category: "books" }).map(p => p.id)', catalogPage.context)),
    [8]
  );
  assert.equal(vm.runInContext('filterProducts(testProducts, { query: "code", category: "electronics" }).length', catalogPage.context), 0);
  assert.equal(vm.runInContext("filterProducts(testProducts).length", catalogPage.context), products.length);
  assert.deepEqual(catalogPage.context.testProducts, products);

  const added = [];
  catalogPage.context.addToCart = (product) => added.push(product);
  vm.runInContext("openQuickView(1)", catalogPage.context);
  assert.equal(catalogPage.elements["quick-view-dialog"].open, true);
  assert.equal(catalogPage.elements["quick-view-name"].textContent, products[0].name);
  assert.equal(catalogPage.elements["quick-view-description"].textContent, products[0].description);
  assert.equal(catalogPage.elements["quick-view-price"].textContent, "$79.99");
  assert.equal(catalogPage.elements["quick-view-add"].disabled, false);
  let escapePrevented = false;
  catalogPage.elements["quick-view-dialog"].listeners.keydown({
    key: "Escape",
    preventDefault() { escapePrevented = true; },
  });
  assert.equal(escapePrevented, true);
  assert.equal(catalogPage.elements["quick-view-dialog"].open, false);
  vm.runInContext("openQuickView(1)", catalogPage.context);
  vm.runInContext("addQuickViewToCart()", catalogPage.context);
  assert.equal(catalogPage.elements["quick-view-dialog"].open, false);
  assert.equal(added[0].id, 1);

  vm.runInContext("openQuickView(6)", catalogPage.context);
  assert.equal(catalogPage.elements["quick-view-add"].disabled, true);
  assert.equal(catalogPage.elements["quick-view-add"].textContent, "Out of Stock");
  vm.runInContext("addQuickViewToCart()", catalogPage.context);
  assert.equal(added.length, 1);

  vm.runInContext("openQuickView(1)", catalogPage.context);
  const refresh = catalogPage.windowListeners.storage({ key: "shopease_products" });
  assert.equal(catalogPage.elements["quick-view-dialog"].open, false);
  advanceTime(300);
  await refresh;

  let savedCatalog = null;
  const savedPage = createPage(["product-grid"], async () => {
    throw new Error("Saved products should not require a network request");
  });
  savedPage.context.localStorage = {
    getItem() { return savedCatalog; },
    setItem(key, value) { savedCatalog = value; },
  };
  savedPage.load("api.js");
  savedPage.load("products.js");
  savedPage.context.newProducts = [{ ...products[0], price: 12.5 }];
  vm.runInContext("saveProducts(newProducts)", savedPage.context);
  await savedPage.start();
  assert.match(savedPage.elements["product-grid"].innerHTML, /\$12\.50/);
  assert.equal(savedPage.errors.length, 0);

  const successFetch = async () => ({ ok: true, json: async () => products });
  const detail = createPage(
    ["product-detail", "reviews-section", "related-section", "product-review-summary",
      "product-review-note", "related-products"],
    successFetch,
    "?id=1"
  );
  detail.load("api.js");
  detail.load("products.js");
  detail.load("product-detail.js");
  await detail.start();
  assert.match(detail.elements["product-detail"].innerHTML, /Wireless Earbuds Pro/);
  assert.match(detail.elements["product-detail"].innerHTML, /Premium sound quality/);
  assert.match(detail.elements["related-products"].innerHTML, /Bluetooth Speaker/);
  assert.doesNotMatch(detail.elements["related-products"].innerHTML, /Wireless Earbuds Pro/);
  assert.match(detail.elements["related-products"].innerHTML, /data-id="6"[\s\S]*?aria-pressed="true"/);
  assert.equal(detail.elements["reviews-section"].hidden, false);

  const wishlist = createPage(["wishlist-items"], successFetch);
  wishlist.load("api.js");
  wishlist.load("products.js");
  wishlist.load("wishlist-page.js");
  await wishlist.start();
  assert.match(wishlist.elements["wishlist-items"].innerHTML, /Wireless Earbuds Pro/);
  assert.match(wishlist.elements["wishlist-items"].innerHTML, /Bluetooth Speaker/);
  vm.runInContext("removeWishlistItem(1)", wishlist.context);
  assert.doesNotMatch(wishlist.elements["wishlist-items"].innerHTML, /Wireless Earbuds Pro/);
  assert.match(wishlist.elements["wishlist-items"].innerHTML, /Bluetooth Speaker/);
  assert.equal(wishlist.elements["wishlist-items"].focused, true);
  assert.match(wishlist.elements["wishlist-items"].innerHTML, /aria-label="Remove from Wishlist: Bluetooth Speaker"/);

  for (const [ids, script, target] of [
    [["product-grid"], null, "product-grid"],
    [["product-detail"], "product-detail.js", "product-detail"],
    [["wishlist-items"], "wishlist-page.js", "wishlist-items"],
  ]) {
    const page = createPage(ids, async () => ({ ok: false, status: 404 }));
    page.load("api.js");
    page.load("products.js");
    if (script) page.load(script);
    await page.start();
    assert.match(page.elements[target].innerHTML, /Unable to load products/);
    assert.equal(page.errors.length, 1);
  }

  for (const fetchCatalog of [
    async () => { throw new Error("Network error"); },
    async () => ({ ok: true, json: async () => { throw new Error("Invalid JSON"); } }),
    async () => ({ ok: true, json: async () => ({}) }),
    async () => ({ ok: true, json: async () => [products[0], products[0]] }),
  ]) {
    const page = createPage(["product-grid"], fetchCatalog);
    page.load("api.js");
    page.load("products.js");
    await page.start();
    assert.match(page.elements["product-grid"].innerHTML, /Unable to load products/);
    assert.equal(page.errors.length, 1);
  }

  console.log("Product loading tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
