import { AuditableEntity } from './base';

export interface Role extends AuditableEntity {
  name: string;
  description?: string;
}
