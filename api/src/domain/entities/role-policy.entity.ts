import { AuditableEntity } from './base';

export class RolePolicy implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  roleId!: string;
  policyId!: string;
}
