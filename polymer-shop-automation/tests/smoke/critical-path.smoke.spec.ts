import { test, expect } from '../fixtures';
import products from '../../test-data/products.json';

/**
 * SMOKE: the absolute minimum set of checks to confirm the app is alive.
 * Run these before anything else — if they fail, nothing else is worth running.
 * Target wall-clock: under 30 seconds total.
 */
test.describe('Critical path @smoke', () => {
  test('TC-SM01 app loads and renders the home page', { tag: '@smoke' }, async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectLoaded();
    await expect(homePage.page).toHaveTitle(/SHOP/i);
    await expect(homePage.page).toHaveURL(/shop\.polymer-project\.org/);
  });

  test('TC-SM02 category navigation is functional', { tag: '@smoke' }, async ({ homePage, categoryPage }) => {
    await homePage.goto();
    await homePage.openCategory('mens_outerwear');
    await categoryPage.expectLoaded();
    expect(await categoryPage.productCount()).toBeGreaterThan(0);
    await expect(categoryPage.page).toHaveURL(/\/list\/mens_outerwear/);
  });

  test('TC-SM03 add-to-cart critical path works', { tag: '@smoke' }, async ({ productPage }) => {
    const p = products.products[0];
    await productPage.goto(p.category, p.name);
    await productPage.expectLoaded();

    const before = await productPage.cartCount();
    expect(before).toBe(0);

    await productPage.addToCart();
    expect(await productPage.cartCount()).toBe(1);
  });
});
