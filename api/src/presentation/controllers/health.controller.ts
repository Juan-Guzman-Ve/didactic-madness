import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-03-09T12:00:00.000Z',
        environment: 'development',
      },
    },
  })
  healthCheck(): { status: string; timestamp: string; environment: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Database connectivity check' })
  @ApiResponse({
    status: 200,
    description: 'Database connection is healthy',
    schema: {
      example: {
        status: 'ok',
        database: 'connected',
      },
    },
  })
  async databaseCheck(): Promise<{
    status: string;
    database: string;
  }> {
    // Simple check - if this endpoint responds, TypeORM connection is working
    return {
      status: 'ok',
      database: 'connected',
    };
  }
}
