import { HttpException, HttpStatus } from '@nestjs/common';

export const createHttpException = (message: string, status: HttpStatus): HttpException => {
  return new HttpException(message, status);
};

export const handleError = (error: unknown, defaultMessage: string) => {
  const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  throw createHttpException(defaultMessage, status);
};
