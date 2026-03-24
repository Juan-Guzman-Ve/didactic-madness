import { BaseIntegrationTest } from '../helpers/base-integration-test';
import { UserFactory } from '../helpers/user-factory';
import { AddressFactory } from '../helpers/address-factory';
import request from 'supertest';

class AddressOwnershipTest extends BaseIntegrationTest {
  async runTests() {
    describe('Address Ownership & Scoping (Integration)', () => {
      const userA = UserFactory.create({ email: 'userA@example.com' });
      const userB = UserFactory.create({ email: 'userB@example.com' });
      let userBAddressId: number;

      beforeAll(async () => {
        await this.setup();
        
        // Register User A
        await request(this.app.getHttpServer()).post('/auth/register').send(userA);
        
        // Register User B
        await request(this.app.getHttpServer()).post('/auth/register').send(userB);
        
        // Create an address for User B
        await this.login(userB.email, userB.password);
        const addrResponse = await this.authorizedRequest()
          .post('/me/addresses')
          .send(AddressFactory.create({ city: 'B-City' }));
        
        userBAddressId = addrResponse.body.data.id;
      });

      afterAll(async () => {
        await this.dataSource.query('DELETE FROM public.users WHERE email IN ($1, $2)', [userA.email, userB.email]);
        await this.teardown();
      });

      describe('User A operations', () => {
        beforeAll(async () => {
          await this.login(userA.email, userA.password);
        });

        it('should create and retrieve own address', async () => {
          const payload = AddressFactory.create({ city: 'A-City' });
          const createResponse = await this.authorizedRequest()
            .post('/me/addresses')
            .send(payload);

          expect(createResponse.status).toBe(201);
          const addrId = createResponse.body.data.id;

          const getResponse = await this.authorizedRequest()
            .get(`/me/addresses/${addrId}`);

          expect(getResponse.status).toBe(200);
          expect(getResponse.body.data.city).toBe('A-City');
        });

        it('should list only own addresses', async () => {
          const response = await this.authorizedRequest()
            .get('/me/addresses');

          expect(response.status).toBe(200);
          expect(response.body.data.length).toBeGreaterThan(0);
          
          // Verify none of User B's addresses are present
          const hasBAddress = response.body.data.some((a: any) => a.id === userBAddressId);
          expect(hasBAddress).toBe(false);
        });

        it('should NOT access User B address', async () => {
          const response = await this.authorizedRequest()
            .get(`/me/addresses/${userBAddressId}`);

          expect(response.status).toBe(403);
          expect(response.body.message).toMatch(/do not have access/i);
        });

        it('should NOT update User B address', async () => {
          const response = await this.authorizedRequest()
            .put(`/me/addresses/${userBAddressId}`)
            .send({ city: 'Hacked-City' });

          expect(response.status).toBe(403);
        });

        it('should NOT delete User B address', async () => {
          const response = await this.authorizedRequest()
            .delete(`/me/addresses/${userBAddressId}`);

          expect(response.status).toBe(403);
         });
      });
    });
  }
}

new AddressOwnershipTest().runTests();
