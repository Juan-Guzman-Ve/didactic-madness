import { Entity, Column } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('addresses')
export class AddressEntity extends AuditableEntity {
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'address_line_1' })
  addressLine1!: string;

  @Column({ name: 'address_line_2', nullable: true })
  addressLine2!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ name: 'postal_code' })
  postalCode!: string;

  @Column()
  country!: string;

  @Column({ name: 'is_default', default: false })
  isDefault!: boolean;
}
