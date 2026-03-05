import { Page, expect } from '@playwright/test';

export class BookingConfirmationPage {
  constructor(private page: Page) {}

  async assertBookingConfirmed() {
    await expect(this.page).toHaveURL(/Book(Hotel|ingConfirm)\.php/);

    // Order number field is the key indicator of a successful booking
    await expect(this.page.locator('#order_no')).toBeVisible({
      timeout: 20000,
    });
  }

  async assertMandatoryFieldErrorsVisible() {
    await expect(this.page.getByText(/Please Enter your First Name/i)).toBeVisible();
    await expect(this.page.getByText(/Please Enter you Last Name/i)).toBeVisible();
    await expect(this.page.getByText(/Please Enter your Address/i)).toBeVisible();
    await expect(
      this.page.getByText(/Please Enter your 16 Digit Credit Card Number/i)
    ).toBeVisible();
  }
}

