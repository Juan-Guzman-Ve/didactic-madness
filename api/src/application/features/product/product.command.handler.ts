import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY, ICommandHandler } from '@app/application';
import { Product } from '@app/domain';
import { CreateProductCommand, UpdateProductCommand, DeleteProductCommand, BulkCreateProductsCommand } from './product.commands';
import { ProductResponse } from './product.responses';
import { ProductMapper } from './product.mapper';

@Injectable()
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand, ProductResponse> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductResponse> {
    const product = Object.assign(new Product(), {
      sku: command.sku,
      categoryId: command.categoryId,
      name: command.name,
      description: command.description,
      brand: command.brand,
      model: command.model,
      price: command.price,
      stock: command.stock,
      specifications: command.specifications,
      status: command.status ?? 'Active',
    });
    const saved = await this.productRepository.create(product);
    return ProductMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand, ProductResponse> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductResponse> {
    const existing = await this.productRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Product with ID ${command.id} not found`);

    const updated = await this.productRepository.updateById(command.id, {
      sku: command.sku,
      categoryId: command.categoryId,
      name: command.name,
      description: command.description,
      brand: command.brand,
      model: command.model,
      price: command.price,
      stock: command.stock,
      specifications: command.specifications,
      status: command.status,
    });
    return ProductMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteProductCommandHandler implements ICommandHandler<DeleteProductCommand, void> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const exists = await this.productRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`Product with ID ${command.id} not found`);
    await this.productRepository.deleteById(command.id);
  }
}

@Injectable()
export class BulkCreateProductsCommandHandler implements ICommandHandler<BulkCreateProductsCommand, ProductResponse[]> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: BulkCreateProductsCommand): Promise<ProductResponse[]> {
    const products = command.products.map((p) =>
      Object.assign(new Product(), {
        sku: p.sku,
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        brand: p.brand,
        model: p.model,
        price: p.price,
        stock: p.stock,
        specifications: p.specifications,
        status: p.status ?? 'Active',
      }),
    );
    const saved = await this.productRepository.createMany(products);
    return saved.map(ProductMapper.toResponse);
  }
}
