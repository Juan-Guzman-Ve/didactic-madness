import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetOrderItemByIdQuery,
  GetOrderItemByIdQueryHandler,
  ListOrderItemsQuery,
  ListOrderItemsQueryHandler,
  ListOrderItemsResponse,
  OrderItemResponse,
} from '@app/application/features/order-item';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('admin / order-items')
@ApiBearerAuth()
@ApiExtraModels(ListOrderItemsQuery)
@Controller('admin/order-items')
export class AdminOrderItemsController {
  constructor(
    private readonly getByIdHandler: GetOrderItemByIdQueryHandler,
    private readonly listHandler: ListOrderItemsQueryHandler,
  ) {}

  @RequirePolicies('orders:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListOrderItemsQuery): Promise<ListOrderItemsResponse> {
    return this.listHandler.execute(query);
  }

  @RequirePolicies('orders:read')
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<OrderItemResponse> {
    return this.getByIdHandler.execute({ id } as GetOrderItemByIdQuery);
  }
}
