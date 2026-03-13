import { AuditableEntity } from './base';

export class Category implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  name!: string;
  description!: string;
  slug!: string;
}
