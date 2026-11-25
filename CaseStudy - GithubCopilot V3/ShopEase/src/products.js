/**
 * products.js - Product catalog and rendering
 * ShopEase E-Commerce Training Project
 */

// ─── Product Data ─────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    category: "electronics",
    price: 79.99,
    rating: 4.5,
    reviews: 128,
    emoji: "🎧",
    stock: 15,
    description: "Premium sound quality with active noise cancellation",
  },
  {
    id: 2,
    name: "Smart Watch Series X",
    category: "electronics",
    price: 249.99,
    rating: 4.8,
    reviews: 256,
    emoji: "⌚",
    stock: 8,
    description: "Track your health metrics and stay connected",
  },
  {
    id: 3,
    name: "Classic White T-Shirt",
    category: "clothing",
    price: 24.99,
    rating: 4.2,
    reviews: 89,
    emoji: "👕",
    stock: 50,
    description: "100% organic cotton, perfect everyday essential",
  },
  {
    id: 4,
    name: "Running Sneakers",
    category: "clothing",
    price: 119.99,
    rating: 4.6,
    reviews: 312,
    emoji: "👟",
    stock: 22,
    description: "Lightweight and breathable for peak performance",
  },
  {
    id: 5,
    name: "JavaScript: The Good Parts",
    category: "books",
    price: 34.99,
    rating: 4.7,
    reviews: 601,
    emoji: "📗",
    stock: 30,
    description: "Essential reading for every JavaScript developer",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 59.99,
    rating: 4.3,
    reviews: 175,
    emoji: "🔊",
    stock: 0,
    description: "360° surround sound with 12-hour battery life",
  },
  {
    id: 7,
    name: "Cozy Hoodie",
    category: "clothing",
    price: 64.99,
    rating: 4.4,
    reviews: 143,
    emoji: "🧥",
    stock: 18,
    description: "Warm, soft, and perfect for cooler weather",
  },
  {
    id: 8,
    name: "Clean Code",
    category: "books",
    price: 39.99,
    rating: 4.9,
    reviews: 987,
    emoji: "📘",
    stock: 25,
    description: "A handbook of agile software craftsmanship",
  },
];

// ─── Render Logic ─────────────────────────────────────────────────────────────

/**
 * Generate star rating HTML from a numeric rating
 * @param {number} rating - Rating value (0–5)
 * @returns {string} Star rating string with review count
 */
function renderStars(rating, reviews) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(empty) +
    ` (${reviews})`
  );
}

/**
 * Create a product card HTML string
 * @param {Object} product - Product data object
 * @returns {string} HTML string for the product card
 */
function createProductCard(product) {
  const stockBadge =
    product.stock === 0
      ? `<span class="badge badge-danger">Out of Stock</span>`
      : product.stock < 10
      ? `<span class="badge badge-warning">Low Stock</span>`
      : `<span class="badge badge-success">In Stock</span>`;

  const addButton =
    product.stock === 0
      ? `<button class="btn-primary" disabled style="opacity:0.5; cursor:not-allowed;">Out of Stock</button>`
      : `<button class="btn-primary" onclick='addToCart(${JSON.stringify(
          product
        )})'>Add to Cart</button>`;

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image">${product.emoji}</div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">${renderStars(
          product.rating,
          product.reviews
        )}</div>
        <div style="margin-bottom:0.5rem;">${stockBadge}</div>
        <div class="product-price">${formatCurrency(product.price)}</div>
        ${addButton}
      </div>
    </div>
  `;
}

/**
 * Render all products to the grid, with optional filtering and sorting
 * @param {string} searchQuery - Text to filter by name
 * @param {string} category - Category filter value
 * @param {string} sortBy - Sort order: 'price-asc' | 'price-desc' | 'name' | 'default'
 */
function renderProducts(searchQuery = "", category = "", sortBy = "default") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  let filtered = PRODUCTS.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <p>😕 No products found</p>
      <p style="font-size:0.875rem; color:#6b7280;">Try adjusting your search or filters</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(createProductCard).join("");
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");

  function applyFilters() {
    renderProducts(
      searchInput?.value || "",
      categoryFilter?.value || "",
      sortFilter?.value || "default"
    );
  }

  searchInput?.addEventListener("input", applyFilters);
  categoryFilter?.addEventListener("change", applyFilters);
  sortFilter?.addEventListener("change", applyFilters);
});
