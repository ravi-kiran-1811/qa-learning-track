import { test, expect } from '../fixtures';
import products from '../../test-data/products.json';

/**
 * REGRESSION: checkout form validation. Submitting an empty form must NOT
 * complete the order - the app should keep the user on /checkout.
 */
test.describe('Checkout validation @regression', () => {
  test.beforeEach(async ({ productPage }) => {
    // Checkout requires a non-empty cart, so seed one item first.
    const p = products.products[0];
    await productPage.goto(p.category, p.name);
    await productPage.addToCart();
  });

  test('submitting an empty form does not place the order', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await checkoutPage.expectLoaded();
    await checkoutPage.placeOrder();
    // Required-field validation blocks navigation to the success route.
    await expect(checkoutPage.page).not.toHaveURL(/\/checkout\/success/);
    await expect(checkoutPage.accountEmail).toBeVisible();
  });

  test('TC-R11 checkout form renders all required input fields', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await checkoutPage.expectLoaded();
    // Account section
    await expect(checkoutPage.accountEmail).toBeVisible();
    await expect(checkoutPage.accountPhone).toBeVisible();
    // Shipping section
    await expect(checkoutPage.shipAddress).toBeVisible();
    await expect(checkoutPage.shipCity).toBeVisible();
    await expect(checkoutPage.shipState).toBeVisible();
    await expect(checkoutPage.shipZip).toBeVisible();
    await expect(checkoutPage.shipCountry).toBeVisible();
    // Payment section
    await expect(checkoutPage.ccName).toBeVisible();
    await expect(checkoutPage.ccNumber).toBeVisible();
    await expect(checkoutPage.ccExpMonth).toBeVisible();
    await expect(checkoutPage.ccExpYear).toBeVisible();
    await expect(checkoutPage.ccCVV).toBeVisible();
    await expect(checkoutPage.placeOrderButton).toBeVisible();
  });
});
