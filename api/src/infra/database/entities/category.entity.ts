import { Entity, Column } from 'typeorm';
import { AuditableEntity } from './base';

@Entity('categories')
export class CategoryEntity extends AuditableEntity {
  @Column({ unique: true })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ unique: true })
  slug!: string;
}
