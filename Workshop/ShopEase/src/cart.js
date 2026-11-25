/**
 * cart.js - Shopping Cart Rendering
 * ShopEase E-Commerce Training Project
 */

let appliedCoupon = null;
let cartProducts = null;

function syncCartPrices(products) {
  const cart = getCart();
  const updated = cart.map((item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return product ? { ...item, ...product, quantity: item.quantity } : item;
  });
  const changed = JSON.stringify(cart) !== JSON.stringify(updated);
  if (changed) saveCart(updated);
  return changed;
}

function unavailableCartItems(cart) {
  if (!cartProducts) return cart;
  return cart.filter((item) => {
    const product = cartProducts.find((candidate) => candidate.id === item.id);
    return !product || product.stock < item.quantity;
  });
}

async function refreshCartProducts() {
  try {
    cartProducts = await fetchProducts();
    const changed = syncCartPrices(cartProducts);
    document.getElementById("cart-status").textContent = "";
    renderCart();
    if (changed && !unavailableCartItems(getCart()).length) {
      document.getElementById("cart-status").textContent =
        "Product details were updated. Please review your cart and total.";
    }
    return true;
  } catch (error) {
    cartProducts = null;
    console.error("Could not load products for cart:", error);
    document.getElementById("cart-status").textContent =
      "Unable to load current product prices. Please reload the page.";
    document.getElementById("checkout-btn").disabled = true;
    return false;
  }
}

/**
 * Render the full cart page, including items list and summary
 */
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  if (!container) return;
  const unavailable = unavailableCartItems(cart);
  const button = document.getElementById("checkout-btn");
  button.disabled = !cartProducts || cart.length === 0 || unavailable.length > 0;
  if (cartProducts) {
    document.getElementById("cart-status").textContent = unavailable.length
      ? "Some items are unavailable or exceed current stock. Update or remove them before checkout."
      : "";
  }

  if (cart.length === 0) {
    document.getElementById("checkout-content").hidden = true;
    if (appliedCoupon) {
      appliedCoupon = null;
      sessionStorage.removeItem("shopease_coupon");
      document.getElementById("coupon-code").value = "";
      document.getElementById("coupon-message").textContent = "";
      document.getElementById("coupon-remove").hidden = true;
    }
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
    <article class="cart-item" id="cart-item-${item.id}" aria-label="${escapeHtml(item.name)}">
      <div class="cart-item-emoji" aria-hidden="true">${escapeHtml(item.emoji)}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-price">${formatCurrency(item.price)} each</div>
        ${unavailableCartItems([item]).length ? '<div class="field-error">Unavailable or insufficient stock</div>' : ""}
        <div class="quantity-control">
          <button class="qty-btn" type="button" id="cart-decrease-${item.id}" aria-label="Decrease quantity of ${escapeHtml(item.name)}, current quantity ${item.quantity}" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" type="button" id="cart-increase-${item.id}" aria-label="Increase quantity of ${escapeHtml(item.name)}, current quantity ${item.quantity}" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:700; margin-bottom:0.5rem;">
          ${formatCurrency(item.price * item.quantity)}
        </div>
        <button class="remove-btn" type="button" aria-label="Remove ${escapeHtml(item.name)} from cart" onclick="deleteItem(${item.id})">Remove</button>
      </div>
    </article>
  `;
}

/**
 * Update the order summary section with calculated totals
 * @param {Array} cartItems - Current cart items
 */
function updateSummary(cartItems) {
  const { subtotal, discount, shipping, tax, total } = calculateTotals(
    cartItems,
    appliedCoupon ? appliedCoupon.percent : 0
  );

  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("discount").textContent =
    discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0);
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : formatCurrency(shipping);
  document.getElementById("tax").textContent = formatCurrency(tax);
  document.getElementById("total").textContent = formatCurrency(total);

  // Show free shipping hint
  if (appliedCoupon && subtotal - discount > 0 && subtotal - discount <= 50) {
    showToast("🚚 Free shipping on orders over $50 after discounts!", 3000);
  } else if (!appliedCoupon && subtotal > 0 && subtotal < 50) {
    const hint = `🚚 Add ${formatCurrency(50 - subtotal)} more for free shipping!`;
    showToast(hint, 3000);
  }
}

function applyCartCoupon(event) {
  event.preventDefault();
  const input = document.getElementById("coupon-code");
  const message = document.getElementById("coupon-message");
  const code = input.value.trim().toUpperCase();

  if (getCart().length === 0) {
    message.textContent = "Add an item to your cart before applying a coupon.";
    return;
  }
  if (!code) {
    message.textContent = appliedCoupon
      ? `Enter a coupon code. ${appliedCoupon.code} remains applied.`
      : "Enter a coupon code.";
    return;
  }

  const percent = applyCouponCode(code);
  if (percent === 0) {
    message.textContent = appliedCoupon
      ? `Invalid coupon code. ${appliedCoupon.code} remains applied.`
      : "Invalid coupon code.";
    return;
  }

  appliedCoupon = { code, percent };
  sessionStorage.setItem("shopease_coupon", code);
  input.value = code;
  message.textContent = `${code} applied: ${percent}% off.`;
  document.getElementById("coupon-remove").hidden = false;
  updateSummary(getCart());
}

function removeCartCoupon() {
  appliedCoupon = null;
  sessionStorage.removeItem("shopease_coupon");
  document.getElementById("coupon-code").value = "";
  document.getElementById("coupon-message").textContent = "Coupon removed.";
  document.getElementById("coupon-remove").hidden = true;
  updateSummary(getCart());
}

function checkout() {
  if (getCart().length === 0 || !cartProducts || unavailableCartItems(getCart()).length) {
    showToast("⚠️ Check your cart and product availability before checkout.");
    return;
  }
  document.getElementById("checkout-content").hidden = false;
  document.getElementById("checkout-content").scrollIntoView({ behavior: "smooth" });
  document.getElementById("customer-name").focus({ preventScroll: true });
}

/**
 * Change the quantity of a cart item and re-render
 * @param {number} productId - Product ID
 * @param {number} delta - +1 or -1
 */
function changeQty(productId, delta) {
  const item = getCart().find((candidate) => candidate.id === productId);
  updateQuantity(productId, delta);
  renderCart();
  const updated = getCart().find((candidate) => candidate.id === productId);
  const focusTarget = updated
    ? document.getElementById(`cart-${delta < 0 ? "decrease" : "increase"}-${productId}`)
    : document.getElementById("cart-items");
  focusTarget.focus();
  if (item) {
    document.getElementById("cart-feedback").textContent = updated
      ? `${item.name} quantity is ${updated.quantity}.`
      : `${item.name} removed from cart.`;
  }
}

/**
 * Delete an item from the cart and re-render
 * @param {number} productId - Product ID to remove
 */
function deleteItem(productId) {
  removeFromCart(productId);
  renderCart();
  document.getElementById("cart-items").focus();
  showToast("Item removed from cart");
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("coupon-form").addEventListener("submit", applyCartCoupon);
  document.getElementById("coupon-remove").addEventListener("click", removeCartCoupon);
  const savedCode = sessionStorage.getItem("shopease_coupon");
  if (savedCode && getCart().length > 0) {
    const percent = applyCouponCode(savedCode);
    if (percent > 0) {
      appliedCoupon = { code: savedCode, percent };
      document.getElementById("coupon-code").value = savedCode;
      document.getElementById("coupon-message").textContent = `${savedCode} applied: ${percent}% off.`;
      document.getElementById("coupon-remove").hidden = false;
    } else {
      sessionStorage.removeItem("shopease_coupon");
      document.getElementById("coupon-message").textContent = "Saved coupon is invalid. Please apply a new code.";
    }
  } else if (savedCode) {
    sessionStorage.removeItem("shopease_coupon");
  }
  await refreshCartProducts();
});

window.addEventListener("storage", (event) => {
  if (event.key === PRODUCT_STORAGE_KEY || event.key === "shopease_cart") {
    refreshCartProducts();
  }
});
