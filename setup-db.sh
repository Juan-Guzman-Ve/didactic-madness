#!/bin/bash

# ═════════════════════════════════════════════════════════════════════════════
# Database Setup Script
# ═════════════════════════════════════════════════════════════════════════════

set -e

echo "🗄️  Database Setup for Didactic Madness"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database is ready
until docker exec didactic-madness-db pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Still waiting..."
    sleep 2
done

echo "✅ PostgreSQL is ready"
echo ""

# Apply migration
echo "📝 Applying database migration..."
docker exec -i didactic-madness-db psql -U postgres -d didactic_madness_dev < database/migrations/20260305_create_health_checks_table.sql

echo "✅ Migration applied successfully"
echo ""

# Verify tables
echo "🔍 Verifying tables..."
docker exec -i didactic-madness-db psql -U postgres -d didactic_madness_dev -c "\dt"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📊 Connection details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: didactic_madness_dev"
echo "   User: postgres"
echo "   Password: postgres"
echo ""
echo "🚀 You can now start the API:"
echo "   cd api"
echo "   npm run start:dev"
echo ""
