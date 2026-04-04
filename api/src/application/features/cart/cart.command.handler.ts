import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository, CART_REPOSITORY, ICommandHandler } from '@app/application';
import { Cart } from '@app/domain';
import { CreateCartCommand } from './cart.commands';
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
