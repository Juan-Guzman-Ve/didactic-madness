# Generic Base Controller & Service

This base provides CRUD operations out of the box for all entities.

## Features

✅ **Get by ID** - `GET /:id`
✅ **Get Paginated** - `GET /` with `?page=1&limit=20&sort=name:ASC`
✅ **Create Single** - `POST /`
✅ **Update Single** - `PUT /:id`
✅ **Delete Single** - `DELETE /:id`
✅ **Bulk Delete** - `DELETE /bulk/delete` with `{ ids: [...] }`
✅ **Bulk Create** - `POST /bulk/create` with `{ items: [...] }`
✅ **Bulk Update** - `PUT /bulk/update` with `{ updates: [{ id, data }] }`

## Usage

### 1. Create Service extending BaseService

```typescript
@Injectable()
export class CategoriesService extends BaseService<
  CategoryEntity,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
  ) {
    super(repository, 'Category');
  }

  protected mapCreateDtoToEntity(dto: CreateCategoryDto): CategoryEntity {
    const entity = new CategoryEntity();
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  protected mapUpdateDtoToEntity(
    dto: UpdateCategoryDto,
    entity: CategoryEntity,
  ): CategoryEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    return entity;
  }
}
```

### 2. Create Controller extending BaseController

```typescript
@Controller('categories')
export class CategoriesController extends BaseController<
  CategoryEntity,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto
> {
  constructor(service: CategoriesService) {
    super(service, 'Category');
  }

  protected toResponseDto(entity: CategoryEntity): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  protected toResponseDtoList(entities: CategoryEntity[]): CategoryResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
```

### 3. Available Endpoints

All these endpoints are automatically available:

```bash
# Get paginated categories
GET /categories?page=1&limit=20&sort=name:ASC

# Get single category
GET /categories/:id

# Create category
POST /categories
Body: { "name": "Electronics", "description": "..." }

# Update category
PUT /categories/:id
Body: { "name": "Updated Name" }

# Delete category
DELETE /categories/:id

# Bulk delete
DELETE /categories/bulk/delete
Body: { "ids": ["uuid1", "uuid2", "uuid3"] }

# Bulk create
POST /categories/bulk/create
Body: { "items": [{ "name": "Cat1" }, { "name": "Cat2" }] }

# Bulk update
PUT /categories/bulk/update
Body: { 
  "updates": [
    { "id": "uuid1", "data": { "name": "New Name 1" } },
    { "id": "uuid2", "data": { "name": "New Name 2" } }
  ]
}
```

## Pagination Response Format

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Adding Custom Endpoints

You can still add custom methods to your controller/service:

```typescript
@Controller('categories')
export class CategoriesController extends BaseController<...> {
  // ... base implementation

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const entity = await this.service.findBySlug(slug);
    if (!entity) throw new NotFoundException();
    return this.toResponseDto(entity);
  }
}
```

## TypeScript Generics

```typescript
BaseController<TEntity, TCreateDto, TUpdateDto, TResponseDto>
BaseService<TEntity, TCreateDto, TUpdateDto>
```

- **TEntity** - TypeORM entity class
- **TCreateDto** - DTO for creating entities
- **TUpdateDto** - DTO for updating entities (usually PartialType of CreateDto)
- **TResponseDto** - Response DTO for API responses
