/**
 * wishlist.js - Wishlist storage and operations
 * ShopEase E-Commerce Training Project
 */

const WISHLIST_STORAGE_KEY = "shopease_wishlist";

function getWishlist() {
  const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  updateWishlistCount();
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

function toggleWishlist(product) {
  const wishlist = getWishlist();
  const existingIndex = wishlist.indexOf(product.id);

  if (existingIndex !== -1) {
    wishlist.splice(existingIndex, 1);
    saveWishlist(wishlist);
    return false;
  }

  wishlist.push(product.id);
  saveWishlist(wishlist);
  return true;
}

function removeFromWishlist(productId) {
  saveWishlist(getWishlist().filter((id) => id !== productId));
}

function updateWishlistCount() {
  if (typeof document === "undefined") return;

  const element = document.getElementById("wishlist-count");
  if (element) element.textContent = getWishlist().length;
}

updateWishlistCount();

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getWishlist,
    isInWishlist,
    removeFromWishlist,
    saveWishlist,
    toggleWishlist,
    updateWishlistCount,
  };
}
