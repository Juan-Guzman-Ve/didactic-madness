import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DatabaseConfig } from '../config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = configService.get<DatabaseConfig>('database')!;

  // Log the actual database config values (excluding password for security)
  // eslint-disable-next-line no-console
  console.log('[DatabaseConfig]', {
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    database: dbConfig.database,
    schema: dbConfig.schema,
    ssl: dbConfig.ssl,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    maxConnections: dbConfig.maxConnections,
    connectionTimeout: dbConfig.connectionTimeout,
  });

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    schema: dbConfig.schema,
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../../migrations/*{.ts,.js}')],
    subscribers: [],
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
    extra: {
      max: dbConfig.maxConnections,
      connectionTimeoutMillis: dbConfig.connectionTimeout,
    },
  };
};
