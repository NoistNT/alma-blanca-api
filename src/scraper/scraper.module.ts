import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
