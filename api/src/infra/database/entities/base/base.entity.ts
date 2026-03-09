import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

/**
 * Base entity class for TypeORM
 * Provides common fields for all entities
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

/**
 * Auditable entity class for TypeORM
 * Provides audit trail fields
 * 
 * Audit fields are automatically populated by AuditSubscriber:
 * - createdAt: Set on insert
 * - updatedAt: Set on insert and update
 * - createdBy: Set on insert (from request context)
 * - updatedBy: Set on update (from request context)
 */
export abstract class AuditableEntity extends BaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy!: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy!: string;
}
