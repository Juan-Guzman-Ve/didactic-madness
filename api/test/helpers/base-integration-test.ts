import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import request from 'supertest';

/**
 * Scoped actions delegate type
 */
type CleanupAction = () => Promise<void>;

/**
 * Base class for all integration tests
 */
export abstract class BaseIntegrationTest {
  protected app!: INestApplication;
  protected dataSource!: DataSource;
  protected jwtToken: string | null = null;
  private cleanupActions: CleanupAction[] = [];

  /**
   * Initialize NestJS application for integration testing
   */
  async setup(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await this.app.init();
    this.dataSource = this.app.get(DataSource);
    
    // Ensure we are working on the public schema (standard for educational projects)
    const schema = process.env.DB_SCHEMA || 'public';
    await this.dataSource.query(`SET search_path TO ${schema};`);
  }

  /**
   * Cleanup registered actions and close the app
   */
  async teardown(): Promise<void> {
    // Run all registered cleanup actions (reversed)
    for (const action of this.cleanupActions.reverse()) {
      try {
        await action();
      } catch (error) {
        console.error('Error during cleanup action:', error);
      }
    }
    
    this.cleanupActions = [];
    
    if (this.app) {
      await this.app.close();
    }
  }

  /**
   * Register a cleanup action to be executed during teardown
   */
  registerCleanup(action: CleanupAction): void {
    this.cleanupActions.push(action);
  }

  /**
   * Helper to perform a real login and set the JWT token
   */
  async login(email: string, password: string): Promise<string> {
    const response = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Login failed for user ${email}: ${JSON.stringify(response.body)}`);
    }

    const data = response.body.data || response.body;
    this.jwtToken = data.accessToken || data.access_token;
    
    if (!this.jwtToken) {
      throw new Error(`No token found in login response: ${JSON.stringify(response.body)}`);
    }

    return this.jwtToken!;
  }

  /**
   * Helper to perform authenticated requests
   */
  authorizedRequest() {
    if (!this.jwtToken) {
      throw new Error('No JWT token found. Call login() first.');
    }
    return {
      get: (url: string) => request(this.app.getHttpServer()).get(url).set('Authorization', `Bearer ${this.jwtToken}`),
      post: (url: string) => request(this.app.getHttpServer()).post(url).set('Authorization', `Bearer ${this.jwtToken}`),
      put: (url: string) => request(this.app.getHttpServer()).put(url).set('Authorization', `Bearer ${this.jwtToken}`),
      delete: (url: string) => request(this.app.getHttpServer()).delete(url).set('Authorization', `Bearer ${this.jwtToken}`),
    };
  }

  /**
   * Scoped DB clean helper (often used in registerCleanup)
   */
  async clearTable(tableName: string): Promise<void> {
    const schema = process.env.DB_SCHEMA || 'testing';
    await this.dataSource.query(`TRUNCATE TABLE ${schema}.${tableName} RESTART IDENTITY CASCADE;`);
  }
}
