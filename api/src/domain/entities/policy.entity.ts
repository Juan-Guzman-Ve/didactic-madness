import { AuditableEntity } from './base';

export class Policy implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  name!: string;
  resource!: string;
  action!: string;
  description?: string;
}
