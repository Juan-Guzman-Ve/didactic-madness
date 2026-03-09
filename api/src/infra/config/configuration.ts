import databaseConfig from './schemas/database.config';
import appConfig from './schemas/app.config';

export const configurations = [databaseConfig, appConfig];

export { default as databaseConfig } from './schemas/database.config';
export { default as appConfig } from './schemas/app.config';
export { validationSchema } from './validation.schema';
