import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
  SyncCartItemsCommand,
  SyncCartItemsCommandHandler,
  UpdateCartItemCommand,
  UpdateCartItemCommandHandler,
} from '@app/application/features/cart-item';
import { BaseController } from '@app/presentation/base';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('cart-items')
@ApiBearerAuth()
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
    private readonly syncHandler: SyncCartItemsCommandHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }


  @RequirePolicies('cart:manage')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<CartItemResponse> {
    return super.getById(id);
  }


  @RequirePolicies('cart:manage')
  @ApiBody({ type: CreateCartItemCommand })
  @Post()
  override create(@Body() command: CreateCartItemCommand): Promise<CartItemResponse> {
    return super.create(command);
  }


  @RequirePolicies('cart:manage')
  @ApiBody({ type: UpdateCartItemCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartItemCommand,
  ): Promise<CartItemResponse> {
    return super.update(id, body);
  }


  @RequirePolicies('cart:manage')
  @ApiBody({ type: SyncCartItemsCommand })
  @Put()
  sync(@Body() command: SyncCartItemsCommand): Promise<CartItemResponse[]> {
    return this.syncHandler.execute(command);
  }


  @RequirePolicies('cart:manage')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
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
