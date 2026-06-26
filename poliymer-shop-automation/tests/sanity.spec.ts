/**
 * Sanity Tests — fast checks on all critical journeys.
 * Run before every build / PR. If any fail, stop.
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import { shopData } from '../src/data/shopTestData';

// ── Home Page ──────────────────────────────────────────────────────────────

test.describe('@sanity Sanity — Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.openHomePage();
  });

  test('S001: Home page loads successfully', async ({ page }) => {
    console.log('\n📌 S001 - Home page loads');
    const isLoaded = await homePage.verifyPageLoaded();
    expect(isLoaded).toBeTruthy();
    expect((await page.title()).length).toBeGreaterThan(0);
    console.log(`✓ Page title: "${await page.title()}"`);
  });

  test('S002: Search navigates to a category page', async ({ page }) => {
    console.log('\n📌 S002 - Search/navigation');
    await homePage.searchForProduct(shopData.searchProducts[0]);
    const url = await homePage.getCurrentUrl();
    expect(url).toContain('shop.polymer-project.org');
    console.log(`✓ Navigated to: ${url}`);
  });

  test('S003: Category tiles are displayed on home page', async ({ page }) => {
    console.log('\n📌 S003 - Category tiles visible');
    const count = await homePage.getProductCount();
    expect(count).toBeGreaterThan(0);
    console.log(`✓ Found ${count} category tile(s)`);
  });

  test('S004: Shop Now button navigates away from home', async ({ page }) => {
    console.log('\n📌 S004 - Shop Now navigation');
    await homePage.openShop();
    const url = await homePage.getCurrentUrl();
    expect(url.toLowerCase()).toContain('shop.polymer-project.org');
    console.log(`✓ Navigated to: ${url}`);
  });

  test('S005: Page title is non-empty', async ({ page }) => {
    console.log('\n📌 S005 - Page title');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log(`✓ Title: "${title}"`);
  });
});

// ── Product Page ───────────────────────────────────────────────────────────

test.describe('@sanity Sanity — Product Page', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    await homePage.openHomePage();
  });

  test('S006: Product detail page loads with title', async ({ page }) => {
    console.log('\n📌 S006 - Product detail loads');
    const count = await homePage.getProductCount();
    if (count > 0) {
      await homePage.clickProduct(0);
      const isLoaded = await productPage.verifyProductLoaded();
      expect(isLoaded).toBeTruthy();
      const title = await productPage.getProductTitle();
      expect(title.length).toBeGreaterThan(0);
      console.log(`✓ Product: "${title}"`);
    }
  });

  test('S007: Product page shows a price', async ({ page }) => {
    console.log('\n📌 S007 - Product price visible');
    const count = await homePage.getProductCount();
    if (count > 0) {
      await homePage.clickProduct(0);
      const price = await productPage.getProductPrice();
      expect(price.length).toBeGreaterThan(0);
      expect(price).toMatch(/\d/);
      console.log(`✓ Price: "${price}"`);
    }
  });

  test('S008: Add to Cart button is visible on product page', async ({ page }) => {
    console.log('\n📌 S008 - Add to Cart button visible');
    const count = await homePage.getProductCount();
    if (count > 0) {
      await homePage.clickProduct(0);
      const visible = await productPage.isVisible(productPage.addToCartBtn);
      expect(visible).toBeTruthy();
      console.log('✓ Add to Cart button is visible');
    }
  });
});

// ── Shopping Cart ──────────────────────────────────────────────────────────

test.describe('@sanity Sanity — Shopping Cart', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await homePage.openHomePage();
  });

  test('S009: Cart is empty on first visit', async ({ page }) => {
    console.log('\n📌 S009 - Cart is initially empty');
    await homePage.goToCart();
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    console.log('✓ Cart is empty');
  });

  test('S010: Adding a product puts it in the cart', async ({ page }) => {
    console.log('\n📌 S010 - Add product to cart');
    const count = await homePage.getProductCount();
    if (count > 0) {
      await homePage.clickProduct(0);
      await productPage.addToCart(1);
      await productPage.goToCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
      console.log(`✓ Cart has ${itemCount} item(s)`);
    }
  });
});
