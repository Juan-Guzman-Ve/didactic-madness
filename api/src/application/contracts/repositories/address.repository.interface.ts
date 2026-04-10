import { Address } from '@app/domain';
import { IRepository, PaginationParams, PaginatedResult } from '@app/application';

export interface IAddressRepository extends IRepository<Address> {
  findByUserId(userId: number): Promise<Address[]>;
  findPaginatedByUserId(userId: number, params: PaginationParams): Promise<PaginatedResult<Address>>;
}
