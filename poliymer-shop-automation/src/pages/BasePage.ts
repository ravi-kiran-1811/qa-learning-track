/**
 * Base Page Object - Common methods and properties for all pages
 *
 * The Shop app is a Polymer PWA: almost every element lives inside an open
 * shadow root. Playwright's CSS engine pierces open shadow DOM automatically,
 * so selectors like `shop-detail h1` cross the shadow boundary for us.
 */

import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('a[href="/cart"] paper-icon-button');
  }

  /** Open a path relative to baseURL and wait for the SPA to settle. */
  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /** Number of items in the cart badge. */
  async cartCount(): Promise<number> {
    const icon = this.cartLink.first();
    const text = (await icon.getAttribute('aria-label')) ?? '';
    const match = text.match(/(\d+)\s*item/);
    return match ? Number(match[1]) : 0;
  }

  /** Navigate to the cart page. */
  async goToCart(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.cartLink.first().scrollIntoViewIfNeeded();
    await this.cartLink.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Page document title. */
  async title(): Promise<string> {
    return this.page.title();
  }

  /** Current URL string. */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /** Save a screenshot to the reports folder. */
  async screenshot(filename: string): Promise<void> {
    const path = `test-execution-reports/screenshots/${filename}.png`;
    await this.page.screenshot({ path });
  }

  // ── Utility helpers used by child page objects ──────────────────────────

  /** Get the inner text of the first matching element. */
  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).first().innerText()).trim();
  }

  /** Click the first matching element. */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).first().click();
  }

  /** Fill the first matching input/textarea with the given value. */
  async fillText(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).first().fill(value);
  }

  /** Return true when the first matching element becomes visible within timeout. */
  async isVisible(selector: string, timeout = 8000): Promise<boolean> {
    try {
      await this.page.locator(selector).first().waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /** Log an error message without throwing. */
  async handleError(message: string): Promise<void> {
    console.error(`✗ ${message}`);
  }

  /**
   * Return the first matching Locator, or null when no element is found.
   * Used to guard optional interactions (e.g. quantity input).
   */
  async getElement(selector: string): Promise<Locator | null> {
    const count = await this.page.locator(selector).count();
    return count > 0 ? this.page.locator(selector).first() : null;
  }

  /**
   * Return all matching elements as an array of Locators.
   * Each Locator can be chained with .locator() for child lookups.
   */
  async getAllElements(selector: string): Promise<Locator[]> {
    const loc = this.page.locator(selector);
    const count = await loc.count();
    return Array.from({ length: count }, (_, i) => loc.nth(i));
  }

  /** Assert a locator is visible. */
  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
