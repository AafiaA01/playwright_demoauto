import { Page, expect } from '@playwright/test';

export class SelectHotelPage {
  constructor(private page: Page) {}

  async assertOnSelectHotelPage() {
    await expect(this.page).toHaveURL(/SelectHotel\.php/);
    // App does not expose an accessible heading reliably; wait for core controls instead
    await expect(this.page.locator('#radiobutton_0')).toBeVisible();
    await expect(this.page.locator('#continue')).toBeVisible();
  }

  async selectFirstHotelAndContinue() {
    await this.page.locator('#radiobutton_0').check();
    await this.page.locator('#continue').click();
  }
}

