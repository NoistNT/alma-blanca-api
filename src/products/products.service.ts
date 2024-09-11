import { API_URL, SESSION_NAME } from '@/constants';
import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import {
  ApiResponse,
  FindAllFromApiResponse,
  ICookie,
  Products,
} from './types';

@Injectable()
export class ProductsService {
  private async getCookiesSession() {
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();

      const page = await context.newPage();
      await page.goto(API_URL);

      // Extract cookies from the context
      const cookies = await context.cookies();
      if (!cookies) throw new Error('Cookies not found');

      await page.close();
      await browser.close();

      return cookies;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }

  private async getCookie(): Promise<{ Cookie: string }> {
    try {
      const cookies: ICookie[] = await this.getCookiesSession();

      // Find the correct cookie
      const cookie: ICookie = cookies.find(({ name }) => name === SESSION_NAME);
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

  // TODO: Update to fetch products from all pages, currently it only fetches the first page
  async findAllFromApi(): Promise<FindAllFromApiResponse> {
    try {
      const headers = await this.getCookie();
      if (!headers) throw new Error('Cookie not found');

      const uri = `${API_URL}/v4/product?filter_page=0&filter_order=0`;

      const response = await fetch(uri, { headers });
      if (!response.ok)
        throw new Error(`API request failed with status: ${response.status}`);

      const { data } = (await response.json()) as ApiResponse;

      const products: Products[] = data.map(
        ({
          idProductos,
          p_nombre,
          p_descripcion,
          p_precio,
          p_link,
          p_oferta,
          imagenes,
        }) => ({
          id: idProductos,
          name: p_nombre,
          description: p_descripcion,
          price: p_precio,
          link: p_link,
          onSale: p_oferta,
          images: imagenes.map(({ idImagenes, i_link }) => ({
            id: idImagenes,
            link: i_link,
          })),
        }),
      );

      return { data: products };
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
