import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICartItemRepository, CART_ITEM_REPOSITORY, ICommandHandler } from '@app/application';
import { CartItem } from '@app/domain';
import { CreateCartItemCommand, UpdateCartItemCommand, DeleteCartItemCommand } from './cart-item.commands';
import { CartItemResponse } from './cart-item.responses';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class CreateCartItemCommandHandler implements ICommandHandler<CreateCartItemCommand, CartItemResponse> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(command: CreateCartItemCommand): Promise<CartItemResponse> {
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
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartItemResponse> {
    const existing = await this.cartItemRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`CartItem with ID ${command.id} not found`);

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
