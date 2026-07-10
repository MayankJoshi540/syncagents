@echo off
echo ===================================================
echo Starting all microservices and frontend...
echo ===================================================

:: Start Gateway
start "Gateway" cmd /k "cd backend\gateway && npm run dev"

:: Start Agent Service
start "Agent Service" cmd /k "cd backend\services\agent && npm run dev"

:: Start Auth Service
start "Auth Service" cmd /k "cd backend\services\auth && npm run dev"

:: Start Billing Service
start "Billing Service" cmd /k "cd backend\services\billing && npm run dev"

:: Start Chat Service
start "Chat Service" cmd /k "cd backend\services\chat && npm run dev"

:: Start Frontend
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo All services launched! Check the newly opened console windows.
echo ===================================================
pause
