import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CartItemResponse,
  CreateCartItemCommand,
  CreateCartItemCommandHandler,
  DeleteCartItemCommand,
  DeleteCartItemCommandHandler,
  GetCartItemByIdQuery,
  GetCartItemByIdQueryHandler,
  ListCartItemsQuery,
  ListCartItemsQueryHandler,
  ListCartItemsResponse,
  UpdateCartItemCommand,
  UpdateCartItemCommandHandler,
} from '@app/application/features/cart-item';
import { BaseController } from '@app/presentation/base';

@ApiTags('cart-items')
@ApiExtraModels(ListCartItemsQuery)
@Controller('cart-items')
export class CartItemController extends BaseController<
  CreateCartItemCommand,
  UpdateCartItemCommand,
  DeleteCartItemCommand,
  GetCartItemByIdQuery,
  CartItemResponse
> {
  constructor(
    createHandler: CreateCartItemCommandHandler,
    updateHandler: UpdateCartItemCommandHandler,
    deleteHandler: DeleteCartItemCommandHandler,
    getByIdHandler: GetCartItemByIdQueryHandler,
    private readonly listHandler: ListCartItemsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
      return this.listHandler.execute(query);
    }
}
