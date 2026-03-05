import { Page } from '@playwright/test';
import { searchData } from '../utils/testData';

export class SearchPage {
  constructor(private page: Page) {}

  private location = '#location';
  private hotels = '#hotels';
  private roomType = '#room_type';
  private checkIn = '#datepick_in';
  private checkOut = '#datepick_out';
  private adults = '#adult_room';
  private children = '#child_room';
  private searchBtn = '#Submit';

  async searchHotel() {
    const data = searchData.validSearch;

    await this.page.selectOption(this.location, data.locationLabel);
    await this.page.selectOption(this.hotels, data.hotelLabel);
    await this.page.selectOption(this.roomType, data.roomTypeLabel);
    await this.page.fill(this.checkIn, data.checkIn);
    await this.page.fill(this.checkOut, data.checkOut);
    await this.page.selectOption(this.adults, data.adults);
    await this.page.selectOption(this.children, data.children);
    await this.page.click(this.searchBtn);
  }
}