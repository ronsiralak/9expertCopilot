/**
 * utils.js - Utility Functions
 * ShopEase E-Commerce Training Project
 *
 * NOTE: Some functions below are intentionally incomplete or have bugs.
 * These are designed as GitHub Copilot training exercises.
 */

// ─── String Utilities ─────────────────────────────────────────────────────────

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a max length with ellipsis
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength) {
  // TODO: implement truncation with "..." suffix
}

/**
 * Convert a string to a URL-friendly slug
 * @param {string} str - e.g. "Hello World!" -> "hello-world"
 * @returns {string}
 */
function slugify(str) {
  // TODO: implement slugify
}

// ─── Array Utilities ──────────────────────────────────────────────────────────

/**
 * Group an array of objects by a key
 * @param {Array} arr
 * @param {string} key
 * @returns {Object} Grouped object
 * @example groupBy([{cat:'a'},{cat:'b'},{cat:'a'}], 'cat') -> { a: [...], b: [...] }
 */
function groupBy(arr, key) {
  // TODO: implement groupBy
}

/**
 * Remove duplicate values from an array
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Sort an array of objects by a numeric or string property
 * @param {Array} arr
 * @param {string} key - Property to sort by
 * @param {'asc'|'desc'} direction
 * @returns {Array} Sorted copy of the array (do NOT mutate original)
 */
function sortBy(arr, key, direction = "asc") {
  // BUG: this mutates the original array — fix it
  return arr.sort((a, b) => {
    if (direction === "asc") return a[key] > b[key] ? 1 : -1;
    return a[key] < b[key] ? 1 : -1;
  });
}

// ─── Validation Utilities ─────────────────────────────────────────────────────

/**
 * Validate an email address format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  // TODO: use regex to validate email
}

/**
 * Validate a credit card number using Luhn algorithm
 * @param {string} cardNumber - Card number string (digits only)
 * @returns {boolean}
 */
function isValidCreditCard(cardNumber) {
  // TODO: implement Luhn algorithm
}

/**
 * Validate a product object has all required fields
 * @param {Object} product
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateProduct(product) {
  const errors = [];

  if (!product.name || product.name.trim() === "") {
    errors.push("Name is required");
  }
  if (typeof product.price !== "number" || product.price < 0) {
    errors.push("Price must be a non-negative number");
  }
  // BUG: stock check is wrong — should check for >= 0, not > 0
  if (product.stock > 0) {
    errors.push("Stock must be non-negative");
  }

  return { valid: errors.length === 0, errors };
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Format a date as "Month Day, Year" (e.g. "January 1, 2024")
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate the number of days between two dates
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number}
 */
function daysBetween(startDate, endDate) {
  // TODO: implement days between calculation
}

/**
 * Check if a date is within the last N days
 * @param {Date|string} date
 * @param {number} days
 * @returns {boolean}
 */
function isRecent(date, days = 7) {
  // TODO: implement isRecent
}

// ─── Discount Utilities ───────────────────────────────────────────────────────

/**
 * Apply a percentage discount to a price
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discounted price, rounded to 2 decimals
 */
function applyDiscount(price, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  // BUG: calculation is wrong
  return price - discountPercent;
}

/**
 * Apply a coupon code to get a discount percentage
 * @param {string} code
 * @returns {number} Discount percentage (0 if invalid)
 */
function applyCouponCode(code) {
  const coupons = {
    SAVE10: 10,
    SAVE20: 20,
    WELCOME: 15,
    FLASH50: 50,
  };
  // TODO: return the discount for the code (case-insensitive), or 0 if not found
}

module.exports = {
  capitalize,
  truncate,
  slugify,
  groupBy,
  unique,
  sortBy,
  isValidEmail,
  isValidCreditCard,
  validateProduct,
  formatDate,
  daysBetween,
  isRecent,
  applyDiscount,
  applyCouponCode,
};
