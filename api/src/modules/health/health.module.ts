import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from './entities/health-check.entity';
import { HealthCheckRepository } from './repositories/health-check.repository';
import { HealthService } from './services/health.service';
import { HealthController } from './controllers/health.controller';

/**
 * HealthModule — POC module for database connectivity testing
 * 
 * Purpose:
 * - Verify database connection
 * - Test TypeORM integration
 * - Provide health check endpoints
 */
@Module({
  imports: [TypeOrmModule.forFeature([HealthCheck])],
  controllers: [HealthController],
  providers: [HealthService, HealthCheckRepository],
  exports: [HealthService],
})
export class HealthModule {}
