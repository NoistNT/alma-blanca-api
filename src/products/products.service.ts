import { API_URL, LAST_PAGE_KNOWN, SESSION_NAME } from '@/constants';
import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import {
  ApiResponse,
  FindAllFromApiResponse,
  Product,
  ProductFromApi,
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

  private async getCookie(): Promise<HeadersInit> {
    try {
      const cookies = await this.getCookiesSession();

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

  private async fetchProductsFromApi(
    page: number,
    headers: HeadersInit,
  ): Promise<ApiResponse> {
    const uri = `${API_URL}/v4/product?filter_page=${page}&filter_order=0`;
    const response = await fetch(uri, { headers });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return response.json() as Promise<ApiResponse>;
  }

  private mapProducts(data: ProductFromApi[]): Product[] {
    return data.map(
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
  }

  private async findLastPage() {
    let lastPageKnown = Number(LAST_PAGE_KNOWN);

    try {
      const headers = await this.getCookie();
      if (!headers) throw new Error('Cookie not found');

      console.log(`Last page known: ${lastPageKnown}`);

      while (true) {
        const { data } = await this.fetchProductsFromApi(
          lastPageKnown,
          headers,
        );

        if (!data.length) {
          --lastPageKnown;
          console.log(`Last page found: ${lastPageKnown}`);
          break;
        }

        lastPageKnown++;
      }

      return lastPageKnown;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }

  private async fetchAllPages(headers: HeadersInit): Promise<Product[]> {
    const lastPage = await this.findLastPage();
    const productsList: Product[] = [];

    for (let page = 0; page <= lastPage; page++) {
      const { data } = await this.fetchProductsFromApi(page, headers);
      const products = this.mapProducts(data);
      productsList.push(...products);
      console.log(`Page ${page} fetched`);
    }

    return productsList;
  }

  private async fetchAllPerPageFromApi(): Promise<Product[]> {
    try {
      const headers = await this.getCookie();
      if (!headers) throw new Error('Cookie not found');

      return await this.fetchAllPages(headers);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    }
  }

  async findAllFromApi(): Promise<FindAllFromApiResponse> {
    try {
      return { data: await this.fetchAllPerPageFromApi() };
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
