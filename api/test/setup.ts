/**
 * Jest Global Setup
 * 
 * Runs before all tests to configure the test environment
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test file
const envTestPath = path.resolve(__dirname, '../.env.test');
dotenv.config({ path: envTestPath });



// Validate required test environment variables
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_SCHEMA',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required test environment variables: ${missingVars.join(', ')}\n` +
      'Please configure .env.test file',
  );
}

console.log('SUCCESS: Test environment loaded successfully');
console.log(`INFO: NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`INFO: DATABASE: ${process.env.DB_USERNAME}@${process.env.DB_HOST}`);
console.log(`INFO: SCHEMA: ${process.env.DB_SCHEMA}`);
