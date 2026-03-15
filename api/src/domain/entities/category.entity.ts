import { AuditableEntity } from './base';

export class Category extends AuditableEntity {
  name!: string;
  description!: string;
  slug!: string;
}
