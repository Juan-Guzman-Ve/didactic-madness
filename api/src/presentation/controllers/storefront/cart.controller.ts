import { Controller, Get, Put, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  CartItemResponse,
  ListCartItemsQuery,
  ListCartItemsQueryHandler,
  ListCartItemsResponse,
  SyncCartItemsCommand,
  SyncCartItemsCommandHandler,
} from '@app/application/features/cart-item';

@ApiTags('storefront / cart')
@ApiBearerAuth()
@ApiExtraModels(ListCartItemsQuery)
@Controller('cart')
export class StorefrontCartController {
  constructor(
    private readonly listHandler: ListCartItemsQueryHandler,
    private readonly syncHandler: SyncCartItemsCommandHandler,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  list(@Query() query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
    return this.listHandler.execute(query);
  }

  @ApiBody({ type: SyncCartItemsCommand })
  @Put()
  @HttpCode(HttpStatus.OK)
  sync(@Body() command: SyncCartItemsCommand): Promise<CartItemResponse[]> {
    return this.syncHandler.execute(command);
  }
}
