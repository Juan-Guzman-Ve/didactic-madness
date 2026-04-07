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

// Role
import {
  CreateRoleCommandHandler,
  DeleteRoleCommandHandler,
  GetRoleByIdQueryHandler,
  ListRolesQueryHandler,
  UpdateRoleCommandHandler,
} from './application/features/role';

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

// Policy
import {
  CreatePolicyCommandHandler,
  UpdatePolicyCommandHandler,
  DeletePolicyCommandHandler,
  GetPolicyByIdQueryHandler,
  ListPoliciesQueryHandler,
} from './application/features/policy';

// RolePolicy
import {
  CreateRolePolicyCommandHandler,
  UpdateRolePolicyCommandHandler,
  DeleteRolePolicyCommandHandler,
  GetRolePolicyByIdQueryHandler,
  ListRolePoliciesQueryHandler,
} from './application/features/role-policy';

// Product
import {
  CreateProductCommandHandler,
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
} from './application/features/cart-item';

// Order
import {
  CheckoutCommandHandler,
  CreateOrderCommandHandler,
  UpdateOrderCommandHandler,
  DeleteOrderCommandHandler,
  GetOrderByIdQueryHandler,
  ListOrdersQueryHandler,
} from './application/features/order';

// OrderItem
import {
  CreateOrderItemCommandHandler,
  UpdateOrderItemCommandHandler,
  DeleteOrderItemCommandHandler,
  GetOrderItemByIdQueryHandler,
  ListOrderItemsQueryHandler,
} from './application/features/order-item';

// OrderStatusHistory
import {
  CreateOrderStatusHistoryCommandHandler,
  UpdateOrderStatusHistoryCommandHandler,
  DeleteOrderStatusHistoryCommandHandler,
  GetOrderStatusHistoryByIdQueryHandler,
  ListOrderStatusHistoriesQueryHandler,
} from './application/features/order-status-history';

// Presentation Controllers
import {
  RoleController,
  UserController,
  AddressController,
  CategoryController,
  PolicyController,
  RolePolicyController,
  ProductController,
  ProductImageController,
  CartItemController,
  OrderController,
  OrderItemController,
  OrderStatusHistoryController,
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
    RoleController,
    UserController,
    AddressController,
    CategoryController,
    PolicyController,
    RolePolicyController,
    ProductController,
    ProductImageController,
    CartItemController,
    OrderController,
    OrderItemController,
    OrderStatusHistoryController,
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
    // Role
    CreateRoleCommandHandler,
    UpdateRoleCommandHandler,
    DeleteRoleCommandHandler,
    GetRoleByIdQueryHandler,
    ListRolesQueryHandler,
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
    // Policy
    CreatePolicyCommandHandler,
    UpdatePolicyCommandHandler,
    DeletePolicyCommandHandler,
    GetPolicyByIdQueryHandler,
    ListPoliciesQueryHandler,
    // RolePolicy
    CreateRolePolicyCommandHandler,
    UpdateRolePolicyCommandHandler,
    DeleteRolePolicyCommandHandler,
    GetRolePolicyByIdQueryHandler,
    ListRolePoliciesQueryHandler,
    // Product
    CreateProductCommandHandler,
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
    // Order
    CheckoutCommandHandler,
    CreateOrderCommandHandler,
    UpdateOrderCommandHandler,
    DeleteOrderCommandHandler,
    GetOrderByIdQueryHandler,
    ListOrdersQueryHandler,
    // OrderItem
    CreateOrderItemCommandHandler,
    UpdateOrderItemCommandHandler,
    DeleteOrderItemCommandHandler,
    GetOrderItemByIdQueryHandler,
    ListOrderItemsQueryHandler,
    // OrderStatusHistory
    CreateOrderStatusHistoryCommandHandler,
    UpdateOrderStatusHistoryCommandHandler,
    DeleteOrderStatusHistoryCommandHandler,
    GetOrderStatusHistoryByIdQueryHandler,
    ListOrderStatusHistoriesQueryHandler,

    // Auth
    require('./application/features/auth/jwt.strategy').JwtStrategy,
  ],
})
export class AppModule {}
