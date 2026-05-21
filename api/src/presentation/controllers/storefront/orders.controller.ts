import { Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetOrderByIdQuery,
  GetOrderByIdQueryHandler,
  ListOrdersQuery,
  ListOrdersQueryHandler,
  ListOrdersResponse,
  OrderResponse,
  CancelOrderCommand,
  CancelOrderCommandHandler,
} from '@app/application/features/order';
import {
  ListOrderItemsQuery,
  ListOrderItemsQueryHandler,
  ListOrderItemsResponse,
} from '@app/application/features/order-item';
import { CurrentUser } from '@app/presentation/decorators';

@ApiTags('orders')
@ApiBearerAuth()
@ApiExtraModels(ListOrdersQuery)
@Controller('orders')
export class StorefrontOrdersController {
  constructor(
    private readonly getByIdHandler: GetOrderByIdQueryHandler,
    private readonly listHandler: ListOrdersQueryHandler,
    private readonly listItemsHandler: ListOrderItemsQueryHandler,
    private readonly cancelHandler: CancelOrderCommandHandler,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(
    @Query() query: ListOrdersQuery,
    @CurrentUser() _user: { id: number },
  ): Promise<ListOrdersResponse> {
    return this.listHandler.execute(query);
  }

  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() _user: { id: number },
  ): Promise<OrderResponse> {
    return this.getByIdHandler.execute({ id } as GetOrderByIdQuery);
  }

  @Get(':id/items')
  getItems(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListOrderItemsResponse> {
    return this.listItemsHandler.execute({ orderId: id } as ListOrderItemsQuery);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ): Promise<OrderResponse> {
    return this.cancelHandler.execute({ id, userId: user.id } as CancelOrderCommand);
  }
}
