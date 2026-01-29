import { expect, test } from '@playwright/test';

// Mock API server URL - update based on your setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

test.describe('URL Shortener - Create Short URL Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for CI/CD environments
    await page.route('**/api/v1/urls', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
        return;
      }

      if (request.method() === 'POST') {
        const postData = request.postDataJSON();
        const shortCode = postData.custom_alias || 'abc123';

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            short_code: shortCode,
            short_url: `${BASE_URL}/${shortCode}`,
            long_url: postData.long_url,
            created_at: new Date().toISOString(),
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  });

  test.fixme('should create a short URL successfully', async ({ page }) => {
    // Fill in the URL using ID selector (more reliable)
    const urlInput = page.locator('#longUrl');
    await urlInput.waitFor({ state: 'visible' });
    await urlInput.fill('https://www.google.com');

    // Submit the form
    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for the result to appear
    await page.waitForSelector('text=/URL Shortened Successfully/i', {
      timeout: 10000,
    });

    // Check that the short URL is displayed
    const shortUrl = `${BASE_URL}/abc123`;
    const shortUrlElement = page.getByText(shortUrl);
    await expect(shortUrlElement).toBeVisible();

    // Check for copy button
    const copyButton = page.getByRole('button', { name: /Copy/i });
    await expect(copyButton).toBeVisible();
  });

  test.fixme('should create a short URL with custom alias', async ({
    page,
  }) => {
    const timestamp = Date.now();
    const customAlias = `test${timestamp}`;

    // Fill in the URL
    const urlInput = page.locator('#longUrl');
    await urlInput.fill('https://www.github.com');

    // Click on advanced options to reveal custom alias field
    const advancedButton = page.getByText(/Advanced Options/i);
    if (await advancedButton.isVisible()) {
      await advancedButton.click();
    }

    // Fill in custom alias
    const aliasInput = page.getByPlaceholder(/Custom alias/i);
    if (await aliasInput.isVisible()) {
      await aliasInput.fill(customAlias);
    }

    // Submit the form
    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/URL Shortened Successfully/i', {
      timeout: 10000,
    });

    // Check that custom alias is in the URL
    const shortUrlElement = page
      .locator('.font-mono')
      .filter({ hasText: customAlias });
    await expect(shortUrlElement).toBeVisible();
  });

  test.fixme('should copy short URL to clipboard', async ({ page }) => {
    // Mock clipboard API to avoid permission issues and ensuring success state
    await page.evaluate(() => {
      // @ts-ignore
      const mockClipboard = {
        writeText: async () => Promise.resolve(),
      };

      try {
        if (navigator.clipboard) {
          Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            configurable: true,
            writable: true,
          });
        } else {
          // @ts-ignore
          navigator.clipboard = mockClipboard;
        }
      } catch (e) {
        // If defineProperty fails (unlikely in test env but possible), we might be stuck
      }
    });

    // Create a short URL
    const urlInput = page.locator('#longUrl');
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/URL Shortened Successfully/i', {
      timeout: 10000,
    });

    // Click copy button
    const copyButton = page.getByRole('button', { name: /Copy/i }).first();
    await copyButton.click();

    // Check for success state (Check icon)
    // The button content changes to a Check icon
    await expect(page.locator('.lucide-check')).toBeVisible({ timeout: 5000 });
  });

  test('should toggle QR code display', async ({ page }) => {
    // Create a short URL
    const urlInput = page.locator('#longUrl');
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/URL Shortened Successfully/i', {
      timeout: 10000,
    });

    // Click QR code toggle
    const qrToggle = page.getByRole('button', { name: /Show QR Code/i });
    await expect(qrToggle).toBeVisible();
    await qrToggle.click();

    // Wait for button text to change to ensure state updated
    await expect(
      page.getByRole('button', { name: /Hide QR Code/i }),
    ).toBeVisible();

    // Check that QR code SVG is visible
    const qrCode = page.locator('#qr-code');
    await expect(qrCode).toBeVisible({ timeout: 5000 });

    // Toggle again to hide
    await page.getByRole('button', { name: /Hide QR Code/i }).click();
    await expect(qrCode).not.toBeVisible();
  });

  test('should navigate to analytics page', async ({ page }) => {
    // Mock analytics API as well
    // Mock analytics API as well
    await page.route('**/api/v1/analytics/**', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          short_code: 'abc123',
          short_url: `${BASE_URL}/abc123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          click_count: 42,
        }),
      });
    });

    // Create a short URL
    const urlInput = page.locator('#longUrl');
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/URL Shortened Successfully/i', {
      timeout: 10000,
    });

    // Click analytics link
    const analyticsLink = page.getByRole('link', { name: /View Analytics/i });
    await analyticsLink.click();

    // Check that we're on the analytics page
    await expect(page).toHaveURL(/\/analytics\//);
    await expect(page.getByText(/Analytics/i)).toBeVisible();
  });
});
