import { AuditableEntity } from './base';

export interface RolePolicy extends AuditableEntity {
  roleId: string;
  policyId: string;
}
