import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login';
import { searchData, loginData } from '../utils/testData';
import { stepWithScreenshot } from '../utils/screenshotUtil';

test.describe('Hotel Adactin - Search Hotel', () => {
  test(
    'user can search hotel with valid data (data-driven)',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const { username, password } = loginData.validUser;
      const data = searchData.validSearch;

      await stepWithScreenshot(
        page,
        testInfo,
        'login before searching hotel',
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'fill search form with valid data',
        async () => {
          const locationSelect = page.locator('#location');
          await expect(locationSelect).toBeVisible();

          await locationSelect.selectOption({ label: data.locationLabel });
          await page
            .locator('#hotels')
            .selectOption({ label: data.hotelLabel });
          await page
            .locator('#room_type')
            .selectOption({ label: data.roomTypeLabel });
        }
      );

      await stepWithScreenshot(page, testInfo, 'submit valid search', async () => {
        await page.getByRole('button', { name: /Search/i }).click();
      });

      await stepWithScreenshot(
        page,
        testInfo,
        'verify select hotel page displayed',
        async () => {
          await expect(page).toHaveURL(/SelectHotel\.php/);
          await expect(page.locator('#radiobutton_0')).toBeVisible();
        }
      );
    }
  );

  test(
    'should display error when searching without selecting location',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const { username, password } = loginData.validUser;

      await stepWithScreenshot(
        page,
        testInfo,
        'login before negative location test',
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'submit search without selecting location',
        async () => {
          await expect(page.locator('#location')).toBeVisible();

          await page.locator('#Submit').click();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'verify location error message',
        async () => {
          await expect(
            page.getByText(/Please Select a Location/i)
          ).toBeVisible();
        }
      );
    }
  );

  test(
    'should display error for checkout date before checkin date (data-driven)',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const { username, password } = loginData.validUser;
      const invalidDates = searchData.invalidDateSearch;

      await stepWithScreenshot(
        page,
        testInfo,
        'login before invalid date test',
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'fill search form with invalid dates',
        async () => {
          await expect(page.locator('#location')).toBeVisible();

          await page
            .locator('#location')
            .selectOption({ label: invalidDates.locationLabel });

          await page.fill('#datepick_in', invalidDates.checkIn);
          await page.fill('#datepick_out', invalidDates.checkOut);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'submit search with invalid dates',
        async () => {
          await page.locator('#Submit').click();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'verify invalid date error message',
        async () => {
          await expect(
            page.getByText(
              /Check-Out Date shall be after than Check-In Date/i
            )
          ).toBeVisible();
        }
      );
    }
  );

  test.skip(
    'should display error when searching without selecting hotel',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const { username, password } = loginData.validUser;
      const { locationLabel } = searchData.validSearch;

      await stepWithScreenshot(
        page,
        testInfo,
        'login before hotel selection negative test',
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'fill only location and submit search',
        async () => {
          await expect(page.locator('#location')).toBeVisible();

          await page
            .locator('#location')
            .selectOption({ label: locationLabel });

          await page.locator('#Submit').click();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'verify hotel selection error message',
        async () => {
          await expect(
            page.getByText(/Please Select.*Hotel/i)
          ).toBeVisible();
        }
      );
    }
  );
});