import { API_URL, SESSION_NAME } from '@/constants';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

interface ICookie {
  name: string;
  value: string;
}

@Injectable()
export class ProductsService {
  async getCookiesSession() {
    try {
      // Check if the cookies file exists
      if (!fs.existsSync('cookies.json')) {
        return {
          success: false,
          message: 'Cookies file does not exist. Run the scraper first.',
        };
      }

      // Load cookies from the file
      const cookies: ICookie[] = JSON.parse(
        fs.readFileSync('cookies.json', 'utf8'),
      );

      // Find the correct cookie
      const cookieHeader = cookies.find(
        (cookie) => cookie.name === SESSION_NAME,
      );

      // Convert the cookie into a cookie header string
      const headers = {
        'Content-Type': 'application/json',
        Cookie: `${cookieHeader.name}=${cookieHeader.value}`,
      };

      // Make a request to the API with the cookie header
      const response = await fetch(
        `${API_URL}/v4/product?filter_page=0&filter_order=0`,
        { headers }, // Attach cookies to the request
      );
      const data = await response.json();

      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }
}
