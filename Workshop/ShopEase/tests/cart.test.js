const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { applyDiscount } = require("../src/utils");

const storage = new Map();
const cartCount = { textContent: "" };
let renderCount = 0;
const context = vm.createContext({
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
  },
  document: {
    getElementById(id) { return id === "cart-count" ? cartCount : null; },
  },
  applyDiscount,
  renderCart() { renderCount++; },
});

vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8"), context);
vm.runInContext("showToast = () => {}", context);
const run = (expression) => vm.runInContext(expression, context);
const storedCart = () => JSON.parse(storage.get("shopease_cart"));
const totals = (discount = 0) =>
  JSON.parse(JSON.stringify(run(`calculateTotals(getCart(), ${discount})`)));

assert.equal(cartCount.textContent, 0);
run('addToCart({ id: 1, name: "Phone", price: 20 })');
run('addToCart({ id: 2, name: "Case", price: 10 }, 2)');
run('addToCart({ id: 3, name: "Cable", price: 5 })');
assert.deepEqual(storedCart(), [
  { id: 1, name: "Phone", price: 20, quantity: 1 },
  { id: 2, name: "Case", price: 10, quantity: 2 },
  { id: 3, name: "Cable", price: 5, quantity: 1 },
]);
assert.equal(cartCount.textContent, 4);

run("updateQuantity(1, 2)");
run("updateQuantity(2, -1)");
assert.deepEqual(storedCart().map(({ id, quantity }) => ({ id, quantity })), [
  { id: 1, quantity: 3 },
  { id: 2, quantity: 1 },
  { id: 3, quantity: 1 },
]);
assert.equal(cartCount.textContent, 5);
assert.deepEqual(totals(10), {
  subtotal: 75,
  discount: 7.5,
  shipping: 0,
  tax: 4.73,
  total: 72.23,
});

run("removeFromCart(2)");
assert.deepEqual(storedCart().map((item) => item.id), [1, 3]);
assert.equal(cartCount.textContent, 4);
assert.deepEqual(totals(10), {
  subtotal: 65,
  discount: 6.5,
  shipping: 0,
  tax: 4.1,
  total: 62.6,
});

run("clearCart()");
assert.deepEqual(storedCart(), []);
assert.equal(run("getCart().length"), 0);
assert.equal(cartCount.textContent, 0);
assert.equal(renderCount, 1);
assert.deepEqual(totals(), { subtotal: 0, discount: 0, shipping: 5.99, tax: 0, total: 5.99 });

console.log("Cart integration tests passed");
