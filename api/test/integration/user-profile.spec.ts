import { BaseIntegrationTest } from '../helpers/base-integration-test';
import { UserFactory } from '../helpers/user-factory';
import request from 'supertest';

class UserProfileTest extends BaseIntegrationTest {
  async runTests() {
    describe('User Profile Management (Integration)', () => {
      const testUser = UserFactory.create({ email: 'profile-test@example.com' });

      beforeAll(async () => {
        await this.setup();
        // Register user for profile tests
        await request(this.app.getHttpServer())
          .post('/auth/register')
          .send(testUser);
      });

      afterAll(async () => {
        await this.dataSource.query('DELETE FROM public.users WHERE email = $1', [testUser.email]);
        await this.teardown();
      });

      describe('Personal Profile (/me)', () => {
        beforeAll(async () => {
          await this.login(testUser.email, testUser.password);
        });

        it('should retrieve own profile data', async () => {
          const response = await this.authorizedRequest()
            .get('/me');

          expect(response.status).toBe(200);
          expect(response.body.data.email).toBe(testUser.email);
        });

        it('should update own profile details', async () => {
          const newPhone = '999888777';
          const updatePayload = {
            firstName: 'UpdatedName',
            phone: newPhone,
          };

          const response = await this.authorizedRequest()
            .put('/me')
            .send(updatePayload);

          expect(response.status).toBe(200);
          expect(response.body.data.firstName).toBe('UpdatedName');
          expect(response.body.data.phone).toBe(newPhone);
          
          // Verify persistence
          const dbUser = await this.dataSource.query('SELECT * FROM public.users WHERE email = $1', [testUser.email]);
          expect(dbUser[0].first_name).toBe('UpdatedName');
        });

        it('should update password and login again', async () => {
          const newPassword = 'NewSecretPassword!';
          
          // Update profile with new password
          await this.authorizedRequest()
            .put('/me')
            .send({ password: newPassword });

          // Try to login with new password
          const loginResponse = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send({
              email: testUser.email,
              password: newPassword,
            });

          expect([200, 201]).toContain(loginResponse.status);
          expect(loginResponse.body.data).toHaveProperty('accessToken');
          
          // Re-login to update jwtToken for subsequent tests
          await this.login(testUser.email, newPassword);
        });
      });
    });
  }
}

new UserProfileTest().runTests();
