# Test Cases & Test Data — Polymer Shop

**Application under test:** https://shop.polymer-project.org/
**Type:** Demo Progressive Web App (PWA) storefront built with Polymer web components.
**Note:** This is a demo store — checkout accepts any well-formed card and no real payment is processed.

## Test Classification

| Suite | Purpose | When to run | Tag |
|-------|---------|-------------|-----|
| **Smoke** | Absolute minimum checks: is the app alive and the revenue path intact? Run in under 30 s. If these fail, stop. | Every commit / deploy | `@smoke` |
| **Sanity** | Fast checks on all critical journeys. If these fail, do not proceed to regression. | Every build / PR | `@sanity` |
| **Regression** | Broader feature coverage — categories, product detail, cart, checkout validation, and edge cases. | Before release | `@regression` |
| **E2E** | Full happy-path purchase journeys spanning every page object. | Before release / nightly | `@e2e` |

## Test Data

Test data lives in [`test-data/`](../test-data) as JSON and is imported by the specs (data-driven).

| File | Contents |
|------|----------|
| `categories.json` | The four category slugs and display names. |
| `products.json` | One representative product per category (verified live URLs). |
| `checkout.json` | `valid`, `internationalCustomer`, and `invalidMissingRequired` checkout payloads. |
| `types.ts` | TypeScript interfaces (`CheckoutInfo`, `ProductData`) shared by pages and specs. |

### Sample valid checkout record

| Field | Value |
|-------|-------|
| Email | qa.tester@example.com |
| Phone | 5551234567 |
| Ship Address | 123 Test Street, Testville, CA 90210 |
| Card Name | QA Tester |
| Card Number | 4111111111111111 |
| CVV | 123 |

### Sample invalid checkout record (all-blank — used to test validation)

All fields empty string — see `checkout.json > invalidMissingRequired`.

---

## Test Cases

### Smoke

| TC ID | Title | Preconditions | Steps | Test Data | Expected Result | Automated By |
|-------|-------|---------------|-------|-----------|-----------------|--------------|
| TC-SM01 | App loads and renders home page | App reachable | 1. Open `/` | — | App shell visible; title matches `/SHOP/i`; URL correct | `tests/smoke/critical-path.smoke.spec.ts` |
| TC-SM02 | Category navigation is functional | On home page | 1. Click Men's Outerwear tile | mens_outerwear | Category listing loads; ≥1 product; URL is `/list/mens_outerwear` | `tests/smoke/critical-path.smoke.spec.ts` |
| TC-SM03 | Add-to-cart critical path works | On a product detail page | 1. Note badge (0) 2. Click Add to Cart | products[0] | Cart badge increments to 1 | `tests/smoke/critical-path.smoke.spec.ts` |

### Sanity

| TC ID | Title | Preconditions | Steps | Test Data | Expected Result | Automated By |
|-------|-------|---------------|-------|-----------|-----------------|--------------|
| TC-S01 | Home page loads with app shell | App reachable | 1. Open `/` | — | `shop-home` visible; page title contains "SHOP" | `tests/sanity/home.sanity.spec.ts` |
| TC-S02 | All four shopping categories are linked | On home page | 1. Read category tile hrefs | categories.json | The 4 expected category slugs are present | `tests/sanity/home.sanity.spec.ts` |
| TC-S03 | Home → Category → Product navigation | App reachable | 1. Open home 2. Open a category 3. Open first product | mens_outerwear | Each page loads; product detail shows a non-empty title | `tests/sanity/navigation.sanity.spec.ts` |
| TC-S04 | Adding a product updates the cart badge | On a product detail page | 1. Note badge count (0) 2. Add to Cart | products[0] | Cart badge increments to 1 | `tests/sanity/add-to-cart.sanity.spec.ts` |

### Regression

| TC ID | Title | Preconditions | Steps | Test Data | Expected Result | Automated By |
|-------|-------|---------------|-------|-----------|-----------------|--------------|
| TC-R01 | Each category lists products | App reachable | 1. Open each `/list/<slug>` | categories.json (×4, data-driven) | Every category renders ≥1 product | `tests/regression/category.regression.spec.ts` |
| TC-R02 | Open product by name from category listing | On a category listing page | 1. Read product names 2. Click a named product | mens_outerwear | URL contains `/detail/`; product detail page loads | `tests/regression/category.regression.spec.ts` |
| TC-R03 | Product detail shows all controls | On a product detail page | 1. Open product detail | products[0] | Title, price, size select, quantity select all visible | `tests/regression/product-detail.regression.spec.ts` |
| TC-R04 | Add with explicit size and quantity updates cart | On a product detail page | 1. Select size M and qty 2 2. Add to Cart | size=M, qty=2 | Cart badge shows 2 | `tests/regression/product-detail.regression.spec.ts` |
| TC-R05 | Empty cart shows the empty message | Cart empty | 1. Open `/cart` | — | "…is empty." message shown; 0 line items | `tests/regression/cart.regression.spec.ts` |
| TC-R06 | Added product appears as a line item in the cart | 1 item added | 1. Add product 2. Open cart | products[0] | Cart shows exactly 1 line item | `tests/regression/cart.regression.spec.ts` |
| TC-R07 | Two different products produce two line items | App reachable | 1. Add 2 different products 2. Open cart | products[0], products[1] | Cart shows 2 line items | `tests/regression/cart.regression.spec.ts` |
| TC-R08 | Submitting empty checkout form is blocked | Cart has 1 item | 1. Open checkout 2. Click Place Order with blank form | invalidMissingRequired | Stays on `/checkout`; no success route | `tests/regression/checkout-validation.regression.spec.ts` |
| TC-R09 | Cart shows subtotal row when items are present | 1 item added | 1. Add product 2. Open cart | products[0] | Subtotal row visible and contains a `$` price | `tests/regression/cart.regression.spec.ts` |
| TC-R10 | Removing an item decreases line-item count | 1 item in cart | 1. Add product 2. Open cart 3. Click remove (×) | products[0] | Line items go from 1 → 0; empty message appears | `tests/regression/cart.regression.spec.ts` |
| TC-R11 | Checkout form renders all required input fields | Cart has 1 item | 1. Open `/checkout` 2. Inspect all fields | — | All 12 fields (email, phone, ship*, cc*) and Place Order button visible | `tests/regression/checkout-validation.regression.spec.ts` |
| TC-R12 | Add to Cart button background turns black while pressed | On a product detail page | 1. Hover button 2. Press and hold | products[0] | Background is white at rest; switches to black while active | `tests/regression/button-state.regression.spec.ts` |

### End-to-End

| TC ID | Title | Preconditions | Steps | Test Data | Expected Result | Automated By |
|-------|-------|---------------|-------|-----------|-----------------|--------------|
| TC-E01 | Full purchase flow — domestic customer | App reachable | Home → category → product → Add to Cart → Cart → Checkout → Place Order | products[0] + checkout.valid | Redirects to `/checkout/success`; "Thank you" shown | `tests/e2e/purchase-flow.e2e.spec.ts` |
| TC-E02 | Full purchase flow — international customer | App reachable | Add product → Cart → Checkout with intl data → Place Order | products[1] + checkout.internationalCustomer | Order succeeds; "Thank you" shown | `tests/e2e/purchase-flow.e2e.spec.ts` |

---

## Additional Manual / Exploratory Cases (not automated)

These are intentionally outside the automated scope — PWA, visual, and device-level concerns.

| TC ID | Title | Notes |
|-------|-------|-------|
| TC-M01 | Offline mode (PWA) | Load app, go offline, confirm the cached shell still loads. |
| TC-M02 | Responsive layout | Verify category grid and checkout form on 375 px mobile viewport. |
| TC-M03 | Cart quantity re-selection | Return to product page, change quantity; confirm badge updates correctly. |
| TC-M04 | Invalid card format entry | Enter a non-numeric card number; verify field-level validation message. |
| TC-M05 | 404 route handling | Navigate to a non-existent path; verify the 404 component is rendered. |
| TC-M06 | Back-button navigation | Use the browser's native back button after adding to cart; confirm state persists. |
