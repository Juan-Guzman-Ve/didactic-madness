import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('order-status-histories')
@ApiBearerAuth()
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

  @RequirePolicies('orders:read')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<OrderStatusHistoryResponse> {
    return super.getById(id);
  }

  @RequirePolicies('orders:update')
  @ApiBody({ type: CreateOrderStatusHistoryCommand })
  @Post()
  override create(@Body() command: CreateOrderStatusHistoryCommand): Promise<OrderStatusHistoryResponse> {
    return super.create(command);
  }

  @RequirePolicies('orders:update')
  @ApiBody({ type: UpdateOrderStatusHistoryCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderStatusHistoryCommand,
  ): Promise<OrderStatusHistoryResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('orders:update')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('orders:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListOrderStatusHistoriesQuery): Promise<ListOrderStatusHistoriesResponse> {
    return this.listHandler.execute(query);
  }
}
