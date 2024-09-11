import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const envVariables = [
  'PORT',
  'BASE_URL',
  'API_URL',
  'SESSION_NAME',
  'LAST_PAGE_KNOWN',
];

const customError = (envVariable: string) => {
  const message = `${envVariable} is not defined`;
  console.error(message);
  throw new Error(message);
};

for (const envVariable of envVariables) {
  if (!process.env[envVariable]) {
    customError(envVariable);
  }
}

export const { PORT, BASE_URL, API_URL, SESSION_NAME, LAST_PAGE_KNOWN } =
  process.env;
