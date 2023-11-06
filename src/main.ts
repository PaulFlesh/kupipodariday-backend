import 'reflect-metadata';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AppExceptionsFilter } from './exceptions/app-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(helmet());

  app.useGlobalFilters(new AppExceptionsFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
  });
}
bootstrap();
