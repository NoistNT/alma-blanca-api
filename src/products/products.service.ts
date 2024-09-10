import { API_URL, SESSION_NAME } from '@/constants';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Products } from './types';

interface ICookie {
  name: string;
  value: string;
}

@Injectable()
export class ProductsService {
  async getCookiesSession() {
    try {
      // Check if cookies.json exists
      if (!fs.existsSync('cookies.json'))
        throw new Error('Cookies file does not exist.');

      // Read and parse cookies.json
      const fileContent = fs.readFileSync('cookies.json', 'utf8');
      if (!fileContent) throw new Error('Cookies file is empty.');

      const cookies: ICookie[] = JSON.parse(fileContent);

      // Find the correct cookie
      const cookie = cookies.find(({ name }) => name === SESSION_NAME);
      if (!cookie) throw new Error(`Cookie not found.`);

      // Return cookie header
      return { Cookie: `${cookie.name}=${cookie.value}` };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }

  async findAllFromApi() {
    try {
      const headers = await this.getCookiesSession();
      if (!headers) throw new Error('No cookies found');

      const uri = `${API_URL}/v4/product?filter_page=0&filter_order=0`;
      const response = await fetch(uri, { headers });
      if (!response.ok)
        throw new Error(`API request failed with status: ${response.status}`);

      const data = (await response.json()) as Products[];

      const products: Products[] = data.map(
        ({ id, name, description, price, link, image }) => ({
          id,
          name,
          description,
          price,
          link,
          image: { id: image.id, link: image.link },
        }),
      );

      return products;
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
