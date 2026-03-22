# GitHub Copilot Instructions — Technical Standards

## Project Overview

Full-stack TypeScript application with NestJS backend + TypeORM + Supabase Postgres and Angular 17+ (standalone) + Angular Material 3 frontend.

---

## Dependency Management

### Exact Versions Only

**ALWAYS use exact versions in package.json** - never use `^` or `~` prefixes.

**Why:**
- Avoid peer dependency warnings completely
- Ensure reproducible builds across all environments
- No surprises from automatic version bumps
- Lock down the exact versions that work together

### package.json Format

```json
{
  "dependencies": {
    "@nestjs/common": "11.1.16",        // ✅ CORRECT - exact version
    "@nestjs/core": "11.1.16",          // ✅ CORRECT
    "class-validator": "0.14.1"         // ✅ CORRECT
  },
  "devDependencies": {
    "typescript": "5.9.3",              // ✅ CORRECT
    "jest": "29.7.0"                    // ✅ CORRECT
  }
}
```

**NEVER:**
```json
{
  "dependencies": {
    "@nestjs/common": "^11.1.16",       // ❌ WRONG - semver range
    "class-validator": "~0.14.1"        // ❌ WRONG - tilde range  
  }
}
```

### Installation

- Use `npm install` (no --legacy-peer-deps)
- Never install packages with `--save` or `--save-exact` manually - edit package.json directly
- Delete `package-lock.json` and `node_modules/` before major dependency updates
- Test after any dependency change: `npm run build && npm test`

### Adding New Dependencies

1. Check compatibility with current NestJS version
2. Add to `package.json` with **exact version** (no `^` or `~`)
3. Run `npm install` (no --legacy-peer-deps)
4. Run `npm run build` to verify
5. Commit `package.json` and `package-lock.json` together

---

## Core Development Principles

### SOLID, DRY, KISS

- **Single Responsibility**: Each class/function does one thing well
- **DRY**: Extract code on 2nd use (no earlier, no later)
- **KISS**: Simple solutions over clever ones. I'm not a frontend expert — keep UI code straightforward

### Code Readability

Code must read like a story. If you need to backtrack to understand logic, refactor it.

**Good:**
```typescript
async getEntity(id: string): Promise<Entity> {
  const entity = await this.repository.findById(id);
  if (!entity) throw new NotFoundError('Entity', id);
  
  return entity;
}
```

**Bad:**
```typescript
async getEntity(id: string): Promise<Entity> {
  const entity = await this.repository.findById(id);
  if (entity) {
    return entity;
  } else {
    throw new NotFoundError('Entity', id);
  }
}
```

---

## Repository Structure

```
├── ui/         # Angular 17+ standalone app
├── api/        # NestJS backend
├── database/   # Source of truth: hand-written SQL migrations, seed scripts, ERD
└── bruno/      # API collections (folder per module)
```

**The `database/` folder is the source of truth.** All schema changes are hand-written SQL migrations committed here, then wrapped in TypeORM migration files.

---

## Code Organization

### File Structure

- **Every component/feature:** separate `.ts`, `.html`, `.scss` files
- **NO inline templates or styles**
- **Naming:** `kebab-case` for files and folders
  - ✅ `item-card.component.ts`, `user-profile.service.ts`
  - ❌ `ItemCard.component.ts`, `UserProfileService.ts`

### Folder Depth

**Max 3-4 levels.** If deeper, rethink the structure.

```
✅ api/src/modules/entities/services/
✅ ui/src/app/features/items/components/
❌ api/src/modules/entities/services/queries/filters/
```

### Function Length

**Max 20-30 lines.** If longer, break into private helper methods.

---

## TypeScript Standards

### Strictness

- **`strict: true`** in both `ui/` and `api/`
- **Avoid `any`** — use `unknown` when type is unclear
- **`any` allowed ONLY with a justification comment:**

```typescript
// Using 'any' here because Supabase Storage returns an untyped response
// TODO: Create a proper type in v2
const uploadResult: any = await storage.upload(...);
```

### Import Paths

**Always use path aliases** (defined in `tsconfig.json`):

```typescript
✅ import { UiTableComponent } from '@shared/components/table';
✅ import { EntitiesService } from '@app/modules/entities';
❌ import { UiTableComponent } from '../../../shared/components/table';
```

---

## Domain-Driven Design (DDD)

### Domain Entities

**Domain entities are rich models with behavior**, not just data containers. They encapsulate business logic and maintain invariants.

```typescript
// domain/entities/user.entity.ts
export class User {
  private constructor(
    public readonly id: string,
    private _email: string,
    private _status: UserStatus,
    private _createdAt: Date,
  ) {}

  // Factory method
  static create(email: string): User {
    return new User(
      crypto.randomUUID(),
      email,
      UserStatus.ACTIVE,
      new Date(),
    );
  }

  // Reconstruct from database
  static fromPersistence(data: UserPersistence): User {
    return new User(
      data.id,
      data.email,
      data.status,
      data.createdAt,
    );
  }

  // Getters (encapsulation)
  get email(): string {
    return this._email;
  }

  get status(): UserStatus {
    return this._status;
  }

  // Business logic
  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new AlreadyInactiveError();
    }
    this._status = UserStatus.INACTIVE;
  }

  changeEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new InvalidEmailError(newEmail);
    }
    this._email = newEmail;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Map to persistence
  toPersistence(): UserPersistence {
    return {
      id: this.id,
      email: this._email,
      status: this._status,
      createdAt: this._createdAt,
    };
  }
}
```

### Commands/Queries and Mapping (Use Case Pattern)

**Commands and Queries replace input DTOs**. They include validations and are received directly by controllers.

**Mapping happens in handlers:**
- Command/Query → Domain Entity (before repository call)
- Domain Entity → Response DTO (after repository returns)

#### Command Example (Write Operation)

```typescript
// use-cases/commands/create-user.command.ts
export class CreateUserCommand implements ICommand {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// use-cases/commands/create-user.handler.ts
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserResponseDto> {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    // 1. Command → Domain
    const user = User.create(command.email, command.password);

    // 2. Save
    const saved = await this.repository.save(user);

    // 3. Domain → Response DTO
    return UserMapper.toResponseDto(saved);
  }
}

// Controller receives Command directly
@Post()
async create(@Body() command: CreateUserCommand) {
  return this.service.createUser(command);
}
```

#### Query Example (Read Operation)

```typescript
// use-cases/queries/list-users.query.ts
export class ListUsersQuery implements IQuery<PaginatedResponse<UserResponseDto>> {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  status?: string;
}

// use-cases/queries/list-users.handler.ts
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, PaginatedResponse<UserResponseDto>> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: ListUsersQuery): Promise<PaginatedResponse<UserResponseDto>> {
    const [users, total] = await this.repository.findPaginated(query);
    
    return {
      data: users.map(user => UserMapper.toResponseDto(user)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }
}
```

#### Response DTO (Only for outputs)

```typescript
// dtos/user-response.dto.ts
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: string;
}
```

#### Dedicated Mapper Class (Recommended for Use Case Pattern)

```typescript
// mappers/user.mapper.ts
export class UserMapper {
  static toDomain(command: CreateUserCommand): User {
    return User.create(command.email, command.password);
  }

  static toResponseDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  static toDomainFromPersistence(raw: UserPersistence): User {
    return User.fromPersistence(raw);
  }

  static toPersistence(entity: User): UserPersistence {
    return entity.toPersistence();
  }
}
```

### When to Use Mappers

**Use Dedicated Mapper Classes:**
- Clean separation of concerns
- Handler doesn't need to know Domain Entity internals
- Reusable across multiple handlers
- Easy to test mapping logic independently
- Preferred for Use Case Pattern

### Example: Handler Using Use Case Pattern

```typescript
// use-cases/commands/create-user.handler.ts
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserResponseDto> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    // Command → Domain
    const user = UserMapper.toDomain(command);

    // Business logic in domain
    // (validation already handled by entity factory)

    // Persist
    const saved = await this.userRepository.save(user);

    // Domain → Response DTO
    return UserMapper.toResponseDto(saved);
  }
}

// Service coordinates handlers
export class UserService {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUserHandler: GetUserByIdHandler,
  ) {}

  async createUser(command: CreateUserCommand): Promise<UserResponseDto> {
    return this.createUserHandler.execute(command);
  }

  async getUserById(query: GetUserByIdQuery): Promise<UserResponseDto> {
    return this.getUserHandler.execute(query);
  }
}

// Controller receives Command directly
@Controller('users')
export class UsersController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() command: CreateUserCommand) {
    return this.service.createUser(command);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const query = new GetUserByIdQuery(id);
    return this.service.getUserById(query);
  }
}
```

### Key Principles

1. **Rich Domain Models:** Business logic lives in entities, not services or handlers
2. **Use Case Pattern:** Commands/Queries replace input DTOs, handlers own the mapping logic
3. **Encapsulation:** Use private fields with public getters/methods
4. **Factory Methods:** Prefer `User.create()` over `new User()`
5. **Explicit Mapping:** Always use mapper classes (`UserMapper.toDomain()`, `UserMapper.toResponseDto()`)
6. **Only Response DTOs:** Commands/Queries handle input, DTOs only for output
7. **Immutability When Possible:** Use `readonly` for IDs and timestamps
8. **No Anemic Models:** Entities should have behavior, not just getters/setters
9. **Thin Controllers:** Only receive Commands/Queries and delegate to services
10. **Handlers Own Logic:** Mapping and business orchestration in handlers

---

## Validation Strategy

### Guard Clauses (Simple Checks)

Use early returns for simple validation:

```typescript
async updateEntity(id: string, dto: UpdateEntityDto): Promise<Entity> {
  if (!id) throw new InvalidIdError();
  if (dto.value < 0) throw new InvalidValueError();
  
  // Happy path continues without nesting
  const entity = await this.repository.findById(id);
  if (!entity) throw new NotFoundError('Entity', id);
  
  return this.repository.save({ ...entity, ...dto });
}
```

### Dedicated Validators (Complex Logic)

For complex validation (cross-field, async checks, business rules), extract into validator classes:

```typescript
// validators/create-resource.validator.ts
export class CreateResourceValidator {
  async validate(dto: CreateResourceDto): Promise<void> {
    await this.validateAvailability(dto.items);
    await this.validateUserPermissions(dto.userId);
    this.validateItemValues(dto.items);
  }
  
  private async validateAvailability(items: ItemDto[]): Promise<void> {
    // Complex availability check logic
  }
}
```

---

## Error Handling

### Domain-Specific Error Classes

Create custom error classes for each domain error:

```typescript
// errors/not-found.error.ts
export class NotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID ${id} not found`);
    this.name = 'NotFoundError';
  }
}

// errors/insufficient-resources.error.ts
export class InsufficientResourcesError extends Error {
  constructor(resourceId: string, requested: number, available: number) {
    super(`Insufficient resources for ${resourceId}. Requested: ${requested}, Available: ${available}`);
    this.name = 'InsufficientResourcesError';
  }
}
```

### Global Exception Filter

Let NestJS's global exception filter catch and format errors centrally:

```typescript
// common/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Map domain errors to HTTP responses
    if (exception instanceof NotFoundError) {
      return new NotFoundException(exception.message);
    }
    // ...
  }
}
```

**Don't wrap every method in try-catch.** Let errors bubble up to the filter.

---

## API Response Format

All successful responses wrapped in an envelope:

```typescript
// Success
{
  "data": Entity | Entity[] | { /* complex object */ },
  "meta": {           // Optional, for paginated responses
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error (handled by exception filter)
{
  "statusCode": 404,
  "message": "Entity with ID abc123 not found",
  "error": "Not Found"
}
```

Implement a `ResponseInterceptor` to wrap all controller responses automatically.

---

## Testing Strategy

### Integration Tests First

**Priority: integration tests with real database** (`.env.test` pointing to a test schema in Supabase).

**Test through the service layer** to follow the complete flow of your application logic.

Why:
- Follow the entire flow of an action (Command/Query → Service → Handler → Domain → Repository → DB)
- Set breakpoints and debug through the full logic path
- Mirrors real-world usage
- Catches integration issues early
- Validates that all layers work together correctly

```typescript
// test/modules/users.integration.spec.ts
describe('User Service Integration', () => {
  let app: INestApplication;
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule], // Real module, all dependencies, real DB
    }).compile();

    userService = app.get(UserService);
    userRepository = app.get(UserRepository);
  });

  afterEach(async () => {
    // Clean up test data
    await userRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createUser', () => {
    it('should create a user and validate the complete flow', async () => {
      // Arrange
      const command: CreateUserCommand = {
        email: 'test@example.com',
        password: 'SecurePass123',
      };

      // Act - Call service (follows full flow: Command → Handler → Domain → Validation → Persistence)
      const result = await userService.createUser(command);

      // Assert - Validate response
      expect(result.id).toBeDefined();
      expect(result.email).toBe(command.email);
      expect(result.status).toBe(UserStatus.ACTIVE);

      // Verify persistence - Ensure data is actually in DB
      const savedUser = await userRepository.findById(result.id);
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toBe(command.email);
    });

    it('should throw error when email is invalid', async () => {
      const command: CreateUserCommand = {
        email: 'invalid-email',
        password: 'SecurePass123',
      };

      await expect(userService.createUser(command)).rejects.toThrow(
        InvalidEmailError,
      );
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate an active user and persist the change', async () => {
      // Arrange - Create a user first
      const user = await userService.createUser({
        email: 'active@example.com',
        password: 'SecurePass123',
      });

      // Act - Deactivate
      await userService.deactivateUser(user.id);

      // Assert - Verify status changed in DB
      const deactivated = await userRepository.findById(user.id);
      expect(deactivated.status).toBe(UserStatus.INACTIVE);
    });

    it('should throw error when user not found', async () => {
      await expect(
        userService.deactivateUser('non-existent-id'),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Testing Complex Flows

For multi-step business operations, test the entire flow:

```typescript
describe('Order Processing Flow', () => {
  it('should handle complete order creation flow', async () => {
    // Arrange - Set up test data
    const user = await userService.createUser(mockUserDto);
    const product = await productService.create(mockProductDto);

    // Act - Create order (tests full flow)
    const order = await orderService.createOrder({
      userId: user.id,
      items: [{ productId: product.id, quantity: 2 }],
    });

    // Assert - Verify all side effects
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.items).toHaveLength(1);
    
    // Verify inventory was reduced
    const updatedProduct = await productService.findById(product.id);
    expect(updatedProduct.stock).toBe(product.stock - 2);
    
    // Verify order is in DB
    const savedOrder = await orderRepository.findById(order.id);
    expect(savedOrder).toBeDefined();
  });
});
```

### Unit Tests (Secondary)

Use for isolated logic only (e.g., utility functions, validators, formatters):

```typescript
// validators/email.validator.spec.ts
describe('EmailValidator', () => {
  it('should reject invalid email', () => {
    expect(() => validator.validate('not-an-email')).toThrow();
  });
});

// utils/price-calculator.spec.ts
describe('PriceCalculator', () => {
  it('should calculate total with tax', () => {
    const result = calculateTotal(100, 0.15);
    expect(result).toBe(115);
  });
});
```

### Key Testing Principles

1. **Integration > Unit:** Test through the service layer, not individual methods
2. **Full Flow:** Follow the complete logic path from input to database
3. **Real Dependencies:** Use real DB, real services, real repositories
4. **Debuggable:** You can set breakpoints and step through the entire flow
5. **Clean Up:** Always clean up test data after each test
6. **Test Behavior, Not Implementation:** Focus on what the system does, not how

---

## Database Migrations

### Hand-Written SQL Only

**No auto-generated migrations.** The `database/` folder is the source of truth.

#### Process:

1. **Write SQL migration** in `database/migrations/YYYYMMDD_description.sql`:

```sql
-- database/migrations/20260303_add_entities_table.sql
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_entities_code ON entities(code);
```

2. **Apply to Supabase** via the SQL editor or CLI

3. **Create TypeORM wrapper** for local dev consistency:

```typescript
// api/migrations/20260303_add_entities_table.ts
export class AddEntitiesTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paste the same SQL here
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE entities`);
  }
}
```

---

## Frontend Architecture (Angular)

### Component Structure

**Standalone components only.** No `NgModule` boilerplate.

```typescript
// item-card.component.ts
import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UiButtonComponent } from '@shared/components/button';

@Component({
  selector: 'item-card',
  standalone: true,
  imports: [MatCardModule, UiButtonComponent],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  item = input.required<Item>();
  onSelect = output<Item>();
}
```

### State Management

- **Signals** for local component state
- **Services** for shared state
- **Minimal RxJS** (only where Angular Material or HttpClient requires it)

```typescript
// entities.service.ts (shared state)
@Injectable({ providedIn: 'root' })
export class EntitiesService {
  private entitiesSignal = signal<Entity[]>([]);
  readonly entities = this.entitiesSignal.asReadonly();

  async loadEntities(): Promise<void> {
    const data = await this.http.get<ApiResponse<Entity[]>>('/api/entities');
    this.entitiesSignal.set(data.data);
  }
}
```

### Dependency Injection

Use `inject()` function (modern Angular):

```typescript
export class EntitiesComponent {
  private readonly entitiesService = inject(EntitiesService);
  private readonly router = inject(Router);
  
  async ngOnInit() {
    await this.entitiesService.loadEntities();
  }
}
```

### Generic Components

Shared components in `ui/src/app/shared/components/` are **generic and reusable**. Feature components **compose** them:

```typescript
// shared/components/table/ui-table.component.ts
export class UiTableComponent<T> {
  data = input.required<T[]>();
  columns = input.required<ColumnDef<T>[]>();
}

// features/entities/entities-table.component.ts
export class EntitiesTableComponent {
  entities = input.required<Entity[]>();
  
  columns: ColumnDef<Entity>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'value', header: 'Value', formatter: (v) => `$${v}` },
  ];
}
```

**Use generics where they add value without sacrificing readability.**

---

## Git Workflow

### Conventional Commits

```
feat: add filtering by category
fix: correct calculation logic
chore: update dependencies
docs: add API endpoint documentation
test: add integration tests for module
refactor: simplify service logic
```

### Branch Strategy

- `main` — production-ready code
- `develop` — integration branch
- `feature/description` — feature branches
- `fix/description` — bugfix branches

---

## API Documentation (Bruno)

Every endpoint must have a corresponding `.bru` file in `bruno/api/<module>/`.

### Organization

```
bruno/
└── api/
    ├── auth/
    │   ├── login.bru
    │   └── register.bru
    ├── entities/
    │   ├── list-entities.bru
    │   ├── get-entity.bru
    │   ├── create-entity.bru
    │   └── update-entity.bru
    └── other-modules/
```

### Example `.bru` File

```
meta {
  name: List Entities
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/entities?page=1&limit=20&category=active
  body: none
}

params:query {
  page: 1
  limit: 20
  category: active
}

tests {
  test("Status is 200", function() {
    expect(res.status).to.equal(200);
  });
  
  test("Response has data array", function() {
    expect(res.body.data).to.be.an('array');
  });
}
```

---

## Comments and Documentation

**AVOID comments. Code MUST be so clean that it is self-explanatory. If you feel the need to add a comment to explain what the code does, refactor the code instead.**

### The ONLY Exceptions:

✅ **Complex business logic**
```typescript
// Reservation expires after 15 minutes to prevent deadlocks
// during high-traffic operations
const RESERVATION_TTL_MS = 15 * 60 * 1000;
```

✅ **Non-obvious workarounds**
```typescript
// Supabase Storage doesn't support atomic operations,
// so we manually handle cleanup if the DB transaction fails
```

✅ **TODOs with context**
```typescript
// TODO: Replace with Azure Blob Storage once Key Vault is configured
```

❌ **Don't comment the obvious**
```typescript
// Get entity by ID
async getEntity(id: string): Promise<Entity> { ... }
```

---

## Anti-Patterns to Avoid

### ❌ Nested Ifs (Spaghetti Code)

```typescript
// BAD
if (user) {
  if (user.isActive) {
    if (user.hasPermission('admin')) {
      // do something
    }
  }
}
```

```typescript
// GOOD - Guard clauses
if (!user) throw new UserNotFoundError();
if (!user.isActive) throw new InactiveUserError();
if (!user.hasPermission('admin')) throw new ForbiddenError();

// Happy path — no nesting
```

### ❌ Magic Numbers

```typescript
// BAD
if (quantity < 5) { ... }

// GOOD
const LOW_QUANTITY_THRESHOLD = 5;
if (quantity < LOW_QUANTITY_THRESHOLD) { ... }
```

### ❌ God Classes

If a service has >10 methods or >200 lines, split it.

```typescript
// BAD: EntitiesService doing too much
class EntitiesService {
  create() { ... }
  update() { ... }
  delete() { ... }
  findById() { ... }
  search() { ... }
  exportToCsv() { ... }
  importFromCsv() { ... }
  generateReport() { ... }
  sendEmailNotification() { ... }
}

// GOOD: Split responsibilities
class EntitiesService {
  create() { ... }
  update() { ... }
  findById() { ... }
}

class EntitiesSearchService { ... }
class EntitiesExportService { ... }
class EntitiesReportService { ... }
```

### ❌ Boilerplate

Don't add code that doesn't solve a problem. If a class/function/abstraction isn't pulling its weight, delete it.

---

## Final Reminders

1. **Domain-Driven Design** — Business logic lives in domain entities. Use explicit mapping methods (`fromDto`, `toDto`, `toPersistence`).
2. **Keep frontend simple** — I'm not a frontend dev. Prefer straightforward Angular patterns over clever hacks.
3. **Database is source of truth** — All schema changes start in `database/`, not in TypeORM entities.
4. **Integration tests > unit tests** — I want to debug real flows. Test through the service layer to follow the complete logic path.
5. **Bruno first** — Every endpoint needs a `.bru` file before it's considered "done".
6. **Extract on 2nd use** — Not before, not after.
7. **Max 20-30 lines per function.**
8. **Code reads like a story** — No backtracking to understand logic.

---

When in doubt, ask: **"Is this simple, readable, and testable?"** If no, refactor.
