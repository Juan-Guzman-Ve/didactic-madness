import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CreateHealthChecksTable Migration — TypeORM wrapper
 * 
 * Source of truth: database/migrations/20260305_create_health_checks_table.sql
 * 
 * This migration wraps the hand-written SQL for TypeORM compatibility.
 */
export class CreateHealthChecksTable1709654400000 implements MigrationInterface {
  name = 'CreateHealthChecksTable1709654400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlPath = path.join(
      __dirname,
      '../../../database/migrations/20260305_create_health_checks_table.sql',
    );

    const sql = fs.readFileSync(sqlPath, 'utf8');
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sqlPath = path.join(
      __dirname,
      '../../../database/migrations/20260305_create_health_checks_table_rollback.sql',
    );

    const sql = fs.readFileSync(sqlPath, 'utf8');
    await queryRunner.query(sql);
  }
}
