import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  CreateOrderStatusHistoryCommand,
  CreateOrderStatusHistoryCommandHandler,
  GetOrderStatusHistoryByIdQuery,
  GetOrderStatusHistoryByIdQueryHandler,
  ListOrderStatusHistoriesQuery,
  ListOrderStatusHistoriesQueryHandler,
  ListOrderStatusHistoriesResponse,
  OrderStatusHistoryResponse,
} from '@app/application/features/order-status-history';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('admin / order-status-histories')
@ApiBearerAuth()
@ApiExtraModels(ListOrderStatusHistoriesQuery)
@Controller('admin/order-status-histories')
export class AdminOrderStatusHistoriesController {
  constructor(
    private readonly createHandler: CreateOrderStatusHistoryCommandHandler,
    private readonly getByIdHandler: GetOrderStatusHistoryByIdQueryHandler,
    private readonly listHandler: ListOrderStatusHistoriesQueryHandler,
  ) {}

  @RequirePolicies('orders:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListOrderStatusHistoriesQuery): Promise<ListOrderStatusHistoriesResponse> {
    return this.listHandler.execute(query);
  }

  @RequirePolicies('orders:read')
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<OrderStatusHistoryResponse> {
    return this.getByIdHandler.execute({ id } as GetOrderStatusHistoryByIdQuery);
  }

  @RequirePolicies('orders:update')
  @ApiBody({ type: CreateOrderStatusHistoryCommand })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  pushStatus(@Body() command: CreateOrderStatusHistoryCommand): Promise<OrderStatusHistoryResponse> {
    return this.createHandler.execute(command);
  }
}
