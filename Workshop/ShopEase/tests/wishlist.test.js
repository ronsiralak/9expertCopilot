const assert = require("node:assert/strict");
const {
  getWishlist,
  isInWishlist,
  removeFromWishlist,
  toggleWishlist,
} = require("../src/wishlist");

const storageValues = new Map();
global.localStorage = {
  getItem(key) {
    return storageValues.has(key) ? storageValues.get(key) : null;
  },
  setItem(key, value) {
    storageValues.set(key, String(value));
  },
};
global.document = {
  getElementById() {
    return null;
  },
};

const product = { id: 1, name: "Phone", price: 99, emoji: "📱" };

assert.deepEqual(getWishlist(), []);
assert.equal(toggleWishlist(product), true);
assert.deepEqual(getWishlist(), [product.id]);
assert.equal(isInWishlist(product.id), true);
assert.equal(toggleWishlist(product), false);
assert.deepEqual(getWishlist(), []);

toggleWishlist(product);
removeFromWishlist(product.id);
assert.deepEqual(getWishlist(), []);

storageValues.set("shopease_cart", JSON.stringify([{ id: 2, quantity: 1 }]));
toggleWishlist(product);
assert.deepEqual(
  JSON.parse(storageValues.get("shopease_cart")),
  [{ id: 2, quantity: 1 }]
);

console.log("Wishlist tests passed");
