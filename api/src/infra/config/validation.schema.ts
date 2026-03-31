import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  CORS_ENABLED: Joi.string().valid('true', 'false').default('false'),

  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.string().valid('true', 'false').default('false'),
  DB_MAX_CONNECTIONS: Joi.number().default(10),
  DB_CONNECTION_TIMEOUT: Joi.number().default(5000),

  // TypeORM
  TYPEORM_SYNCHRONIZE: Joi.string().valid('true', 'false').default('false'),
  TYPEORM_LOGGING: Joi.string().valid('true', 'false').default('false'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('3600s'),
});
