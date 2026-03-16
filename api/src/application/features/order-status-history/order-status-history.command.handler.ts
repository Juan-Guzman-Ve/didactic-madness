import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderStatusHistoryRepository, ORDER_STATUS_HISTORY_REPOSITORY, ICommandHandler } from '@app/application';
import { OrderStatusHistory } from '@app/domain';
import {
  CreateOrderStatusHistoryCommand,
  UpdateOrderStatusHistoryCommand,
  DeleteOrderStatusHistoryCommand,
} from './order-status-history.commands';
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

@Injectable()
export class UpdateOrderStatusHistoryCommandHandler
  implements ICommandHandler<UpdateOrderStatusHistoryCommand, OrderStatusHistoryResponse> {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: IOrderStatusHistoryRepository,
  ) {}

  async execute(command: UpdateOrderStatusHistoryCommand): Promise<OrderStatusHistoryResponse> {
    const existing = await this.historyRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`OrderStatusHistory with ID ${command.id} not found`);

    const updated = await this.historyRepository.updateById(command.id, {
      status: command.status,
      notes: command.notes,
    });
    return OrderStatusHistoryMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteOrderStatusHistoryCommandHandler
  implements ICommandHandler<DeleteOrderStatusHistoryCommand, void> {
  constructor(
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: IOrderStatusHistoryRepository,
  ) {}

  async execute(command: DeleteOrderStatusHistoryCommand): Promise<void> {
    const exists = await this.historyRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`OrderStatusHistory with ID ${command.id} not found`);
    await this.historyRepository.deleteById(command.id);
  }
}
