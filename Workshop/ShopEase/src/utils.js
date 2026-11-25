/**
 * utils.js - Utility Functions
 * ShopEase E-Commerce Training Project
 *
 * NOTE: Some functions below are intentionally incomplete or have bugs.
 * These are designed as GitHub Copilot training exercises.
 */

// ─── String Utilities ─────────────────────────────────────────────────────────

/**
 * แปลงอักขระแรกเป็นตัวพิมพ์ใหญ่โดยไม่เปลี่ยนส่วนที่เหลือ
 * @param {string|null|undefined} str - ข้อความที่ต้องการแปลง
 * @returns {string} ข้อความที่แปลงแล้ว หรือสตริงว่างเมื่อค่าเป็น falsy
 * @throws {TypeError} เมื่อค่าเป็น truthy และไม่ใช่สตริง
 * @example
 * capitalize("hello"); // "Hello"
 */
function capitalize(str) {
  if (!str) return "";
  if (typeof str !== "string") {
    throw new TypeError("String is required");
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * ตัดข้อความให้มีความยาวไม่เกินกำหนด โดยนับจุดท้ายข้อความรวมด้วย
 * @param {string} str - ข้อความที่ต้องการตัด
 * @param {number} maxLength - ความยาวสูงสุด ต้องเป็นจำนวนเต็มที่ไม่ติดลบ
 * @returns {string} ข้อความเดิมหากไม่เกินกำหนด มิฉะนั้นลงท้ายด้วยจุดไม่เกินสามจุด
 * @throws {TypeError} เมื่อข้อความหรือความยาวมีชนิดไม่ถูกต้อง หรือความยาวไม่ใช่จำนวนจำกัด
 * @throws {RangeError} เมื่อความยาวติดลบหรือไม่เป็นจำนวนเต็ม
 * @example
 * truncate("Hello, world!", 8); // "Hello..."
 */
function truncate(str, maxLength) {
  if (typeof str !== "string") {
    throw new TypeError("String is required");
  }
  if (typeof maxLength !== "number" || !Number.isFinite(maxLength)) {
    throw new TypeError("Maximum length must be a number");
  }
  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new RangeError("Maximum length must be a non-negative integer");
  }
  if (str.length <= maxLength) return str;
  if (maxLength === 0) return "";
  if (maxLength < 3) return ".".repeat(maxLength);
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * แปลงข้อความเป็น slug ตัวพิมพ์เล็กสำหรับ URL
 * @param {string} str - ข้อความที่ต้องการแปลง
 * @returns {string} สตริงที่ประกอบด้วยตัวอักษร ASCII ตัวเลข และขีดคั่นระหว่างกลุ่ม
 * @throws {TypeError} เมื่อค่าไม่ใช่สตริง
 * @example
 * slugify("Hello World!"); // "hello-world"
 */
function slugify(str) {
  if (typeof str !== "string") {
    throw new TypeError("String is required");
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Array Utilities ──────────────────────────────────────────────────────────

/**
 * จัดกลุ่มออบเจ็กต์ตามค่าของพร็อพเพอร์ตีที่ระบุ
 * @param {Array<Object>} arr - อาร์เรย์ของออบเจ็กต์ที่ต้องการจัดกลุ่ม
 * @param {string} key - ชื่อพร็อพเพอร์ตีที่ใช้จัดกลุ่ม
 * @returns {Object<string, Array<Object>>} ออบเจ็กต์ที่ไม่มี prototype ซึ่งจับคู่ค่าพร็อพเพอร์ตีกับอาร์เรย์ของสมาชิก
 * @throws {TypeError} เมื่อ arr ไม่ใช่อาร์เรย์ หรือสมาชิกเป็น null หรือ undefined
 * @example
 * groupBy([{ cat: "a" }, { cat: "b" }, { cat: "a" }], "cat");
 * // { a: [{ cat: "a" }, { cat: "a" }], b: [{ cat: "b" }] }
 */
function groupBy(arr, key) {
  if (!Array.isArray(arr)) {
    throw new TypeError("Array is required");
  }
  return arr.reduce((acc, item) => {
    const keyValue = item[key];
    if (!Object.prototype.hasOwnProperty.call(acc, keyValue)) acc[keyValue] = [];
    acc[keyValue].push(item);
    return acc;
  }, Object.create(null));
}

/**
 * ลบค่าซ้ำโดยคงลำดับของค่าที่พบครั้งแรก
 * @param {Array<*>|null} arr - อาร์เรย์ที่ต้องการลบค่าซ้ำ หรือ null
 * @returns {Array<*>} อาร์เรย์ใหม่ที่ไม่มีค่าซ้ำ หรืออาร์เรย์ว่างเมื่อรับ null
 * @throws {TypeError} เมื่อค่าไม่ใช่อาร์เรย์หรือ null
 * @example
 * unique([1, 2, 2, 3]); // [1, 2, 3]
 */
function unique(arr) {
  if (arr === null) return [];
  if (!Array.isArray(arr)) {
    throw new TypeError("Array is required");
  }
  return [...new Set(arr)];
}

/**
 * เรียงสำเนาของอาร์เรย์ออบเจ็กต์ตามพร็อพเพอร์ตีชนิดตัวเลขหรือสตริง
 * @template T
 * @param {Array<T>} arr - อาร์เรย์ของออบเจ็กต์ที่ต้องการเรียง
 * @param {string} key - ชื่อพร็อพเพอร์ตีที่ใช้เปรียบเทียบ
 * @param {"asc"|"desc"} [direction="asc"] - ทิศทางการเรียง
 * @returns {Array<T>} อาร์เรย์ใหม่ที่เรียงแล้ว โดยไม่แก้ไขอาร์เรย์เดิม
 * @throws {TypeError} เมื่อ arr ไม่ใช่อาร์เรย์
 * @throws {RangeError} เมื่อ direction ไม่ใช่ "asc" หรือ "desc"
 * @example
 * sortBy([{ price: 20 }, { price: 5 }], "price"); // [{ price: 5 }, { price: 20 }]
 */
function sortBy(arr, key, direction = "asc") {
  if (!Array.isArray(arr)) {
    throw new TypeError("Array is required");
  }
  if (direction !== "asc" && direction !== "desc") {
    throw new RangeError('Direction must be "asc" or "desc"');
  }
  return [...arr].sort((a, b) => {
    if (a[key] === b[key]) return 0;
    if (direction === "asc") return a[key] > b[key] ? 1 : -1;
    return a[key] < b[key] ? 1 : -1;
  });
}

// ─── Validation Utilities ─────────────────────────────────────────────────────

/**
 * ตรวจสอบรูปแบบอีเมลพื้นฐานของแอปพลิเคชัน
 * @param {string} email - อีเมลที่ต้องการตรวจสอบ
 * @returns {boolean} true เมื่อส่วนหน้าไม่มีช่องว่างหรือ @ และโดเมนมีอย่างน้อยสองส่วนที่ถูกต้อง
 * @example
 * isValidEmail("user@example.com"); // true
 */
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email);
}

/**
 * ตรวจสอบความยาวและผลรวม Luhn ของหมายเลขบัตร
 * @param {string} cardNumber - หมายเลขบัตรที่มีตัวเลข 12–19 หลักโดยไม่มีตัวคั่น
 * @returns {boolean} true เมื่อความยาวและผลรวม Luhn ถูกต้อง
 * @example
 * isValidCreditCard("4242424242424242"); // true
 */
function isValidCreditCard(cardNumber) {
  if (typeof cardNumber !== "string" || !/^\d{12,19}$/.test(cardNumber)) {
    return false;
  }
  const digits = cardNumber.split("").reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * ตรวจสอบชื่อ ราคา และจำนวนสินค้าในสต็อก
 * @param {{name: string, price: number, stock: number}} product - ข้อมูลสินค้าที่ต้องการตรวจสอบ
 * @returns {{valid: boolean, errors: string[]}} สถานะความถูกต้องและข้อความข้อผิดพลาดของแต่ละช่อง
 * @throws {TypeError} เมื่อ product เป็น null หรือไม่ใช่ออบเจ็กต์
 * @example
 * validateProduct({ name: "Phone", price: 99, stock: 0 });
 * // { valid: true, errors: [] }
 */
function validateProduct(product) {
  if (product === null || typeof product !== "object") {
    throw new TypeError("Product is required");
  }
  const errors = [];

  if (typeof product.name !== "string" || product.name.trim() === "") {
    errors.push("Name is required");
  }
  if (!Number.isFinite(product.price) || product.price < 0) {
    errors.push("Price must be a non-negative number");
  }
  if (!Number.isFinite(product.stock) || product.stock < 0) {
    errors.push("Stock must be non-negative");
  }

  return { valid: errors.length === 0, errors };
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * จัดรูปแบบวันที่ตามภาษา en-US โดยใช้เขตเวลาท้องถิ่น
 * @param {Date|string} date - ออบเจ็กต์ Date หรือสตริงวันที่ที่ JavaScript แปลงได้
 * @returns {string} วันที่ในรูปแบบ Month Day, Year หรือ "Invalid Date" หากวันที่ไม่ถูกต้อง
 * @throws {TypeError} เมื่อค่าไม่ใช่ Date หรือสตริง
 * @example
 * formatDate(new Date(2024, 0, 1)); // "January 1, 2024"
 */
function formatDate(date) {
  if (!(date instanceof Date) && typeof date !== "string") {
    throw new TypeError("Date must be a Date or date string");
  }
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * คำนวณผลต่างจำนวนวันตามปฏิทิน UTC จากวันเริ่มต้นถึงวันสิ้นสุด
 * @param {Date|string} startDate - วันเริ่มต้น
 * @param {Date|string} endDate - วันสิ้นสุด
 * @returns {number} จำนวนวันแบบมีเครื่องหมาย โดยเป็นลบเมื่อวันสิ้นสุดอยู่ก่อนวันเริ่มต้น
 * @throws {TypeError|RangeError} เมื่อชนิดหรือค่าของวันที่ไม่ถูกต้อง
 * @example
 * daysBetween("2024-02-28", "2024-03-01"); // 2
 */
function daysBetween(startDate, endDate) {
  /**
   * แปลงวันที่เป็น timestamp ของเวลาเที่ยงคืน UTC ในวันนั้น
   * @private
   * @param {Date|string} value - ออบเจ็กต์ Date หรือสตริงวันที่
   * @returns {number} timestamp ของเวลาเที่ยงคืน UTC
   * @throws {TypeError|RangeError} เมื่อชนิดหรือค่าของวันที่ไม่ถูกต้อง
   * @example
   * utcMidnight("2024-01-01T12:00:00Z"); // 1704067200000
   */
  function utcMidnight(value) {
    if (!(value instanceof Date) && typeof value !== "string") {
      throw new TypeError("Date must be a Date or date string");
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new RangeError("Invalid date");
    }
    return date.setUTCHours(0, 0, 0, 0);
  }

  return (utcMidnight(endDate) - utcMidnight(startDate)) / 86400000;
}

/**
 * ตรวจสอบว่าวันที่ไม่อยู่ในอนาคตและอยู่ภายในจำนวนวันตามปฏิทิน UTC ที่กำหนด
 * @param {Date|string} date - วันที่ที่ต้องการตรวจสอบ
 * @param {number} [days=7] - จำนวนวันย้อนหลังสูงสุด รวมวันขอบเขต ต้องเป็นจำนวนเต็มที่ไม่ติดลบ
 * @returns {boolean} true เมื่อวันที่อยู่ภายในช่วงที่กำหนดและไม่อยู่ในอนาคต
 * @throws {TypeError|RangeError} เมื่อวันที่หรือจำนวนวันไม่ถูกต้อง
 * @example
 * isRecent(new Date()); // true
 */
function isRecent(date, days = 7) {
  if (!Number.isInteger(days) || days < 0) {
    throw new RangeError("Days must be a non-negative integer");
  }
  if (!(date instanceof Date) && typeof date !== "string") {
    throw new TypeError("Date must be a Date or date string");
  }
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) {
    throw new RangeError("Invalid date");
  }
  const now = Date.now();
  return timestamp <= now && daysBetween(new Date(timestamp), new Date(now)) <= days;
}

// ─── Discount Utilities ───────────────────────────────────────────────────────

/**
 * คำนวณราคาหลังหักส่วนลดเป็นเปอร์เซ็นต์
 * @param {number} price - ราคาเดิมซึ่งเป็นจำนวนจำกัดและไม่ติดลบ
 * @param {number} discountPercent - เปอร์เซ็นต์ส่วนลดตั้งแต่ 0 ถึง 100 รวมขอบเขต
 * @returns {number} ราคาหลังหักส่วนลด
 * @throws {Error} เมื่อราคาหรือเปอร์เซ็นต์ส่วนลดไม่อยู่ในช่วงที่กำหนด
 * @example
 * applyDiscount(100, 10); // 90
 */
function applyDiscount(price, discountPercent) {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a non-negative number");
  }
  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return price * (1 - discountPercent / 100);
}

/**
 * ตรวจสอบรหัสคูปองเพื่อรับเปอร์เซ็นต์ส่วนลด
 * @param {string} code - รหัสคูปอง โดยไม่คำนึงถึงช่องว่างรอบนอกหรือตัวพิมพ์เล็กและใหญ่
 * @returns {number} เปอร์เซ็นต์ส่วนลด หรือ 0 เมื่อรหัสไม่ถูกต้อง
 * @example
 * applyCouponCode(" save10 "); // 10
 * applyCouponCode("UNKNOWN"); // 0
 */
function applyCouponCode(code) {
  const coupons = {
    SAVE10: 10,
    SAVE20: 20,
    WELCOME: 15,
    FLASH50: 50,
  };
  if (typeof code !== "string") return 0;
  const normalized = code.trim().toUpperCase();
  return Object.prototype.hasOwnProperty.call(coupons, normalized)
    ? coupons[normalized]
    : 0;
}

if (typeof module !== "undefined" && module.exports) module.exports = {
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
