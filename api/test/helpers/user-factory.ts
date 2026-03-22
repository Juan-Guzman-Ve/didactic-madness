/**
 * User Factory for Integration Testing
 */
export class UserFactory {
  /**
   * Create a user registration payload with sensible defaults
   * @param overrides Properties to override the defaults
   * @returns A plain object ready for API calls
   */
  static create(overrides: Record<string, any> = {}) {
    const defaultUser = {
      email: `test-${Math.random().toString(36).substring(2, 10)}@example.com`,
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      phone: '123456789',
    };

    return { ...defaultUser, ...overrides };
  }
}
