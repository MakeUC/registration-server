import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT!;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: `*` });
  await app.listen(port);
}
bootstrap(); 
