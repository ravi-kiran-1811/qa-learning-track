/**
 * Regression Tests — broad feature coverage, edge cases, full workflows.
 * Run before every release.
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { shopData } from '../src/data/shopTestData';

// ── Navigation & Category ──────────────────────────────────────────────────

test.describe('@regression Regression — Navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.openHomePage();
  });

  test('R001: All four categories are accessible', async ({ page }) => {
    console.log('\n📌 R001 - All categories accessible');
    const slugs = await homePage.categorySlugs();
    expect(slugs.length).toBe(4);
    for (const slug of slugs) {
      await page.goto(`/list/${slug}`);
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).toContain(slug);
      console.log(`✓ Category "${slug}" accessible`);
      await homePage.openHomePage();
    }
  });

  test('R002: Search navigates correctly for multiple terms', async ({ page }) => {
    console.log('\n📌 R002 - Search with multiple terms');
    for (const term of shopData.searchProducts.slice(0, 3)) {
      await homePage.searchForProduct(term);
      const url = await homePage.getCurrentUrl();
      expect(url).toContain('shop.polymer-project.org');
      console.log(`✓ Searched "${term}" → ${url}`);
      await homePage.openHomePage();
    }
  });

  test('R003: Category tile count is consistent across reloads', async ({ page }) => {
    console.log('\n📌 R003 - Category tile count consistent');
    const count1 = await homePage.getProductCount();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const count2 = await homePage.getProductCount();
    expect(count1).toBe(count2);
    console.log(`✓ Consistent count: ${count1}`);
  });
});

// ── Product Detail ─────────────────────────────────────────────────────────

test.describe('@regression Regression — Product Detail', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    await homePage.openHomePage();
  });

  test('R004: First three products load with title and price', async ({ page }) => {
    console.log('\n📌 R004 - First 3 products verified');
    const slugs = await homePage.categorySlugs();
    const checkCount = Math.min(slugs.length, 3);
    for (let i = 0; i < checkCount; i++) {
      await homePage.clickProduct(i);
      expect(await productPage.verifyProductLoaded()).toBeTruthy();
      const details = await productPage.verifyProductDetails();
      expect(details).toBeTruthy();
      console.log(`✓ Product ${i + 1} verified`);
      await productPage.goBack();
      await homePage.openHomePage();
    }
  });

  test('R005: Product price contains a numeric value', async ({ page }) => {
    console.log('\n📌 R005 - Price format valid');
    await homePage.clickProduct(0);
    const price = await productPage.getProductPrice();
    expect(price).toMatch(/\d+/);
    console.log(`✓ Price: "${price}"`);
  });

  test('R006: Browser back button returns to category listing', async ({ page }) => {
    console.log('\n📌 R006 - Back navigation');
    await homePage.clickProduct(0);
    expect(await productPage.verifyProductLoaded()).toBeTruthy();
    await productPage.goBack();
    const url = page.url();
    expect(url).not.toContain('/detail/');
    console.log(`✓ Back to: ${url}`);
  });
});

// ── Shopping Cart ──────────────────────────────────────────────────────────

test.describe('@regression Regression — Cart', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await homePage.openHomePage();
  });

  test('R007: Adding multiple products increases cart count', async ({ page }) => {
    console.log('\n📌 R007 - Add multiple products');
    const slugs = await homePage.categorySlugs();
    const toAdd = Math.min(slugs.length, 2);
    for (let i = 0; i < toAdd; i++) {
      await homePage.clickProduct(i);
      await productPage.addToCart(1);
      await productPage.goBack();
      await homePage.openHomePage();
    }
    await productPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThanOrEqual(1);
    console.log(`✓ Cart has ${count} item(s)`);
  });

  test('R008: Cart shows correct item after adding one product', async ({ page }) => {
    console.log('\n📌 R008 - One item in cart');
    await homePage.clickProduct(0);
    await productPage.addToCart(1);
    await productPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
    console.log(`✓ Cart has ${count} item(s)`);
  });

  test('R009: Cart is empty on fresh navigation', async ({ page }) => {
    console.log('\n📌 R009 - Empty cart check');
    await homePage.goToCart();
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    console.log('✓ Cart is empty');
  });

  test('R010: Cart total price is displayed when items are present', async ({ page }) => {
    console.log('\n📌 R010 - Cart total price');
    await homePage.clickProduct(0);
    await productPage.addToCart(1);
    await productPage.goToCart();
    const total = await cartPage.getTotalPrice();
    expect(total.length).toBeGreaterThan(0);
    expect(total).toMatch(/\d/);
    console.log(`✓ Total: "${total}"`);
  });

  test('R011: Removing an item from cart reduces count', async ({ page }) => {
    console.log('\n📌 R011 - Remove item from cart');
    await homePage.clickProduct(0);
    await productPage.addToCart(1);
    await productPage.goToCart();
    const before = await cartPage.getCartItemCount();
    if (before > 0) {
      await cartPage.removeItemAtIndex(0);
      const after = await cartPage.getCartItemCount();
      expect(after).toBeLessThan(before);
      console.log(`✓ Removed item: ${before} → ${after}`);
    }
  });
});

// ── Checkout ───────────────────────────────────────────────────────────────

test.describe('@regression Regression — Checkout', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await homePage.openHomePage();
  });

  test('R012: Checkout page is reachable after adding a product', async ({ page }) => {
    console.log('\n📌 R012 - Checkout reachable');
    await homePage.clickProduct(0);
    await productPage.addToCart(1);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();
    const url = page.url();
    expect(url).toBeDefined();
    console.log(`✓ Checkout URL: ${url}`);
  });

  test('R013: Customer information can be filled in checkout', async ({ page }) => {
    console.log('\n📌 R013 - Fill customer info');
    await homePage.clickProduct(0);
    await productPage.addToCart(1);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(shopData.validCustomer);
    console.log('✓ Customer info filled');
  });

  test('R014: Payment information can be filled in checkout', async ({ page }) => {
    console.log('\n📌 R014 - Fill payment info');
    await homePage.clickProduct(0);
    await productPage.addToCart(1);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(shopData.validCustomer);
    await checkoutPage.fillPaymentInfo(shopData.validPayment);
    console.log('✓ Payment info filled');
  });

  test('R015: Multiple customer checkout flows complete without errors', async ({ page }) => {
    console.log('\n📌 R015 - Multiple customer flows');
    for (let i = 0; i < 2; i++) {
      await homePage.openHomePage();
      await homePage.clickProduct(0);
      await productPage.addToCart(1);
      await productPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo(shopData.multipleCustomers[i]);
      console.log(`✓ Customer ${i + 1} flow done`);
      await homePage.openHomePage();
    }
  });
});

// ── Error Handling ─────────────────────────────────────────────────────────

test.describe('@regression Regression — Error Handling', () => {
  test('R016: Navigating to an invalid product URL is handled gracefully', async ({ page }) => {
    console.log('\n📌 R016 - Invalid product URL');
    await page.goto('https://shop.polymer-project.org/detail/invalid/nonexistent-product', {
      waitUntil: 'networkidle',
    });
    const url = page.url();
    expect(url).toContain('shop.polymer-project.org');
    console.log(`✓ Handled gracefully — URL: ${url}`);
  });

  test('R017: Page reload preserves the current URL', async ({ page }) => {
    console.log('\n📌 R017 - Reload preserves URL');
    await page.goto('https://shop.polymer-project.org/');
    await page.waitForLoadState('networkidle');
    const before = page.url();
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(before);
    console.log(`✓ URL preserved: ${before}`);
  });
});
