import { AuditableEntity } from './base';

export class Role implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  name!: string;
  description?: string;
}
