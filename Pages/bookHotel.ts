import { Page, expect } from '@playwright/test';

export interface BookingDetails {
  firstName: string;
  lastName: string;
  address: string;
  creditCardNumber: string;
  creditCardType: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export class BookHotelPage {
  constructor(private page: Page) {}

  async assertOnBookHotelPage() {
    await expect(this.page).toHaveURL(/BookHotel\.php/);
    // App may not expose an accessible heading reliably; wait for core form fields instead
    await expect(this.page.locator('#first_name')).toBeVisible();
    await expect(this.page.locator('#book_now')).toBeVisible();
  }

  async fillBookingDetails(details: BookingDetails) {
    await this.page.locator('#first_name').fill(details.firstName);
    await this.page.locator('#last_name').fill(details.lastName);
    await this.page.locator('#address').fill(details.address);
    await this.page.locator('#cc_num').fill(details.creditCardNumber);

    await this.page
      .locator('#cc_type')
      .selectOption({ label: details.creditCardType });
    await this.page
      .locator('#cc_exp_month')
      .selectOption({ label: details.expiryMonth });
    await this.page
      .locator('#cc_exp_year')
      .selectOption({ label: details.expiryYear });

    await this.page.locator('#cc_cvv').fill(details.cvv);
  }

  async bookNow() {
    await this.page.getByRole('button', { name: /Book Now/i }).click();
  }

  async submitEmptyForm() {
    await this.page.getByRole('button', { name: /Book Now/i }).click();
  }
}

