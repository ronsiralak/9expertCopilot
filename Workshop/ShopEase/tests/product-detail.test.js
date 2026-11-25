const assert = require("node:assert/strict");
const {
  findProductById,
  getRelatedProducts,
} = require("../src/product-detail");

const products = [
  { id: 1, category: "books" },
  { id: 2, category: "books" },
  { id: 3, category: "books" },
  { id: 4, category: "books" },
  { id: 5, category: "electronics" },
];

assert.deepEqual(findProductById(products, 2), products[1]);
assert.equal(findProductById(products, 99), undefined);
assert.deepEqual(
  getRelatedProducts(products, 1),
  [products[1], products[2], products[3]]
);
assert.deepEqual(getRelatedProducts(products, 5), []);
assert.deepEqual(getRelatedProducts(products, 99), []);
assert.deepEqual(getRelatedProducts(products, 1, 2), [products[1], products[2]]);

console.log("Product detail tests passed");
