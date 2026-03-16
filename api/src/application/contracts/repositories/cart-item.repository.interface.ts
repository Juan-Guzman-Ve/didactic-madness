import { CartItem } from '@app/domain';
import { IRepository } from '@app/application';

export interface ICartItemRepository extends IRepository<CartItem> {
  findByCartId(cartId: number): Promise<CartItem[]>;
}
