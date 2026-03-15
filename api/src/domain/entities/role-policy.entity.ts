import { AuditableEntity } from './base';

export class RolePolicy extends AuditableEntity {
  roleId!: number;
  policyId!: number;
}
