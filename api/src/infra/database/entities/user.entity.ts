import { Entity, Column } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('users')
export class UserEntity extends AuditableEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ name: 'role_id', type: 'integer' })
  roleId!: number;

  @Column({ default: 'Active' })
  status!: string;
}
