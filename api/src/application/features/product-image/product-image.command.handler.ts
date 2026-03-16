import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductImageRepository, PRODUCT_IMAGE_REPOSITORY, ICommandHandler } from '@app/application';
import { ProductImage } from '@app/domain';
import { CreateProductImageCommand, UpdateProductImageCommand, DeleteProductImageCommand } from './product-image.commands';
import { ProductImageResponse } from './product-image.responses';
import { ProductImageMapper } from './product-image.mapper';

@Injectable()
export class CreateProductImageCommandHandler implements ICommandHandler<CreateProductImageCommand, ProductImageResponse> {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY) private readonly productImageRepository: IProductImageRepository,
  ) {}

  async execute(command: CreateProductImageCommand): Promise<ProductImageResponse> {
    const productImage = Object.assign(new ProductImage(), {
      productId: command.productId,
      url: command.url,
      displayOrder: command.displayOrder ?? 0,
    });
    const saved = await this.productImageRepository.create(productImage);
    return ProductImageMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateProductImageCommandHandler implements ICommandHandler<UpdateProductImageCommand, ProductImageResponse> {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY) private readonly productImageRepository: IProductImageRepository,
  ) {}

  async execute(command: UpdateProductImageCommand): Promise<ProductImageResponse> {
    const existing = await this.productImageRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`ProductImage with ID ${command.id} not found`);

    const updated = await this.productImageRepository.updateById(command.id, {
      url: command.url,
      displayOrder: command.displayOrder,
    });
    return ProductImageMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteProductImageCommandHandler implements ICommandHandler<DeleteProductImageCommand, void> {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY) private readonly productImageRepository: IProductImageRepository,
  ) {}

  async execute(command: DeleteProductImageCommand): Promise<void> {
    const exists = await this.productImageRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`ProductImage with ID ${command.id} not found`);
    await this.productImageRepository.deleteById(command.id);
  }
}
