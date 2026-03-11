import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  synchronize: boolean;
  logging: boolean;
  maxConnections: number;
  connectionTimeout: number;
}

export default registerAs('database', (): DatabaseConfig => ({
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  username: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  ssl: process.env.DATABASE_SSL === 'true',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS!, 10),
  connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT!, 10),
}));
