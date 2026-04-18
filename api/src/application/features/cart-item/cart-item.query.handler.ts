import { Injectable, Inject } from '@nestjs/common';
import { ICartItemRepository, CART_ITEM_REPOSITORY, IQueryHandler, ICartRepository, CART_REPOSITORY } from '@app/application';
import { ListCartItemsQuery } from './cart-item.queries';
import { ListCartItemsResponse } from './cart-item.responses';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class ListCartItemsQueryHandler implements IQueryHandler<ListCartItemsQuery, ListCartItemsResponse> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
  ) {}

  execute(query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
    if (query.userId) {
      return this.listCustomerCartItems(query.userId);
    }
    return this.listAll(query);
  }

  private async listCustomerCartItems(userId: number): Promise<ListCartItemsResponse> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) return { data: [], meta: { page: 1, limit: 0, total: 0, totalPages: 0 } };

    const items = await this.cartItemRepository.findByCartId(cart.id);
    return {
      data: items.map(CartItemMapper.toResponse),
      meta: { page: 1, limit: items.length, total: items.length, totalPages: 1 },
    };
  }

  private async listAll(query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
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
