import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('carts')
export class CartController extends BaseController<
  CreateCartCommand,
  UpdateCartCommand,
  DeleteCartCommand,
  GetCartByIdQuery,
  ListCartsQuery,
  CartResponse,
  ListCartsResponse
> {
  constructor(
    createHandler: CreateCartCommandHandler,
    updateHandler: UpdateCartCommandHandler,
    deleteHandler: DeleteCartCommandHandler,
    getByIdHandler: GetCartByIdQueryHandler,
    listHandler: ListCartsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
