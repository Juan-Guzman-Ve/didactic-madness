# API-Specific Copilot Instructions

**Context:** Working in `api/` folder (NestJS backend)

---

## Quick Rules

1. **Naming:** kebab-case for files/folders
2. **Max 20-30 lines per method**
3. **Guard clauses** for simple validation
4. **Domain error classes** (no generic `throw new Error()`)
5. **No try-catch everywhere** (let global exception filter handle)

---

## Module Structure

```
modules/
  products/
    ├── products.module.ts
    ├── products.controller.ts         # HTTP layer
    ├── products.service.ts            # Business logic
    ├── entities/
    │   └── product.entity.ts          # TypeORM entity
    ├── dto/
    │   ├── create-product.dto.ts      # Input validation
    │   └── update-product.dto.ts
    ├── errors/
    │   ├── product-not-found.error.ts # Domain errors
    │   └── insufficient-stock.error.ts
    └── validators/
        └── create-product.validator.ts # Complex validation
```

---

## Controller Pattern

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public() // Opt-out of auth when needed
  async findAll(@Query() query: QueryProductsDto): Promise<ApiResponse<Product[]>> {
    const products = await this.productsService.findAll(query);
    return { data: products };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Product>> {
    const product = await this.productsService.findById(id);
    return { data: product };
  }

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ApiResponse<Product>> {
    const product = await this.productsService.create(dto);
    return { data: product };
  }
}
```

**Key points:**
- Controllers are **thin** (no business logic)
- Return wrapped responses: `{ data: T }` or `{ data: T[], meta: { page, total } }`
- Let service throw domain errors
- Let global exception filter catch and format errors

---

## Service Pattern (Business Logic)

```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(id: string): Promise<Product> {
    if (!id) throw new InvalidIdError();

    const product = await this.repository.findOne({ where: { id } });
    if (!product) throw new ProductNotFoundError(id);

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // Guard clauses for simple validation
    if (dto.stock < 0) throw new InvalidStockError();
    if (dto.price <= 0) throw new InvalidPriceError();

    const product = this.repository.create(dto);
    return this.repository.save(product);
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.findById(productId);
    
    if (product.stock < quantity) {
      throw new InsufficientStockError(productId, quantity, product.stock);
    }

    product.stock -= quantity;
    await this.repository.save(product);
  }
}
```

**Key points:**
- Guard clauses at the top
- No try-catch (let errors bubble)
- Throw domain-specific errors
- Max 20-30 lines per method (extract to private helpers if longer)

---

## Domain Error Pattern

```typescript
// errors/product-not-found.error.ts
export class ProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`Product with ID ${productId} not found`);
    this.name = 'ProductNotFoundError';
  }
}

// errors/insufficient-stock.error.ts
export class InsufficientStockError extends Error {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}. ` +
      `Requested: ${requested}, Available: ${available}`
    );
    this.name = 'InsufficientStockError';
  }
}
```

**Why:** Global exception filter maps these to proper HTTP responses centrally.

---

## DTO Pattern (Input Validation)

```typescript
import { IsString, IsNumber, IsUUID, Min, Max, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  sku: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

**Key points:**
- Use class-validator decorators
- Global ValidationPipe automatically validates
- Errors returned as `400 Bad Request` with field-level messages

---

## Validation: Guard Clauses vs Validators

### Use Guard Clauses (in service methods) for:
- Simple checks (null, empty, range)
- Business rules (stock > 0)
- Single-field validation

```typescript
async updateStock(id: string, quantity: number): Promise<void> {
  if (!id) throw new InvalidIdError();
  if (quantity < 0) throw new InvalidQuantityError();
  
  // Happy path continues
}
```

### Use Validator Classes for:
- Complex cross-field validation
- Async validation (DB checks)
- Multi-step validation logic

```typescript
@Injectable()
export class CreateOrderValidator {
  async validate(dto: CreateOrderDto): Promise<void> {
    await this.validateStock(dto.items);
    await this.validateUserBalance(dto.userId, dto.total);
    this.validateItemPrices(dto.items);
  }
  
  private async validateStock(items: OrderItemDto[]): Promise<void> {
    // Complex logic here
  }
}
```

---

## Entity Pattern (TypeORM)

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, unique: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { nullable: true })
  description: string | null;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column('uuid')
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Key points:**
- Entity reflects the database table
- Hand-written SQL migration is source of truth
- Entity is a wrapper for type safety

---

## API Response Format

**Success responses:**
```typescript
// Single item
{ data: Product }

// List without pagination
{ data: Product[] }

// Paginated list
{
  data: Product[],
  meta: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

**Error responses** (handled by global exception filter):
```typescript
{
  statusCode: 404,
  message: "Product with ID abc123 not found",
  error: "Not Found"
}
```

---

## Testing Pattern (Integration-first)

```typescript
describe('ProductsService (Integration)', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeAll(async () => {
    // Use real database (test schema in Supabase)
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDbConfig),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get(ProductsService);
    repository = module.get(getRepositoryToken(Product));
  });

  afterEach(async () => {
    // Clean up test data
    await repository.clear();
  });

  it('should create and retrieve a product', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      sku: 'TEST-001',
      price: 99.99,
      stock: 10,
      categoryId: testCategoryId,
    };

    const created = await service.create(dto);
    expect(created.id).toBeDefined();

    const found = await service.findById(created.id);
    expect(found.name).toBe(dto.name);
  });

  it('should throw ProductNotFoundError for invalid ID', async () => {
    await expect(service.findById('invalid-id'))
      .rejects
      .toThrow(ProductNotFoundError);
  });
});
```

**Key points:**
- Real database connection (`.env.test`)
- Can set breakpoints and debug
- Test full flows, not isolated units
- Clean up after each test

---

## Dependencies Injection

```typescript
// Inject repository
constructor(
  @InjectRepository(Product)
  private readonly repository: Repository<Product>,
) {}

// Inject another service
constructor(
  private readonly productsService: ProductsService,
  private readonly categoriesService: CategoriesService,
) {}

// Inject config
constructor(
  @Inject('DATABASE_CONFIG')
  private readonly dbConfig: DatabaseConfig,
) {}
```

---

## Common Mistakes to Avoid

1. ❌ Business logic in controllers
2. ❌ Try-catch in every method (let errors bubble)
3. ❌ Generic `throw new Error()` (use domain errors)
4. ❌ Methods > 30 lines (extract to private helpers)
5. ❌ Using `any` without justification comment
6. ❌ Nested if statements (use guard clauses)
7. ❌ Auto-generated migrations (write SQL manually)

---

## Quick Reference: NestJS Decorators

```typescript
// Controller
@Controller('path')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)

// Endpoints
@Get()           // GET /path
@Post()          // POST /path
@Put(':id')      // PUT /path/:id
@Delete(':id')   // DELETE /path/:id
@Patch(':id')    // PATCH /path/:id

// Parameters
@Param('id')     // Route parameter
@Body()          // Request body
@Query()         // Query string
@Headers()       // Headers

// Auth
@Public()        // Opt-out of JwtAuthGuard
@Roles('admin')  // Role-based guard

// Dependency Injection
@Injectable()
@InjectRepository(Entity)
@Inject('TOKEN')
```

---

**Remember:** Max 20-30 lines per method. If longer, extract to private helper methods.
