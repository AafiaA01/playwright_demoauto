import type { Page, TestInfo } from '@playwright/test';

/**
 * Run a logical test step and always capture a screenshot after it completes.
 * Screenshots are stored under the test's own output folder for easy reporting.
 */
export async function stepWithScreenshot(
  page: Page,
  testInfo: TestInfo,
  stepName: string,
  action: () => Promise<void>
): Promise<void> {
  await action();

  const safeTitle = testInfo.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  const safeStep = stepName.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  const fileName = `${safeTitle}_${safeStep}_${Date.now()}.png`;

  const screenshotPath = testInfo.outputPath(`screenshots/${fileName}`);

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  await testInfo.attach(stepName, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}

