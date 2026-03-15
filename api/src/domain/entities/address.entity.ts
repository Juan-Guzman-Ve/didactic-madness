import { AuditableEntity } from './base';

export class Address extends AuditableEntity {
  userId!: number;
  addressLine1!: string;
  addressLine2?: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
  isDefault!: boolean;
}
