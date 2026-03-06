# Quick Start Guide — NestJS API Setup

This guide will help you get the NestJS API running with either **Supabase** (production) or **local PostgreSQL** (development).

## Option 1: Local Development with Docker (Quickest)

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- pgAdmin on `localhost:5050` (optional GUI)

### 2. Apply Database Migration

```bash
# Using psql (if installed)
psql -h localhost -U postgres -d didactic_madness_dev -f database/migrations/20260305_create_health_checks_table.sql

# OR using Docker exec
docker exec -i didactic-madness-db psql -U postgres -d didactic_madness_dev < database/migrations/20260305_create_health_checks_table.sql
```

### 3. Start the API

```bash
cd api
npm run start:dev
```

### 4. Test the Endpoints

```bash
# Check API is running
curl http://localhost:3000/api

# Check database connectivity
curl http://localhost:3000/api/health/database

# View health check history
curl http://localhost:3000/api/health/history
```

**Expected Response** (database endpoint):
```json
{
  "status": "healthy",
  "database": "didactic_madness_dev",
  "connected": true,
  "latency": 15
}
```

---

## Option 2: Using Supabase (Production)

### 1. Get Supabase Credentials

1. Go to https://supabase.com
2. Create a new project (or use existing)
3. Go to **Settings** → **Database**
4. Copy connection details:
   - Host
   - Port
   - Database name
   - User
   - Password

### 2. Update Environment Variables

Edit `api/.env`:

```env
DATABASE_HOST=db.yourproject.supabase.co
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=postgres
DATABASE_SSL=true
```

### 3. Apply Migration via Supabase SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `database/migrations/20260305_create_health_checks_table.sql`
3. Paste and execute

### 4. Start the API

```bash
cd api
npm run start:dev
```

### 5. Test

```bash
curl http://localhost:3000/api/health/database
```

---

## Troubleshooting

### "Cannot connect to database"

**Local Docker:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View logs
docker logs didactic-madness-db

# Restart container
docker-compose restart postgres
```

**Supabase:**
- Verify credentials in `.env`
- Check if IP is whitelisted (Supabase → Settings → Database → Connection Pooling)
- Ensure SSL is enabled: `DATABASE_SSL=true`

### "Module not found" errors in IDE

This is normal after initial setup. The build succeeded and created all files. Restart your IDE or run:

```bash
cd api
npm run build
```

---

## API Documentation

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | API status |
| GET | `/api/ping` | Ping check |
| GET | `/api/health` | Overall health |
| GET | `/api/health/database` | Database connectivity |
| GET | `/api/health/history` | Recent health checks (from DB) |

### Example: View Health History

```bash
curl http://localhost:3000/api/health/history
```

Response:
```json
{
  "total": 2,
  "records": [
    {
      "id": "uuid",
      "service": "database",
      "status": "healthy",
      "message": "Connected in 15ms",
      "checkedAt": "2026-03-05T12:00:00.000Z"
    }
  ]
}
```

---

## Next Steps

1. ✅ Database connected
2. ✅ Health check working
3. ✅ TypeORM configured
4. 🔜 Build your domain modules!

Refer to `api/README.md` for full documentation.

---

## Project Structure Summary

```
didactic-madness/
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules (DDD)
│   │   │   └── health/     # POC module
│   │   ├── config/         # Configuration
│   │   ├── migrations/     # TypeORM wrappers
│   │   └── main.ts         # Entry point
│   └── package.json
├── database/               # SOURCE OF TRUTH
│   └── migrations/         # Hand-written SQL
├── ui/                     # Angular frontend
├── docker-compose.yml      # Local PostgreSQL setup
└── README.md
```

## Tech Stack

- **Backend**: NestJS 11 + TypeORM + PostgreSQL
- **Frontend**: Angular 17+ standalone + Material 3
- **Database**: Supabase PostgreSQL (production) or Docker PostgreSQL (local)
- **Architecture**: Domain-Driven Design (DDD)

Happy coding! 🚀
