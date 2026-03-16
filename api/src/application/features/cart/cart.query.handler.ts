import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository, CART_REPOSITORY, IQueryHandler } from '@app/application';
import { GetCartByIdQuery, ListCartsQuery } from './cart.queries';
import { CartResponse, ListCartsResponse } from './cart.responses';
import { CartMapper } from './cart.mapper';

@Injectable()
export class GetCartByIdQueryHandler implements IQueryHandler<GetCartByIdQuery, CartResponse> {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(query: GetCartByIdQuery): Promise<CartResponse> {
    const cart = await this.cartRepository.findById(query.id);
    if (!cart) throw new NotFoundException(`Cart with ID ${query.id} not found`);
    return CartMapper.toResponse(cart);
  }
}

@Injectable()
export class ListCartsQueryHandler implements IQueryHandler<ListCartsQuery, ListCartsResponse> {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(query: ListCartsQuery): Promise<ListCartsResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.cartRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(CartMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
