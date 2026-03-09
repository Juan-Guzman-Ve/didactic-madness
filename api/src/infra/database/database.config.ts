import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DatabaseConfig } from '../config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = configService.get<DatabaseConfig>('database')!;

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../../migrations/*{.ts,.js}')],
    subscribers: [path.join(__dirname, '../**/*.subscriber{.ts,.js}')],
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
    extra: {
      max: dbConfig.maxConnections,
      connectionTimeoutMillis: dbConfig.connectionTimeout,
    },
  };
};
