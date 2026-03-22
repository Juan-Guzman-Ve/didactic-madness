import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

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

  @RequirePolicies('orders:read')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<OrderResponse> {
    return super.getById(id);
  }

  @RequirePolicies('orders:create')
  @ApiBody({ type: CreateOrderCommand })
  @Post()
  override create(@Body() command: CreateOrderCommand): Promise<OrderResponse> {
    return super.create(command);
  }

  @RequirePolicies('orders:update')
  @ApiBody({ type: UpdateOrderCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderCommand,
  ): Promise<OrderResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('orders:cancel')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('orders:read', 'orders:list')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListOrdersQuery): Promise<ListOrdersResponse> {
    return this.listHandler.execute(query);
  }
}
