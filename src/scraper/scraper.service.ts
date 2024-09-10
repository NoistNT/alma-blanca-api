import { API_URL } from '@/constants';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { chromium } from 'playwright';

@Injectable()
export class ScraperService {
  constructor() {}

  async getCookiesSession() {
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();

      const page = await context.newPage();
      await page.goto(API_URL);

      // Extract cookies from the context
      const cookies = await context.cookies();

      // Save cookies to a file in JSON format
      fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

      await page.close();
      await browser.close();

      console.log('Cookies have been saved');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }
}
