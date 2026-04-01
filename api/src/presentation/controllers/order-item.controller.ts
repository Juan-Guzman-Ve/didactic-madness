import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';
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
@ApiBearerAuth()
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


  @RequirePolicies('order-items:read')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<OrderItemResponse> {
    return super.getById(id);
  }

  @RequirePolicies('order-items:create')
  @ApiBody({ type: CreateOrderItemCommand })
  @Post()
  override create(@Body() command: CreateOrderItemCommand): Promise<OrderItemResponse> {
    return super.create(command);
  }

  @RequirePolicies('order-items:update')
  @ApiBody({ type: UpdateOrderItemCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderItemCommand,
  ): Promise<OrderItemResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('order-items:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('order-items:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListOrderItemsQuery): Promise<ListOrderItemsResponse> {
    return this.listHandler.execute(query);
  }
}
