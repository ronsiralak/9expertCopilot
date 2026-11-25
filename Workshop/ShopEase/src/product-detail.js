/**
 * product-detail.js - Product detail page rendering
 * ShopEase E-Commerce Training Project
 */

let currentDetailProduct = null;

function findProductById(products, productId) {
  return products.find((product) => product.id === productId);
}

function getRelatedProducts(products, productId, limit = 3) {
  const product = findProductById(products, productId);
  if (!product) return [];

  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id && candidate.category === product.category
    )
    .slice(0, limit);
}

function renderProductDetail() {
  const detailContainer = document.getElementById("product-detail");
  if (!detailContainer) return;

  const rawId = new URLSearchParams(window.location.search).get("id");
  const productId = rawId === null ? NaN : Number(rawId);
  const product = Number.isInteger(productId)
    ? findProductById(PRODUCTS, productId)
    : undefined;

  const reviewsSection = document.getElementById("reviews-section");
  const relatedSection = document.getElementById("related-section");

  if (!product) {
    currentDetailProduct = null;
    detailContainer.innerHTML = `
      <div class="empty-state">
        <p>Product not found</p>
        <a href="products.html" class="btn-primary" style="display:inline-block; width:auto; padding:0.75rem 2rem;">
          Browse Products
        </a>
      </div>`;
    reviewsSection.hidden = true;
    relatedSection.hidden = true;
    return;
  }

  detailContainer.innerHTML = `
    <article class="product-detail-layout">
      <div class="product-detail-image" role="img" aria-label="${escapeHtml(product.name)} image placeholder">
        ${escapeHtml(product.emoji)}
      </div>
      <div class="product-detail-info">
        <div class="product-category">${escapeHtml(product.category)}</div>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="product-rating">${renderStars(product.rating, product.reviews)}</div>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <p class="product-detail-stock">
          ${product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
        </p>
        <p class="product-detail-description">${escapeHtml(product.description)}</p>
        <div class="product-detail-actions">
          ${
            product.stock === 0
              ? `<button class="btn-primary" type="button" disabled>Out of Stock</button>`
              : `<button class="btn-primary" type="button" onclick="addDetailProductToCart()">Add to Cart</button>`
          }
          <button
            class="wishlist-toggle${isInWishlist(product.id) ? " is-saved" : ""}"
            id="detail-wishlist-btn"
            type="button"
            aria-pressed="${isInWishlist(product.id)}"
            onclick="toggleDetailWishlist()"
          >${isInWishlist(product.id) ? "♥ Saved" : "♡ Add to Wishlist"}</button>
        </div>
      </div>
    </article>
  `;

  document.getElementById("product-review-summary").innerHTML = `
    <div class="product-rating">${renderStars(product.rating, product.reviews)}</div>
    <strong>${product.rating.toFixed(1)} out of 5</strong>
    <span> · Based on ${product.reviews} reviews</span>
  `;
  document.getElementById("product-review-note").textContent =
    "Individual review details are not available yet.";
  reviewsSection.hidden = false;

  const relatedProducts = getRelatedProducts(PRODUCTS, product.id);
  const relatedContainer = document.getElementById("related-products");
  relatedContainer.innerHTML = relatedProducts
    .map((product) => createProductCard(product))
    .join("");
  relatedSection.hidden = relatedProducts.length === 0;

  currentDetailProduct = product;
}

function addDetailProductToCart() {
  if (!currentDetailProduct) {
    showToast("Product details are unavailable");
    return;
  }
  addToCart(currentDetailProduct);
}

function toggleDetailWishlist() {
  if (!currentDetailProduct) {
    showToast("Product details are unavailable");
    return;
  }

  const product = currentDetailProduct;
  const added = toggleWishlist(product);
  const button = document.getElementById("detail-wishlist-btn");
  button.classList.toggle("is-saved", added);
  button.setAttribute("aria-pressed", String(added));
  button.textContent = added ? "♥ Saved" : "♡ Add to Wishlist";
  showToast(
    added
      ? `${product.name} added to wishlist`
      : `${product.name} removed from wishlist`
  );
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadProducts();
    } catch (error) {
      showProductsLoadError(document.getElementById("product-detail"), error);
      return;
    }
    renderProductDetail();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { findProductById, getRelatedProducts };
}
