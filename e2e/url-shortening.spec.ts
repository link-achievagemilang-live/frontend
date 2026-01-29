import { expect, test } from '@playwright/test';

// Mock API server URL - update based on your setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

test.describe('URL Shortener - Create Short URL Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for CI/CD environments
    await page.route('**/api/v1/urls', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        const shortCode = postData.custom_alias || 'abc123';
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
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
  });

  test('should create a short URL successfully', async ({ page }) => {
    // Fill in the URL
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
    await urlInput.fill('https://www.google.com');

    // Submit the form
    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for the result to appear
    await page.waitForSelector('text=/Short URL created/i', { timeout: 10000 });

    // Check that the short URL is displayed
    const shortUrlElement = page
      .locator('code')
      .filter({ hasText: /http/ })
      .first();
    await expect(shortUrlElement).toBeVisible();

    // Check for copy button
    const copyButton = page.getByRole('button', { name: /Copy/i });
    await expect(copyButton).toBeVisible();
  });

  test('should create a short URL with custom alias', async ({ page }) => {
    const timestamp = Date.now();
    const customAlias = `test${timestamp}`;

    // Fill in the URL
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
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
    await page.waitForSelector('text=/Short URL created/i', { timeout: 10000 });

    // Check that custom alias is in the URL
    const shortUrlElement = page
      .locator('code')
      .filter({ hasText: customAlias });
    await expect(shortUrlElement).toBeVisible();
  });

  test('should copy short URL to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Create a short URL
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/Short URL created/i', { timeout: 10000 });

    // Click copy button
    const copyButton = page.getByRole('button', { name: /Copy/i }).first();
    await copyButton.click();

    // Check for success message
    await expect(page.getByText(/Copied/i)).toBeVisible({ timeout: 3000 });
  });

  test('should toggle QR code display', async ({ page }) => {
    // Create a short URL
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/Short URL created/i', { timeout: 10000 });

    // Click QR code toggle
    const qrToggle = page.getByRole('button', { name: /QR Code/i });
    await qrToggle.click();

    // Check that QR code canvas is visible
    const qrCode = page.locator('canvas');
    await expect(qrCode).toBeVisible();

    // Toggle again to hide
    await qrToggle.click();
    await expect(qrCode).not.toBeVisible();
  });

  test('should navigate to analytics page', async ({ page }) => {
    // Mock analytics API as well
    await page.route('**/api/v1/analytics/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'abc123',
          short_url: `${BASE_URL}/abc123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          clicks: 42,
        }),
      });
    });

    // Create a short URL
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Wait for result
    await page.waitForSelector('text=/Short URL created/i', { timeout: 10000 });

    // Click analytics link
    const analyticsLink = page.getByRole('link', { name: /View Analytics/i });
    await analyticsLink.click();

    // Check that we're on the analytics page
    await expect(page).toHaveURL(/\/analytics\//);
    await expect(page.getByText(/Analytics/i)).toBeVisible();
  });
});
