import databaseConfig from './schemas/database.config';
import appConfig from './schemas/app.config';
import authConfig from './schemas/auth.config';

export const configurations = [databaseConfig, appConfig, authConfig];

export { default as databaseConfig } from './schemas/database.config';
export { default as appConfig } from './schemas/app.config';
export { default as authConfig } from './schemas/auth.config';
export { validationSchema } from './validation.schema';
