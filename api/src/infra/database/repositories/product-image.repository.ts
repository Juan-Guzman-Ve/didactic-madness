import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from '@app/domain';
import { IProductImageRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { ProductImageEntity } from '@app/infra/database/entities';

@Injectable()
export class ProductImageRepository extends BaseRepository<ProductImage, ProductImageEntity> implements IProductImageRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    repository: Repository<ProductImageEntity>,
  ) {
    super(repository);
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    const entities = await this.repository.find({ where: { productId } });
    return this.toDomainMany(entities);
  }

  protected toDomain(entity: ProductImageEntity): ProductImage {
    return Object.assign(new ProductImage(), {
      id: entity.id,
      productId: entity.productId,
      url: entity.url,
      displayOrder: entity.displayOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<ProductImage>): Partial<ProductImageEntity> {
    const entity: Partial<ProductImageEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.productId !== undefined) entity.productId = domain.productId;
    if (domain.url !== undefined) entity.url = domain.url;
    if (domain.displayOrder !== undefined) entity.displayOrder = domain.displayOrder;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
