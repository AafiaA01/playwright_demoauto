import { test } from '@playwright/test';
import { LoginPage } from '../Pages/login';
import { SearchPage } from '../Pages/search';
import { SelectHotelPage } from '../Pages/selectHotel';
import { BookHotelPage } from '../Pages/bookHotel';
import { BookingConfirmationPage } from '../Pages/bookingConfirmation';
import { loginData, bookHotelData } from '../utils/testData';
import { stepWithScreenshot } from '../utils/screenshotUtil';

test.describe('Hotel Adactin - Hotel Booking', () => {
  test(
    'user can search, select and book a hotel successfully',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const searchPage = new SearchPage(page);
      const selectHotelPage = new SelectHotelPage(page);
      const bookHotelPage = new BookHotelPage(page);
      const bookingConfirmationPage = new BookingConfirmationPage(page);

      const { username, password } = loginData.validUser;
      const booking = bookHotelData.validBooking;

      await stepWithScreenshot(
        page,
        testInfo,
        'login before booking flow',
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'search hotel before selection',
        async () => {
          await searchPage.searchHotel();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'select first hotel and continue',
        async () => {
          await selectHotelPage.assertOnSelectHotelPage();
          await selectHotelPage.selectFirstHotelAndContinue();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'fill booking details',
        async () => {
          await bookHotelPage.assertOnBookHotelPage();
          await bookHotelPage.fillBookingDetails({
            firstName: booking.firstName,
            lastName: booking.lastName,
            address: booking.address,
            creditCardNumber: booking.creditCardNumber,
            creditCardType: booking.creditCardType,
            expiryMonth: booking.expiryMonth,
            expiryYear: booking.expiryYear,
            cvv: booking.cvv,
          });
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'submit booking and verify confirmation',
        async () => {
          await bookHotelPage.bookNow();
          await bookingConfirmationPage.assertBookingConfirmed();
        }
      );
    }
  );

  test(
    'shows validation errors when booking form is submitted empty',
    async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const searchPage = new SearchPage(page);
      const selectHotelPage = new SelectHotelPage(page);
      const bookHotelPage = new BookHotelPage(page);
      const bookingConfirmationPage = new BookingConfirmationPage(page);

      const { username, password } = loginData.validUser;

      await stepWithScreenshot(
        page,
        testInfo,
        'login before empty booking validation test',
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'search and select hotel before empty booking test',
        async () => {
          await searchPage.searchHotel();
          await selectHotelPage.assertOnSelectHotelPage();
          await selectHotelPage.selectFirstHotelAndContinue();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'submit empty booking form',
        async () => {
          await bookHotelPage.assertOnBookHotelPage();
          await bookHotelPage.submitEmptyForm();
        }
      );

      await stepWithScreenshot(
        page,
        testInfo,
        'verify mandatory field errors on booking page',
        async () => {
          await bookingConfirmationPage.assertMandatoryFieldErrorsVisible();
        }
      );
    }
  );
});

