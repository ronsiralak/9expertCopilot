/**
 * cart.js - Shopping Cart Rendering
 * ShopEase E-Commerce Training Project
 */

/**
 * Render the full cart page, including items list and summary
 */
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p style="font-size:3rem;">🛒</p>
        <p>Your cart is empty</p>
        <a href="products.html" class="btn-primary" style="display:inline-block; width:auto; padding:0.75rem 2rem;">
          Continue Shopping
        </a>
      </div>`;
    updateSummary([]);
    return;
  }

  container.innerHTML = cart.map(createCartItemHTML).join("");
  updateSummary(cart);
}

/**
 * Create HTML for a single cart item row
 * @param {Object} item - Cart item { id, name, price, emoji, quantity }
 * @returns {string} HTML string
 */
function createCartItemHTML(item) {
  return `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)} each</div>
        <div class="quantity-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:700; margin-bottom:0.5rem;">
          ${formatCurrency(item.price * item.quantity)}
        </div>
        <button class="remove-btn" onclick="deleteItem(${item.id})">Remove</button>
      </div>
    </div>
  `;
}

/**
 * Update the order summary section with calculated totals
 * @param {Array} cartItems - Current cart items
 */
function updateSummary(cartItems) {
  const { subtotal, shipping, tax, total } = calculateTotals(cartItems);

  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : formatCurrency(shipping);
  document.getElementById("tax").textContent = formatCurrency(tax);
  document.getElementById("total").textContent = formatCurrency(total);

  // Show free shipping hint
  if (subtotal > 0 && subtotal < 50) {
    const hint = `🚚 Add ${formatCurrency(50 - subtotal)} more for free shipping!`;
    showToast(hint, 3000);
  }
}

/**
 * Change the quantity of a cart item and re-render
 * @param {number} productId - Product ID
 * @param {number} delta - +1 or -1
 */
function changeQty(productId, delta) {
  updateQuantity(productId, delta);
  renderCart();
}

/**
 * Delete an item from the cart and re-render
 * @param {number} productId - Product ID to remove
 */
function deleteItem(productId) {
  removeFromCart(productId);
  renderCart();
  showToast("Item removed from cart");
}

// Render cart on page load
document.addEventListener("DOMContentLoaded", renderCart);
