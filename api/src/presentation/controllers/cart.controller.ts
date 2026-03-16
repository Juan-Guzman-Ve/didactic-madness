import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CartResponse,
  CreateCartCommand,
  CreateCartCommandHandler,
  DeleteCartCommand,
  DeleteCartCommandHandler,
  GetCartByIdQuery,
  GetCartByIdQueryHandler,
  ListCartsQuery,
  ListCartsQueryHandler,
  ListCartsResponse,
  UpdateCartCommand,
  UpdateCartCommandHandler,
} from '@app/application/features/cart';
import { BaseController } from '@app/presentation/base';

@ApiTags('carts')
@ApiExtraModels(ListCartsQuery)
@Controller('carts')
export class CartController extends BaseController<
  CreateCartCommand,
  UpdateCartCommand,
  DeleteCartCommand,
  GetCartByIdQuery,
  CartResponse
> {
  constructor(
    createHandler: CreateCartCommandHandler,
    updateHandler: UpdateCartCommandHandler,
    deleteHandler: DeleteCartCommandHandler,
    getByIdHandler: GetCartByIdQueryHandler,
    private readonly listHandler: ListCartsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListCartsQuery): Promise<ListCartsResponse> {
      return this.listHandler.execute(query);
    }
}
