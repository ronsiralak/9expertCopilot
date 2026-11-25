/**
 * wishlist-page.js - Wishlist page rendering
 * ShopEase E-Commerce Training Project
 */

function createWishlistItemHTML(product) {
  return `
    <article class="wishlist-item" aria-label="${escapeHtml(product.name)}">
      <div class="product-image" aria-hidden="true">${escapeHtml(product.emoji)}</div>
      <div class="wishlist-item-info">
        <div class="product-category">${escapeHtml(product.category)}</div>
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <button class="wishlist-remove" type="button" aria-label="Remove from Wishlist: ${escapeHtml(product.name)}" onclick="removeWishlistItem(${product.id})">
          Remove from Wishlist
        </button>
      </div>
    </article>
  `;
}

function renderWishlist() {
  const container = document.getElementById("wishlist-items");
  if (!container) return;

  const wishlist = getWishlist();
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p style="font-size:3rem;">♡</p>
        <p>Your wishlist is empty</p>
        <a href="products.html" class="btn-primary" style="display:inline-block; width:auto; padding:0.75rem 2rem;">
          Browse Products
        </a>
      </div>`;
    return;
  }

  container.innerHTML = wishlist.map((id) => {
    const product = PRODUCTS.find((item) => item.id === id);
    if (product) return createWishlistItemHTML(product);
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new Error("Invalid wishlist product ID");
    }
    return `<article class="wishlist-item" aria-label="Unavailable product ${id}"><div class="wishlist-item-info">
      <div class="product-name">Product no longer available</div>
      <button class="wishlist-remove" type="button" aria-label="Remove from Wishlist: unavailable product ${id}" onclick="removeWishlistItem(${id})">
        Remove from Wishlist
      </button>
    </div></article>`;
  }).join("");
}

function removeWishlistItem(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  removeFromWishlist(productId);
  renderWishlist();
  document.getElementById("wishlist-items").focus();
  showToast(product ? `${product.name} removed from wishlist` : "Item removed from wishlist");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadProducts();
  } catch (error) {
    showProductsLoadError(document.getElementById("wishlist-items"), error);
    return;
  }
  renderWishlist();
});
