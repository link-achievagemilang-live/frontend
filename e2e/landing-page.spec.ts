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
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
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

    // Should show validation error
    await expect(page.getByText(/Please enter a valid URL/i)).toBeVisible();
  });

  test('should validate invalid URL format', async ({ page }) => {
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
    await urlInput.fill('not-a-valid-url');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });
    await submitButton.click();

    // Should show validation error
    await expect(page.getByText(/Please enter a valid URL/i)).toBeVisible();
  });

  test('should show loading state when submitting', async ({ page }) => {
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
    await urlInput.fill('https://www.example.com');

    const submitButton = page.getByRole('button', { name: /Shorten URL/i });

    // Click and check for loading state
    await submitButton.click();

    // Button should show loading state (disabled or loading text)
    await expect(submitButton).toBeDisabled();
  });
});

test.describe('URL Shortener - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that main elements are visible on mobile
    await expect(page.getByText('Shorten URLs')).toBeVisible();
    const urlInput = page.getByPlaceholder(/Enter your long URL/i);
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
