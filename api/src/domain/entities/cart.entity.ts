import { AuditableEntity } from './base';

export class Cart implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  userId!: string;
}
