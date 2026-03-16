import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from '@app/infra/database/database.config';
import * as entities from '@app/infra/database/entities';
import { RoleRepository } from '@app/infra/database/repositories/role.repository';
import { UserRepository } from '@app/infra/database/repositories/user.repository';
import { AddressRepository } from '@app/infra/database/repositories/address.repository';
import { CategoryRepository } from '@app/infra/database/repositories/category.repository';
import { PolicyRepository } from '@app/infra/database/repositories/policy.repository';
import { RolePolicyRepository } from '@app/infra/database/repositories/role-policy.repository';
import { ProductRepository } from '@app/infra/database/repositories/product.repository';
import { ProductImageRepository } from '@app/infra/database/repositories/product-image.repository';
import { CartRepository } from '@app/infra/database/repositories/cart.repository';
import { CartItemRepository } from '@app/infra/database/repositories/cart-item.repository';
import { OrderRepository } from '@app/infra/database/repositories/order.repository';
import { OrderItemRepository } from '@app/infra/database/repositories/order-item.repository';
import { OrderStatusHistoryRepository } from '@app/infra/database/repositories/order-status-history.repository';
import {
  ROLE_REPOSITORY,
  USER_REPOSITORY,
  ADDRESS_REPOSITORY,
  CATEGORY_REPOSITORY,
  POLICY_REPOSITORY,
  ROLE_POLICY_REPOSITORY,
  PRODUCT_REPOSITORY,
  PRODUCT_IMAGE_REPOSITORY,
  CART_REPOSITORY,
  CART_ITEM_REPOSITORY,
  ORDER_REPOSITORY,
  ORDER_ITEM_REPOSITORY,
  ORDER_STATUS_HISTORY_REPOSITORY,
} from '@app/application';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  providers: [
    RoleRepository,
    { provide: ROLE_REPOSITORY, useExisting: RoleRepository },
    UserRepository,
    { provide: USER_REPOSITORY, useExisting: UserRepository },
    AddressRepository,
    { provide: ADDRESS_REPOSITORY, useExisting: AddressRepository },
    CategoryRepository,
    { provide: CATEGORY_REPOSITORY, useExisting: CategoryRepository },
    PolicyRepository,
    { provide: POLICY_REPOSITORY, useExisting: PolicyRepository },
    RolePolicyRepository,
    { provide: ROLE_POLICY_REPOSITORY, useExisting: RolePolicyRepository },
    ProductRepository,
    { provide: PRODUCT_REPOSITORY, useExisting: ProductRepository },
    ProductImageRepository,
    { provide: PRODUCT_IMAGE_REPOSITORY, useExisting: ProductImageRepository },
    CartRepository,
    { provide: CART_REPOSITORY, useExisting: CartRepository },
    CartItemRepository,
    { provide: CART_ITEM_REPOSITORY, useExisting: CartItemRepository },
    OrderRepository,
    { provide: ORDER_REPOSITORY, useExisting: OrderRepository },
    OrderItemRepository,
    { provide: ORDER_ITEM_REPOSITORY, useExisting: OrderItemRepository },
    OrderStatusHistoryRepository,
    { provide: ORDER_STATUS_HISTORY_REPOSITORY, useExisting: OrderStatusHistoryRepository },
  ],
  exports: [
    TypeOrmModule,
    ROLE_REPOSITORY,
    USER_REPOSITORY,
    ADDRESS_REPOSITORY,
    CATEGORY_REPOSITORY,
    POLICY_REPOSITORY,
    ROLE_POLICY_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCT_IMAGE_REPOSITORY,
    CART_REPOSITORY,
    CART_ITEM_REPOSITORY,
    ORDER_REPOSITORY,
    ORDER_ITEM_REPOSITORY,
    ORDER_STATUS_HISTORY_REPOSITORY,
  ],
})
export class DatabaseModule {}

