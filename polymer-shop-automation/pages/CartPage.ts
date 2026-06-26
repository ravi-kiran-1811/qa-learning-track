import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** Shopping cart page (/cart). */
export class CartPage extends BasePage {
  readonly heading: Locator;
  readonly lineItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyMessage: Locator;
  readonly removeButtons: Locator;
  readonly subtotalRow: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('shop-cart header');
    this.lineItems = page.locator('shop-cart shop-cart-item');
    this.checkoutButton = page.locator('shop-cart').getByText('Checkout', { exact: true });
    // Rendered as "Your <cart-icon> is empty." so match the stable fragment.
    this.emptyMessage = page.locator('shop-cart').getByText('is empty');
    // The "×" close button inside each cart line item.
    this.removeButtons = page.locator('shop-cart-item paper-icon-button[icon="close"]');
    // Price span inside the checkout box at the bottom of the cart.
    this.subtotalRow = page.locator('shop-cart .checkout-box');
  }

  async goto(): Promise<void> {
    await this.open('/cart');
  }

  async itemCount(): Promise<number> {
    return this.lineItems.count();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyMessage.isVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Remove the nth line item (zero-based). */
  async removeItem(index = 0): Promise<void> {
    await this.removeButtons.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  /** Subtotal text shown at the bottom of the non-empty cart. */
  async subtotalText(): Promise<string> {
    return (await this.subtotalRow.innerText()).trim();
  }

  async expectLoaded(): Promise<void> {
    // The <header> is hidden when the cart is empty, so assert on the host.
    await expect(this.page.locator('shop-cart')).toBeVisible();
  }
}
