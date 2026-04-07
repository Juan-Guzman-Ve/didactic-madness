import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  IOrderRepository, ORDER_REPOSITORY,
  IOrderItemRepository, ORDER_ITEM_REPOSITORY,
  IOrderStatusHistoryRepository, ORDER_STATUS_HISTORY_REPOSITORY,
  ICartRepository, CART_REPOSITORY,
  ICartItemRepository, CART_ITEM_REPOSITORY,
  IProductRepository, PRODUCT_REPOSITORY,
  IAddressRepository, ADDRESS_REPOSITORY,
  ICommandHandler,
} from '@app/application';
import { Order, OrderItem, OrderStatusHistory, CartItem, Product } from '@app/domain';
import { CreateOrderCommand, UpdateOrderCommand, DeleteOrderCommand, CheckoutCommand } from './order.commands';
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

@Injectable()
export class CheckoutCommandHandler implements ICommandHandler<CheckoutCommand, OrderResponse> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
    @Inject(ORDER_STATUS_HISTORY_REPOSITORY) private readonly historyRepository: IOrderStatusHistoryRepository,
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
    @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: CheckoutCommand): Promise<OrderResponse> {
    const { userId, addressId } = command;

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new NotFoundException(`Cart for user ${userId} not found`);

    const cartItems = await this.cartItemRepository.findByCartId(cart.id);
    if (cartItems.length === 0) throw new BadRequestException('Cart is empty');

    const address = await this.addressRepository.findById(addressId);
    if (!address) throw new NotFoundException(`Address with ID ${addressId} not found`);
    if (address.userId !== userId) throw new ForbiddenException('Address does not belong to the current user');

    const products = await this.loadAndValidateProducts(cartItems);
    const totalAmount = this.calculateTotal(cartItems, products);
    const order = await this.createOrder(userId, addressId, totalAmount);

    await this.createOrderItems(order.id, cartItems, products);
    await this.decrementStock(cartItems, products);
    await this.recordStatusHistory(order.id, userId);
    await this.clearCart(cartItems);

    return OrderMapper.toResponse(order);
  }

  private async loadAndValidateProducts(cartItems: CartItem[]): Promise<Map<number, Product>> {
    const products = new Map<number, Product>();

    for (const item of cartItems) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) throw new NotFoundException(`Product with ID ${item.productId} not found`);
      if (product.status !== 'Active') throw new BadRequestException(`Product "${product.name}" is not available`);
      if (product.stock < item.quantity) throw new BadRequestException(`Not enough stock for "${product.name}". Available: ${product.stock}`);
      products.set(item.productId, product);
    }

    return products;
  }

  private calculateTotal(cartItems: CartItem[], products: Map<number, Product>): number {
    return cartItems.reduce((total, item) => total + products.get(item.productId)!.price * item.quantity, 0);
  }

  private async createOrder(userId: number, addressId: number, totalAmount: number): Promise<Order> {
    const order = Object.assign(new Order(), {
      orderNumber: `ORD-${Date.now()}`,
      userId,
      addressId,
      status: 'PendingPayment',
      totalAmount,
      paymentStatus: 'Pending',
    });
    return this.orderRepository.create(order);
  }

  private async createOrderItems(orderId: number, cartItems: CartItem[], products: Map<number, Product>): Promise<void> {
    const orderItems = cartItems.map((item) =>
      Object.assign(new OrderItem(), {
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: products.get(item.productId)!.price,
      }),
    );
    await this.orderItemRepository.createMany(orderItems);
  }

  private async decrementStock(cartItems: CartItem[], products: Map<number, Product>): Promise<void> {
    for (const item of cartItems) {
      const product = products.get(item.productId)!;
      await this.productRepository.updateById(product.id, { stock: product.stock - item.quantity });
    }
  }

  private async recordStatusHistory(orderId: number, userId: number): Promise<void> {
    const history = Object.assign(new OrderStatusHistory(), {
      orderId,
      status: 'PendingPayment',
      changedByUserId: userId,
      notes: 'Order placed',
      changedAt: new Date(),
    });
    await this.historyRepository.create(history);
  }

  private async clearCart(cartItems: CartItem[]): Promise<void> {
    await this.cartItemRepository.deleteByIds(cartItems.map((item) => item.id));
  }
}
