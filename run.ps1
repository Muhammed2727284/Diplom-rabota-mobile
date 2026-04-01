Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JobBoard Project Launcher" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\acer\Desktop\дипломдук жумуш\backend'; python manage.py runserver"

Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\acer\Desktop\дипломдук жумуш\mobile'; npx expo start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers Started!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: Check Expo window for QR code" -ForegroundColor White
Write-Host ""
Write-Host "Open Expo Go on your phone and scan QR code" -ForegroundColor Cyan
Write-Host ""
