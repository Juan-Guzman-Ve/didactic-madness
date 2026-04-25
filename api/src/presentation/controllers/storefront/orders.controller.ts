import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetOrderByIdQuery,
  GetOrderByIdQueryHandler,
  ListOrdersQuery,
  ListOrdersQueryHandler,
  ListOrdersResponse,
  OrderResponse,
} from '@app/application/features/order';
import { CurrentUser } from '@app/presentation/decorators';

@ApiTags('orders')
@ApiBearerAuth()
@ApiExtraModels(ListOrdersQuery)
@Controller('orders')
export class StorefrontOrdersController {
  constructor(
    private readonly getByIdHandler: GetOrderByIdQueryHandler,
    private readonly listHandler: ListOrdersQueryHandler,
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
}
