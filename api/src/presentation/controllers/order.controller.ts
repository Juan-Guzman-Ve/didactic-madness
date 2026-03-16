import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateOrderCommand,
  CreateOrderCommandHandler,
  DeleteOrderCommand,
  DeleteOrderCommandHandler,
  GetOrderByIdQuery,
  GetOrderByIdQueryHandler,
  ListOrdersQuery,
  ListOrdersQueryHandler,
  ListOrdersResponse,
  OrderResponse,
  UpdateOrderCommand,
  UpdateOrderCommandHandler,
} from '@app/application/features/order';
import { BaseController } from '@app/presentation/base';

@ApiTags('orders')
@Controller('orders')
export class OrderController extends BaseController<
  CreateOrderCommand,
  UpdateOrderCommand,
  DeleteOrderCommand,
  GetOrderByIdQuery,
  ListOrdersQuery,
  OrderResponse,
  ListOrdersResponse
> {
  constructor(
    createHandler: CreateOrderCommandHandler,
    updateHandler: UpdateOrderCommandHandler,
    deleteHandler: DeleteOrderCommandHandler,
    getByIdHandler: GetOrderByIdQueryHandler,
    listHandler: ListOrdersQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
