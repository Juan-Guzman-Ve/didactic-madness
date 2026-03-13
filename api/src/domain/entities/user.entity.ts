import { AuditableEntity } from './base';

export class User implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  email!: string;
  passwordHash!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  roleId!: string;
  status!: string;
}
