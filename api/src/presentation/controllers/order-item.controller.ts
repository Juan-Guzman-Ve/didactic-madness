import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateOrderItemCommand,
  CreateOrderItemCommandHandler,
  DeleteOrderItemCommand,
  DeleteOrderItemCommandHandler,
  GetOrderItemByIdQuery,
  GetOrderItemByIdQueryHandler,
  ListOrderItemsQuery,
  ListOrderItemsQueryHandler,
  ListOrderItemsResponse,
  OrderItemResponse,
  UpdateOrderItemCommand,
  UpdateOrderItemCommandHandler,
} from '@app/application/features/order-item';
import { BaseController } from '@app/presentation/base';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemController extends BaseController<
  CreateOrderItemCommand,
  UpdateOrderItemCommand,
  DeleteOrderItemCommand,
  GetOrderItemByIdQuery,
  ListOrderItemsQuery,
  OrderItemResponse,
  ListOrderItemsResponse
> {
  constructor(
    createHandler: CreateOrderItemCommandHandler,
    updateHandler: UpdateOrderItemCommandHandler,
    deleteHandler: DeleteOrderItemCommandHandler,
    getByIdHandler: GetOrderItemByIdQueryHandler,
    listHandler: ListOrderItemsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
