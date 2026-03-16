import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderItemRepository, ORDER_ITEM_REPOSITORY, ICommandHandler } from '@app/application';
import { OrderItem } from '@app/domain';
import { CreateOrderItemCommand, UpdateOrderItemCommand, DeleteOrderItemCommand } from './order-item.commands';
import { OrderItemResponse } from './order-item.responses';
import { OrderItemMapper } from './order-item.mapper';

@Injectable()
export class CreateOrderItemCommandHandler implements ICommandHandler<CreateOrderItemCommand, OrderItemResponse> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async execute(command: CreateOrderItemCommand): Promise<OrderItemResponse> {
    const orderItem = Object.assign(new OrderItem(), {
      orderId: command.orderId,
      productId: command.productId,
      quantity: command.quantity,
      priceAtPurchase: command.priceAtPurchase,
    });
    const saved = await this.orderItemRepository.create(orderItem);
    return OrderItemMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateOrderItemCommandHandler implements ICommandHandler<UpdateOrderItemCommand, OrderItemResponse> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async execute(command: UpdateOrderItemCommand): Promise<OrderItemResponse> {
    const existing = await this.orderItemRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`OrderItem with ID ${command.id} not found`);

    const updated = await this.orderItemRepository.updateById(command.id, {
      quantity: command.quantity,
      priceAtPurchase: command.priceAtPurchase,
    });
    return OrderItemMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteOrderItemCommandHandler implements ICommandHandler<DeleteOrderItemCommand, void> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async execute(command: DeleteOrderItemCommand): Promise<void> {
    const exists = await this.orderItemRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`OrderItem with ID ${command.id} not found`);
    await this.orderItemRepository.deleteById(command.id);
  }
}
