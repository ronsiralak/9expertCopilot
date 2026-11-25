/**
 * Demo checkout validation. No form data is stored or sent.
 */
const CHECKOUT_FIELDS = [
  "customer-name", "customer-email", "customer-address", "customer-city",
  "customer-postal", "card-name", "card-number", "card-expiry", "card-cvv",
];
let checkoutSubmitting = false;

function formatCardNumber(input) {
  const caret = input.selectionStart === null ? input.value.length : input.selectionStart;
  const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, "").length;
  const digits = input.value.replace(/\D/g, "").slice(0, 16);
  input.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  const count = Math.min(digitsBeforeCaret, digits.length);
  const position = count === 0 ? 0 : count + Math.floor((count - 1) / 4);
  input.setSelectionRange(position, position);
}

function handleCardDelete(event) {
  const input = event.currentTarget;
  const start = input.selectionStart;
  if (start === null || start !== input.selectionEnd) return;
  if (event.key === "Backspace" && start > 1 && input.value[start - 1] === " ") {
    input.setSelectionRange(start - 2, start);
  } else if (event.key === "Delete" && input.value[start] === " ") {
    input.setSelectionRange(start, start + 2);
  }
}

function validateCheckoutField(id) {
  const input = document.getElementById(id);
  const value = input.value.trim();
  let error = "";
  if (!value) {
    error = "This field is required.";
  } else if (id === "customer-email" && !isValidEmail(value)) {
    error = "Enter a valid email address.";
  } else if (id === "card-number") {
    const digits = value.replace(/[ -]/g, "");
    if (!isValidCreditCard(digits)) {
      error = "Enter a valid test card number.";
    } else if (digits !== "4242424242424242") {
      error = "Use the test card number shown above.";
    }
  } else if (id === "card-expiry") {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value) || value < currentMonth) {
      error = "Choose the current month or a future month.";
    }
  } else if (id === "card-cvv" && value !== "123") {
    error = "Use test security code 123.";
  }
  document.getElementById(`${id}-error`).textContent = error;
  input.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}

async function submitCheckout(event) {
  event.preventDefault();
  if (checkoutSubmitting) return;
  const validity = CHECKOUT_FIELDS.map(validateCheckoutField);
  if (validity.includes(false)) {
    document.getElementById(CHECKOUT_FIELDS[validity.indexOf(false)]).focus();
    return;
  }

  const before = JSON.stringify({
    cart: getCart(),
    coupon: sessionStorage.getItem("shopease_coupon"),
  });
  checkoutSubmitting = true;
  const submitButton = document.querySelector("#checkout-form button[type=submit]");
  submitButton.disabled = true;
  try {
    if (!await refreshCartProducts()) {
      document.getElementById("checkout-message").textContent =
        "Current prices could not be verified. Checkout is unavailable.";
      return;
    }
    if (!getCart().length || unavailableCartItems(getCart()).length) {
      document.getElementById("checkout-message").textContent =
        "Update your cart before continuing.";
      return;
    }
    if (JSON.stringify({
      cart: getCart(),
      coupon: sessionStorage.getItem("shopease_coupon"),
    }) !== before) {
      document.getElementById("checkout-message").textContent =
        "Your cart or coupon changed. Review your cart and total before continuing.";
      return;
    }
    const currentValidity = CHECKOUT_FIELDS.map(validateCheckoutField);
    if (currentValidity.includes(false)) {
      document.getElementById(CHECKOUT_FIELDS[currentValidity.indexOf(false)]).focus();
      return;
    }
    document.getElementById("checkout-form").reset();
    sessionStorage.removeItem("shopease_coupon");
    clearCart();
    document.getElementById("checkout-content").hidden = true;
    document.getElementById("checkout-result").textContent =
      "Demo checkout complete. No payment was taken and no order was placed.";
    document.getElementById("checkout-result").focus();
  } finally {
    checkoutSubmitting = false;
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const cardNumber = document.getElementById("card-number");
  cardNumber.addEventListener("keydown", handleCardDelete);
  cardNumber.addEventListener("compositionend", () => {
    formatCardNumber(cardNumber);
    validateCheckoutField("card-number");
  });
  form.addEventListener("input", (event) => {
    if (event.target.id === "card-number") {
      if (event.isComposing) return;
      formatCardNumber(event.target);
    }
    if (CHECKOUT_FIELDS.includes(event.target.id)) validateCheckoutField(event.target.id);
  });
  form.addEventListener("submit", submitCheckout);
});
