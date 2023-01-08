import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a', //append
});

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    forbidUnknownValues: false,
  }));
  app.use(morgan('tiny', {
    stream: logStream,
  }));
  await app.listen(PORT);
  Logger.log(`Server start on host http://localhost:${PORT}/api`)
}

bootstrap();
