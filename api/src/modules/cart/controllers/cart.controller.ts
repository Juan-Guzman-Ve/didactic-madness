import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart() {
    // TODO: Get user's cart with items
    return {
      message: 'Get cart - implementation pending',
    };
  }

  @Post('items')
  async addItem(@Body() addToCartDto: AddToCartDto) {
    // TODO: Add item to cart
    return {
      message: 'Add to cart - implementation pending',
      dto: addToCartDto,
    };
  }

  @Put('items/:id')
  async updateItem(@Param('id') id: string, @Body() updateDto: UpdateCartItemDto) {
    // TODO: Update cart item quantity
    return {
      message: `Update cart item ${id} - implementation pending`,
      dto: updateDto,
    };
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string) {
    // TODO: Remove item from cart
    return {
      message: `Remove cart item ${id} - implementation pending`,
    };
  }

  @Delete()
  async clearCart() {
    // TODO: Clear entire cart
    return {
      message: 'Clear cart - implementation pending',
    };
  }
}
