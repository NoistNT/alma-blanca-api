import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createHttpException } from './shared/utils';

ConfigModule.forRoot();

const envVariables = ['PORT', 'BASE_URL', 'API_URL', 'SESSION_NAME', 'LAST_PAGE_KNOWN'];

for (const envVariable of envVariables) {
  if (!process.env[envVariable]) {
    createHttpException(`Missing env variable: ${envVariable}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const { PORT, BASE_URL, API_URL, SESSION_NAME, LAST_PAGE_KNOWN } = process.env;
