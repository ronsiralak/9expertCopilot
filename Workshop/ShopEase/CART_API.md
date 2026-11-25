# ShopEase Cart API

The cart API is a set of global functions defined in `src/app.js`. Include that classic script in a browser page before calling the functions. The API is synchronous and stores cart contents in the current browser's `localStorage` under `shopease_cart`; it does not communicate with a server.

## Data types

The project also provides importable TypeScript interfaces in
[`types.d.ts`](types.d.ts). `CartItem` describes the cart item below, and
`OrderSummary` has the same fields as `OrderTotals`.

```ts
type CartProduct = {
  id: number;
  name: string;
  price: number;
  [productField: string]: unknown;
};

type CartItem = CartProduct & {
  quantity: number;
};

type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};
```

## Cart methods

### `getCart(): CartItem[]`

Read and parse the cart from `localStorage`. Returns an empty array when no cart has been saved. A storage access failure or malformed stored JSON is surfaced as an exception.

```js
const items = getCart();
console.log(`${items.length} distinct products in the cart`);
```

### `saveCart(items: CartItem[]): void`

Serialize and save the supplied cart items, then refresh the page's cart count badge if possible. Storage failures are reported and rethrown. Items are not validated.

```js
const items = getCart();
saveCart(items);
```

### `addToCart(product: CartProduct, quantity?: number): void`

Add a product to the cart, adding `quantity` to an existing item's quantity when the product ID is already present. The default quantity is `1`. This function does not validate stock, price, or quantity.

```js
addToCart(
  { id: 12, name: "Canvas Tote", price: 18.5, category: "accessories" },
  2
);
```

### `removeFromCart(productId: number): void`

Remove the item whose ID matches `productId`. If no item matches, the cart is saved unchanged.

```js
removeFromCart(12);
```

### `updateQuantity(productId: number, delta: number): void`

Add `delta` to the matching item's quantity. Missing items are ignored; if the resulting quantity is zero or less, the item is removed.

```js
updateQuantity(12, 1);  // Add one
updateQuantity(12, -1); // Remove one
```

### `clearCart(): void`

Save an empty cart and call the global `renderCart()` function if that function is available.

```js
clearCart();
```

## Cart display and calculation helpers

### `updateCartCount(): void`

Read the cart and update the element with ID `cart-count`, if present. The displayed value is the sum of item quantities.

```js
updateCartCount();
```

### `showToast(message: string, duration?: number): void`

Display a toast notification, replacing any currently visible `.toast` element. `duration` is in milliseconds and defaults to `2500`.

```js
showToast("Item added to your cart", 3000);
```

### `formatCurrency(amount: number): string`

Format a number as USD using the `en-US` locale.

```js
formatCurrency(18.5); // "$18.50"
```

### `calculateTotals(cartItems: CartItem[], discountPercent?: number): OrderTotals`

Calculate subtotal, discount, shipping, tax, and total for the supplied items. `discountPercent` defaults to `0` and must be between `0` and `100`, inclusive, or the function throws. Shipping is free when the post-discount subtotal is greater than `$50`; otherwise it is `$5.99`. Tax is `7%` of the applicable subtotal.

```js
const totals = calculateTotals(getCart(), 10);
console.log(formatCurrency(totals.total));
```

## Complete example

```html
<script src="src/app.js"></script>
<script>
  const product = {
    id: 12,
    name: "Canvas Tote",
    price: 18.5,
    category: "accessories",
  };

  addToCart(product, 2);

  const cartItems = getCart();
  const totals = calculateTotals(cartItems);
  console.log(cartItems, totals);
</script>
```

These functions are client-side demo helpers, not a production commerce SDK. In particular, cart data is browser-local and methods such as `addToCart` do not enforce current product stock.
