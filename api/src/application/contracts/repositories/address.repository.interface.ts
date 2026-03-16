import { Address } from '@app/domain';
import { IRepository } from '@app/application';

export interface IAddressRepository extends IRepository<Address> {
  findByUserId(userId: number): Promise<Address[]>;
}
