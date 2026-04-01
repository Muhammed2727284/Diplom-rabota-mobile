# Enable script execution
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JobBoard QR Launcher for Phone" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\acer\Desktop\дипломдук жумуш\backend'; python manage.py runserver"

Write-Host "[2/3] Starting Frontend with Tunnel..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  IMPORTANT: Use Tunnel for Phone!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "When Expo starts, press 't' for tunnel mode" -ForegroundColor White
Write-Host "This will work with your phone via internet" -ForegroundColor White
Write-Host ""

cd "C:\Users\acer\Desktop\дипломдук жумуш\mobile"
npx expo start --tunnel

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instructions" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. When Expo starts, press 't' for tunnel" -ForegroundColor White
Write-Host "2. Open Expo Go on your phone" -ForegroundColor White  
Write-Host "3. Scan the QR code" -ForegroundColor White
Write-Host "4. App will work via internet tunnel" -ForegroundColor White
Write-Host ""
