import { expect, test } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

test.describe('Smoke Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/URL Shortener|link.achievagemilang.live/i);
    
    // Check for main heading
    const heading = page.locator('h1').filter({ hasText: /Shorten URLs/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should have working form with mocked API', async ({ page }) => {
    // Mock API response
    await page.route('**/api/v1/urls', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            short_code: 'test123',
            short_url: `${BASE_URL}/test123`,
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
    
    // Fill the form - use ID to be more specific
    const urlInput = page.locator('#longUrl');
    await urlInput.waitFor({ state: 'visible', timeout: 10000 });
    await urlInput.fill('https://www.example.com');
    
    // Submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for result and check
    await page.waitForTimeout(2000);
    
    // Check for short URL in the result component
    const resultElement = await page.locator('text=Short URL created').isVisible().catch(() => false);
    if (resultElement) {
      // If result component is visible, check for test123
      await expect(page.locator('text=/test123/')).toBeVisible({ timeout: 5000 });
    } else {
      // Fallback: check page content
      const pageContent = await page.content();
      expect(pageContent).toContain('test123');
    }
  });

  test('should navigate to analytics page with mocked data', async ({ page }) => {
    // Mock analytics API
    await page.route('**/api/v1/analytics/test123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          short_code: 'test123',
          short_url: `${BASE_URL}/test123`,
          long_url: 'https://www.example.com',
          created_at: new Date().toISOString(),
          clicks: 42,
        }),
      });
    });

    await page.goto('/analytics/test123');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit for React to hydrate
    await page.waitForTimeout(1000);
    
    // Check that we're on the analytics page
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toMatch(/analytic|click|visit/i);
  });
});

