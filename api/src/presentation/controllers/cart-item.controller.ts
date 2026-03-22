import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('cart-items')
@ApiExtraModels(ListCartItemsQuery)
@Controller('cart-items')
@RequirePolicies('cart:manage')
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

  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<CartItemResponse> {
    return super.getById(id);
  }

  @ApiBody({ type: CreateCartItemCommand })
  @Post()
  override create(@Body() command: CreateCartItemCommand): Promise<CartItemResponse> {
    return super.create(command);
  }

  @ApiBody({ type: UpdateCartItemCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartItemCommand,
  ): Promise<CartItemResponse> {
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
  list(@Query() query: ListCartItemsQuery): Promise<ListCartItemsResponse> {
    return this.listHandler.execute(query);
  }
}
