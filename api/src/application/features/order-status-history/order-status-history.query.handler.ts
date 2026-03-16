import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderStatusHistoryRepository, ORDER_STATUS_HISTORY_REPOSITORY, IQueryHandler } from '@app/application';
import { GetOrderStatusHistoryByIdQuery, ListOrderStatusHistoriesQuery } from './order-status-history.queries';
import { OrderStatusHistoryResponse, ListOrderStatusHistoriesResponse } from './order-status-history.responses';
import { OrderStatusHistoryMapper } from './order-status-history.mapper';

@Injectable()
export class GetOrderStatusHistoryByIdQueryHandler
  implements IQueryHandler<GetOrderStatusHistoryByIdQuery, OrderStatusHistoryResponse> {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: IOrderStatusHistoryRepository,
  ) {}

  async execute(query: GetOrderStatusHistoryByIdQuery): Promise<OrderStatusHistoryResponse> {
    const history = await this.historyRepository.findById(query.id);
    if (!history) throw new NotFoundException(`OrderStatusHistory with ID ${query.id} not found`);
    return OrderStatusHistoryMapper.toResponse(history);
  }
}

@Injectable()
export class ListOrderStatusHistoriesQueryHandler
  implements IQueryHandler<ListOrderStatusHistoriesQuery, ListOrderStatusHistoriesResponse> {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: IOrderStatusHistoryRepository,
  ) {}

  async execute(query: ListOrderStatusHistoriesQuery): Promise<ListOrderStatusHistoriesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.historyRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(OrderStatusHistoryMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
