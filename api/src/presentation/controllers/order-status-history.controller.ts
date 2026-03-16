import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateOrderStatusHistoryCommand,
  CreateOrderStatusHistoryCommandHandler,
  DeleteOrderStatusHistoryCommand,
  DeleteOrderStatusHistoryCommandHandler,
  GetOrderStatusHistoryByIdQuery,
  GetOrderStatusHistoryByIdQueryHandler,
  ListOrderStatusHistoriesQuery,
  ListOrderStatusHistoriesQueryHandler,
  ListOrderStatusHistoriesResponse,
  OrderStatusHistoryResponse,
  UpdateOrderStatusHistoryCommand,
  UpdateOrderStatusHistoryCommandHandler,
} from '@app/application/features/order-status-history';
import { BaseController } from '@app/presentation/base';

@ApiTags('order-status-histories')
@Controller('order-status-histories')
export class OrderStatusHistoryController extends BaseController<
  CreateOrderStatusHistoryCommand,
  UpdateOrderStatusHistoryCommand,
  DeleteOrderStatusHistoryCommand,
  GetOrderStatusHistoryByIdQuery,
  ListOrderStatusHistoriesQuery,
  OrderStatusHistoryResponse,
  ListOrderStatusHistoriesResponse
> {
  constructor(
    createHandler: CreateOrderStatusHistoryCommandHandler,
    updateHandler: UpdateOrderStatusHistoryCommandHandler,
    deleteHandler: DeleteOrderStatusHistoryCommandHandler,
    getByIdHandler: GetOrderStatusHistoryByIdQueryHandler,
    listHandler: ListOrderStatusHistoriesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
