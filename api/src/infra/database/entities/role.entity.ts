import { Entity, Column } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('roles')
export class RoleEntity extends AuditableEntity {
  @Column({ unique: true })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;
}
