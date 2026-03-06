# PC Parts Store API

NestJS backend with TypeORM + Supabase PostgreSQL, following Domain-Driven Design principles.

## Tech Stack

- **Framework**: NestJS 11.x
- **ORM**: TypeORM 0.3.x
- **Database**: PostgreSQL (Supabase)
- **Language**: TypeScript 5.9+
- **Architecture**: DDD (Domain-Driven Design)

## Project Structure

```
api/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.config.ts
│   ├── modules/             # Feature modules (DDD)
│   │   └── health/          # POC health check module
│   │       ├── controllers/ # HTTP endpoints
│   │       ├── services/    # Business logic
│   │       ├── repositories/# Data access layer
│   │       ├── entities/    # Domain entities
│   │       └── health.module.ts
│   ├── migrations/          # TypeORM migration wrappers
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   └── main.ts              # Entry point
├── .env                     # Environment variables
├── tsconfig.json            # TypeScript configuration
└── nest-cli.json            # NestJS CLI configuration
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your Supabase credentials:

```env
DATABASE_HOST=your-project.supabase.co
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_NAME=postgres
DATABASE_SSL=true
```

### 3. Run Database Migrations

**Option A: Supabase SQL Editor** (Recommended)
1. Go to your Supabase dashboard → SQL Editor
2. Copy the SQL from `../database/migrations/20260305_create_health_checks_table.sql`
3. Execute the query

**Option B: TypeORM CLI** (for local PostgreSQL)
```bash
npm run migration:run
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000/api`

## Available Endpoints

### Root
- `GET /api` - API status
- `GET /api/ping` - Simple ping check

### Health Checks
- `GET /api/health` - Overall application health
- `GET /api/health/database` - Database connectivity check
- `GET /api/health/history` - Recent health check records

## Testing the Setup

### 1. Check API is Running
```bash
curl http://localhost:3000/api
```

Response:
```json
{
  "message": "PC Parts Store API is running",
  "timestamp": "2026-03-05T..."
}
```

### 2. Check Database Connection
```bash
curl http://localhost:3000/api/health/database
```

Response:
```json
{
  "status": "healthy",
  "database": "postgres",
  "connected": true,
  "latency": 23
}
```

### 3. View Health History
```bash
curl http://localhost:3000/api/health/history
```

## Development Commands

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Format code
npm run format

# Check code formatting
npm run lint
```

## Architecture Principles

Following the project's technical standards:

1. **Domain-Driven Design**: Business logic in domain entities
2. **Repository Pattern**: Data access abstraction
3. **Explicit DTOs**: Clear request/response objects
4. **Hand-written SQL**: Database migrations in `../database/` folder first
5. **Integration Tests**: Testing through service layer with real DB

## Database Migrations

The `database/` folder is the **source of truth** for all schema changes:

1. Write SQL migration in `../database/migrations/`
2. Apply to Supabase via SQL Editor
3. Create TypeORM wrapper in `src/migrations/` (optional, for local dev)

See `../database/README.md` for details.

## Next Steps

- [ ] Connect to your Supabase instance
- [ ] Apply the health_checks migration
- [ ] Test all health endpoints
- [ ] Start building your domain modules!

## Support

For issues or questions, refer to the main project README or technical documentation in `../docs/`.
