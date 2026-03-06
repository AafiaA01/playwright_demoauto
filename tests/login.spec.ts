import { test } from '@playwright/test';
import { LoginPage } from '../Pages/login';
import { loginData } from '../utils/testData';
import { stepWithScreenshot } from '../utils/screenshotUtil';

// updated login test scenarios

test.describe('Hotel Adactin - Login', () => {
  test('login using raw page actions (UI smoke)', async ({ page }, testInfo) => {
    const { username, password } = loginData.validUser;

    await stepWithScreenshot(page, testInfo, 'navigate to login page', async () => {
      await page.goto('https://adactinhotelapp.com/');
    });

    await stepWithScreenshot(page, testInfo, 'fill username', async () => {
      await page.locator('#username').fill(username);
    });

    await stepWithScreenshot(page, testInfo, 'fill password', async () => {
      await page.locator('#password').fill(password);
    });

    await stepWithScreenshot(page, testInfo, 'click login button', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });
  });

  test(
    'login using LoginPage POM with data-driven credentials',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const { username, password } = loginData.validUser;

      await stepWithScreenshot(
        page,
        testInfo,
        'navigate to login page using POM',
        async () => {
          await loginPage.goto();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'perform login using POM',
        async () => {
          await loginPage.login(username, password);
        }
      );
    }
  );
});