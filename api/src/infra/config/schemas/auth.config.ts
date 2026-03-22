import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiration: string;
}

export default registerAs('auth', (): AuthConfig => ({
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '3600s',
}));
