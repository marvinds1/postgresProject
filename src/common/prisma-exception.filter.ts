import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    let mapped: HttpException | undefined;
    if (exception.code === 'P2002') {
      mapped = new ConflictException('Resource already exists');
    } else if (exception.code === 'P2025') {
      mapped = new NotFoundException();
    }
    super.catch(mapped ?? exception, host);
  }
}
