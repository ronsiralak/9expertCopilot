/**
 * app.js - Core Application Utilities
 * ShopEase E-Commerce Training Project
 *
 * GitHub Copilot Training: This file contains shared utilities
 * used across the application.
 */

// ─── Cart Storage ────────────────────────────────────────────────────────────

/**
 * Get cart items from localStorage
 * @returns {Array} Array of cart item objects
 */
function getCart() {
  const data = localStorage.getItem("shopease_cart");
  return data ? JSON.parse(data) : [];
}

/**
 * Save cart items to localStorage
 * @param {Array} items - Cart items to persist
 */
function saveCart(items) {
  localStorage.setItem("shopease_cart", JSON.stringify(items));
  updateCartCount();
}

/**
 * Add a product to the cart
 * @param {Object} product - Product object { id, name, price, emoji, category }
 * @param {number} quantity - Quantity to add (default: 1)
 */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
  showToast(`✅ ${product.name} added to cart`);
}

/**
 * Remove an item from cart by product ID
 * @param {number} productId - ID of the product to remove
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

/**
 * Update the quantity of a cart item
 * @param {number} productId - ID of the product
 * @param {number} delta - Amount to change quantity by (+1 or -1)
 */
function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

/**
 * Clear all items from the cart
 */
function clearCart() {
  saveCart([]);
  if (typeof renderCart === "function") renderCart();
}

// ─── UI Utilities ─────────────────────────────────────────────────────────────

/**
 * Update the cart count badge in the navbar
 */
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default: 2500)
 */
function showToast(message, duration = 2500) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Format a number as USD currency string
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string (e.g. "$12.99")
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Calculate order totals
 * @param {Array} cartItems - Array of cart items
 * @returns {Object} { subtotal, shipping, tax, total }
 */
function calculateTotals(cartItems) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

/**
 * Simulate checkout process
 */
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("⚠️ Your cart is empty!");
    return;
  }
  showToast("🎉 Order placed successfully! Thank you for shopping with us.");
  clearCart();
}

// Init cart count on page load
updateCartCount();
