import { Injectable, Inject } from '@nestjs/common';
import { IOrderStatusHistoryRepository, ORDER_STATUS_HISTORY_REPOSITORY, ICommandHandler } from '@app/application';
import { OrderStatusHistory } from '@app/domain';
import { CreateOrderStatusHistoryCommand } from './order-status-history.commands';
import { OrderStatusHistoryResponse } from './order-status-history.responses';
import { OrderStatusHistoryMapper } from './order-status-history.mapper';

@Injectable()
export class CreateOrderStatusHistoryCommandHandler
  implements ICommandHandler<CreateOrderStatusHistoryCommand, OrderStatusHistoryResponse> {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: IOrderStatusHistoryRepository,
  ) {}

  async execute(command: CreateOrderStatusHistoryCommand): Promise<OrderStatusHistoryResponse> {
    const history = Object.assign(new OrderStatusHistory(), {
      orderId: command.orderId,
      status: command.status,
      changedByUserId: command.changedByUserId,
      notes: command.notes,
    });
    const saved = await this.historyRepository.create(history);
    return OrderStatusHistoryMapper.toResponse(saved);
  }
}

// Status history is append-only — no update or delete handlers
