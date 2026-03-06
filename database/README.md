# Database Migrations

This folder contains the **source of truth** for all database schema changes.

## Principles

1. **Hand-written SQL first** — All migrations are written as `.sql` files here
2. **TypeORM wrappers** — TypeORM migration files in `api/src/migrations/` wrap these SQL files
3. **Applied to Supabase** — Run SQL directly in Supabase SQL editor or CLI
4. **Versioned** — Follow `YYYYMMDD_description.sql` naming convention

## File Structure

```
database/
├── migrations/
│   ├── YYYYMMDD_migration_name.sql          # Up migration
│   └── YYYYMMDD_migration_name_rollback.sql # Down migration (optional)
└── seeds/
    └── YYYYMMDD_seed_name.sql               # Seed data
```

## Applying Migrations

### Option 1: Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy/paste the SQL from the migration file
4. Execute

### Option 2: Supabase CLI
```bash
supabase db push
```

### Option 3: TypeORM (for local dev)
```bash
cd api
npm run migration:run
```

## Current Migrations

- `20260305_create_health_checks_table.sql` - POC table for database connectivity testing

## Next Steps

Replace this with your actual Supabase connection details and apply the migration!
