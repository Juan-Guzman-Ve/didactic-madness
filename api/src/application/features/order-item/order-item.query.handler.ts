import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderItemRepository, ORDER_ITEM_REPOSITORY, IQueryHandler } from '@app/application';
import { GetOrderItemByIdQuery, ListOrderItemsQuery } from './order-item.queries';
import { OrderItemResponse, ListOrderItemsResponse } from './order-item.responses';
import { OrderItemMapper } from './order-item.mapper';

@Injectable()
export class GetOrderItemByIdQueryHandler implements IQueryHandler<GetOrderItemByIdQuery, OrderItemResponse> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async execute(query: GetOrderItemByIdQuery): Promise<OrderItemResponse> {
    const orderItem = await this.orderItemRepository.findById(query.id);
    if (!orderItem) throw new NotFoundException(`OrderItem with ID ${query.id} not found`);
    return OrderItemMapper.toResponse(orderItem);
  }
}

@Injectable()
export class ListOrderItemsQueryHandler implements IQueryHandler<ListOrderItemsQuery, ListOrderItemsResponse> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async execute(query: ListOrderItemsQuery): Promise<ListOrderItemsResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.orderItemRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(OrderItemMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
