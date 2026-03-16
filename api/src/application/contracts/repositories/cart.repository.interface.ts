import { Cart } from '@app/domain';
import { IRepository } from '@app/application';

export interface ICartRepository extends IRepository<Cart> {
  findByUserId(userId: number): Promise<Cart | null>;
}
