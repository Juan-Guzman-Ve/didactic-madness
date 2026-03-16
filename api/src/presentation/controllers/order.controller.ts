import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
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
@ApiExtraModels(ListOrdersQuery)
@Controller('orders')
export class OrderController extends BaseController<
  CreateOrderCommand,
  UpdateOrderCommand,
  DeleteOrderCommand,
  GetOrderByIdQuery,
  OrderResponse
> {
  constructor(
    createHandler: CreateOrderCommandHandler,
    updateHandler: UpdateOrderCommandHandler,
    deleteHandler: DeleteOrderCommandHandler,
    getByIdHandler: GetOrderByIdQueryHandler,
    private readonly listHandler: ListOrdersQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListOrdersQuery): Promise<ListOrdersResponse> {
      return this.listHandler.execute(query);
    }
}
