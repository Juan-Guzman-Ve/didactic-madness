import { Entity, Column } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('policies')
export class PolicyEntity extends AuditableEntity {
  @Column({ unique: true })
  name!: string;

  @Column()
  resource!: string;

  @Column()
  action!: string;

  @Column('text', { nullable: true })
  description!: string;
}
