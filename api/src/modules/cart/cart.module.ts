import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
