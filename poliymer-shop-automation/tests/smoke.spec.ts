/**
 * Smoke Tests — absolute minimum checks to confirm the app is alive.
 * Run these first. If any fail, skip everything else.
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';

test.describe('@smoke Smoke Tests', () => {
  test('SM001: Application is accessible and home page loads', async ({ page }) => {
    console.log('\n📌 TEST: SM001 - Application accessible');
    const homePage = new HomePage(page);
    await homePage.openHomePage();

    const isLoaded = await homePage.verifyPageLoaded();
    expect(isLoaded).toBeTruthy();

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log(`✓ Home page loaded — title: "${title}"`);
  });

  test('SM002: Can navigate to a category listing', async ({ page }) => {
    console.log('\n📌 TEST: SM002 - Category navigation');
    const homePage = new HomePage(page);
    await homePage.openHomePage();

    await homePage.openShop();
    const url = await homePage.getCurrentUrl();
    expect(url.toLowerCase()).toContain('shop.polymer-project.org');
    console.log(`✓ Navigated to: ${url}`);
  });

  test('SM003: Add to cart critical path works', async ({ page }) => {
    console.log('\n📌 TEST: SM003 - Add to cart');
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.openHomePage();
    await homePage.clickProduct(0);

    const productLoaded = await productPage.verifyProductLoaded();
    expect(productLoaded).toBeTruthy();

    await productPage.addToCart(1);
    await productPage.goToCart();

    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
    console.log(`✓ Cart has ${count} item(s)`);
  });

  test('SM004: Cart page is directly accessible', async ({ page }) => {
    console.log('\n📌 TEST: SM004 - Cart page accessible');
    const cartPage = new CartPage(page);
    await page.goto('https://shop.polymer-project.org/cart');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toContain('shop.polymer-project.org');
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    console.log('✓ Cart page is accessible and empty on fresh visit');
  });

  test('SM005: Checkout page is reachable via checkout URL', async ({ page }) => {
    console.log('\n📌 TEST: SM005 - Checkout page accessible');
    await page.goto('https://shop.polymer-project.org/checkout');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toContain('shop.polymer-project.org');
    console.log(`✓ Checkout URL accessible: ${url}`);
  });
});
