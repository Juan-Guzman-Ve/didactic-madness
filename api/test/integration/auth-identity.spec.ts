import { BaseIntegrationTest } from '../helpers/base-integration-test';
import { UserFactory } from '../helpers/user-factory';
import request from 'supertest';

class AuthIdentityTest extends BaseIntegrationTest {
  async runTests() {
    describe('Auth & Identity (Integration)', () => {
      beforeAll(async () => {
        await this.setup();
      });

      afterAll(async () => {
        await this.teardown();
      });

      describe('Registration', () => {
        it('should register a new user successfully', async () => {
          const payload = UserFactory.create();
          
          const response = await request(this.app.getHttpServer())
            .post('/auth/register')
            .send(payload);

          expect(response.status).toBe(201);
          expect(response.body.data.email).toBe(payload.email);
          expect(response.body.data.firstName).toBe(payload.firstName);
          
          // Verify in DB
          const users = await this.dataSource.query('SELECT * FROM public.users WHERE email = $1', [payload.email]);
          expect(users.length).toBe(1);
          expect(users[0].first_name).toBe(payload.firstName);
          
          // Cleanup this specific user
          this.registerCleanup(async () => {
            await this.dataSource.query('DELETE FROM public.users WHERE email = $1', [payload.email]);
          });
        });
      });

      describe('Login', () => {
        const testUser = UserFactory.create({ email: 'login-test@example.com' });

        beforeAll(async () => {
          // Pre-register user for login tests
          await request(this.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);
        });

        afterAll(async () => {
          await this.dataSource.query('DELETE FROM public.users WHERE email = $1', [testUser.email]);
        });

        it('should login and receive a JWT token', async () => {
          const response = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send({
              email: testUser.email,
              password: testUser.password,
            });

          expect([200, 201]).toContain(response.status);
          expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should fail login with incorrect password', async () => {
          const response = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send({
              email: testUser.email,
              password: 'WrongPassword!',
            });

          expect(response.status).toBe(401);
        });
      });
    });
  }
}

new AuthIdentityTest().runTests();
