/**
 * Address Factory for Integration Testing
 */
export class AddressFactory {
  /**
   * Create an address payload with sensible defaults
   * @param overrides Properties to override the defaults
   * @returns A plain object ready for API calls
   */
  static create(overrides: Record<string, any> = {}) {
    const defaultAddress = {
      addressLine1: '123 Test St',
      addressLine2: 'Apt 4B',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      isDefault: false,
    };

    return { ...defaultAddress, ...overrides };
  }
}
