import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('cart-items')
export class CartItemController extends BaseController<
  CreateCartItemCommand,
  UpdateCartItemCommand,
  DeleteCartItemCommand,
  GetCartItemByIdQuery,
  ListCartItemsQuery,
  CartItemResponse,
  ListCartItemsResponse
> {
  constructor(
    createHandler: CreateCartItemCommandHandler,
    updateHandler: UpdateCartItemCommandHandler,
    deleteHandler: DeleteCartItemCommandHandler,
    getByIdHandler: GetCartItemByIdQueryHandler,
    listHandler: ListCartItemsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
