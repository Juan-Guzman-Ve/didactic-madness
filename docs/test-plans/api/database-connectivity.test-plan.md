# Test Plan: Database Connectivity Validation

## Feature
Validación de conexión a la base de datos para el entorno de integración.

## Critical Points
- **Connection:** La aplicación debe conectarse exitosamente al host de base de datos (`public` schema).
- **Search Path:** El `search_path` debe ser el predeterminado para asegurar que se están tocando los datos esperados.
- **Permissions:** El usuario debe poder realizar operaciones CRUD en las tablas existentes.

## Test Cases

| ID | Scenario | Input | Expected Output |
|---|---|---|---|
| DB-01 | Test Database Connection | N/A | DataSource is initialized and connected. |
| DB-02 | Verify Table Access | Select from 'users' | Result is an array (even if empty). |
| DB-03 | Basic Write Validation | Insert dummy record | Transaction successful + Cleanup verified. |

## Data Setup
- **Environment:** Archivo `.env.test` con `DB_SCHEMA=public`.
- **Pre-requisite:** La base de datos debe tener las tablas creadas (Migraciones ya aplicadas).
- **Cleanup:** El test debe limpiar sus propios datos.
