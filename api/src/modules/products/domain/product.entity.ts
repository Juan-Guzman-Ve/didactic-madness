// Domain Entity: Rich model with business logic
export class Product {
  private constructor(
    public readonly id: string,
    private _sku: string,
    private _categoryId: string,
    private _name: string,
    private _description: string,
    private _brand: string,
    private _model: string,
    private _price: number,
    private _stock: number,
    private _specifications: Record<string, any>,
    private _status: ProductStatus,
    private _createdAt: Date,
  ) {}

  // Factory method
  static create(
    sku: string,
    categoryId: string,
    name: string,
    description: string,
    brand: string,
    model: string,
    price: number,
    stock: number,
    specifications: Record<string, any>,
  ): Product {
    // Validate price and stock
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return new Product(
      crypto.randomUUID(),
      sku,
      categoryId,
      name,
      description,
      brand,
      model,
      price,
      stock,
      specifications,
      ProductStatus.ACTIVE,
      new Date(),
    );
  }

  // Reconstruct from database
  static fromPersistence(data: ProductPersistence): Product {
    return new Product(
      data.id,
      data.sku,
      data.categoryId,
      data.name,
      data.description,
      data.brand,
      data.model,
      data.price,
      data.stock,
      data.specifications,
      data.status as ProductStatus,
      data.createdAt,
    );
  }

  // Getters
  get sku(): string {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get status(): ProductStatus {
    return this._status;
  }

  get isAvailable(): boolean {
    return this._status === ProductStatus.ACTIVE && this._stock > 0;
  }

  // Business logic
  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    this._price = newPrice;
  }

  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock cannot be negative');
    }
    this._stock = quantity;
  }

  decreaseStock(quantity: number): void {
    if (quantity > this._stock) {
      throw new Error('Insufficient stock');
    }
    this._stock -= quantity;
  }

  increaseStock(quantity: number): void {
    this._stock += quantity;
  }

  deactivate(): void {
    this._status = ProductStatus.INACTIVE;
  }

  activate(): void {
    this._status = ProductStatus.ACTIVE;
  }

  // Map to persistence
  toPersistence(): ProductPersistence {
    return {
      id: this.id,
      sku: this._sku,
      categoryId: this._categoryId,
      name: this._name,
      description: this._description,
      brand: this._brand,
      model: this._model,
      price: this._price,
      stock: this._stock,
      specifications: this._specifications,
      status: this._status,
      createdAt: this._createdAt,
    };
  }
}

export enum ProductStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface ProductPersistence {
  id: string;
  sku: string;
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  specifications: Record<string, any>;
  status: string;
  createdAt: Date;
}
