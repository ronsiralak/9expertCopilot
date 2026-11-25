# Changelog

All notable changes to ShopEase are documented in this file. This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Planned

- Add stronger slug normalization and edge-case handling for string utilities.
- Add browser-level end-to-end coverage and screenshots for the primary shopping flows.
- Explore server-backed product and order persistence; the current app stores demo state in the browser.

## [1.0.0]

### Added

- Multi-page storefront with home, product catalog, product detail, cart, wishlist, and product administration pages.
- Product search, category filtering, sorting, quick view, stock indicators, and related products.
- Browser-local cart and wishlist, coupon discounts, order summaries, and demo checkout validation.
- Light and dark themes and a sample catalog in `products.json`.
- Shared string, array, validation, date, and discount utilities.
- Node.js tests covering utilities, products, wishlist, checkout, coupons, themes, and administration.

### Known Issues

- `slugify` removes punctuation but does not collapse adjacent hyphens, so inputs such as `"React & Redux"` produce `"react--redux"`.
- `truncate` does not enforce the requested maximum length when `maxLength` is less than three.
- `sortBy` reports equal property values as less-than instead of equal, which can produce inconsistent ordering for ties.
- Product, cart, and wishlist changes are stored only in the current browser; the admin page has no access control and checkout does not process payments.
