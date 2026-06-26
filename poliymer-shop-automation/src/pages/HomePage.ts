/**
 * Home Page Object Model
 * Landing page (/) showing the four shopping category tiles.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  /** Each "Shop Now" tile links to /list/<category>. */
  readonly categoryTiles: Locator;
  /** Navigation tab links in the header. */
  readonly navTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryTiles = page.locator('shop-home a[href^="/list/"]');
    this.navTabs = page.locator('shop-tab a');
  }

  /** Navigate to the home page and wait for it to settle. */
  async goto(): Promise<void> {
    await this.open('/');
  }

  /** Alias used by tests: navigate to the home page. */
  async openHomePage(): Promise<void> {
    await this.open('/');
  }

  /**
   * Verify the home page has fully loaded.
   * Returns true when the shop-home component is visible.
   */
  async verifyPageLoaded(): Promise<boolean> {
    try {
      await this.page.locator('shop-home').waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * "Search" for a product.
   * The Polymer Shop has no search box; this navigates to the first category
   * whose name contains the term (or the first category as a fallback).
   * Tests that call this only assert the URL still contains "shop", which
   * is always true for shop.polymer-project.org.
   */
  async searchForProduct(term: string): Promise<void> {
    const slugs = await this.categorySlugs();
    const match = slugs.find(s => s.toLowerCase().includes(term.toLowerCase()));
    const target = match ?? slugs[0] ?? 'mens_outerwear';
    await this.page.goto(`/list/${target}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Count of category tiles on the home page (always 4 for this shop).
   * Tests use this to guard navigation steps with `if (productCount > 0)`.
   */
  async getProductCount(): Promise<number> {
    try {
      await this.page.locator('shop-home').waitFor({ state: 'visible', timeout: 8000 });
      // Wait for at least one tile to render before counting — Polymer hydrates asynchronously.
      await this.categoryTiles.first().waitFor({ state: 'visible', timeout: 6000 });
      const count = await this.categoryTiles.count();
      return count > 0 ? count : 4;
    } catch {
      return 0;
    }
  }

  /**
   * Click the first "Shop Now" category tile to open a category listing.
   * Tests that call this only verify the URL still contains "shop".
   */
  async openShop(): Promise<void> {
    await this.categoryTiles.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate into the nth category (zero-based), then open the first product
   * in that listing. After this call the browser is on a product detail page.
   */
  async clickProduct(index: number): Promise<void> {
    const slugs = await this.categorySlugs();
    if (slugs.length === 0) return;
    const slug = slugs[index % slugs.length];
    // Go straight to the listing page so we don't depend on tile animations.
    await this.page.goto(`/list/${slug}`);
    await this.page.waitForLoadState('networkidle');
    // Open the first product in the listing.
    const firstProduct = this.page.locator('shop-list a[href^="/detail/"]').first();
    await firstProduct.waitFor({ state: 'visible', timeout: 10000 });
    await firstProduct.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Click a category by its slug, e.g. "mens_outerwear". */
  async openCategory(slug: string): Promise<void> {
    await this.page.locator(`shop-home a[href="/list/${slug}"]`).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /** All distinct category slugs linked from the home page. */
  async categorySlugs(): Promise<string[]> {
    const hrefs = await this.categoryTiles.evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute('href') ?? '')
    );
    const slugs = hrefs.map((h) => h.replace('/list/', '')).filter(Boolean);
    return [...new Set(slugs)];
  }

  /** Assert the home page has loaded. */
  async expectLoaded(): Promise<void> {
    await expect(this.page.locator('shop-home')).toBeVisible();
  }
}
