import { Controller, Get, Put, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  GetOrderByIdQuery,
  GetOrderByIdQueryHandler,
  ListOrdersQuery,
  ListOrdersQueryHandler,
  ListOrdersResponse,
  OrderResponse,
  UpdateOrderCommand,
  UpdateOrderCommandHandler,
} from '@app/application/features/order';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('admin / orders')
@ApiBearerAuth()
@ApiExtraModels(ListOrdersQuery)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(
    private readonly updateHandler: UpdateOrderCommandHandler,
    private readonly getByIdHandler: GetOrderByIdQueryHandler,
    private readonly listHandler: ListOrdersQueryHandler,
  ) {}

  @RequirePolicies('orders:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListOrdersQuery): Promise<ListOrdersResponse> {
    return this.listHandler.execute(query);
  }

  @RequirePolicies('orders:read')
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<OrderResponse> {
    return this.getByIdHandler.execute({ id } as GetOrderByIdQuery);
  }

  @RequirePolicies('orders:update')
  @ApiBody({ type: UpdateOrderCommand })
  @Put(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderCommand,
  ): Promise<OrderResponse> {
    return this.updateHandler.execute({ ...body, id } as UpdateOrderCommand);
  }
}
