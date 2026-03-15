import { AuditableEntity } from './base';

export class User extends AuditableEntity {
  email!: string;
  passwordHash!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  roleId!: number;
  status!: string;
}
