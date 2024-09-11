import { API_URL, SESSION_NAME } from '@/constants';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  ApiResponse,
  FindAllFromApiResponse,
  ICookie,
  Products,
} from './types';

@Injectable()
export class ProductsService {
  private async getCookie(): Promise<{ Cookie: string }> {
    try {
      // Check if cookies.json exists
      if (!fs.existsSync('cookies.json')) {
        throw new Error('Cookies file does not exist. First run the scraper.');
      }

      // Read and parse cookies.json
      const fileContent = fs.readFileSync('cookies.json', 'utf8');
      if (!fileContent) throw new Error('Cookies file is empty.');

      const cookies: ICookie[] = JSON.parse(fileContent);

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
      console.log(data);

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
