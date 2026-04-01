@echo off
echo ========================================
echo   JobBoard Perfect Launch - SDK 54
echo ========================================
echo.

echo [1/4] Starting Backend Server...
cd /d "%~dp0backend"
start "Django Backend" cmd /k "python manage.py runserver"
timeout /t 3 /nobreak >nul

echo [2/4] Updating Dependencies to SDK 54...
cd /d "%~dp0mobile"
call npm install

echo [3/4] Clearing Cache...
call npx expo start --clear --tunnel

echo.
echo ========================================
echo   Perfect Launch Complete!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: Scan QR code in Expo Go
echo.
echo Your Expo Go SDK 54 is now compatible!
echo.
pause
