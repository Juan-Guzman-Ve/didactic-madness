import { AuditableEntity } from './base';

export class Policy extends AuditableEntity {
  name!: string;
  resource!: string;
  action!: string;
  description?: string;
}
