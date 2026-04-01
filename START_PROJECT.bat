@echo off
echo ========================================
echo   JobBoard Project Launcher
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd /d "%~dp0backend"
start "Django Backend" cmd /k "python manage.py runserver"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server...
cd /d "%~dp0mobile"
start "Expo Frontend" cmd /k "npx expo start --clear"

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: Check Expo window for QR code
echo.
echo Open Expo Go on your phone and scan the QR code
echo.
pause
