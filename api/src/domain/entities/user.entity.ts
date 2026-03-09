import { AuditableEntity } from './base';

export interface User extends AuditableEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleId: string;
  status: string;
}
