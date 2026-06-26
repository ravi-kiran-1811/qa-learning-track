import { Page, expect } from '@playwright/test';

export class Logger {
  static step(msg: string) { console.log(`\n📌 ${msg}`); }
  static pass(msg: string) { console.log(`✓ ${msg}`); }
  static fail(msg: string) { console.log(`✗ ${msg}`); }
  static info(msg: string) { console.log(`ℹ ${msg}`); }
}

export class DataValidator {
  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  static isValidPhone(phone: string): boolean {
    return /^[\d\-+\s]{10,}$/.test(phone);
  }
  static extractPrice(priceStr: string): number {
    const m = priceStr.match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  }
}

export class BrowserHelper {
  static async takeScreenshot(page: Page, filename: string): Promise<void> {
    await page.screenshot({ path: `test-execution-reports/screenshots/${filename}.png` });
    Logger.pass(`Screenshot saved: ${filename}`);
  }
}
