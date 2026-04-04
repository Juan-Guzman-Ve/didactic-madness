import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  CartResponse,
  CreateCartCommand,
  CreateCartCommandHandler,
  GetCartByIdQuery,
  GetCartByIdQueryHandler,
  ListCartsQuery,
  ListCartsQueryHandler,
  ListCartsResponse
} from '@app/application/features/cart';
import { BaseController } from '@app/presentation/base';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@ApiExtraModels(ListCartsQuery)
@Controller('carts')
export class CartController
{
  constructor(
    getByIdHandler: GetCartByIdQueryHandler,
    private readonly listHandler: ListCartsQueryHandler,
  ) {
  }


  @RequirePolicies('cart:read_all')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<CartResponse> {
    return super.getById(id);
  }


  @RequirePolicies('cart:manage')
  @ApiBody({ type: CreateCartCommand })
  @Post()
  override create(@Body() command: CreateCartCommand): Promise<CartResponse> {
    return super.create(command);
  }


  @RequirePolicies('cart:manage')
  @ApiBody({ type: UpdateCartCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartCommand,
  ): Promise<CartResponse> {
    return super.update(id, body);
  }


  @RequirePolicies('cart:manage')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('cart:read_all')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListCartsQuery): Promise<ListCartsResponse> {
    return this.listHandler.execute(query);
  }
}

