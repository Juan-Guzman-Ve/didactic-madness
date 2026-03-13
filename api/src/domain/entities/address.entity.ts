import { AuditableEntity } from './base';

export class Address implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  userId!: string;
  addressLine1!: string;
  addressLine2?: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
  isDefault!: boolean;
}
