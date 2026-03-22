import { BaseIntegrationTest } from '../helpers/base-integration-test';

class DatabaseConnectivityTest extends BaseIntegrationTest {
  async runTests() {
    describe('Database Connectivity (Integration)', () => {
      beforeAll(async () => {
        await this.setup();
      });

      afterAll(async () => {
        await this.teardown();
      });

      it('DB-01: should initialize DataSource and connect successfully', () => {
        expect(this.dataSource).toBeDefined();
        expect(this.dataSource.isInitialized).toBe(true);
      });

      it('DB-02: should be able to query the users table', async () => {
        // We use the public schema by default as per requirements
        const result = await this.dataSource.query('SELECT count(*) FROM public.users');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty('count');
      });

      it('DB-03: should verify the search_path is set to public', async () => {
        const result = await this.dataSource.query('SHOW search_path');
        // PostgreSQL might return '"$user", public' or just 'public'
        const searchPath = result[0].search_path;
        expect(searchPath.toLowerCase()).toContain('public');
      });

      it('DB-04: should successfully execute a write and then cleanup', async () => {
        // Insert a dummy role for testing write permissions
        const testRoleName = `TEST_ROLE_${Date.now()}`;
        
        await this.dataSource.query(
          'INSERT INTO public.roles (name, description) VALUES ($1, $2)',
          [testRoleName, 'Temporary role for connectivity test']
        );

        // Register cleanup to ensure it's deleted even if next expectation fails
        this.registerCleanup(async () => {
          await this.dataSource.query('DELETE FROM public.roles WHERE name = $1', [testRoleName]);
        });

        // Verify it was written
        const verify = await this.dataSource.query('SELECT * FROM public.roles WHERE name = $1', [testRoleName]);
        expect(verify.length).toBe(1);
        expect(verify[0].name).toBe(testRoleName);
      });
    });
  }
}

// Instantiate and run
new DatabaseConnectivityTest().runTests();
