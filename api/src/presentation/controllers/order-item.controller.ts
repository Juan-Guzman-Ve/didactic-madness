import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
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
@ApiExtraModels(ListOrderItemsQuery)
@Controller('order-items')
export class OrderItemController extends BaseController<
  CreateOrderItemCommand,
  UpdateOrderItemCommand,
  DeleteOrderItemCommand,
  GetOrderItemByIdQuery,
  OrderItemResponse
> {
  constructor(
    createHandler: CreateOrderItemCommandHandler,
    updateHandler: UpdateOrderItemCommandHandler,
    deleteHandler: DeleteOrderItemCommandHandler,
    getByIdHandler: GetOrderItemByIdQueryHandler,
    private readonly listHandler: ListOrderItemsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListOrderItemsQuery): Promise<ListOrderItemsResponse> {
      return this.listHandler.execute(query);
    }
}
