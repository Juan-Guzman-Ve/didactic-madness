import { RolePolicy } from '@app/domain';
import { IRepository } from '@app/application';

export interface IRolePolicyRepository extends IRepository<RolePolicy> {
  findByRoleId(roleId: number): Promise<RolePolicy[]>;
  findByPolicyId(policyId: number): Promise<RolePolicy[]>;
}
