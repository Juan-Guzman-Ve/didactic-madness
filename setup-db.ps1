# ═════════════════════════════════════════════════════════════════════════════
# Database Setup Script (PowerShell)
# ═════════════════════════════════════════════════════════════════════════════

Write-Host "🗄️  Database Setup for Didactic Madness" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Start PostgreSQL container
Write-Host "📦 Starting PostgreSQL container..." -ForegroundColor Yellow
docker-compose up -d postgres

Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Wait for database to be ready
$retries = 0
$maxRetries = 30
while ($retries -lt $maxRetries) {
    try {
        docker exec didactic-madness-db pg_isready -U postgres 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            break
        }
    } catch {}
    Write-Host "   Still waiting..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
    $retries++
}

if ($retries -eq $maxRetries) {
    Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
    exit 1
}

Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
Write-Host ""

# Apply migration
Write-Host "📝 Applying database migration..." -ForegroundColor Yellow
Get-Content "database\migrations\20260305_create_health_checks_table.sql" | docker exec -i didactic-madness-db psql -U postgres -d didactic_madness_dev

Write-Host "✅ Migration applied successfully" -ForegroundColor Green
Write-Host ""

# Verify tables
Write-Host "🔍 Verifying tables..." -ForegroundColor Yellow
docker exec didactic-madness-db psql -U postgres -d didactic_madness_dev -c "\dt"

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Connection details:" -ForegroundColor Cyan
Write-Host "   Host: localhost"
Write-Host "   Port: 5432"
Write-Host "   Database: didactic_madness_dev"
Write-Host "   User: postgres"
Write-Host "   Password: postgres"
Write-Host ""
Write-Host "🚀 You can now start the API:" -ForegroundColor Cyan
Write-Host "   cd api"
Write-Host "   npm run start:dev"
Write-Host ""
