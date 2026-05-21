import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Infrastructure
import { configurations, validationSchema } from './infra/config';
import { DatabaseModule } from './infra/database';

// Auth
import { JwtAuthGuard, PoliciesGuard } from './presentation/guards';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestContextInterceptor } from './presentation/interceptors/request-context.interceptor';

// User
import {
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
  GetUserByIdQueryHandler,
  ListUsersQueryHandler,
} from './application/features/user';

// Address
import {
  CreateAddressCommandHandler,
  UpdateAddressCommandHandler,
  DeleteAddressCommandHandler,
  GetAddressByIdQueryHandler,
  ListAddressesQueryHandler,
} from './application/features/address';

// Category
import {
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  DeleteCategoryCommandHandler,
  GetCategoryByIdQueryHandler,
  ListCategoriesQueryHandler,
} from './application/features/category';

// Product
import {
  BulkCreateProductsCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
  GetProductByIdQueryHandler,
  ListProductsQueryHandler,
} from './application/features/product';

// ProductImage
import {
  CreateProductImageCommandHandler,
  UpdateProductImageCommandHandler,
  DeleteProductImageCommandHandler,
  GetProductImageByIdQueryHandler,
  ListProductImagesQueryHandler,
} from './application/features/product-image';

// CartItem
import {
  ListCartItemsQueryHandler,
  SyncCartItemsCommandHandler,
  AddToCartCommandHandler,
} from './application/features/cart-item';

// Order
import {
  CheckoutCommandHandler,
  UpdateOrderCommandHandler,
  CancelOrderCommandHandler,
  GetOrderByIdQueryHandler,
  ListOrdersQueryHandler,
} from './application/features/order';

// OrderItem
import {
  GetOrderItemByIdQueryHandler,
  ListOrderItemsQueryHandler,
} from './application/features/order-item';

// OrderStatusHistory
import {
  CreateOrderStatusHistoryCommandHandler,
  GetOrderStatusHistoryByIdQueryHandler,
  ListOrderStatusHistoriesQueryHandler,
} from './application/features/order-status-history';

// Presentation Controllers
import {
  AdminCategoriesController,
  AdminProductsController,
  AdminUsersController,
  AdminOrdersController,
  AdminOrderItemsController,
  AdminOrderStatusHistoriesController,
  AdminProductImagesController,
  AdminAddressesController,
  StorefrontCategoriesController,
  StorefrontProductsController,
  StorefrontCartController,
  StorefrontCheckoutController,
  StorefrontOrdersController,
  StorefrontAddressesController,
  StorefrontAccountController,
} from './presentation/controllers';
import { AuthController } from '@app/presentation/controllers/auth.controller';
import { LoginCommandHandler, RegisterCommandHandler } from '@app/application/features/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
      validationSchema: validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret') || 'super-secret-key',
        signOptions: {
          expiresIn: configService.get('auth.jwtExpiration') as any ?? '3600s',
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    // Admin
    AdminCategoriesController,
    AdminProductsController,
    AdminUsersController,
    AdminOrdersController,
    AdminOrderItemsController,
    AdminOrderStatusHistoriesController,
    AdminProductImagesController,
    AdminAddressesController,
    // Storefront
    StorefrontCategoriesController,
    StorefrontProductsController,
    StorefrontCartController,
    StorefrontCheckoutController,
    StorefrontOrdersController,
    StorefrontAddressesController,
    StorefrontAccountController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    // Auth
    LoginCommandHandler,
    RegisterCommandHandler,
    // User
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    GetUserByIdQueryHandler,
    ListUsersQueryHandler,
    // Address
    CreateAddressCommandHandler,
    UpdateAddressCommandHandler,
    DeleteAddressCommandHandler,
    GetAddressByIdQueryHandler,
    ListAddressesQueryHandler,
    // Category
    CreateCategoryCommandHandler,
    UpdateCategoryCommandHandler,
    DeleteCategoryCommandHandler,
    GetCategoryByIdQueryHandler,
    ListCategoriesQueryHandler,
    // Product
    BulkCreateProductsCommandHandler,
    UpdateProductCommandHandler,
    DeleteProductCommandHandler,
    GetProductByIdQueryHandler,
    ListProductsQueryHandler,
    // ProductImage
    CreateProductImageCommandHandler,
    UpdateProductImageCommandHandler,
    DeleteProductImageCommandHandler,
    GetProductImageByIdQueryHandler,
    ListProductImagesQueryHandler,
    // CartItem
    ListCartItemsQueryHandler,
    SyncCartItemsCommandHandler,
    AddToCartCommandHandler,
    // Order
    CheckoutCommandHandler,
    UpdateOrderCommandHandler,
    CancelOrderCommandHandler,
    GetOrderByIdQueryHandler,
    ListOrdersQueryHandler,
    // OrderItem
    GetOrderItemByIdQueryHandler,
    ListOrderItemsQueryHandler,
    // OrderStatusHistory
    CreateOrderStatusHistoryCommandHandler,
    GetOrderStatusHistoryByIdQueryHandler,
    ListOrderStatusHistoriesQueryHandler,

    // Auth
    require('./application/features/auth/jwt.strategy').JwtStrategy,
  ],
})
export class AppModule {}
