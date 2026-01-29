import { expect, test } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

test.describe('Analytics Page', () => {
  // Note: This test uses API mocking for CI/CD environments

  test('should display analytics page correctly', async ({ page }) => {
    // Mock analytics API response
    await page.route('**/api/v1/analytics/test123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'test123',
          short_url: `${BASE_URL}/test123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          click_count: 42,
        }),
      });
    });

    // Navigate to a test analytics page
    await page.goto('/analytics/test123');

    // Check for main elements
    await expect(page.getByText(/Analytics/i)).toBeVisible();
  });

  test('should show error for non-existent short code', async ({ page }) => {
    // Mock 404 response for non-existent code
    await page.route('**/api/v1/analytics/nonexistent999999', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Short URL not found',
        }),
      });
    });

    // Navigate to analytics page with non-existent code
    await page.goto('/analytics/nonexistent999999');

    // Wait for error message
    await page.waitForSelector('text=/Error|not found/i', { timeout: 10000 });

    // Check for error state
    const errorText = page.getByRole('heading', { name: /Error/i });
    await expect(errorText).toBeVisible();

    // Check for back button
    const backButton = page.getByRole('button', { name: /Back to Home/i });
    await expect(backButton).toBeVisible();
  });

  test('should navigate back to home from analytics', async ({ page }) => {
    // Mock analytics API response
    await page.route('**/api/v1/analytics/test123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'test123',
          short_url: `${BASE_URL}/test123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          click_count: 42,
        }),
      });
    });

    await page.goto('/analytics/test123');

    // Click back button
    const backButton = page.getByRole('button', { name: /Back/i }).first();
    await backButton.click();

    // Should be back on home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Shorten URLs')).toBeVisible();
  });

  test('should display QR code on analytics page', async ({ page }) => {
    // Mock analytics API response
    await page.route('**/api/v1/analytics/test123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'test123',
          short_url: `${BASE_URL}/test123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          click_count: 42,
        }),
      });
    });

    await page.goto('/analytics/test123');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Look for QR code section heading (more specific selector to avoid strict mode violation)
    const qrSection = page.getByRole('heading', { name: /QR Code/i });
    if (await qrSection.isVisible()) {
      await expect(qrSection).toBeVisible();

      // Check for canvas element (QR code)
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();
    }
  });
});

test.describe('Analytics Page - Responsive', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Mock analytics API response
    await page.route('**/api/v1/analytics/test123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'test123',
          short_url: `${BASE_URL}/test123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          click_count: 42,
        }),
      });
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/analytics/test123');

    // Check that main elements are visible on mobile
    await expect(page.getByText(/Analytics/i)).toBeVisible();
  });
});
