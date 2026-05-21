import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  ICartItemRepository, CART_ITEM_REPOSITORY,
  ICartRepository, CART_REPOSITORY,
  IProductRepository, PRODUCT_REPOSITORY,
  ICommandHandler,
} from '@app/application';
import { Cart, CartItem } from '@app/domain';
import { AddToCartCommand } from './cart-item.commands';
import { CartItemResponse } from './cart-item.responses';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class AddToCartCommandHandler implements ICommandHandler<AddToCartCommand, CartItemResponse> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: AddToCartCommand): Promise<CartItemResponse> {
    const product = await this.productRepository.findById(command.productId);
    if (!product) throw new NotFoundException(`Product with ID ${command.productId} not found`);

    let cart = await this.cartRepository.findByUserId(command.userId);
    if (!cart) {
      cart = await this.cartRepository.create(Object.assign(new Cart(), { userId: command.userId }));
    }

    const existingItems = await this.cartItemRepository.findByCartId(cart.id);
    const existingItem = existingItems.find(item => item.productId === command.productId);

    const newQty = (existingItem?.quantity ?? 0) + command.quantity;
    if (product.stock < newQty) {
      throw new BadRequestException(
        `Not enough stock for product "${product.name}". Available: ${product.stock}`,
      );
    }

    if (existingItem) {
      const updated = await this.cartItemRepository.updateById(existingItem.id, { quantity: newQty });
      return CartItemMapper.toResponse(updated);
    }

    const newItem = await this.cartItemRepository.create(
      Object.assign(new CartItem(), { cartId: cart.id, productId: command.productId, quantity: command.quantity }),
    );
    return CartItemMapper.toResponse(newItem);
  }
}
