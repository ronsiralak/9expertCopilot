const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function node() {
  return {
    children: [], listeners: {}, value: "", hidden: false,
    appendChild(child) { this.children.push(child); },
    replaceChildren() { this.children = []; },
    addEventListener(event, callback) { this.listeners[event] = callback; },
    setAttribute() {},
    contains() { return false; },
    focus() { this.focused = true; },
    checkValidity() { return true; },
    reset() { this.didReset = true; },
  };
}
const elements = {};
function element(id) {
  if (!elements[id]) elements[id] = node();
  return elements[id];
}
let products = [{ id: 1, name: "Test", price: 10, stock: 5, category: "books" }];
const storage = new Map();
let callback;
const context = vm.createContext({
  document: {
    getElementById: element,
    createElement: node,
    addEventListener(event, fn) { if (event === "DOMContentLoaded") callback = fn; },
  },
  window: { confirm() { return true; } },
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, value); },
  },
  async fetchProducts() { return products.map((product) => ({ ...product })); },
  saveProducts(value) { products = value; },
  console,
});
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "src", "admin.js"), "utf8"), context);

async function main() {
  await callback();
  assert.equal(element("admin-products").children.length, 1);
  context.input = { valueAsNumber: 25.5, checkValidity() { return true; } };
  context.input.id = "admin-edit-price-1";
  context.document.body = {};
  context.document.activeElement = context.document.body;
  await vm.runInContext('editProduct(1, "price", input)', context);
  assert.equal(products[0].price, 25.5);
  assert.equal(element("admin-edit-price-1").focused, true);
  context.document.activeElement = undefined;
  context.input.valueAsNumber = 1.5;
  await vm.runInContext('editProduct(1, "stock", input)', context);
  assert.equal(products[0].stock, 5);
  assert.match(element("admin-status").textContent, /valid non-negative stock/);

  element("admin-name").value = "New product";
  element("admin-price").valueAsNumber = 7.5;
  element("admin-stock").valueAsNumber = 3;
  element("admin-category").value = "books";
  const form = element("admin-add-form");
  await form.listeners.submit({ preventDefault() {}, currentTarget: form });
  assert.equal(products.length, 2);
  assert.equal(products[1].name, "New product");
  assert.equal(form.didReset, true);
  context.productToDelete = products[1];
  await vm.runInContext("deleteProduct(productToDelete)", context);
  assert.equal(products.length, 1);
  assert.equal(products[0].id, 1);
  console.log("Admin tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
