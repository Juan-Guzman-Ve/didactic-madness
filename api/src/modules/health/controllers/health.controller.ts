import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

/**
 * HealthController — Health check endpoints
 * 
 * Endpoints:
 * - GET /api/health - Overall health status
 * - GET /api/health/database - Database connectivity check
 * - GET /api/health/history - Recent health check records
 */
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.getHealth();
  }

  @Get('database')
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Get('history')
  async getHistory() {
    const records = await this.healthService.getHealthHistory();
    return {
      total: records.length,
      records,
    };
  }
}
