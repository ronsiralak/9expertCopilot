/**
 * utils.test.js - Unit Tests for Utility Functions
 * ShopEase E-Commerce Training Project
 *
 * Run with: node --test tests/utils.test.js  (Node 18+)
 * Or install Jest: npm test
 *
 * ─── GitHub Copilot Training: Unit Test Exercise ─────────────────────────────
 * These tests are written to demonstrate Copilot's test generation.
 * Some tests are intentionally left incomplete (marked TODO).
 * Use Copilot to:
 *  1. Generate test cases for TODO functions
 *  2. Fix tests that are wrong
 *  3. Add edge case tests
 */

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
      if (diff >= Math.pow(10, -decimals))
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
});

describe("truncate", () => {
  // TODO: Write tests for truncate()
  // Expected behavior:
  //   truncate("Hello World", 5) -> "Hello..."
  //   truncate("Hi", 10)         -> "Hi"  (no truncation needed)
  //   truncate("", 5)            -> ""
});

describe("slugify", () => {
  // TODO: Write tests for slugify()
  // Expected behavior:
  //   slugify("Hello World")   -> "hello-world"
  //   slugify("React & Redux") -> "react-redux"
  //   slugify("  spaces  ")    -> "spaces"
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

  test("does not mutate original array (this test will FAIL due to bug)", () => {
    const original = [...products];
    const originalFirst = original[0].price;
    sortBy(original, "price", "asc");
    // BUG: sortBy mutates original, so this test will fail
    expect(original[0].price).toBe(originalFirst);
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
  // TODO: add more edge cases (e.g. spaces, multiple @ signs, valid subdomains)
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

  test("zero stock is valid (this test will FAIL due to bug in validateProduct)", () => {
    // BUG: validateProduct has a bug — stock: 0 should be valid
    const result = validateProduct({ name: "Phone", price: 99, stock: 0 });
    expect(result.valid).toBeTruthy();
  });
});

describe("applyDiscount", () => {
  test("applies 10% discount correctly (this test will FAIL due to bug)", () => {
    // BUG: applyDiscount currently does price - percent instead of correct formula
    expect(applyDiscount(100, 10)).toBeCloseTo(90);
  });

  test("0% discount returns original price", () => {
    expect(applyDiscount(50, 0)).toBeCloseTo(50);
  });

  test("100% discount returns 0", () => {
    expect(applyDiscount(50, 100)).toBeCloseTo(0);
  });

  test("throws on invalid discount", () => {
    expect(() => applyDiscount(100, 150)).toThrow();
  });
});

describe("applyCouponCode", () => {
  // TODO: Write tests for applyCouponCode()
  // Expected behavior:
  //   applyCouponCode("SAVE10")  -> 10
  //   applyCouponCode("save20")  -> 20  (case-insensitive)
  //   applyCouponCode("INVALID") -> 0
  //   applyCouponCode("")        -> 0
});

// ─── Results ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log(`\n💡 Use GitHub Copilot to fix the failing tests and implement the TODOs!`);
  process.exit(1);
}
