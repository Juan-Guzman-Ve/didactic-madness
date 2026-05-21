import { Controller, Get, Post, Put, Body, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  AddToCartCommand,
  AddToCartCommandHandler,
  CartItemResponse,
  ListCartItemsQuery,
  ListCartItemsQueryHandler,
  ListCartItemsResponse,
  SyncCartItemsCommand,
  SyncCartItemsCommandHandler,
} from '@app/application/features/cart-item';
import { IPolicyRepository, POLICY_REPOSITORY } from '@app/application';
import { CurrentUser } from '@app/presentation/decorators';

const CART_FULL_ACCESS_POLICY = 'cart:read_all';

@ApiTags('storefront / cart')
@ApiBearerAuth()
@ApiExtraModels(ListCartItemsQuery)
@Controller('cart')
export class StorefrontCartController {
  constructor(
    private readonly listHandler: ListCartItemsQueryHandler,
    private readonly syncHandler: SyncCartItemsCommandHandler,
    private readonly addToCartHandler: AddToCartCommandHandler,
    @Inject(POLICY_REPOSITORY) private readonly policyRepository: IPolicyRepository,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async list(
    @Query() query: ListCartItemsQuery,
    @CurrentUser() user: { id: number; roleId: number },
  ): Promise<ListCartItemsResponse> {
    const userPolicies = await this.policyRepository.findByRoleId(user.roleId);
    const hasFullAccess = userPolicies.some(p => p.name === CART_FULL_ACCESS_POLICY);

    if (!hasFullAccess) {
      query.userId = user.id;
    }

    return this.listHandler.execute(query);
  }

  @ApiBody({ type: AddToCartCommand })
  @Post()
  @HttpCode(HttpStatus.OK)
  async addToCart(
    @Body() command: AddToCartCommand,
    @CurrentUser() user: { id: number; roleId: number },
  ): Promise<CartItemResponse> {
    command.userId = user.id;
    return this.addToCartHandler.execute(command);
  }

  @ApiBody({ type: SyncCartItemsCommand })
  @Put()
  @HttpCode(HttpStatus.OK)
  sync(@Body() command: SyncCartItemsCommand): Promise<CartItemResponse[]> {
    return this.syncHandler.execute(command);
  }
}
