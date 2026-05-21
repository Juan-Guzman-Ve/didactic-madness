import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IOrderItemRepository, ORDER_ITEM_REPOSITORY,
  IProductRepository, PRODUCT_REPOSITORY,
  IQueryHandler,
} from '@app/application';
import { GetOrderItemByIdQuery, ListOrderItemsQuery } from './order-item.queries';
import { OrderItemResponse, ListOrderItemsResponse } from './order-item.responses';
import { OrderItemMapper } from './order-item.mapper';

@Injectable()
export class GetOrderItemByIdQueryHandler implements IQueryHandler<GetOrderItemByIdQuery, OrderItemResponse> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetOrderItemByIdQuery): Promise<OrderItemResponse> {
    const orderItem = await this.orderItemRepository.findById(query.id);
    if (!orderItem) throw new NotFoundException(`OrderItem with ID ${query.id} not found`);
    const product = await this.productRepository.findById(orderItem.productId);
    return OrderItemMapper.toResponse(orderItem, product?.name ?? '', product?.sku ?? '');
  }
}

@Injectable()
export class ListOrderItemsQueryHandler implements IQueryHandler<ListOrderItemsQuery, ListOrderItemsResponse> {
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY) private readonly orderItemRepository: IOrderItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: ListOrderItemsQuery): Promise<ListOrderItemsResponse> {
    if (query.orderId !== undefined) {
      const items = await this.orderItemRepository.findByOrderId(query.orderId);
      const enriched = await Promise.all(
        items.map(async (item) => {
          const product = await this.productRepository.findById(item.productId);
          return OrderItemMapper.toResponse(item, product?.name ?? '', product?.sku ?? '');
        })
      );
      return {
        data: enriched,
        meta: { page: 1, limit: enriched.length, total: enriched.length, totalPages: 1 },
      };
    }

    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.orderItemRepository.findPaginated({ page, limit });
    const enriched = await Promise.all(
      result.data.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        return OrderItemMapper.toResponse(item, product?.name ?? '', product?.sku ?? '');
      })
    );

    return {
      data: enriched,
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
