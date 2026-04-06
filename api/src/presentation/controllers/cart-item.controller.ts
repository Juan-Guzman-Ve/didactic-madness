import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  CartItemResponse,
  ListCartItemsQuery,
  ListCartItemsQueryHandler,
  ListCartItemsResponse,
  SyncCartItemsCommand,
  SyncCartItemsCommandHandler
} from '@app/application/features/cart-item';
import { BaseController } from '@app/presentation/base';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('cart-items')
@ApiBearerAuth()
@ApiExtraModels(ListCartItemsQuery)
@Controller('cart-items')
export class CartItemController {
  constructor(
    private readonly listHandler: ListCartItemsQueryHandler,
    private readonly syncHandler: SyncCartItemsCommandHandler,
  ) {}

  @RequirePolicies('cart:manage')
  @ApiBody({ type: SyncCartItemsCommand })
  @Put()
  sync(@Body() command: SyncCartItemsCommand): Promise<CartItemResponse[]> {
    return this.syncHandler.execute(command);
  }

  @RequirePolicies('cart:manage')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
    return this.listHandler.execute(query);
  }
}
