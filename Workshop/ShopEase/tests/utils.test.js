/**
 * utils.test.js - Unit Tests for Utility Functions
 * ShopEase E-Commerce Training Project
 *
 * Run with: node --test tests/utils.test.js  (Node 18+)
 * Or install Jest: npm test
 *
 * ─── GitHub Copilot Training: Unit Test Exercise ─────────────────────────────
 * These tests are written to demonstrate Copilot's test generation.
 * Known bugs are reported as expected failures until fixed.
 */

const assert = require("node:assert/strict");
const {
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
} = require("../src/utils");

// ─── Simple test runner (no deps needed) ─────────────────────────────────────

let passed = 0;
let failed = 0;
let knownBugs = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${err.message}`);
    failed++;
  }
}

function knownBug(name, fn) {
  try {
    fn();
  } catch (err) {
    if (!(err instanceof assert.AssertionError)) {
      console.log(`  ❌ ${name}: ${err.message}`);
      failed++;
      return;
    }
    console.log(`  ⚠️  Known bug: ${name}`);
    knownBugs++;
    return;
  }
  console.log(`  ❌ ${name}: unexpectedly passed; convert this to a regular test`);
  failed++;
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected)
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual: (expected) => {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) throw new Error(`Expected ${b}, got ${a}`);
    },
    toBeTruthy: () => {
      if (!actual) throw new Error(`Expected truthy, got ${actual}`);
    },
    toBeFalsy: () => {
      if (actual) throw new Error(`Expected falsy, got ${actual}`);
    },
    toThrow: () => {
      // for functions
      if (typeof actual !== "function") throw new Error("Expected a function");
      let threw = false;
      try { actual(); } catch { threw = true; }
      if (!threw) throw new Error("Expected function to throw");
    },
    toBeCloseTo: (expected, decimals = 2) => {
      const diff = Math.abs(actual - expected);
      if (!Number.isFinite(actual) || diff >= Math.pow(10, -decimals))
        throw new Error(`Expected ~${expected}, got ${actual}`);
    },
  };
}

function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  fn();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("capitalize", () => {
  test("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
  test("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });
  test("handles already capitalized", () => {
    expect(capitalize("World")).toBe("World");
  });
  test("does not change rest of string", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });
  test("handles null and rejects a truthy non-string", () => {
    expect(capitalize(null)).toBe("");
    expect(() => capitalize(1)).toThrow();
  });
  test("capitalizes accented characters and preserves leading whitespace", () => {
    assert.equal(capitalize("éclair"), "Éclair");
    assert.equal(capitalize(" hello"), " hello");
    assert.equal(capitalize(undefined), "");
    assert.throws(() => capitalize({}), TypeError);
  });
});

describe("truncate", () => {
  test("truncates within the maximum length including the ellipsis", () => {
    expect(truncate("Hello World", 5)).toBe("He...");
  });
  test("preserves strings that fit, including at the boundary", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
    expect(truncate("Hello", 5)).toBe("Hello");
  });
  test("handles empty input and a three-character limit", () => {
    expect(truncate("", 5)).toBe("");
    expect(truncate("Hello", 3)).toBe("...");
  });
  test("throws for null input", () => {
    expect(() => truncate(null, 5)).toThrow();
  });
  test("truncate respects limits shorter than the ellipsis", () => {
    assert.ok(truncate("Hello", 2).length <= 2);
  });
  test("handles every limit below the ellipsis length", () => {
    assert.equal(truncate("Hello", 0), "");
    assert.equal(truncate("Hello", 1), ".");
    assert.equal(truncate("Hello", 2), "..");
    assert.equal(truncate("Hi", 2), "Hi");
  });
  test("rejects invalid string and length types or ranges", () => {
    for (const length of ["5", NaN, Infinity, undefined]) {
      assert.throws(() => truncate("Hello", length), TypeError);
    }
    for (const length of [-1, 1.5]) {
      assert.throws(() => truncate("Hello", length), RangeError);
    }
    assert.throws(() => truncate(123, 5), TypeError);
  });
});

describe("slugify", () => {
  test("lowercases words and replaces whitespace", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("  Many \t spaces  ")).toBe("many-spaces");
  });
  test("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
  test("handles empty input", () => {
    expect(slugify("")).toBe("");
  });
  test("throws for null input", () => {
    expect(() => slugify(null)).toThrow();
  });
  test("slugify avoids duplicate separators around special characters", () => {
    assert.equal(slugify("React & Redux"), "react-redux");
  });
  test("removes edge separators and collapses mixed separators", () => {
    assert.equal(slugify(" --A__B !!! "), "a-b");
    assert.equal(slugify(" ! & -- "), "");
    assert.throws(() => slugify(123), TypeError);
  });
});

describe("groupBy", () => {
  const items = [
    { category: "electronics", name: "Phone" },
    { category: "clothing", name: "Shirt" },
    { category: "electronics", name: "Laptop" },
  ];

  test("groups items by category key", () => {
    const result = groupBy(items, "category");
    expect(result["electronics"].length).toBe(2);
    expect(result["clothing"].length).toBe(1);
  });

  test("returns empty object for empty array", () => {
    expect(groupBy([], "category")).toEqual({});
  });
  test("groups missing properties and rejects null input", () => {
    expect(groupBy([{}], "category")).toEqual({ undefined: [{}] });
    expect(() => groupBy(null, "category")).toThrow();
  });
  test("groupBy accepts constructor as a group value", () => {
    assert.doesNotThrow(() => groupBy([{ category: "constructor" }], "category"));
  });
  test("groups inherited-property names without losing members or their order", () => {
    const values = [
      { category: "__proto__", id: 1 },
      { category: "constructor", id: 2 },
      { category: "toString", id: 3 },
      { category: "__proto__", id: 4 },
    ];
    const groups = groupBy(values, "category");
    assert.deepEqual(groups["__proto__"], [values[0], values[3]]);
    assert.deepEqual(groups.constructor, [values[1]]);
    assert.deepEqual(groups.toString, [values[2]]);
    assert.throws(() => groupBy([null], "category"), TypeError);
  });
});

describe("unique", () => {
  test("removes duplicate numbers", () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });
  test("removes duplicate strings", () => {
    expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
  });
  test("returns original if no duplicates", () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });
  test("handles empty and null input", () => {
    expect(unique([])).toEqual([]);
    expect(unique(null)).toEqual([]);
  });
  test("deduplicates NaN and object references without merging distinct objects", () => {
    const first = { id: 1 };
    const second = { id: 1 };
    const values = [first, NaN, first, second, NaN];
    assert.deepEqual(unique(values), [first, NaN, second]);
    assert.equal(values.length, 5);
  });
  test("rejects non-array input other than null", () => {
    assert.throws(() => unique("abc"), TypeError);
    assert.throws(() => unique(undefined), TypeError);
  });
});

describe("sortBy", () => {
  const products = [
    { name: "Laptop", price: 999 },
    { name: "Mouse", price: 29 },
    { name: "Keyboard", price: 79 },
  ];

  test("sorts by price ascending", () => {
    const sorted = sortBy([...products], "price", "asc");
    expect(sorted[0].price).toBe(29);
    expect(sorted[2].price).toBe(999);
  });

  test("sorts by price descending", () => {
    const sorted = sortBy([...products], "price", "desc");
    expect(sorted[0].price).toBe(999);
  });

  test("does not mutate original array", () => {
    const original = [...products];
    const originalFirst = original[0].price;
    sortBy(original, "price", "asc");
    expect(original[0].price).toBe(originalFirst);
  });
  test("sorts strings and handles an empty array", () => {
    expect(sortBy(products, "name").map((item) => item.name))
      .toEqual(["Keyboard", "Laptop", "Mouse"]);
    expect(sortBy([], "price")).toEqual([]);
  });
  test("preserves the order of equal keys in either direction", () => {
    // BUG: Equal keys previously compared as -1, reversing ties.
    const items = [{ value: 1, id: "a" }, { value: 1, id: "b" }, { value: 1, id: "c" }];
    expect(sortBy(items, "value", "asc").map((item) => item.id)).toEqual(["a", "b", "c"]);
    expect(sortBy(items, "value", "desc").map((item) => item.id)).toEqual(["a", "b", "c"]);
  });
  test("throws for null input", () => {
    expect(() => sortBy(null, "price")).toThrow();
  });
  test("sorts strings descending without mutating the input", () => {
    const sorted = sortBy(products, "name", "desc");
    assert.deepEqual(sorted.map((item) => item.name), ["Mouse", "Laptop", "Keyboard"]);
    assert.deepEqual(products.map((item) => item.name), ["Laptop", "Mouse", "Keyboard"]);
    assert.notEqual(sorted, products);
  });
  test("rejects unsupported sort directions and non-arrays", () => {
    assert.throws(() => sortBy(products, "price", "descending"), RangeError);
    assert.throws(() => sortBy("products", "price"), TypeError);
  });
});

describe("isValidEmail", () => {
  test("accepts valid email", () => {
    expect(isValidEmail("user@example.com")).toBeTruthy();
  });
  test("rejects missing @", () => {
    expect(isValidEmail("userexample.com")).toBeFalsy();
  });
  test("rejects missing domain", () => {
    expect(isValidEmail("user@")).toBeFalsy();
  });
  test("rejects empty string", () => {
    expect(isValidEmail("")).toBeFalsy();
  });
  test("handles whitespace, multiple at signs, subdomains and null", () => {
    expect(isValidEmail("a b@example.com")).toBeFalsy();
    expect(isValidEmail("a@@example.com")).toBeFalsy();
    expect(isValidEmail("a@sub.example.com")).toBeTruthy();
    expect(isValidEmail(null)).toBeFalsy();
  });
  test("checks domain labels and does not coerce non-strings", () => {
    assert.equal(isValidEmail("user+tag@sub-domain.example.com"), true);
    for (const email of ["user@example..com", "user@-example.com", "user@example-.com", "user@example.com."]) {
      assert.equal(isValidEmail(email), false);
    }
    assert.equal(isValidEmail({ toString: () => "user@example.com" }), false);
  });
});

describe("isValidCreditCard", () => {
  test("accepts a digit-only card number with a valid Luhn checksum", () => {
    expect(isValidCreditCard("4242424242424242")).toBeTruthy();
  });
  test("rejects invalid checksums and invalid input", () => {
    for (const value of ["4242424242424241", "", "0", "00000000000000000000", "4242 4242 4242 4242", null]) {
      expect(isValidCreditCard(value)).toBeFalsy();
    }
  });
  test("accepts valid checksum at both length boundaries", () => {
    expect(isValidCreditCard("000000000000")).toBeTruthy();
    expect(isValidCreditCard("0000000000000000000")).toBeTruthy();
  });
  test("validates odd-length Luhn checksums and rejects non-string numbers", () => {
    assert.equal(isValidCreditCard("378282246310005"), true);
    assert.equal(isValidCreditCard("378282246310006"), false);
    assert.equal(isValidCreditCard("00000000000"), false);
    assert.equal(isValidCreditCard(4242424242424242), false);
  });
});

describe("formatDate", () => {
  test("formats a local date in US long form", () => {
    expect(formatDate(new Date(2024, 0, 15, 12))).toBe("January 15, 2024");
  });
  test("reports an invalid date string", () => {
    expect(formatDate("invalid")).toBe("Invalid Date");
  });
  test("throws for an unsupported value", () => {
    expect(() => formatDate(Symbol("date"))).toThrow();
  });
  test("formats a local date string and handles invalid Date instances", () => {
    assert.equal(formatDate("2024-01-15T12:00:00"), "January 15, 2024");
    assert.equal(formatDate(new Date(NaN)), "Invalid Date");
    assert.throws(() => formatDate(null), TypeError);
    assert.throws(() => formatDate(0), TypeError);
  });
});

describe("daysBetween", () => {
  test("counts signed UTC calendar days, including leap days", () => {
    expect(daysBetween("2024-02-28T23:59:00Z", "2024-03-01T00:01:00Z")).toBe(2);
    expect(daysBetween("2024-03-01", "2024-02-28")).toBe(-2);
    expect(daysBetween("2024-03-01T00:00:00Z", "2024-03-01T23:59:00Z")).toBe(0);
    expect(daysBetween("2024-03-01T00:30:00+02:00", "2024-03-01T00:00:00Z")).toBe(1);
  });
  test("rejects invalid dates", () => {
    expect(() => daysBetween("invalid", "2024-01-01")).toThrow();
    expect(() => daysBetween(null, "2024-01-01")).toThrow();
    expect(() => daysBetween("2024-01-01", "invalid")).toThrow();
  });
  test("accepts Date instances without mutating them", () => {
    const start = new Date("2024-12-31T23:59:00Z");
    const end = new Date("2025-01-01T00:01:00Z");
    const originalTimes = [start.getTime(), end.getTime()];
    assert.equal(daysBetween(start, end), 1);
    assert.deepEqual([start.getTime(), end.getTime()], originalTimes);
  });
  test("distinguishes unsupported types from invalid dates", () => {
    assert.throws(() => daysBetween(0, "2024-01-01"), TypeError);
    assert.throws(() => daysBetween("2024-01-01", new Date(NaN)), RangeError);
  });
});

describe("isRecent", () => {
  test("uses inclusive UTC calendar days and rejects future dates", () => {
    const originalNow = Date.now;
    Date.now = () => Date.parse("2024-03-08T12:00:00Z");
    try {
      expect(isRecent("2024-03-01T00:00:00Z")).toBeTruthy();
      expect(isRecent("2024-02-29T23:59:00Z")).toBeFalsy();
      expect(isRecent("2024-03-08T12:00:01Z")).toBeFalsy();
      expect(isRecent("2024-03-08T00:00:00Z", 0)).toBeTruthy();
      expect(isRecent("2024-03-07T23:59:00Z", 0)).toBeFalsy();
    } finally {
      Date.now = originalNow;
    }
  });
  test("rejects invalid dates and day limits", () => {
    expect(() => isRecent("invalid")).toThrow();
    expect(() => isRecent("2024-01-01", -1)).toThrow();
    expect(() => isRecent("2024-01-01", 1.5)).toThrow();
    expect(() => isRecent(null)).toThrow();
  });
  test("accepts Date instances at the current instant and rejects later instants", () => {
    const originalNow = Date.now;
    Date.now = () => Date.parse("2024-03-08T12:00:00Z");
    try {
      assert.equal(isRecent(new Date("2024-03-08T12:00:00Z"), 0), true);
      assert.equal(isRecent(new Date("2024-03-08T12:00:00.001Z"), 0), false);
      assert.equal(isRecent(new Date("2024-03-06T23:59:59Z"), 2), true);
    } finally {
      Date.now = originalNow;
    }
  });
  test("rejects invalid Date instances and non-integer or non-finite limits", () => {
    assert.throws(() => isRecent(new Date(NaN)), RangeError);
    assert.throws(() => isRecent(0), TypeError);
    for (const days of ["7", NaN, Infinity]) {
      assert.throws(() => isRecent("2024-01-01", days), RangeError);
    }
  });
});

describe("validateProduct", () => {
  test("valid product passes", () => {
    const result = validateProduct({ name: "Phone", price: 99.99, stock: 10 });
    expect(result.valid).toBeTruthy();
    expect(result.errors.length).toBe(0);
  });

  test("missing name fails", () => {
    const result = validateProduct({ name: "", price: 99, stock: 5 });
    expect(result.valid).toBeFalsy();
  });

  test("negative price fails", () => {
    const result = validateProduct({ name: "Phone", price: -5, stock: 5 });
    expect(result.valid).toBeFalsy();
  });

  test("zero stock and zero price are valid", () => {
    // BUG: Zero stock was previously rejected.
    const result = validateProduct({ name: "Phone", price: 0, stock: 0 });
    expect(result.valid).toBeTruthy();
  });
  test("reports all invalid fields and rejects null", () => {
    expect(validateProduct({ name: " ", price: -1, stock: -1 }).errors)
      .toEqual(["Name is required", "Price must be a non-negative number", "Stock must be non-negative"]);
    expect(() => validateProduct(null)).toThrow();
  });
  test("reports invalid field types and non-finite numeric values", () => {
    assert.deepEqual(validateProduct({ name: 123, price: NaN, stock: Infinity }), {
      valid: false,
      errors: ["Name is required", "Price must be a non-negative number", "Stock must be non-negative"],
    });
    assert.deepEqual(validateProduct({ name: "Phone", price: Infinity, stock: NaN }).errors, [
      "Price must be a non-negative number", "Stock must be non-negative",
    ]);
    assert.throws(() => validateProduct("Phone"), TypeError);
  });
});

describe("applyDiscount", () => {
  test("applies a percentage rather than subtracting percentage points", () => {
    // BUG: A previous implementation subtracted the percentage as a fixed amount.
    expect(applyDiscount(200, 10)).toBeCloseTo(180);
  });

  test("0% discount returns original price", () => {
    expect(applyDiscount(50, 0)).toBeCloseTo(50);
  });

  test("100% discount returns 0", () => {
    expect(applyDiscount(50, 100)).toBeCloseTo(0);
  });

  test("throws on invalid discount", () => {
    expect(() => applyDiscount(100, 150)).toThrow();
    expect(() => applyDiscount(100, -1)).toThrow();
    expect(() => applyDiscount(100, NaN)).toThrow();
    expect(() => applyDiscount(-1, 10)).toThrow();
    expect(() => applyDiscount(null, 10)).toThrow();
  });
  test("supports fractional discounts without rounding the result", () => {
    assert.equal(applyDiscount(19.99, 12.5), 19.99 * 0.875);
    assert.equal(applyDiscount(0, 25), 0);
  });
  test("rejects non-finite prices and non-numeric percentages", () => {
    assert.throws(() => applyDiscount(Infinity, 10), /Price/);
    assert.throws(() => applyDiscount(NaN, 10), /Price/);
    assert.throws(() => applyDiscount(100, Infinity), /Discount/);
    assert.throws(() => applyDiscount(100, "10"), /Discount/);
  });
});

describe("applyCouponCode", () => {
  test("recognizes all supported codes", () => {
    expect(applyCouponCode("SAVE10")).toBe(10);
    expect(applyCouponCode("WELCOME")).toBe(15);
    expect(applyCouponCode("FLASH50")).toBe(50);
  });
  test("ignores case and surrounding whitespace", () => {
    expect(applyCouponCode(" save20 ")).toBe(20);
  });
  test("returns zero for unknown, empty and non-string codes", () => {
    expect(applyCouponCode("INVALID")).toBe(0);
    expect(applyCouponCode("")).toBe(0);
    expect(applyCouponCode(null)).toBe(0);
    expect(applyCouponCode("constructor")).toBe(0);
  });
  test("normalizes whitespace and case without accepting altered or inherited codes", () => {
    assert.equal(applyCouponCode("\tflAsH50\n"), 50);
    assert.equal(applyCouponCode("SAVE 10"), 0);
    assert.equal(applyCouponCode("__proto__"), 0);
    assert.equal(applyCouponCode({ toString: () => "SAVE10" }), 0);
  });
});

// ─── Results ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${knownBugs} known bugs`);
if (failed > 0) {
  console.log(`\n💡 Use GitHub Copilot to fix the failing tests and implement the TODOs!`);
  process.exit(1);
}
