/**
 * Mock product API. Admin changes are stored only in this browser.
 */
const PRODUCT_STORAGE_KEY = "shopease_products";

function validateProducts(products) {
  if (!Array.isArray(products)) throw new Error("Invalid product catalog: expected an array");
  const ids = new Set();
  for (const product of products) {
    if (
      !product || !Number.isSafeInteger(product.id) || product.id < 1 ||
      ids.has(product.id) ||
      typeof product.name !== "string" || !product.name.trim() ||
      typeof product.category !== "string" || !product.category.trim() ||
      typeof product.emoji !== "string" ||
      typeof product.description !== "string" ||
      !Number.isFinite(product.price) || product.price < 0 ||
      !Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5 ||
      !Number.isSafeInteger(product.reviews) || product.reviews < 0 ||
      !Number.isSafeInteger(product.stock) || product.stock < 0
    ) {
      throw new Error("Invalid product catalog: invalid product or duplicate ID");
    }
    ids.add(product.id);
  }
  return products;
}

async function fetchProducts() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (saved !== null) return validateProducts(JSON.parse(saved));

  const response = await fetch("products.json");
  if (!response.ok) throw new Error(`Could not load products (HTTP ${response.status})`);
  return validateProducts(await response.json());
}

function saveProducts(products) {
  validateProducts(products);
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}
