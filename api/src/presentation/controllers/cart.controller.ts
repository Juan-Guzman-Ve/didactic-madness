import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('cart')
@ApiExtraModels(ListCartsQuery)
@Controller('carts')
@RequirePolicies('cart:manage')
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

  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<CartResponse> {
    return super.getById(id);
  }

  @ApiBody({ type: CreateCartCommand })
  @Post()
  override create(@Body() command: CreateCartCommand): Promise<CartResponse> {
    return super.create(command);
  }

  @ApiBody({ type: UpdateCartCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartCommand,
  ): Promise<CartResponse> {
    return super.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListCartsQuery): Promise<ListCartsResponse> {
    return this.listHandler.execute(query);
  }
}

