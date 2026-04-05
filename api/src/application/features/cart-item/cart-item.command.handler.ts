import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICartItemRepository, CART_ITEM_REPOSITORY, ICommandHandler, IProductRepository, PRODUCT_REPOSITORY } from '@app/application';
import { CartItem } from '@app/domain';
import { CreateCartItemCommand, UpdateCartItemCommand, DeleteCartItemCommand, SyncCartItemsCommand } from './cart-item.commands';
import { CartItemResponse } from './cart-item.responses';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class CreateCartItemCommandHandler implements ICommandHandler<CreateCartItemCommand, CartItemResponse> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateCartItemCommand): Promise<CartItemResponse> {
    // Stock validation
    const product = await this.productRepository.findById(command.productId);
    if (!product) throw new NotFoundException(`Product with ID ${command.productId} not found`);
    
    if (product.stock < command.quantity) {
      throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
    }

    const cartItem = Object.assign(new CartItem(), {
      cartId: command.cartId,
      productId: command.productId,
      quantity: command.quantity,
    });
    const saved = await this.cartItemRepository.create(cartItem);
    return CartItemMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateCartItemCommandHandler implements ICommandHandler<UpdateCartItemCommand, CartItemResponse> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartItemResponse> {
    const existing = await this.cartItemRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`CartItem with ID ${command.id} not found`);

    // Stock validation
    const product = await this.productRepository.findById(existing.productId);
    if (product && product.stock < command.quantity) {
      throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
    }

    const updated = await this.cartItemRepository.updateById(command.id, { quantity: command.quantity });
    return CartItemMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteCartItemCommandHandler implements ICommandHandler<DeleteCartItemCommand, void> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(command: DeleteCartItemCommand): Promise<void> {
    const exists = await this.cartItemRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`CartItem with ID ${command.id} not found`);
    await this.cartItemRepository.deleteById(command.id);
  }
}

@Injectable()
export class SyncCartItemsCommandHandler implements ICommandHandler<SyncCartItemsCommand, CartItemResponse[]> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: SyncCartItemsCommand): Promise<CartItemResponse[]> {
    if (command.items.length === 0) throw new BadRequestException('Items list cannot be empty');

    const cartId = command.items[0].cartId;
    const existing = await this.cartItemRepository.findByCartId(cartId);

    const existingByProductId = new Map(existing.map((item) => [item.productId, item]));
    const incomingByProductId = new Map(command.items.map((item) => [item.productId, item]));

    const toCreate = command.items.filter((item) => !existingByProductId.has(item.productId));
    const toUpdate = command.items.filter((item) => {
      const found = existingByProductId.get(item.productId);
      return found && found.quantity !== item.quantity;
    });
    const toDelete = existing.filter((item) => !incomingByProductId.has(item.productId));

    await this.validateStock([...toCreate, ...toUpdate]);

    if (toCreate.length > 0) {
      const newItems = toCreate.map((item) =>
        Object.assign(new CartItem(), { cartId, productId: item.productId, quantity: item.quantity }),
      );
      await this.cartItemRepository.createMany(newItems);
    }

    await Promise.all(
      toUpdate.map((item) => {
        const found = existingByProductId.get(item.productId)!;
        return this.cartItemRepository.updateById(found.id, { quantity: item.quantity });
      }),
    );

    if (toDelete.length > 0) {
      await this.cartItemRepository.deleteByIds(toDelete.map((item) => item.id));
    }

    const final = await this.cartItemRepository.findByCartId(cartId);
    return final.map(CartItemMapper.toResponse);
  }

  private async validateStock(items: CreateCartItemCommand[]): Promise<void> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) throw new NotFoundException(`Product with ID ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
      }
    }
  }
}
