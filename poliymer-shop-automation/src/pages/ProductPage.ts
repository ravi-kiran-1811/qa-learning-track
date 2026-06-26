/**
 * Product Page Object Model
 * Detail page (/detail/<category>/<name>) for a single product.
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Selectors — ordered most-specific-first so Playwright resolves quickly.
  readonly productTitle = 'shop-detail h1, h1[class*="name"], h2[class*="name"]';
  readonly productPrice = 'shop-detail .price, span[class*="price"], .price';
  readonly productDescription = 'shop-detail .description, div[class*="description"], p[class*="desc"]';
  readonly addToCartBtn = 'text=Add to Cart';
  readonly sizeSelector = 'shop-detail #sizeSelect, select[id*="size"]';
  readonly quantityInput = 'shop-detail #quantitySelect, select[id*="quantity"], input[type="number"]';
  readonly productImage = 'shop-detail img, shop-image img, img[class*="product"]';
  readonly errorMessage = '.error, [role="alert"]';
  readonly successMessage = '.success, [role="status"]';
  readonly backButton = 'a.back-btn, a[aria-label*="back"], a[href*="list"]';

  constructor(page: Page) {
    super(page);
  }

  /** Get the product title text. */
  async getProductTitle(): Promise<string> {
    try {
      return await this.getText(this.productTitle);
    } catch (error) {
      await this.handleError(`Failed to get product title: ${error}`);
      return '';
    }
  }

  /** Get the product price text. */
  async getProductPrice(): Promise<string> {
    try {
      return await this.getText(this.productPrice);
    } catch (error) {
      await this.handleError(`Failed to get product price: ${error}`);
      return '';
    }
  }

  /** Get the product description text. */
  async getProductDescription(): Promise<string> {
    try {
      return await this.getText(this.productDescription);
    } catch (error) {
      await this.handleError(`Failed to get product description: ${error}`);
      return '';
    }
  }

  /**
   * Add the product to the cart.
   * Optionally selects a size and sets a quantity before clicking Add to Cart.
   */
  async addToCart(quantity: number = 1): Promise<void> {
    try {
      if (quantity > 1) {
        const qtyEl = await this.getElement(this.quantityInput);
        if (qtyEl) await qtyEl.selectOption(String(quantity));
      }
      await this.page.locator('shop-detail').getByText('Add to Cart').first().click();
      await this.page.waitForTimeout(800);
      console.log(`✓ Added ${quantity} item(s) to cart`);
    } catch (error) {
      await this.handleError(`Failed to add to cart: ${error}`);
    }
  }

  /** Return true when the product title and price are both visible. */
  async verifyProductLoaded(): Promise<boolean> {
    try {
      // Wait for the shadow-DOM host to mount before checking children.
      await this.page.locator('shop-detail').waitFor({ state: 'visible', timeout: 15000 });
      // getText() uses innerText() which auto-waits — reliable across shadow DOM.
      const title = await this.getProductTitle();
      const price = await this.getProductPrice();
      const loaded = title.length > 0 && price.length > 0;
      console.log(`✓ Product page loaded: ${loaded}`);
      return loaded;
    } catch (error) {
      await this.handleError(`Failed to verify product page: ${error}`);
      return false;
    }
  }

  /** Return true when title and price are both non-empty. */
  async verifyProductDetails(): Promise<boolean> {
    try {
      const title = await this.getProductTitle();
      const price = await this.getProductPrice();
      const allVisible = title.length > 0 && price.length > 0;
      console.log(`✓ Product details verified: ${allVisible}`);
      return allVisible;
    } catch (error) {
      await this.handleError(`Failed to verify product details: ${error}`);
      return false;
    }
  }

  /** Return any visible error message text, or empty string. */
  async getErrorMessage(): Promise<string> {
    try {
      if (await this.isVisible(this.errorMessage)) {
        return await this.getText(this.errorMessage);
      }
      return '';
    } catch {
      return '';
    }
  }

  /** Return any visible success message text, or empty string. */
  async getSuccessMessage(): Promise<string> {
    try {
      if (await this.isVisible(this.successMessage)) {
        return await this.getText(this.successMessage);
      }
      return '';
    } catch {
      return '';
    }
  }

  /** Navigate back to the previous listing page. */
  async goBack(): Promise<void> {
    try {
      await this.page.goBack();
      await this.page.waitForLoadState('networkidle');
      console.log('✓ Navigated back');
    } catch (error) {
      await this.handleError(`Failed to go back: ${error}`);
    }
  }
}
