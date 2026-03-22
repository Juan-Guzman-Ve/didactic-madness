/**
 * Product Factory for Integration Testing
 */
export class ProductFactory {
  /**
   * Create a product payload with sensible defaults
   * @param overrides Properties to override the defaults
   * @returns A plain object ready for API calls
   */
  static create(overrides: Record<string, any> = {}) {
    const defaultProduct = {
      sku: `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      categoryId: 1, // Default category from seeds
      name: 'Generic PC Component',
      description: 'A high-performance PC component for enthusiasts.',
      brand: 'TechBrand',
      model: 'V1-X',
      price: 15000, // $150.00 in cents
      stock: 100,
      specifications: {
        warranty: '2 years',
        weight: '500g',
        color: 'Black',
      },
      status: 'Active',
    };

    return { ...defaultProduct, ...overrides };
  }
}
