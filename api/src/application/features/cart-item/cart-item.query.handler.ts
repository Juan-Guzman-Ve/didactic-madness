import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICartItemRepository, CART_ITEM_REPOSITORY, IQueryHandler } from '@app/application';
import { ListCartItemsQuery } from './cart-item.queries';
import { ListCartItemsResponse } from './cart-item.responses';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class ListCartItemsQueryHandler implements IQueryHandler<ListCartItemsQuery, ListCartItemsResponse> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.cartItemRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(CartItemMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
