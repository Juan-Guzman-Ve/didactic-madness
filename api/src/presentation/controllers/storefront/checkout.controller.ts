import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  CheckoutCommand,
  CheckoutCommandHandler,
  OrderResponse,
} from '@app/application/features/order';
import { CurrentUser } from '@app/presentation/decorators';

@ApiTags('storefront / checkout')
@ApiBearerAuth()
@Controller('checkout')
export class StorefrontCheckoutController {
  constructor(private readonly checkoutHandler: CheckoutCommandHandler) {}

  @ApiBody({ type: CheckoutCommand })
  @Post()
  checkout(
    @Body() command: CheckoutCommand,
    @CurrentUser() user: { id: number },
  ): Promise<OrderResponse> {
    command.userId = user.id;
    return this.checkoutHandler.execute(command);
  }
}
