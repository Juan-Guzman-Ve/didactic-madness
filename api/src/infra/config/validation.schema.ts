import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  CORS_ENABLED: Joi.string().valid('true', 'false').default('false'),

  // Database
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SSL: Joi.string().valid('true', 'false').default('false'),
  DATABASE_MAX_CONNECTIONS: Joi.number().default(10),
  DATABASE_CONNECTION_TIMEOUT: Joi.number().default(5000),

  // TypeORM
  TYPEORM_SYNCHRONIZE: Joi.string().valid('true', 'false').default('false'),
  TYPEORM_LOGGING: Joi.string().valid('true', 'false').default('false'),
});
