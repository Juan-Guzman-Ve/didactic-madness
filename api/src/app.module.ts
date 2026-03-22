import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';

// Infrastructure
import { configurations, validationSchema } from './infra/config';
import { DatabaseModule } from './infra/database';

// Auth
import { AuthModule } from './application/features/auth/auth.module';
import { JwtAuthGuard, PoliciesGuard } from './presentation/guards';
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

// Cart
import {
  CreateCartCommandHandler,
  UpdateCartCommandHandler,
  DeleteCartCommandHandler,
  GetCartByIdQueryHandler,
  ListCartsQueryHandler,
} from './application/features/cart';

// CartItem
import {
  CreateCartItemCommandHandler,
  UpdateCartItemCommandHandler,
  DeleteCartItemCommandHandler,
  GetCartItemByIdQueryHandler,
  ListCartItemsQueryHandler,
} from './application/features/cart-item';

// Order
import {
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
  CartController,
  CartItemController,
  OrderController,
  OrderItemController,
  OrderStatusHistoryController,
} from './presentation/controllers';

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
    AuthModule,
  ],
  controllers: [
    AppController,
    RoleController,
    UserController,
    AddressController,
    CategoryController,
    PolicyController,
    RolePolicyController,
    ProductController,
    ProductImageController,
    CartController,
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
    // Cart
    CreateCartCommandHandler,
    UpdateCartCommandHandler,
    DeleteCartCommandHandler,
    GetCartByIdQueryHandler,
    ListCartsQueryHandler,
    // CartItem
    CreateCartItemCommandHandler,
    UpdateCartItemCommandHandler,
    DeleteCartItemCommandHandler,
    GetCartItemByIdQueryHandler,
    ListCartItemsQueryHandler,
    // Order
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
  ],
})
export class AppModule {}
