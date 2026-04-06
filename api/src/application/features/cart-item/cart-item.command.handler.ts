import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICartItemRepository, CART_ITEM_REPOSITORY, ICommandHandler, IProductRepository, PRODUCT_REPOSITORY } from '@app/application';
import { CartItem } from '@app/domain';
import { SyncCartItemsCommand, CartItemDto } from './cart-item.commands';
import { CartItemResponse } from './cart-item.responses';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class SyncCartItemsCommandHandler implements ICommandHandler<SyncCartItemsCommand, CartItemResponse[]> {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly cartItemRepository: ICartItemRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: SyncCartItemsCommand): Promise<CartItemResponse[]> {

    if (command.items.length === 0) throw new BadRequestException('Items list cannot be empty');

    const cartId = command.cartId;
    const existingItems = await this.cartItemRepository.findByCartId(cartId);
    await this.deleteCartProducts(existingItems);
    await this.validateStock(command.items);
    const newItems = await this.EntitiesToDomain(command.items, cartId)
    const items = await this.cartItemRepository.createMany(newItems);
    return items.map(CartItemMapper.toResponse);
  }

  private async validateStock(items: CartItemDto[]): Promise<void> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) 
        throw new NotFoundException(`Product with ID ${item.productId} not found`);

      if (product.stock < item.quantity) 
        throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
      
    }
  }

  private async deleteCartProducts(cartItems: CartItem[]): Promise<void> {
    const itemIds = cartItems.map((item) => item.id);
    await this.cartItemRepository.deleteByIds(itemIds);
  }

  private async EntitiesToDomain(items: CartItemDto[], cartId: number): Promise<CartItem[]> {
    return items.map((item) =>
      Object.assign(new CartItem(), {
        cartId,
        productId: item.productId,
        quantity: item.quantity,
      }),
    );
  }
}
