import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
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
@ApiExtraModels(ListOrderStatusHistoriesQuery)
@Controller('order-status-histories')
export class OrderStatusHistoryController extends BaseController<
  CreateOrderStatusHistoryCommand,
  UpdateOrderStatusHistoryCommand,
  DeleteOrderStatusHistoryCommand,
  GetOrderStatusHistoryByIdQuery,
  OrderStatusHistoryResponse
> {
  constructor(
    createHandler: CreateOrderStatusHistoryCommandHandler,
    updateHandler: UpdateOrderStatusHistoryCommandHandler,
    deleteHandler: DeleteOrderStatusHistoryCommandHandler,
    getByIdHandler: GetOrderStatusHistoryByIdQueryHandler,
    private readonly listHandler: ListOrderStatusHistoriesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListOrderStatusHistoriesQuery): Promise<ListOrderStatusHistoriesResponse> {
      return this.listHandler.execute(query);
    }
}
