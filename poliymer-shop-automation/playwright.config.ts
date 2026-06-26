/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

const slowMo = process.env.SLOW_MO ? Number(process.env.SLOW_MO) : 0;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-execution-reports/html-report', open: 'never' }],
    ['json', { outputFile: 'test-execution-reports/results.json' }],
    ['junit', { outputFile: 'test-execution-reports/results.xml' }],
  ],
  use: {
    baseURL: 'https://shop.polymer-project.org/',
    headless: process.env.HEADLESS === '1',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          slowMo,
          args: [
            '--disable-notifications',
            '--disable-popup-blocking',
            '--no-first-run',
            '--disable-extensions',
            '--disable-infobars',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
          ],
        },
      },
    },
  ],
});
