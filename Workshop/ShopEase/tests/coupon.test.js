const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { applyCouponCode, applyDiscount } = require("../src/utils");

assert.equal(applyCouponCode(" save10 "), 10);
assert.equal(applyCouponCode("save20"), 20);
assert.equal(applyCouponCode("WELCOME"), 15);
assert.equal(applyCouponCode("FLASH50"), 50);
assert.equal(applyCouponCode(""), 0);
assert.equal(applyCouponCode("constructor"), 0);
assert.equal(applyCouponCode("INVALID"), 0);
assert.equal(applyDiscount(100, 10), 90);
assert.equal(applyDiscount(99.99, 10), 99.99 * 0.9);
assert.equal(applyDiscount(0.05, 10), 0.05 * 0.9);
assert.throws(() => applyDiscount(10, NaN));

const elements = {};
function element(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      value: "",
      textContent: "",
      innerHTML: "",
      hidden: false,
      listeners: {},
      scrollIntoView() {},
      focus() { this.focused = true; },
      addEventListener(event, callback) {
        this.listeners[event] = callback;
      },
    };
  }
  return elements[id];
}

const storage = new Map();
const session = new Map();
let catalog = [{ id: 1, name: "Test", price: 100, stock: 100 }];
const listeners = {};
const context = vm.createContext({
  document: {
    getElementById: element,
    addEventListener(event, callback) {
      listeners[event] = callback;
    },
  },
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, value); },
  },
  sessionStorage: {
    getItem(key) { return session.has(key) ? session.get(key) : null; },
    setItem(key, value) { session.set(key, value); },
    removeItem(key) { session.delete(key); },
  },
  window: { location: { href: "" }, addEventListener() {} },
  PRODUCT_STORAGE_KEY: "shopease_products",
  fetchProducts: async () => catalog,
  Intl,
});
for (const file of ["app.js", "utils.js", "cart.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "src", file), "utf8"), context);
}
vm.runInContext("showToast = () => {}", context);
async function main() {
await listeners.DOMContentLoaded();

function run(expression) {
  return vm.runInContext(expression, context);
}
function submit(code) {
  element("coupon-code").value = code;
  element("coupon-form").listeners.submit({ preventDefault() {} });
}

submit("SAVE10");
assert.match(element("coupon-message").textContent, /Add an item/);
run('saveCart([{ id: 1, name: "Test", price: 100, quantity: 1 }]); renderCart()');
submit("");
assert.match(element("coupon-message").textContent, /Enter a coupon/);
submit(" save10 ");
assert.equal(element("coupon-code").value, "SAVE10");
assert.equal(element("discount").textContent, "-$10.00");
assert.equal(element("tax").textContent, "$6.30");
assert.equal(element("shipping").textContent, "FREE");
assert.equal(element("total").textContent, "$96.30");
assert.equal(element("coupon-remove").hidden, false);

submit("wrong");
assert.match(element("coupon-message").textContent, /Invalid/);
assert.match(element("coupon-message").textContent, /SAVE10 remains applied/);
assert.equal(element("total").textContent, "$96.30");
run("changeQty(1, 1)");
assert.equal(element("discount").textContent, "-$20.00");
assert.equal(element("cart-increase-1").focused, true);
assert.match(element("cart-feedback").textContent, /Test quantity is 2/);
assert.match(element("cart-items").innerHTML, /aria-label="Increase quantity of Test, current quantity 2"/);
assert.match(element("cart-items").innerHTML, /aria-label="Remove Test from cart"/);
run("changeQty(1, -1)");
assert.equal(element("cart-decrease-1").focused, true);
element("coupon-remove").listeners.click();
assert.equal(element("discount").textContent, "$0.00");
assert.equal(element("total").textContent, "$107.00");

submit("SAVE10");
submit("save20");
assert.equal(element("discount").textContent, "-$20.00");
submit("FLASH50");
assert.equal(element("shipping").textContent, "$5.99");
assert.equal(element("total").textContent, "$59.49");
run("checkout()");
assert.equal(element("checkout-content").hidden, false);
assert.equal(element("customer-name").focused, true);
assert.equal(session.get("shopease_coupon"), "FLASH50");
run("clearCart()");
assert.equal(element("coupon-remove").hidden, true);
run('saveCart([{ id: 1, name: "Test", price: 100, quantity: 1 }]); renderCart()');
assert.equal(element("discount").textContent, "$0.00");
submit("SAVE10");
run("clearCart()");
assert.equal(element("coupon-remove").hidden, true);

assert.equal(run("calculateTotals([{price: 50, quantity: 1}]).shipping"), 5.99);
assert.equal(run("calculateTotals([{price: 50.01, quantity: 1}]).shipping"), 0);
assert.equal(run("calculateTotals([{price: 0.05, quantity: 1}], 10).discount"), 0);
assert.equal(run("calculateTotals([{price: 99.99, quantity: 1}], 10).total"), 96.29);
assert.throws(() => run("calculateTotals([], NaN)"));

run('saveCart([{ id: 1, name: "Test", price: 100, quantity: 1 }])');
catalog = [{ id: 1, name: "Test", price: 250, stock: 2 }];
await run("refreshCartProducts()");
assert.equal(run("getCart()[0].price"), 250);
assert.equal(element("total").textContent, "$267.50");
catalog = [];
await run("refreshCartProducts()");
assert.equal(element("checkout-btn").disabled, true);
assert.equal(run("getCart().length"), 1);
assert.match(element("cart-status").textContent, /unavailable/i);

run("deleteItem(1)");
assert.equal(element("cart-items").focused, true);
run('saveCart([{ id: 2, name: "Other", price: 10, quantity: 1 }]); changeQty(2, -1)');
assert.match(element("cart-feedback").textContent, /Other removed from cart/);
assert.equal(element("cart-items").focused, true);
assert.match(
  run(`createCartItemHTML({ id: 3, name: 'A "special" item', price: 1, quantity: 1 })`),
  /aria-label="Remove A &quot;special&quot; item from cart"/
);
assert.match(run(`createCartItemHTML({ id: 3, name: "Test", price: 1, quantity: 1 })`),
  /<\/div>\s*<\/article>\s*$/);

const messages = [];
const errors = [];
context.messages = messages;
context.console = { error(...args) { errors.push(args); } };
run("showToast = (message) => messages.push(message)");
const readError = new Error("Storage is disabled");
context.localStorage.getItem = () => { throw readError; };
assert.throws(() => run("getCart()"), (error) => error === readError);
assert.match(messages.pop(), /Unable to read your cart/);
assert.equal(errors.pop()[1], readError);

context.localStorage.getItem = (key) => storage.has(key) ? storage.get(key) : null;
const writeError = new Error("Storage quota exceeded");
context.localStorage.setItem = () => { throw writeError; };
const previousCart = storage.get("shopease_cart");
const previousCount = element("cart-count").textContent;
assert.throws(() => run('addToCart({ id: 2, name: "Other", price: 10 })'),
  (error) => error === writeError);
assert.match(messages.pop(), /Unable to save your cart/);
assert.equal(messages.length, 0);
assert.equal(errors.pop()[1], writeError);
assert.equal(storage.get("shopease_cart"), previousCart);
assert.equal(element("cart-count").textContent, previousCount);

console.log("Coupon tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
