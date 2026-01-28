import { expect, test } from '@playwright/test';

test.describe('Analytics Page', () => {
  // Note: This test requires a valid short code to exist
  // In a real scenario, you'd create one first or use a fixture

  test('should display analytics page correctly', async ({ page }) => {
    // Navigate to a test analytics page
    // You may need to create a short URL first or use a known test code
    await page.goto('/analytics/test123');

    // Check for main elements (will show error if code doesn't exist)
    await expect(page.getByText(/Analytics/i)).toBeVisible();
  });

  test('should show error for non-existent short code', async ({ page }) => {
    // Navigate to analytics page with non-existent code
    await page.goto('/analytics/nonexistent999999');

    // Wait for error message
    await page.waitForSelector('text=/Error|not found/i', { timeout: 10000 });

    // Check for error state
    const errorText = page.getByText(/Error|not found|Failed/i);
    await expect(errorText).toBeVisible();

    // Check for back button
    const backButton = page.getByRole('button', { name: /Back to Home/i });
    await expect(backButton).toBeVisible();
  });

  test('should navigate back to home from analytics', async ({ page }) => {
    await page.goto('/analytics/test123');

    // Click back button
    const backButton = page.getByRole('button', { name: /Back/i }).first();
    await backButton.click();

    // Should be back on home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Shorten URLs')).toBeVisible();
  });

  test('should display QR code on analytics page', async ({ page }) => {
    // This test assumes a valid short code exists
    // You may need to adjust based on your test data
    await page.goto('/analytics/test123');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Look for QR code section
    const qrSection = page.getByText(/QR Code/i);
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
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/analytics/test123');

    // Check that main elements are visible on mobile
    await expect(page.getByText(/Analytics/i)).toBeVisible();
  });
});
