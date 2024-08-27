import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnection } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const connection = getConnection();
    await connection.synchronize(true);
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Failed to synchronize database:', error);
  }

  await app.listen(3000);
}
bootstrap();