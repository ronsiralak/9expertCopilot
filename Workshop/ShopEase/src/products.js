/**
 * products.js - Product catalog and rendering
 * ShopEase E-Commerce Training Project
 */

// ─── Product Data ─────────────────────────────────────────────────────────────

let PRODUCTS = [];
let productsPromise;
let productsLoaded = false;
let appliedSearchQuery = "";
let quickViewProductId = null;

function loadProducts() {
  if (!productsPromise) {
    productsPromise = fetchProducts().then((products) => {
      PRODUCTS = products;
      productsLoaded = true;
      return PRODUCTS;
    });
  }
  return productsPromise;
}

function showProductsLoadError(container, error) {
  console.error("Could not load product catalog:", error);
  container.innerHTML = `<div class="empty-state" role="alert">
    <p>Unable to load products. Please reload the page and try again.</p>
  </div>`;
}

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
 * @param {boolean} [saved] - Whether the product is in the wishlist.
 * @returns {string} HTML string for the product card
 */
function createProductCard(product, saved = isInWishlist(product.id)) {
  const stockBadge =
    product.stock === 0
      ? `<span class="badge badge-danger">Out of Stock</span>`
      : product.stock < 10
      ? `<span class="badge badge-warning">Low Stock</span>`
      : `<span class="badge badge-success">In Stock</span>`;

  const addButton =
    product.stock === 0
      ? `<button class="btn-primary" type="button" disabled style="opacity:0.5; cursor:not-allowed;">Out of Stock</button>`
      : `<button class="btn-primary" type="button" aria-label="Add to Cart: ${escapeHtml(product.name)}" onclick="addProductToCart(${product.id})">Add to Cart</button>`;

  return `
    <article class="product-card" aria-label="${escapeHtml(product.name)}" data-id="${product.id}" data-category="${escapeHtml(product.category)}">
      ${product.stock > 20 ? '<span class="ribbon">Sale</span>' : ""}
      <a class="product-image-link" href="product-detail.html?id=${product.id}" aria-label="View ${escapeHtml(product.name)} details">
        <div class="product-image" aria-hidden="true">${escapeHtml(product.emoji)}</div>
      </a>
      <div class="product-info">
        <div class="product-category">${escapeHtml(product.category)}</div>
        <a class="product-name-link" href="product-detail.html?id=${product.id}">
          <div class="product-name">${escapeHtml(product.name)}</div>
        </a>
        <div class="product-rating">${renderStars(
          product.rating,
          product.reviews
        )}</div>
        <div style="margin-bottom:0.5rem;">${stockBadge}</div>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <button class="btn-secondary quick-view-button" type="button" aria-label="Quick view ${escapeHtml(product.name)}" onclick="openQuickView(${product.id})">Quick View</button>
        <button
          class="wishlist-toggle${saved ? " is-saved" : ""}"
          type="button"
          aria-label="${saved ? "Saved" : "Add to Wishlist"}: ${escapeHtml(product.name)}"
          aria-pressed="${saved}"
          onclick="toggleWishlistById(${product.id})"
        >${saved ? "♥ Saved" : "♡ Add to Wishlist"}</button>
        ${addButton}
      </div>
    </article>
  `;
}

function addProductToCart(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product || product.stock === 0) {
    showToast("Product is unavailable");
    return;
  }
  addToCart(product);
}

function openQuickView(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    showToast("Product is unavailable");
    return;
  }
  const dialog = document.getElementById("quick-view-dialog");
  document.getElementById("quick-view-name").textContent = product.name;
  document.getElementById("quick-view-description").textContent = product.description;
  document.getElementById("quick-view-price").textContent = formatCurrency(product.price);
  const button = document.getElementById("quick-view-add");
  button.disabled = product.stock === 0;
  button.textContent = button.disabled ? "Out of Stock" : "Add to Cart";
  quickViewProductId = product.id;
  dialog.showModal();
}

function addQuickViewToCart() {
  document.getElementById("quick-view-dialog").close();
  addProductToCart(quickViewProductId);
}

function filterProducts(products, { query = "", category = "" } = {}) {
  const normalizedQuery = query.toLowerCase();
  return products.filter((product) => {
    const matchesCategory = !category || product.category === category;
    return matchesCategory && product.name.toLowerCase().includes(normalizedQuery);
  });
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

  const filtered = filterProducts(PRODUCTS, { query: searchQuery, category });
  const status = document.getElementById("product-results-status");
  if (status) {
    status.textContent = `${filtered.length} ${filtered.length === 1 ? "product" : "products"} found.`;
  }

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

  const savedIds = new Set(getWishlist());
  grid.innerHTML = filtered.map((product) => createProductCard(product, savedIds.has(product.id))).join("");
}

/**
 * Toggle a product in the wishlist and update its visible cards.
 * @param {number} productId - Product ID
 */
function toggleWishlistById(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    showToast("Product not found");
    return;
  }

  const added = toggleWishlist(product);
  showToast(
    added
      ? `${product.name} added to wishlist`
      : `${product.name} removed from wishlist`
  );

  document
    .querySelectorAll(`.product-card[data-id="${product.id}"] .wishlist-toggle`)
    .forEach((button) => {
      button.classList.toggle("is-saved", added);
      button.setAttribute("aria-pressed", String(added));
      button.setAttribute("aria-label", `${added ? "Saved" : "Add to Wishlist"}: ${product.name}`);
      button.textContent = added ? "♥ Saved" : "♡ Add to Wishlist";
    });
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");
  const quickViewDialog = document.getElementById("quick-view-dialog");
  let searchTimer;
  appliedSearchQuery = searchInput?.value || "";

  quickViewDialog?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      quickViewDialog.close();
    }
  });

  function applyFilters() {
    if (!productsLoaded) return;
    renderProducts(
      appliedSearchQuery,
      categoryFilter?.value || "",
      sortFilter?.value || "default"
    );
  }

  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      appliedSearchQuery = searchInput.value;
      applyFilters();
    }, 300);
  });
  categoryFilter?.addEventListener("change", applyFilters);
  sortFilter?.addEventListener("change", applyFilters);

  try {
    await loadProducts();
  } catch (error) {
    showProductsLoadError(grid, error);
    return;
  }
  applyFilters();
});

window.addEventListener("storage", async (event) => {
  if (event.key !== PRODUCT_STORAGE_KEY) return;
  const dialog = document.getElementById("quick-view-dialog");
  if (dialog?.open) {
    dialog.close();
    showToast("Products changed. Please reopen Quick View.");
  }
  productsPromise = undefined;
  const grid = document.getElementById("product-grid");
  const detail = document.getElementById("product-detail");
  const wishlist = document.getElementById("wishlist-items");
  const container = grid || detail || wishlist;
  if (!container) return;
  container.innerHTML = `<div class="loading-state" role="status"><span class="spinner" aria-hidden="true"></span> Loading products...</div>`;
  if (detail) {
    document.getElementById("reviews-section").hidden = true;
    document.getElementById("related-section").hidden = true;
  }
  try {
    await loadProducts();
  } catch (error) {
    showProductsLoadError(container, error);
    return;
  }
  if (grid) {
    renderProducts(
      appliedSearchQuery,
      document.getElementById("category-filter")?.value || "",
      document.getElementById("sort-filter")?.value || "default"
    );
  } else if (detail) {
    renderProductDetail();
  } else if (wishlist) {
    renderWishlist();
  }
});
