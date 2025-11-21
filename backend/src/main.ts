import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permitir que React haga peticiones
  app.enableCors({ origin: '*' });

  // Backend en 3001 para no chocar con React
  await app.listen(3001);
}
bootstrap();