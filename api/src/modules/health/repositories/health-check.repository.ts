import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheck } from '../entities/health-check.entity';

/**
 * HealthCheckRepository — Data access layer for health checks
 * 
 * Following repository pattern for database operations.
 */
@Injectable()
export class HealthCheckRepository {
  constructor(
    @InjectRepository(HealthCheck)
    private readonly repository: Repository<HealthCheck>,
  ) {}

  async findAll(): Promise<HealthCheck[]> {
    return this.repository.find({
      order: { checkedAt: 'DESC' },
      take: 10,
    });
  }

  async create(service: string, status: string, message?: string): Promise<HealthCheck> {
    const healthCheck = this.repository.create({
      service,
      status,
      message,
    });

    return this.repository.save(healthCheck);
  }

  async getLatestCheck(service: string): Promise<HealthCheck | null> {
    return this.repository.findOne({
      where: { service },
      order: { checkedAt: 'DESC' },
    });
  }
}
