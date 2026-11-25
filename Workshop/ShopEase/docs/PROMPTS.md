## ShopEase E-Commerce Project

## 📁 Project Structure

```
copilot-training/
├── index.html          ← หน้าแรก (Hero + Features)
├── products.html       ← หน้าสินค้า (Filter / Sort / Search / Quick View)
├── products.json       ← ข้อมูลสินค้า (โหลดด้วย fetch)
├── cart.html           ← หน้าตะกร้า (Summary / Checkout)
├── admin.html          ← จัดการสินค้าใน browser นี้ (ไม่มีระบบยืนยันตัวตน)
├── checkout.html       ← เปลี่ยนเส้นทางไปยังตะกร้า
├── styles/
│   └── main.css        ← Stylesheet ทั้งหมด
├── src/
│   ├── app.js          ← Cart logic, Toast, Currency utils
│   ├── products.js     ← โหลดข้อมูลสินค้า + Render
│   ├── api.js          ← Mock API (หน่วง 300ms) และข้อมูลสินค้าของ browser
│   ├── admin.js        ← จัดการสินค้าใน localStorage
│   ├── cart.js         ← Cart page rendering
│   ├── checkout.js     ← ตรวจฟอร์มและจำลอง checkout
│   └── utils.js        ← Utility functions (มี bugs + TODOs)
├── tests/
│   └── utils.test.js   ← Unit tests (มี failing tests ตั้งใจ)
└── docs/
    └── PROMPTS.md      ← ไฟล์นี้
```

เปิดแอปผ่าน HTTP เช่น `npm start` แล้วเข้า `http://localhost:3000`
แทนการเปิดไฟล์ HTML โดยตรง เพราะ browser อาจบล็อก `fetch()` ผ่าน `file://`.
Checkout เป็นการจำลองเท่านั้น ห้ามกรอกข้อมูลส่วนบุคคลหรือบัตรจริง:
ใช้หมายเลขทดสอบ `4242 4242 4242 4242` และรหัสทดสอบ `123`
ระบบไม่ส่งหรือบันทึกข้อมูลในฟอร์ม และไม่ได้สร้างคำสั่งซื้อหรือเรียกเก็บเงิน
คูปองจะคงอยู่ใน session ของแท็บจนกว่าจะนำออกหรือล้างตะกร้า
การแก้ไขสินค้าที่หน้า Admin เก็บใน localStorage เฉพาะ browser/origin นี้
และไม่มีระบบล็อกอิน จึงไม่เหมาะใช้เป็นระบบจัดการสินค้าจริง
ราคาสินค้าในตะกร้าจะอัปเดตจากแค็ตตาล็อกล่าสุด และต้องแก้ไขหรือนำรายการ
ที่ถูกลบหรือมีสต็อกไม่พอออกก่อน checkout
สำหรับการชำระเงินจริงต้องเชื่อมผู้ให้บริการชำระเงินที่เหมาะสม
และตรวจสอบราคาและคูปองบนเซิร์ฟเวอร์

---

## 🤖 1. ASK MODE — ถามเพื่อเข้าใจ Code

> เปิดไฟล์ใดก็ได้ แล้วใช้ Copilot Chat ถามว่าโค้ดทำอะไร

### Prompt ตัวอย่าง:

```
@workspace What does the addToCart function do? Walk me through it step by step.
```

```
@workspace Explain how the cart total is calculated including tax and shipping logic
```

```
@workspace What happens when a user searches for a product that doesn't exist?
```

```
@workspace How is product data structured in this project? 
Show me all the fields each product has.
```

```
@workspace Why does validateProduct() have a bug with stock: 0?
```

```
#file:src/utils.js Explain what each exported function does in one sentence each
```

---

## 📋 2. PLAN MODE — วางแผนก่อนเขียนโค้ด

> ใช้ Copilot วางแผน Feature ใหม่ก่อนลงมือเขียน

### Prompt ตัวอย่าง:

**Feature: Wishlist (บันทึกสินค้าที่สนใจ)**
```
@workspace I want to add a wishlist feature to ShopEase.
Plan how to implement this without modifying existing cart logic.
What files need to change? What new files are needed?
```

**Feature: Product Detail Page**
```
@workspace Plan a product detail page (product-detail.html).
It should show full description, image placeholder, reviews, 
and related products from the same category.
List all changes needed.
```

**Feature: Coupon Code at Checkout**
```
@workspace Plan how to add coupon code support to the cart page.
The applyCouponCode() function in utils.js already exists.
How do we wire it to the UI? What validation is needed?
```

**Refactor Plan**
```
@workspace The product data is hardcoded in products.js.
Plan how to move it to a separate products.json file 
and load it asynchronously with fetch().
```

---

## ⚡ 3. EDIT MODE (Inline Suggestions) — เขียนโค้ดด้วย Copilot

> วางเคอร์เซอร์ไว้หลัง TODO comment แล้วกด Tab รับ suggestion

### ไฟล์: `src/utils.js`

**Exercise 1 — Complete truncate()**
```javascript
// วางเคอร์เซอร์หลังบรรทัดนี้แล้วปล่อยให้ Copilot เติม:
function truncate(str, maxLength) {
  // TODO: implement truncation with "..." suffix
  // Hint: ถ้า str.length > maxLength ให้ return str.slice(0, maxLength) + "..."
```

**Exercise 2 — Complete slugify()**
```javascript
function slugify(str) {
  // TODO: implement slugify
  // Hint: lowercase -> trim -> replace spaces with - -> remove special chars
```

**Exercise 3 — Complete groupBy()**
```javascript
function groupBy(arr, key) {
  // TODO: implement groupBy using reduce
```

**Exercise 4 — Fix sortBy() bug**
```
// เลือก sortBy function แล้วพิมพ์ใน Inline Chat:
/fix This function mutates the original array. Fix it to return a sorted copy.
```

**Exercise 5 — Fix applyDiscount() bug**
```
/fix The discount formula is wrong. It should be: price * (1 - discountPercent / 100)
```

---

## 🤖 4. AGENT MODE — สร้าง Feature อัตโนมัติ

> ใช้ Copilot Agent ทำงานหลายไฟล์พร้อมกัน

### Prompt ตัวอย่าง:

**Agent: เพิ่ม Dark Mode**
```
@workspace Add a dark mode toggle to the navbar.
- Add a 🌙 button to navbar in index.html, products.html, cart.html
- In main.css, add dark mode CSS variables using prefers-color-scheme
  and a .dark-mode class
- In app.js, add toggleDarkMode() function that saves preference to localStorage
Make all changes across files.
```

**Agent: เพิ่ม Product Search API**
```
@workspace Refactor products.js to load data from a mock API.
- Create a new file src/api.js with a fetchProducts() async function
  that returns a Promise resolving to the PRODUCTS array (simulate 300ms delay)
- Update products.js to use fetchProducts() instead of the inline array
- Show a loading spinner in the product grid while fetching
- Handle errors gracefully with an error state in the UI
```

**Agent: สร้าง Admin Page**
```
@workspace Create a new admin.html page for managing products.
- Table showing all products with name, price, stock, category
- Inline edit for price and stock fields
- Delete button per row
- Add product form at the bottom
- Use existing CSS variables from main.css for styling
- Save changes to localStorage
```

**Agent: เพิ่ม Form Validation**
```
@workspace Add a checkout form to cart.html with these fields:
name, email, address, city, zip, card number, expiry, CVV.
Use the isValidEmail() and isValidCreditCard() functions from utils.js.
Show real-time validation errors below each field.
Prevent submission if any field is invalid.
```

---

## 💬 5. INLINE CHAT — แก้ไขและปรับปรุงโค้ด

> เลือก code แล้วกด Ctrl+I (Windows) / Cmd+I (Mac) เพื่อเปิด Inline Chat

### ใช้กับ `src/app.js`

**ปรับปรุงการทำงาน**
```
/improve Add debouncing to the search input so it only filters 
after the user stops typing for 300ms
```

**อธิบายโค้ด**
```
/explain What edge cases does the updateQuantity function handle?
```

**เพิ่ม Error Handling**
```
Wrap the localStorage calls in getCart() and saveCart() with try/catch 
in case localStorage is disabled (e.g., private browsing mode)
```

### ใช้กับ `src/products.js`

**เพิ่ม Feature**
```
Add a "Quick View" button to each product card that shows 
a modal with the product description and an Add to Cart button
```

**Refactor**
```
/refactor Extract the filter logic from renderProducts() into 
a separate filterProducts(products, { query, category }) function
```

### ใช้กับ `styles/main.css`

**ปรับ UI**
```
Make the product cards show a "sale" ribbon in the top-right corner
when the product's stock is > 20. Add the CSS for .ribbon class.
```

---

## 📄 6. CREATE DOCUMENT — สร้างเอกสาร

> ใช้ Copilot สร้าง Documentation จากโค้ด

### Generate README
```
@workspace Generate a professional README.md for this project including:
- Project overview and screenshots section
- Tech stack (plain HTML/CSS/JS, no frameworks)
- Features list
- Getting started (how to run locally)
- Project structure tree
- Contributing guide
```

### Generate JSDoc
```
#file:src/utils.js Add complete JSDoc comments to all functions 
that are missing them. Include @param types, @returns, and @example
```

### Generate API Documentation
```
#file:src/app.js Create a CART_API.md documentation file 
describing all cart functions as if they were a JavaScript SDK.
Include method signatures, parameters, return types, and usage examples.
```

### Generate Changelog
```
@workspace Generate a CHANGELOG.md in Keep-a-Changelog format.
Assume version 1.0.0 is the current state. 
List features, known bugs (from utils.js), and planned features.
```

---

## 🧪 7. UNIT TESTS — สร้างและแก้ไข Tests

> เปิดไฟล์ tests/utils.test.js แล้วใช้ Copilot ช่วยเขียน Tests

### Generate Tests from scratch
```
#file:src/utils.js Generate complete unit tests for all 
exported functions. Include:
- Happy path tests
- Edge cases (empty input, null, boundary values)  
- Tests that should throw errors
- Tests for the known bugs (mark them with // BUG: comment)
```

### Complete TODO Tests
```
#file:tests/utils.test.js Complete all the TODO describe blocks.
Write at least 3 test cases for each: truncate, slugify, applyCouponCode
```

### Fix Failing Tests
```
#file:tests/utils.test.js 
#file:src/utils.js
The tests for applyDiscount and sortBy are failing due to bugs in utils.js.
Fix the bugs in utils.js to make these tests pass.
```

### Add Integration Test
```
@workspace Create a new file tests/cart.test.js that tests 
the cart workflow:
1. Add 3 different products to cart
2. Update quantities
3. Verify totals calculation
4. Remove one item
5. Clear cart
Mock localStorage for testing.
```

### Test Coverage Report
```
#file:src/utils.js #file:tests/utils.test.js
Which functions in utils.js have no tests yet?
Generate tests for them.
```

---

## 🔧 8. ADVANCED EXERCISES

### Exercise: Fix All Bugs
```
@workspace Find and fix all bugs in src/utils.js.
List each bug with:
1. Function name
2. What the bug is
3. The fix
Then apply all fixes.
```

### Exercise: Performance Audit
```
@workspace Review products.js for performance issues.
The renderProducts() function is called on every keystroke.
How can we optimize it? Implement the optimization.
```

### Exercise: Accessibility Audit
```
@workspace Review all HTML files for accessibility issues.
Add ARIA labels, roles, and keyboard navigation support.
Focus on: buttons, product cards, cart items, and forms.
```

### Exercise: TypeScript Migration
```
@workspace Create TypeScript type definitions file (types.d.ts) 
for this project. Define interfaces for:
- Product
- CartItem  
- OrderSummary
- ValidationResult
- CouponCode
```

---

## 💡 Tips for Better Copilot Results

| Tip | Example |
|-----|---------|
| ใช้ `@workspace` เมื่อต้องการ context ทั้ง project | `@workspace Where is tax calculated?` |
| ใช้ `#file:` เพื่อ reference ไฟล์เฉพาะ | `#file:src/utils.js explain groupBy` |
| บอก context ให้ชัด | แทน "add feature" ให้บอก "add a wishlist button to each product card in products.js" |
| ขอให้ explain ก่อน implement | "Explain your approach before writing code" |
| ขอ test ด้วยเสมอ | "Also write unit tests for the function you create" |
| ใช้ `/fix` สำหรับ bug | เลือก buggy code แล้วพิมพ์ `/fix` |
| ใช้ `/doc` สำหรับ documentation | เลือก function แล้วพิมพ์ `/doc` |
| ใช้ `/test` สำหรับ tests | เลือก function แล้วพิมพ์ `/test` |

---

*ShopEase Copilot Training Project — 🚀*
