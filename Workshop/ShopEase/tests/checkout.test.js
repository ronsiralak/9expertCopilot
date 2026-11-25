const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const elements = {};
function element(id) {
  if (!elements[id]) {
    elements[id] = {
      id, value: "", textContent: "", hidden: false, disabled: false, listeners: {}, attributes: {},
      selectionStart: 0, selectionEnd: 0,
      setAttribute(name, value) { this.attributes[name] = value; },
      setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; },
      addEventListener(event, callback) { this.listeners[event] = callback; },
      focus() { this.focused = true; },
      reset() { inputs.forEach((key) => { element(key).value = ""; }); },
    };
  }
  return elements[id];
}
const inputs = ["customer-name", "customer-email", "customer-address", "customer-city",
  "customer-postal", "card-name", "card-number", "card-expiry", "card-cvv"];
let cart = [{ id: 1, price: 100, quantity: 1 }];
let refreshedPrice = 100;
let available = true;
let refreshSucceeds = true;
let coupon = "SAVE10";
const listeners = {};
const context = vm.createContext({
  document: {
    getElementById: element,
    querySelector() { return element("submit-button"); },
    addEventListener(event, callback) { listeners[event] = callback; },
  },
  getCart() { return cart; },
  clearCart() { cart = []; },
  unavailableCartItems(items) { return available ? [] : items; },
  async refreshCartProducts() {
    if (!refreshSucceeds) return false;
    cart = cart.map((item) => ({ ...item, price: refreshedPrice }));
    return true;
  },
  sessionStorage: {
    getItem() { return coupon; },
    removeItem() { coupon = null; },
  },
});
for (const file of ["utils.js", "checkout.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "src", file), "utf8"), context);
}
listeners.DOMContentLoaded();
const form = element("checkout-form");
const values = ["Test Customer", "test@example.com", "1 Example St", "Test City",
  "12345", "Test Customer", "4242 4242 4242 4242", "2099-12", "123"];
inputs.forEach((id, i) => { element(id).value = values[i]; });
function input(id, value) {
  element(id).value = value;
  element(id).setSelectionRange(value.length, value.length);
  form.listeners.input({ target: element(id) });
}
function submit() { return form.listeners.submit({ preventDefault() {} }); }

async function main() {
  input("card-number", "4242424242424242");
  assert.equal(element("card-number").value, "4242 4242 4242 4242");
  assert.equal(element("card-number").selectionStart, 19);
  assert.equal(element("card-number-error").textContent, "");
  element("card-number").value = "42429242";
  element("card-number").setSelectionRange(5, 5);
  form.listeners.input({ target: element("card-number") });
  assert.equal(element("card-number").value, "4242 9242");
  assert.equal(element("card-number").selectionStart, 6);
  input("card-number", "4242-42ab42");
  assert.equal(element("card-number").value, "4242 4242");
  element("card-number").setSelectionRange(5, 5);
  element("card-number").listeners.keydown({ key: "Backspace", currentTarget: element("card-number") });
  assert.equal(element("card-number").selectionStart, 3);
  assert.equal(element("card-number").selectionEnd, 5);
  element("card-number").setSelectionRange(4, 4);
  element("card-number").listeners.keydown({ key: "Delete", currentTarget: element("card-number") });
  assert.equal(element("card-number").selectionStart, 4);
  assert.equal(element("card-number").selectionEnd, 6);
  input("card-number", values[6]);

  input("customer-email", "invalid");
  assert.match(element("customer-email-error").textContent, /valid email/i);
  await submit();
  assert.equal(cart.length, 1);
  input("customer-email", values[1]);
  assert.equal(element("customer-email-error").textContent, "");

  input("card-number", "4111111111111111");
  assert.match(element("card-number-error").textContent, /test card number shown/i);
  await submit();
  assert.equal(cart.length, 1);
  input("card-number", values[6]);
  input("card-expiry", "2000-01");
  assert.match(element("card-expiry-error").textContent, /future month/i);
  input("card-expiry", values[7]);
  input("card-cvv", "999");
  assert.match(element("card-cvv-error").textContent, /123/);
  input("card-cvv", values[8]);

  refreshedPrice = 120;
  await submit();
  assert.match(element("checkout-message").textContent, /review/i);
  assert.equal(cart[0].price, 120);
  available = false;
  await submit();
  assert.match(element("checkout-message").textContent, /update your cart/i);
  assert.equal(cart.length, 1);
  available = true;
  refreshSucceeds = false;
  await submit();
  assert.match(element("checkout-message").textContent, /could not be verified/i);
  assert.equal(cart.length, 1);
  refreshSucceeds = true;
  await submit();
  assert.match(element("checkout-result").textContent, /no payment.*no order/i);
  assert.equal(element("checkout-result").focused, true);
  assert.equal(cart.length, 0);
  assert.equal(coupon, null);
  assert.ok(inputs.every((id) => element(id).value === ""));
  console.log("Checkout tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
