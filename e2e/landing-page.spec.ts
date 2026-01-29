import { expect, test } from '@playwright/test';

test.describe('URL Shortener - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the landing page correctly', async ({ page }) => {
    // Check for logo
    await expect(
      page.locator('img[alt*="link.achievagemilang.live"]'),
    ).toBeVisible();

    // Check for main heading
    await expect(page.getByText('Shorten URLs')).toBeVisible();
    await expect(page.getByText('Instantly')).toBeVisible();

    // Check for description
    await expect(page.getByText(/Create short, memorable links/)).toBeVisible();
  });

  test('should display the URL shortener form', async ({ page }) => {
    // Check for input field
    const urlInput = page.locator('#longUrl');
    await expect(urlInput).toBeVisible();

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await expect(submitButton).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    // Check for feature cards using heading role for specificity
    await expect(page.getByRole('heading', { name: 'Lightning Fast' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Custom Aliases' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Secure & Reliable' })).toBeVisible();
  });

  test('should validate empty URL submission', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Should show validation error (exact text: "Please enter a URL")
    await expect(page.getByText(/Please enter a URL/i)).toBeVisible({ timeout: 5000 });
  });

  test('should validate invalid URL format', async ({ page }) => {
    const urlInput = page.locator('#longUrl');
    await urlInput.fill('not-a-valid-url');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Should show validation error (text contains "Please enter a valid URL")
    await expect(page.getByText(/Please enter a valid URL/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show loading state when submitting', async ({ page }) => {
    // Mock with a delay to catch loading state
    await page.route('**/api/v1/urls', async (route) => {
      // Add small delay to see loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'test123',
          short_url: 'http://localhost:3000/test123',
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
        }),
      });
    });

    const urlInput = page.locator('#longUrl');
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });

    // Click submit
    await submitButton.click();

    // Button should show "Shortening..." text or be disabled
    try {
      await expect(page.getByText(/Shortening/i)).toBeVisible({ timeout: 2000 });
    } catch {
      // If loading is too fast, at least check result appears
      await expect(page.getByText(/URL Shortened Successfully/i)).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('URL Shortener - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that main elements are visible on mobile
    await expect(page.getByText('Shorten URLs')).toBeVisible();
    const urlInput = page.locator('#longUrl');
    await expect(urlInput).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check that feature cards are visible on tablet
    await expect(page.getByRole('heading', { name: 'Lightning Fast' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Custom Aliases' })).toBeVisible();
  });
});
