import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@app/domain';
import { IProductRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { ProductEntity } from '@app/infra/database/entities';

@Injectable()
export class ProductRepository extends BaseRepository<Product, ProductEntity> implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    repository: Repository<ProductEntity>,
  ) {
    super(repository);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { sku } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const entities = await this.repository.find({ where: { categoryId } });
    return this.toDomainMany(entities);
  }

  protected toDomain(entity: ProductEntity): Product {
    return Object.assign(new Product(), {
      id: entity.id,
      sku: entity.sku,
      categoryId: entity.categoryId,
      name: entity.name,
      description: entity.description,
      brand: entity.brand,
      model: entity.model,
      price: entity.price,
      stock: entity.stock,
      specifications: entity.specifications,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<Product>): Partial<ProductEntity> {
    const entity: Partial<ProductEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.sku !== undefined) entity.sku = domain.sku;
    if (domain.categoryId !== undefined) entity.categoryId = domain.categoryId;
    if (domain.name !== undefined) entity.name = domain.name;
    if (domain.description !== undefined) entity.description = domain.description;
    if (domain.brand !== undefined) entity.brand = domain.brand;
    if (domain.model !== undefined) entity.model = domain.model;
    if (domain.price !== undefined) entity.price = domain.price;
    if (domain.stock !== undefined) entity.stock = domain.stock;
    if (domain.specifications !== undefined) entity.specifications = domain.specifications;
    if (domain.status !== undefined) entity.status = domain.status;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
