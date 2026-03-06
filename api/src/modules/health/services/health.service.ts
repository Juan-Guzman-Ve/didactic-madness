import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { HealthCheckRepository } from '../repositories/health-check.repository';

/**
 * HealthService — Business logic for health checks
 * 
 * Responsible for:
 * - Database connectivity checks
 * - Health status recording
 * - Service health aggregation
 */
@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly healthCheckRepository: HealthCheckRepository,
  ) {}

  /**
   * Check database connectivity by executing a simple query
   */
  async checkDatabase(): Promise<{
    status: string;
    database: string;
    connected: boolean;
    latency: number;
  }> {
    const startTime = Date.now();

    try {
      await this.connection.query('SELECT 1 as health_check');
      const latency = Date.now() - startTime;

      // Record successful check
      await this.healthCheckRepository.create('database', 'healthy', `Connected in ${latency}ms`);

      return {
        status: 'healthy',
        database: this.connection.options.database as string,
        connected: true,
        latency,
      };
    } catch (error) {
      const latency = Date.now() - startTime;

      // Record failed check
      await this.healthCheckRepository.create('database', 'unhealthy', error.message).catch(() => {
        // Ignore if we can't save the error log
      });

      return {
        status: 'unhealthy',
        database: this.connection.options.database as string,
        connected: false,
        latency,
      };
    }
  }

  /**
   * Get all health check records from database
   */
  async getHealthHistory(): Promise<any[]> {
    return this.healthCheckRepository.findAll();
  }

  /**
   * Overall application health check
   */
  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    checks: any;
  }> {
    const dbCheck = await this.checkDatabase();

    return {
      status: dbCheck.connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbCheck,
      },
    };
  }
}
