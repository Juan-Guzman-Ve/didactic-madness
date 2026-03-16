import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository, CART_REPOSITORY, ICommandHandler } from '@app/application';
import { Cart } from '@app/domain';
import { CreateCartCommand, UpdateCartCommand, DeleteCartCommand } from './cart.commands';
import { CartResponse } from './cart.responses';
import { CartMapper } from './cart.mapper';

@Injectable()
export class CreateCartCommandHandler implements ICommandHandler<CreateCartCommand, CartResponse> {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(command: CreateCartCommand): Promise<CartResponse> {
    const cart = Object.assign(new Cart(), { userId: command.userId });
    const saved = await this.cartRepository.create(cart);
    return CartMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateCartCommandHandler implements ICommandHandler<UpdateCartCommand, CartResponse> {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(command: UpdateCartCommand): Promise<CartResponse> {
    const existing = await this.cartRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Cart with ID ${command.id} not found`);

    const updated = await this.cartRepository.updateById(command.id, { userId: command.userId });
    return CartMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteCartCommandHandler implements ICommandHandler<DeleteCartCommand, void> {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(command: DeleteCartCommand): Promise<void> {
    const exists = await this.cartRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`Cart with ID ${command.id} not found`);
    await this.cartRepository.deleteById(command.id);
  }
}
