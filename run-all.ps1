Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting all microservices and frontend..." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

# Start Gateway
Start-Process cmd -ArgumentList "/k", "cd backend\gateway && npm run dev" -Title "Gateway"

# Start Agent Service
Start-Process cmd -ArgumentList "/k", "cd backend\services\agent && npm run dev" -Title "Agent Service"

# Start Auth Service
Start-Process cmd -ArgumentList "/k", "cd backend\services\auth && npm run dev" -Title "Auth Service"

# Start Billing Service
Start-Process cmd -ArgumentList "/k", "cd backend\services\billing && npm run dev" -Title "Billing Service"

# Start Chat Service
Start-Process cmd -ArgumentList "/k", "cd backend\services\chat && npm run dev" -Title "Chat Service"

# Start Frontend
Start-Process cmd -ArgumentList "/k", "cd frontend && npm run dev" -Title "Frontend"

Write-Host "All services launched in separate windows!" -ForegroundColor Cyan
