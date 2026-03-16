import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY, IQueryHandler } from '@app/application';
import { GetOrderByIdQuery, ListOrdersQuery } from './order.queries';
import { OrderResponse, ListOrdersResponse } from './order.responses';
import { OrderMapper } from './order.mapper';

@Injectable()
export class GetOrderByIdQueryHandler implements IQueryHandler<GetOrderByIdQuery, OrderResponse> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: GetOrderByIdQuery): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(query.id);
    if (!order) throw new NotFoundException(`Order with ID ${query.id} not found`);
    return OrderMapper.toResponse(order);
  }
}

@Injectable()
export class ListOrdersQueryHandler implements IQueryHandler<ListOrdersQuery, ListOrdersResponse> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: ListOrdersQuery): Promise<ListOrdersResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.orderRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(OrderMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
