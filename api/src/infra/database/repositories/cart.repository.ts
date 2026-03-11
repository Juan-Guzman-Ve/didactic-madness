import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { ICartRepository, CartWithItems } from '../../../application/contracts/repositories';
import { Cart, CartItem } from '../../../domain/entities';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';

/**
 * Cart repository implementation
 * Handles cart and cart items operations
 */
@Injectable()
export class CartRepository extends BaseRepository<Cart, CartEntity> implements ICartRepository {
  constructor(
    @InjectRepository(CartEntity)
    repository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {
    super(repository);
  }

  /**
   * Map TypeORM entity to domain entity
   */
  protected toDomain(entity: CartEntity): Cart {
    return {
      id: entity.id,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * Map domain entity to TypeORM entity
   */
  protected toEntity(domain: Partial<Cart>): Partial<CartEntity> {
    const entity: Partial<CartEntity> = {};

    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.userId !== undefined) entity.userId = domain.userId;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;

    return entity;
  }

  /**
   * Map cart item entity to domain
   */
  private cartItemToDomain(entity: CartItemEntity): CartItem {
    return {
      id: entity.id,
      cartId: entity.cartId,
      productId: entity.productId,
      quantity: entity.quantity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findByUserId(userId: string): Promise<Cart | null> {
    const entity = await this.repository.findOne({ where: { userId } });
    return entity ? this.toDomain(entity) : null;
  }

  async getCartWithItems(userId: string): Promise<CartWithItems | null> {
    const cartEntity = await this.repository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cartEntity) return null;

    return {
      ...this.toDomain(cartEntity),
      items: cartEntity.items.map((item) => this.cartItemToDomain(item)),
    };
  }

  async addItem(cartId: string, productId: string, quantity: number): Promise<void> {
    // Check if item already exists
    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create new item
      const newItem = this.cartItemRepository.create({
        cartId,
        productId,
        quantity,
      });
      await this.cartItemRepository.save(newItem);
    }
  }

  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<void> {
    await this.cartItemRepository.update(
      { cartId, productId },
      { quantity },
    );
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await this.cartItemRepository.delete({ cartId, productId });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.cartItemRepository.delete({ cartId });
  }

  async findCartItem(cartId: string, productId: string): Promise<CartItem | null> {
    const entity = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });
    return entity ? this.cartItemToDomain(entity) : null;
  }
}
