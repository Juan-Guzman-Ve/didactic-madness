import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Product } from '@app/domain';
import { IProductRepository, ProductFilterParams, PaginatedResult } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { ProductEntity } from '@app/infra/database/entities';
import { min } from 'class-validator';

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

  async findWithFilters(params: ProductFilterParams): Promise<PaginatedResult<Product>> {
    const { page, limit, search, categoryId, minPrice, maxPrice, brand, inStock, sort } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('product');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('product.name ILIKE :search', { search: `%${search}%` })
            .orWhere('product.sku ILIKE :search', { search: `%${search}%` })
            .orWhere('product.brand ILIKE :search', { search: `%${search}%` })
            .orWhere('product.model ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('product.category_id = :categoryId', { categoryId });
    }

    if (minPrice !== undefined && minPrice >= 0 && !isNaN(minPrice)) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined && maxPrice >= 0 && !isNaN(maxPrice)) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (brand) {
      queryBuilder.andWhere('product.brand ILIKE :brand', { brand: `%${brand}%` });
    }

    if (inStock === true) {
      queryBuilder.andWhere('product.stock > 0');
    } else if (inStock === false) {
      queryBuilder.andWhere('product.stock = 0');
    }

    if (sort) {
      const [field, order] = sort.split(':');
      const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      
      const columnMap: Record<string, string> = {
        name: 'product.name',
        price: 'product.price',
        stock: 'product.stock',
        createdAt: 'product.created_at'
      };
      
      const column = columnMap[field] || 'product.id';
      queryBuilder.orderBy(column, sortOrder);
    } else {
      queryBuilder.orderBy('product.id', 'ASC');
    }

    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: this.toDomainMany(entities),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
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
