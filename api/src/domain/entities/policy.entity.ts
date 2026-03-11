import { AuditableEntity } from './base';

export interface Policy extends AuditableEntity {
  name: string;
  resource: string;
  action: string;
  description?: string;
}
