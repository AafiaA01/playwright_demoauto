import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private username = '#username';
  private password = '#password';
  private loginBtn = '#login';

  async goto() {
    await this.page.goto('https://adactinhotelapp.com/');
  }

  async login(user: string, pass: string) {
    await this.page.fill(this.username, user);
    await this.page.fill(this.password, pass);
    await this.page.click(this.loginBtn);
  }
}