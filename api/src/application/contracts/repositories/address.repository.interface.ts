import { IRepository } from './base/repository.interface';
import { Address } from '../../../domain/entities';

export interface IAddressRepository extends IRepository<Address> {
  findByUserId(userId: string): Promise<Address[]>;
  findDefaultByUserId(userId: string): Promise<Address | null>;
  setAsDefault(addressId: string, userId: string): Promise<void>;
}
