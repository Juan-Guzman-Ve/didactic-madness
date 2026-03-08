import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from './repositories/products.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductImageEntity } from './entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
