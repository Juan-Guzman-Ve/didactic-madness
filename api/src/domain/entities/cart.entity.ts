import { AuditableEntity } from './base';

export interface Cart extends AuditableEntity {
  userId: string;
}
