import { AuditableEntity } from './base';

export class Role extends AuditableEntity {
  name!: string;
  description?: string;
}
