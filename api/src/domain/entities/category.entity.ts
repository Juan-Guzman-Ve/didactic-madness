import { AuditableEntity } from './base';

export interface Category extends AuditableEntity {
  name: string;
  description: string;
  slug: string;
}
