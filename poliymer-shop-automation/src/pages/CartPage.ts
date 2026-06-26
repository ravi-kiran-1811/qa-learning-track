/**
 * Cart Page Object Model
 * Shopping cart page (/cart).
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Polymer Shop uses <shop-cart-item> custom elements for line items.
  readonly cartItems = 'shop-cart-item';
  readonly emptyCartMsg = 'shop-cart';        // checked via .getByText below
  readonly removeBtn = 'paper-icon-button[icon="close"]';
  readonly checkoutBtn = 'shop-cart >> text=Checkout';
  readonly subtotal = 'shop-cart .checkout-box';
  readonly continueShoppingBtn = 'a[href="/"]';

  constructor(page: Page) {
    super(page);
  }

  /** Number of line items currently in the cart. */
  async getCartItemCount(): Promise<number> {
    try {
      const items = await this.getAllElements(this.cartItems);
      console.log(`✓ Cart contains ${items.length} item(s)`);
      return items.length;
    } catch (error) {
      await this.handleError(`Failed to get cart item count: ${error}`);
      return 0;
    }
  }

  /** True when the cart has zero line items. */
  async isCartEmpty(): Promise<boolean> {
    try {
      // Wait for the cart shadow-DOM host to be ready.
      await this.page.locator('shop-cart').waitFor({ state: 'visible', timeout: 10000 });
      const itemCount = await this.page.locator(this.cartItems).count();
      const empty = itemCount === 0;
      console.log(`✓ Cart empty: ${empty}`);
      return empty;
    } catch {
      return false;
    }
  }

  /** Remove the line item at the given zero-based index. */
  async removeItemAtIndex(index: number): Promise<void> {
    try {
      const items = await this.getAllElements(this.cartItems);
      if (index < items.length) {
        const removeButton = items[index].locator(this.removeBtn);
        await removeButton.click();
        await this.page.waitForTimeout(800);
        console.log(`✓ Removed item at index ${index}`);
      } else {
        await this.handleError(`Item index ${index} out of range (${items.length} items)`);
      }
    } catch (error) {
      await this.handleError(`Failed to remove item: ${error}`);
    }
  }

  /** Get the total/subtotal price string shown in the checkout box. */
  async getTotalPrice(): Promise<string> {
    try {
      const text = await this.getText(this.subtotal);
      console.log(`✓ Cart total: ${text}`);
      return text;
    } catch (error) {
      await this.handleError(`Failed to get total price: ${error}`);
      return '';
    }
  }

  /** Click the Checkout button. */
  async proceedToCheckout(): Promise<void> {
    try {
      console.log('💳 Proceeding to checkout…');
      await this.page.locator('shop-cart').getByText('Checkout', { exact: true }).click();
      await this.page.waitForLoadState('networkidle');
      console.log('✓ On checkout page');
    } catch (error) {
      await this.handleError(`Failed to proceed to checkout: ${error}`);
    }
  }

  /** Get the subtotal text (same as getTotalPrice). */
  async getSubtotal(): Promise<string> {
    return this.getTotalPrice();
  }
}
