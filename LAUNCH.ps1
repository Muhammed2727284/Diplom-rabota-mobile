# JobBoard Perfect Launch Script
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JobBoard Perfect Launch - SDK 54" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "[1/4] Installing dependencies..." -ForegroundColor Green
Set-Location "C:\Users\acer\Desktop\дипломдук жумуш\mobile"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    pause
    exit 1
}

# Step 2: Start Backend
Write-Host "[2/4] Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\acer\Desktop\дипломдук жумуш\backend'; python manage.py runserver"
Start-Sleep -Seconds 5

# Step 3: Start Frontend with tunnel
Write-Host "[3/4] Starting Frontend with Tunnel..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  QR Code will appear in new window" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; Set-Location 'C:\Users\acer\Desktop\дипломдук жумуш\mobile'; npx expo start --tunnel --clear"

# Step 4: Done
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "Admin:    http://localhost:8000/admin" -ForegroundColor White
Write-Host "          Email: admin@jobboard.com" -ForegroundColor Gray
Write-Host "          Password: admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend: Check new window for QR code" -ForegroundColor White
Write-Host ""
Write-Host "Open Expo Go and scan QR code!" -ForegroundColor Cyan
Write-Host ""
