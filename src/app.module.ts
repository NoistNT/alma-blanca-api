import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [ProductsModule, ScraperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
