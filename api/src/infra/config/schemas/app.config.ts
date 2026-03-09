import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  environment: string;
  apiPrefix: string;
  corsEnabled: boolean;
}

export default registerAs('app', (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  corsEnabled: process.env.CORS_ENABLED === 'true',
}));
