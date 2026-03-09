import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── CORS Configuration ──────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });

  // ─── Global Prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Swagger/OpenAPI Documentation ───────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('PC Parts Store API')
    .setDescription(
      'E-commerce API for PC components with NestJS + TypeORM + Supabase PostgreSQL',
    )
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication & Authorization')
    .addTag('products', 'Product catalog management')
    .addTag('categories', 'Product categories')
    .addTag('cart', 'Shopping cart operations')
    .addTag('orders', 'Order management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Start Server ────────────────────────────────────────────────────────
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
