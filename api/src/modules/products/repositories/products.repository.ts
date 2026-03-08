import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findAll(options?: any) {
    // TODO: Implement query with filters
    return this.repository.find(options);
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ['images', 'category'],
    });
  }

  async findBySku(sku: string) {
    return this.repository.findOne({ where: { sku } });
  }

  async save(product: ProductEntity) {
    return this.repository.save(product);
  }

  async softDelete(id: string) {
    return this.repository.update(id, { status: 'Inactive' });
  }
}
