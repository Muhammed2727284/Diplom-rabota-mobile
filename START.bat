@echo off
color 0A
title JobBoard Launcher

echo ========================================
echo   JobBoard - Perfect Launcher
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "python manage.py runserver"
timeout /t 3 /nobreak >nul

echo [2/3] Installing Frontend Dependencies...
cd /d "%~dp0mobile"
call npm install --legacy-peer-deps

echo [3/3] Starting Expo Frontend...
start "Expo Frontend" cmd /k "npx expo start --tunnel --clear"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo           Email: admin@jobboard.com
echo           Password: admin123
echo.
echo Frontend: Check Expo window for QR code
echo           Scan with Expo Go
echo.
echo Both servers are running in separate windows
echo Close those windows to stop the servers
echo.
pause
