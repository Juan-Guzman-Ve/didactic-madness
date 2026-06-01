import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    if (query.userId !== undefined && order.userId !== query.userId) {
      throw new ForbiddenException('You do not own this order');
    }
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
    const sort = query.sort ?? 'createdAt:desc';

    if (query.userId !== undefined) {
      const userOrders = await this.orderRepository.findByUserId(query.userId);
      const sorted = this.sortOrders(userOrders, sort);
      const total = sorted.length;
      const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paged = sorted.slice(start, start + limit);

      return {
        data: paged.map(OrderMapper.toResponse),
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }

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

  private sortOrders(orders: Parameters<typeof OrderMapper.toResponse>[0][], sort: string) {
    const [field, direction] = sort.split(':');
    const multiplier = direction?.toLowerCase() === 'asc' ? 1 : -1;

    return [...orders].sort((left, right) => {
      const leftValue = this.getSortableValue(left, field);
      const rightValue = this.getSortableValue(right, field);

      if (leftValue < rightValue) return -1 * multiplier;
      if (leftValue > rightValue) return 1 * multiplier;
      return 0;
    });
  }

  private getSortableValue(order: Parameters<typeof OrderMapper.toResponse>[0], field: string): number | string {
    switch (field) {
      case 'totalAmount':
        return order.totalAmount;
      case 'orderNumber':
        return order.orderNumber;
      case 'updatedAt':
        return new Date(order.updatedAt).getTime();
      case 'createdAt':
      default:
        return new Date(order.createdAt).getTime();
    }
  }
}
