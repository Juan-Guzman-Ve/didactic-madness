import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, AppConfig } from './index';

/**
 * Example service demonstrating proper configuration usage
 * 
 * This replaces the old pattern of accessing process.env directly
 */
@Injectable()
export class ConfigExampleService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get database configuration (fully typed)
   */
  getDatabaseInfo(): string {
    const dbConfig = this.configService.get<DatabaseConfig>('database')!;
    
    return `Connected to ${dbConfig.database} at ${dbConfig.host}:${dbConfig.port}`;
  }

  /**
   * Get specific config value (with type inference)
   */
  isProduction(): boolean {
    const env = this.configService.get<string>('app.environment');
    return env === 'production';
  }

  /**
   * Get application configuration
   */
  getAppInfo(): string {
    const appConfig = this.configService.get<AppConfig>('app')!;
    
    return `Running on port ${appConfig.port} in ${appConfig.environment} mode`;
  }

  /**
   * Environment-specific behavior
   */
  getLoggingLevel(): string {
    const appConfig = this.configService.get<AppConfig>('app')!;
    
    switch (appConfig.environment) {
      case 'production':
        return 'error';
      case 'test':
        return 'warn';
      case 'development':
      default:
        return 'debug';
    }
  }

  /**
   * Check SSL configuration
   */
  isDatabaseSecure(): boolean {
    const dbConfig = this.configService.get<DatabaseConfig>('database')!;
    return dbConfig.ssl;
  }

  /**
   * Get connection pool info
   */
  getConnectionPoolInfo(): { max: number; timeout: number } {
    const dbConfig = this.configService.get<DatabaseConfig>('database')!;
    
    return {
      max: dbConfig.maxConnections,
      timeout: dbConfig.connectionTimeout,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON: Old vs New
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ❌ OLD WAY (Don't do this):
 */
class OldWayExample {
  getHost() {
    // Problems:
    // - No type safety
    // - No validation
    // - Hardcoded fallbacks
    // - Direct env access
    return process.env.DATABASE_HOST || 'localhost';
  }
}

/**
 * ✅ NEW WAY (Do this):
 */
class NewWayExample {
  constructor(private readonly configService: ConfigService) {}

  getHost() {
    // Benefits:
    // - Fully typed (DatabaseConfig interface)
    // - Validated on startup (Joi)
    // - No fallbacks needed (required in validation)
    // - Centralized config access
    const dbConfig = this.configService.get<DatabaseConfig>('database')!;
    return dbConfig.host;
  }
}
