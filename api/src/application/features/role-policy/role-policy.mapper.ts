import { RolePolicy } from '@app/domain';
import { RolePolicyResponse } from './role-policy.responses';

export class RolePolicyMapper {
  static toResponse(rolePolicy: RolePolicy): RolePolicyResponse {
    return {
      id: rolePolicy.id,
      roleId: rolePolicy.roleId,
      policyId: rolePolicy.policyId,
      createdAt: rolePolicy.createdAt,
      updatedAt: rolePolicy.updatedAt,
    };
  }
}
