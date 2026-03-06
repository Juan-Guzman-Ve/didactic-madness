import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * HealthCheck Entity — POC table to verify database connectivity
 * 
 * This is a simple proof-of-concept entity to test:
 * - Database connection
 * - TypeORM integration
 * - Query execution
 */
@Entity('health_checks')
export class HealthCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  service: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'checked_at' })
  checkedAt: Date;
}
