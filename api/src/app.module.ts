import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

// Infrastructure
import { DatabaseModule } from './infra/database';
import { configurations, validationSchema } from './infra/config';

// Application Services
import {
  AuthService,
  ProductsService,
  CategoriesService,
  CartService,
  OrdersService,
} from './application/services';

// Presentation Controllers
import {
  AuthController,
  ProductsController,
  CategoriesController,
  CartController,
  OrdersController,
  HealthController,
} from './presentation/controllers';

@Module({
  imports: [
    // ─── Configuration ─────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
      validationSchema: validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    // ─── Infrastructure ────────────────────────────────────────────────────
    DatabaseModule,
  ],
  controllers: [
    AppController,
    HealthController,
    AuthController,
    ProductsController,
    CategoriesController,
    CartController,
    OrdersController,
  ],
  providers: [
    AuthService,
    ProductsService,
    CategoriesService,
    CartService,
    OrdersService,
  ],
})
export class AppModule {}
