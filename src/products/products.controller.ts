import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getCookiesSession() {
    return this.productsService.getCookiesSession();
  }

  @Get()
  findAllFromApi(): Promise<Products[]> {
    return this.productsService.findAllFromApi();
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
