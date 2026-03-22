import { Policy } from '@app/domain';
import { IRepository } from '@app/application';

export interface IPolicyRepository extends IRepository<Policy> {
  findByRoleId(roleId: number): Promise<Policy[]>;
}
