# ShopEase

ShopEase is a lightweight, multi-page e-commerce storefront built with plain HTML, CSS, and JavaScript. Browse a sample product catalog, manage a cart and wishlist, and try a demo checkout. There is no framework, build step, backend, or real payment processing.

## Screenshots

Screenshots are not included yet. Add images to `docs/screenshots/` and embed them here, for example:

```md
![ShopEase home page](docs/screenshots/home.png)
![Product catalog](docs/screenshots/products.png)
![Shopping cart](docs/screenshots/cart.png)
```

## Tech stack

- HTML for the pages and forms
- CSS for layout, styling, and themes
- Vanilla JavaScript for storefront behavior
- `localStorage` and `sessionStorage` for browser-local demo data
- Node.js for the test suite and local static server

No frontend frameworks or runtime libraries are used by the app.
Optional TypeScript interfaces for the project's data are available in [`types.d.ts`](types.d.ts).

## Features

- Home page and sample catalog loaded from `products.json`
- Product search (debounced by 300 ms), category filtering, sorting, quick view, and detail pages
- Add-to-cart, quantity updates, stock checks, and order totals
- Wishlist saved in the current browser
- Demo coupon codes and checkout form validation
- Light and dark themes
- Browser-local product administration for adding, editing, and deleting products
- Keyboard navigation, skip links, labeled controls, and announcements for key updates
- Automated tests for utilities, products, wishlist, checkout, coupons, themes, and administration

## Getting started

### Requirements

- Node.js with npm and `npx`

### Run locally

1. Clone or download this project and open its root directory in a terminal.
2. Start the static server:

   ```sh
   npm start
   ```

3. Visit [http://localhost:3000](http://localhost:3000).

The app fetches its product catalog from `products.json`, so run it through a local web server rather than opening `index.html` directly as a file.

### Run tests

```sh
npm test
```

The utility suite reports existing defects as known bugs; an unexpected pass
requires converting that case to a regular test.

The checkout is for demonstration only. Do not enter real personal or payment information; no order or payment is processed. Product changes and cart/wishlist data are stored only in your browser.

## Project structure

```text
ShopEase/
├── index.html                 # Home page
├── products.html              # Product catalog
├── product-detail.html        # Product detail view
├── cart.html                  # Cart and demo checkout
├── checkout.html              # Checkout page entry
├── wishlist.html              # Saved products
├── admin.html                 # Browser-local product admin
├── products.json              # Sample product catalog
├── styles/
│   └── main.css               # App styles
├── src/
│   ├── admin.js               # Product admin behavior
│   ├── api.js                 # Product loading and persistence
│   ├── app.js                 # Shared cart and UI helpers
│   ├── cart.js                # Cart and coupon behavior
│   ├── checkout.js            # Demo checkout validation
│   ├── product-detail.js      # Product detail behavior
│   ├── products.js            # Catalog rendering and filtering
│   ├── theme.js               # Theme selection
│   ├── utils.js               # Shared utility functions
│   ├── wishlist-page.js       # Wishlist page rendering
│   └── wishlist.js            # Wishlist storage and behavior
├── tests/                     # Node.js tests
└── docs/
    └── PROMPTS.md             # Project prompt notes
```

## Contributing

Contributions and bug reports are welcome.

1. Create a branch for your change.
2. Keep changes focused and follow the existing plain HTML/CSS/JavaScript patterns.
3. Run the test suite with `npm test`.
4. Verify relevant pages locally with `npm start`.
5. Open a pull request describing the change and any relevant testing or screenshots.

For UI changes, include before-and-after screenshots when practical. Avoid adding frameworks or dependencies unless the project maintainers agree that they are needed.
