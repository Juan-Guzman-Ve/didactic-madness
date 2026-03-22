import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY, ICommandHandler } from '@app/application';
import { Order } from '@app/domain';
import { CreateOrderCommand, UpdateOrderCommand, DeleteOrderCommand } from './order.commands';
import { OrderResponse } from './order.responses';
import { OrderMapper } from './order.mapper';

@Injectable()
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand, OrderResponse> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderResponse> {
    const order = Object.assign(new Order(), {
      orderNumber: command.orderNumber || `ORD-${Date.now()}`,
      userId: command.userId,
      addressId: command.addressId,
      status: 'Pending',
      totalAmount: command.totalAmount,
      paymentStatus: 'Pending',
    });
    const saved = await this.orderRepository.create(order);
    return OrderMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateOrderCommandHandler implements ICommandHandler<UpdateOrderCommand, OrderResponse> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: UpdateOrderCommand): Promise<OrderResponse> {
    const existing = await this.orderRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Order with ID ${command.id} not found`);

    if (command.status && command.status !== existing.status) {
      this.validateStatusTransition(existing.status, command.status);
    }

    const updated = await this.orderRepository.updateById(command.id, {
      status: command.status,
      paymentStatus: command.paymentStatus,
      addressId: command.addressId,
    });
    return OrderMapper.toResponse(updated);
  }

  private validateStatusTransition(current: string, next: string): void {
    const validTransitions: Record<string, string[]> = {
      'Pending': ['Paid', 'Cancelled'],
      'Paid': ['Processing', 'Cancelled'],
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Delivered'],
      'Delivered': [],
      'Cancelled': [],
    };

    const allowed = validTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${next}`);
    }
  }
}

@Injectable()
export class DeleteOrderCommandHandler implements ICommandHandler<DeleteOrderCommand, void> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const exists = await this.orderRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`Order with ID ${command.id} not found`);
    await this.orderRepository.deleteById(command.id);
  }
}
