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

// Ensure we're in test mode
if (process.env.NODE_ENV !== 'test') {
  console.warn(
    '⚠️  WARNING: NODE_ENV is not set to "test". Setting it now...',
  );
  process.env.NODE_ENV = 'test';
}

// Validate required test environment variables
const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required test environment variables: ${missingVars.join(', ')}\n` +
      'Please configure .env.test file',
  );
}

console.log('✅ Test environment loaded successfully');
console.log(`📊 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`🗄️  DATABASE: ${process.env.DATABASE_NAME}@${process.env.DATABASE_HOST}`);
